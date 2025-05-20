// app/api/payment/check/[paymentId]/route.js
import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';

// Конфигурация YooKassa
const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const yooCheckout = new YooCheckout({ shopId, secretKey });

// Strapi API URL и токен
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Функция обновления статуса оплаты в Strapi
const updateSpeakerPaymentStatus = async (speakerDocumentId, paymentInfo) => {
  try {
    console.log(`Обновление статуса оплаты для спикера с documentId ${speakerDocumentId} в Strapi...`);
    
    // Получаем информацию о плане подписки
    const planId = paymentInfo.metadata?.planId;
    const amount = paymentInfo.amount?.value;
    
    // Определяем длительность подписки в днях (по умолчанию 30 дней)
    let subscriptionDays = 30;
    
    // Можно настроить разную длительность в зависимости от плана
    if (planId === '2') {
      subscriptionDays = 180; // 6 месяцев
    } else if (planId === '3') {
      subscriptionDays = 300; // 10 месяцев
    }
    
    // Рассчитываем дату окончания подписки
    const now = new Date();
    const expirationDate = new Date(now);
    expirationDate.setDate(now.getDate() + subscriptionDays);
    
    // 1. Сначала ищем спикера по documentId в Strapi
    console.log(`Поиск спикера с documentId ${speakerDocumentId} в Strapi...`);
    
    const findSpeakerResponse = await fetch(
      `${STRAPI_API_URL}/api/speakers?filters[documentId][$eq]=${speakerDocumentId}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    if (!findSpeakerResponse.ok) {
      const errorData = await findSpeakerResponse.text();
      throw new Error(`Ошибка API Strapi при поиске спикера: ${findSpeakerResponse.status} - ${errorData}`);
    }
    
    const speakersData = await findSpeakerResponse.json();
    
    if (!speakersData.data || speakersData.data.length === 0) {
      console.log(speakersData);
      
      throw new Error(`Спикер с documentId ${speakerDocumentId} не найден в Strapi`);
    }
    
    // Получаем id записи в Strapi
    const strapiId = speakersData.data[0].id;
    console.log(`Найден спикер в Strapi с id ${strapiId}`);
    
    // 2. Обновляем спикера по полученному id
    const updateResponse = await fetch(`${STRAPI_API_URL}/api/speakers/${speakerDocumentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          isPaid: true, // Устанавливаем статус isPaid = true
          subscriptionExpiresAt: expirationDate.toISOString(),
          lastPaymentDate: now.toISOString(),
          lastPaymentAmount: amount,
          lastPaymentId: paymentInfo.id
        }
      })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      throw new Error(`Ошибка API Strapi при обновлении спикера: ${updateResponse.status} - ${errorData}`);
    }
    
    const result = await updateResponse.json();
    console.log(`Спикер с documentId ${speakerDocumentId} успешно обновлен в Strapi:`, result);
    
    return true;
  } catch (error) {
    console.error(`Ошибка обновления статуса в Strapi для спикера с documentId ${speakerDocumentId}:`, error);
    return false;
  }
};

export async function GET(request) {
  try {
    // Извлекаем paymentId напрямую из URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const paymentId = pathParts[pathParts.length - 1];
    
    console.log('API получил paymentId из URL:', paymentId);
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID платежа не указан' },
        { status: 400 }
      );
    }
    
    // Получаем информацию о платеже
    const payment = await yooCheckout.getPayment(paymentId);
    
    // Проверяем статус платежа
    const status = payment.status;
    
    // Если платеж успешно завершен, обновляем статус пользователя в Strapi
  if (status === 'succeeded') {
  const speakerDocumentId = payment.metadata?.speakerDocumentId;

  if (speakerDocumentId) {
    console.log(`Платеж успешен для спикера ${speakerDocumentId}`);
    
    // Обновляем статус в Strapi
    const updated = await updateSpeakerPaymentStatus(speakerDocumentId, payment);
    
    if (updated) {
      console.log(`Статус оплаты для спикера ${speakerDocumentId} успешно обновлен в Strapi`);
    } else {
      console.error(`Не удалось обновить статус оплаты для спикера ${speakerDocumentId} в Strapi`);
    }
  } else {
    console.warn('В metadata отсутствует speakerDocumentId');
  }
}
    
    return NextResponse.json({
      status,
      payment
    });
  } catch (error) {
    console.error('Ошибка проверки статуса платежа:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка проверки статуса платежа' },
      { status: 500 }
    );
  }
}