// app/api/payments/route.js - обновленная версия без модели payment
import { NextResponse } from 'next/server';
import { checkAuth } from '../utils/auth';

export async function POST(request) {
  try {
    // Проверяем авторизацию пользователя
    const auth = await checkAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Получаем данные из запроса
    const { amount, duration, speakerId, description } = await request.json();

    // Проверяем, что speakerId передан и не undefined
    if (!speakerId) {
      return NextResponse.json({ error: 'Speaker ID is required' }, { status: 400 });
    }

    // Определяем базовый URL для возврата
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      // Пытаемся определить из заголовков запроса, если переменная окружения не установлена
      const host = request.headers.get('host');
      const protocol = host.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${host}`;
      console.log('Determined base URL from request:', baseUrl);
    }

    // Формируем URL для возврата после оплаты
    const returnUrl = `${baseUrl}/payment-complete?payment=complete&speakerId=${speakerId}`;

    console.log('Return URL:', returnUrl);

    // Создаем уникальный идентификатор для платежа
    const idempotenceKey = `${speakerId}_${Date.now()}`;

    // Подготавливаем данные для запроса к ЮКассе
    const paymentData = {
      amount: {
        value: amount,
        currency: 'RUB',
      },
      capture: true, // автоматический прием поступившего платежа
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description: description || `Оплата подписки на ${duration} месяцев`,
      metadata: {
        speakerId: speakerId,
        duration: duration,
        userId: auth.user.id,
      },
    };

    console.log('Request to Yookassa:', paymentData);

    // Проверяем наличие переменных окружения
    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Missing Yookassa credentials. Please configure the environment variables.'
      }, { status: 500 });
    }

    // Отправляем запрос к API ЮКассы для создания платежа
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify(paymentData),
    });

    // Получаем ответ от ЮКассы
    const responseText = await response.text();
    console.log('Yookassa response (raw):', responseText);
    
    let paymentResponse;
    try {
      paymentResponse = JSON.parse(responseText);
      console.log('Yookassa response (parsed):', paymentResponse);
    } catch (e) {
      console.error('Error parsing Yookassa response:', e);
      return NextResponse.json({ 
        error: 'Failed to parse Yookassa response',
        rawResponse: responseText
      }, { status: 500 });
    }

    // Проверяем, что ответ содержит ID платежа
    if (!paymentResponse.id) {
      console.error('Yookassa response does not contain payment ID:', paymentResponse);
      return NextResponse.json({ 
        error: 'Yookassa response does not contain payment ID',
        response: paymentResponse
      }, { status: 500 });
    }

    // Проверяем, что ответ содержит URL для оплаты
    if (!paymentResponse.confirmation || !paymentResponse.confirmation.confirmation_url) {
      console.error('Yookassa response does not contain confirmation URL:', paymentResponse);
      return NextResponse.json({ 
        error: 'Yookassa response does not contain confirmation URL',
        response: paymentResponse
      }, { status: 500 });
    }

    // ШАГ 1: Создаем объект для сохранения в localStorage
    // Клиент должен сохранить эти данные перед переходом на страницу оплаты
    const storageData = {
      paymentId: paymentResponse.id,
      speakerId: speakerId,
      amount: amount,
      timestamp: Date.now()
    };

    // ШАГ 2: Возвращаем все необходимые данные клиенту
    return NextResponse.json({ 
      paymentId: paymentResponse.id,
      paymentUrl: paymentResponse.confirmation.confirmation_url,
      speakerId: speakerId,
      // Важно! Этот объект будет сохранен в localStorage
      storageData: storageData
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create payment',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}