import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';

// Конфигурация YooKassa
const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const yooCheckout = new YooCheckout({ shopId, secretKey });

// Обработчик POST-запросов
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, description, speakerId, planId, email, speakerDocumentId } = body;
        console.log('>> speakerDocumentId из body запроса:', speakerDocumentId);
    if (!amount || !speakerId || !planId) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные параметры' },
        { status: 400 }
      );
    }
    
    // Создаем идентификатор платежа
    const idempotenceKey = `${speakerId}_${planId}_${Date.now()}`;
    
    // Создаем платеж в ЮКассе
    const createPayload = {
      amount: {
        value: amount.toString(),
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-complete`
      },
      description: description || `Оплата подписки`,
      metadata: {
        speakerId,
        planId,
        email,
        speakerDocumentId
      }
    };

    // Отправляем запрос на создание платежа
    const payment = await yooCheckout.createPayment(createPayload, idempotenceKey);
       
    // Получаем URL для перенаправления пользователя
    const paymentUrl = payment.confirmation.confirmation_url;
    
    // Данные для сохранения в localStorage
    const storageData = {
      paymentId: payment.id,
      speakerId,
      planId,
      timestamp: Date.now()
    };
    
    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl,
      storageData
    });
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка создания платежа' },
      { status: 500 }
    );
  }
}
