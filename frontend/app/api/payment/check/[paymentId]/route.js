// app/api/payment/check/[paymentId]/route.js
// Возвращает текущий статус платежа из ЮKassa.
// Запись в БД (isPaid, subscriptionExpiresAt и др.) выполняется только в webhook —
// это единственный авторитетный источник.
import { YooCheckout } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';

const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;
const yooCheckout = new YooCheckout({ shopId, secretKey });

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const paymentId = pathParts[pathParts.length - 1];

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID платежа не указан' },
        { status: 400 }
      );
    }

    const payment = await yooCheckout.getPayment(paymentId);

    return NextResponse.json({
      status: payment.status,
      payment,
    });
  } catch (error) {
    console.error('Ошибка проверки статуса платежа:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка проверки статуса платежа' },
      { status: 500 }
    );
  }
}
