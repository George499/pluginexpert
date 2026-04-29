// app/api/yookassa/webhook/route.js
import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Конфигурация YooKassa
const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const yooCheckout = new YooCheckout({ shopId, secretKey });

// Strapi
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'https://admin.pluginexpert.ru';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Длительность подписки по тарифу (в днях). Соответствие тарифам в PaymentModal.
const PLAN_DURATION_DAYS = {
  '1': 90,   // 3 месяца
  '2': 180,  // 6 месяцев
  '3': 300,  // 10 месяцев
};

const getSubscriptionDays = (planId) => PLAN_DURATION_DAYS[String(planId)] ?? 90;

// Запись лога в файл. По умолчанию выключена в продакшене (логи уходят в stdout).
// Чтобы включить файловые логи в проде — установить WEBHOOK_FILE_LOGS=true.
const FILE_LOGS_ENABLED =
  process.env.WEBHOOK_FILE_LOGS === 'true' ||
  (process.env.WEBHOOK_FILE_LOGS !== 'false' && process.env.NODE_ENV !== 'production');

const logToFile = async (data, prefix = 'webhook') => {
  if (!FILE_LOGS_ENABLED) {
    console.log(`[webhook:${prefix}]`, JSON.stringify(data));
    return null;
  }
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logPath = path.join(logDir, `${prefix}-${timestamp}.json`);
    fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
    console.log(`Лог записан в файл: ${logPath}`);
    return logPath;
  } catch (error) {
    console.error('Ошибка записи лога:', error);
    return null;
  }
};

export async function POST(request) {
  console.log('WEBHOOK ПОЛУЧЕН: ' + new Date().toISOString());
  let rawBody = '';
  let logFilePath = null;
  
  try {
    // 1. СНАЧАЛА ЛОГИРУЕМ СЫРЫЕ ДАННЫЕ
    
    // Получаем заголовки запроса
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Получаем тело запроса в виде текста
    rawBody = await request.text();
    
    // Логируем сырые данные
    console.log('WEBHOOK ОТ ЮКАССЫ (RAW):', rawBody);
    
    const initialLogData = {
      timestamp: new Date().toISOString(),
      headers,
      rawBody
    };
    
    // Записываем сырые данные в лог-файл
    logFilePath = await logToFile(initialLogData, 'yookassa-webhook-raw');
    console.log(`Входящие данные webhook залогированы в файл: ${logFilePath}`);
    
    // 2. ПАРСИМ JSON И ОБРАБАТЫВАЕМ ДАННЫЕ
    
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log('Разобранные данные webhook:', JSON.stringify(body, null, 2));
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
      await logToFile({
        timestamp: new Date().toISOString(),
        error: 'JSON parse error',
        message: e.message,
        rawBody
      }, 'yookassa-webhook-error');
      
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    
    // Получаем тип события и данные объекта
    const event = body.event;
    const object = body.object;
    
    // Логируем структурированные данные
    await logToFile({
      timestamp: new Date().toISOString(),
      event,
      object
    }, 'yookassa-webhook-parsed');
    
    // 3. ПОЛУЧАЕМ ПОЛНУЮ ИНФОРМАЦИЮ О ПЛАТЕЖЕ
    
    const paymentId = object?.id;
    
    if (!paymentId) {
      console.error('ID платежа отсутствует в уведомлении');
      await logToFile({
        timestamp: new Date().toISOString(),
        error: 'Payment ID not found',
        body
      }, 'yookassa-webhook-error');
      
      return NextResponse.json({ 
        success: false, 
        error: 'Payment ID not found' 
      });
    }
    
    // Получаем полную информацию о платеже через API ЮКассы
    try {
      console.log(`Получение полной информации о платеже ${paymentId}`);
      
      // Используем метод getPayment из документации
      const fullPaymentInfo = await yooCheckout.getPayment(paymentId);
      
      console.log('Полная информация о платеже:', JSON.stringify(fullPaymentInfo, null, 2));
      
      // Логируем полную информацию о платеже
      await logToFile({
        timestamp: new Date().toISOString(),
        event,
        paymentId,
        fullPaymentInfo
      }, 'payment-full-info');
      
      // 4. ОБРАБОТКА РАЗЛИЧНЫХ ТИПОВ СОБЫТИЙ
      
      // В зависимости от типа события (payment.succeeded, payment.canceled и т.д.)
      // можно выполнить различные действия
      
     if (event === 'payment.succeeded') {
  console.log(`Платеж ${paymentId} успешно завершен`);

  await logToFile({
    timestamp: new Date().toISOString(),
    event,
    status: 'succeeded',
    paymentId,
    amount: fullPaymentInfo.amount,
    metadata: fullPaymentInfo.metadata
  }, 'payment-succeeded');

  // Обновление подписки спикера в Strapi (по documentId — Strapi 5 REST)
  const speakerDocumentId = fullPaymentInfo.metadata?.speakerDocumentId;
  const planId = fullPaymentInfo.metadata?.planId;
  const amount = fullPaymentInfo.amount?.value;

  if (!speakerDocumentId) {
    console.error('В metadata платежа отсутствует speakerDocumentId — не могу обновить Strapi');
    await logToFile({
      timestamp: new Date().toISOString(),
      error: 'speakerDocumentId missing in payment metadata',
      paymentId,
      metadata: fullPaymentInfo.metadata,
    }, 'strapi-update-error');
  } else if (!STRAPI_API_TOKEN) {
    console.error('STRAPI_API_TOKEN не задан — не могу авторизоваться в Strapi');
    await logToFile({
      timestamp: new Date().toISOString(),
      error: 'STRAPI_API_TOKEN missing',
      paymentId,
    }, 'strapi-update-error');
  } else {
    try {
      // Идемпотентность: если этот paymentId уже применён — пропускаем,
      // чтобы повторные/ретрай-вебхуки не продлевали подписку.
      const currentRes = await fetch(`${STRAPI_API_URL}/api/speakers/${speakerDocumentId}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      });
      if (currentRes.ok) {
        const currentJson = await currentRes.json();
        const currentLastPaymentId = currentJson?.data?.lastPaymentId;
        if (currentLastPaymentId && currentLastPaymentId === paymentId) {
          console.log(`Платёж ${paymentId} уже применён к speaker ${speakerDocumentId} — пропускаю`);
          await logToFile({
            timestamp: new Date().toISOString(),
            event: 'idempotent-skip',
            paymentId,
            speakerDocumentId,
          }, 'payment-succeeded');
          return NextResponse.json({ success: true });
        }
      }

      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(now.getDate() + getSubscriptionDays(planId));

      const strapiResponse = await fetch(`${STRAPI_API_URL}/api/speakers/${speakerDocumentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            isPaid: true,
            subscriptionExpiresAt: expiresAt.toISOString(),
            lastPaymentDate: now.toISOString(),
            lastPaymentAmount: amount ? parseFloat(amount) : undefined,
            lastPaymentId: paymentId,
          },
        }),
      });

      const result = await strapiResponse.json();
      if (!strapiResponse.ok) {
        console.error('Strapi вернул ошибку:', strapiResponse.status, result);
        await logToFile({
          timestamp: new Date().toISOString(),
          error: 'Strapi update failed',
          status: strapiResponse.status,
          response: result,
          speakerDocumentId,
          paymentId,
        }, 'strapi-update-error');
      } else {
        console.log('Speaker обновлён в Strapi:', result);
      }
    } catch (error) {
      console.error('Ошибка обновления speaker в Strapi:', error);
      await logToFile({
        timestamp: new Date().toISOString(),
        error: 'Ошибка при обновлении speaker',
        message: error.message,
        speakerDocumentId,
        paymentId,
      }, 'strapi-update-error');
    }
  }
}
 else if (event === 'payment.waiting_for_capture') {
        console.log(`Платеж ${paymentId} ожидает подтверждения`);
      } else if (event === 'payment.canceled') {
        console.log(`Платеж ${paymentId} был отменен`);
      } else {
        console.log(`Получено событие ${event} для платежа ${paymentId}`);
      }
      
    } catch (error) {
      console.error(`Ошибка получения информации о платеже ${paymentId}:`, error);
      
      // Логируем ошибку получения информации
      await logToFile({
        timestamp: new Date().toISOString(),
        error: 'Payment fetch error',
        message: error.message,
        paymentId,
        objectFromWebhook: object
      }, 'payment-fetch-error');
      
      // Даже при ошибке получения полной информации, возвращаем успешный ответ
      // чтобы ЮКасса не повторяла запрос
    }
    
    // 5. ВСЕГДА ВОЗВРАЩАЕМ УСПЕШНЫЙ ОТВЕТ
    
    // ЮКасса ожидает успешный ответ (HTTP 200) для подтверждения получения уведомления
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Критическая ошибка обработки webhook:', error);
    
    // Логируем критическую ошибку
    await logToFile({
      timestamp: new Date().toISOString(),
      error: 'Critical webhook processing error',
      message: error.message,
      stack: error.stack,
      rawBody,
      logFilePath
    }, 'webhook-critical-error');
    
    // Даже при критической ошибке возвращаем HTTP 200
    // чтобы ЮКасса не повторяла запрос
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 200 }
    );
  }
}