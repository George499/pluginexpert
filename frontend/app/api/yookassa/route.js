// app/api/yookassa/route.js
import { NextResponse } from 'next/server';
import YooCheckout from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { amount, description, speakerId, planId, email } = await request.json();

    const payment = await checkout.createPayment({
      amount: {
        value: amount,
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?speakerId=${speakerId}`,
      },
      capture: true,
      description: description,
      metadata: {
        speakerId,
        planId,
        email,
      },
      receipt: {
        customer: {
          email,
        },
        items: [
          {
            description,
            quantity: 1,
            amount: {
              value: amount,
              currency: 'RUB',
            },
            vat_code: 1,
          },
        ],
      },
    });

    return NextResponse.json({ confirmation_url: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
