// app/api/payments/latest/route.js
import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils/auth';
import getStrapi from '../../utils/strapi';

export async function GET(request) {
  try {
    // Получаем параметры из URL
    const { searchParams } = new URL(request.url);
    const speakerId = searchParams.get('speakerId');
    
    if (!speakerId) {
      return NextResponse.json({ error: 'Speaker ID is required' }, { status: 400 });
    }

    // Проверяем авторизацию пользователя
    const auth = await checkAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Получаем JWT токен из заголовка
    let token = request.headers.get('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Получаем экземпляр Strapi API с токеном пользователя
    const strapi = getStrapi(token);

    // Находим последний платеж пользователя для указанного спикера
    const payments = await strapi.find('api::payment.payment', {
      filters: {
        speakerId: { $eq: speakerId },
        userId: { $eq: auth.user.id }
      },
      sort: 'createdAt:desc',
      pagination: { page: 1, pageSize: 1 }
    });

    // Если платежи не найдены
    if (!payments.data || payments.data.length === 0) {
      return NextResponse.json({ message: 'No payments found' }, { status: 404 });
    }

    const latestPayment = payments.data[0];

    // Проверяем статус платежа в ЮКассе
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${latestPayment.attributes.paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching payment from Yookassa. Status: ${response.status}`);
      return NextResponse.json({
        paymentId: latestPayment.attributes.paymentId,
        status: 'unknown'
      });
    }

    const paymentData = await response.json();

    // Возвращаем информацию о платеже
    return NextResponse.json({
      paymentId: latestPayment.attributes.paymentId,
      status: paymentData.status,
      amount: paymentData.amount,
      created_at: paymentData.created_at
    });

  } catch (error) {
    console.error('Error getting latest payment:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get latest payment'
    }, { status: 500 });
  }
}