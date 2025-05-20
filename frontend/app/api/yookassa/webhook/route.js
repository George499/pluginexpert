// app/api/yookassa/webhook/route.js
import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Конфигурация YooKassa
const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const yooCheckout = new YooCheckout({ shopId, secretKey });

// Функция для записи лога в файл
const logToFile = async (data, prefix = 'webhook') => {
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

  // Логируем успешный платёж
  await logToFile({
    timestamp: new Date().toISOString(),
    event,
    status: 'succeeded',
    paymentId,
    amount: fullPaymentInfo.amount,
    metadata: fullPaymentInfo.metadata
  }, 'payment-succeeded');

  // ✅ Отправка в Strapi: обновление isPaid у speaker
  try {
    const strapiResponse = await fetch('https://admin.pluginexpert.ru/api/speakers/' + fullPaymentInfo.metadata.speakerId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Добавь токен, если в Strapi включена авторизация
        // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          isPaid: true
        }
      }),
    });

    const result = await strapiResponse.json();
    console.log('Speaker обновлён в Strapi:', result);
  } catch (error) {
    console.error('Ошибка обновления speaker в Strapi:', error);
    await logToFile({
      timestamp: new Date().toISOString(),
      error: 'Ошибка при обновлении speaker',
      message: error.message,
      speakerId: fullPaymentInfo.metadata.speakerId,
      speakerDocumentId: fullPaymentInfo.metadata.speakerDocumentId
    }, 'strapi-update-error');
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