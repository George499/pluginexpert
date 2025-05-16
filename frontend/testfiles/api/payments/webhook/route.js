// app/api/payments/webhook/route.js - обновленная версия без модели payment
import { NextResponse } from 'next/server';
import getStrapi from '../../utils/strapi';
import crypto from 'crypto';

// Отключаем автоматический бодипарсер для получения сырого тела запроса
export const config = {
  api: {
    bodyParser: false,
  },
};

// Вспомогательная функция для чтения тела запроса как строки
async function readBodyAsString(request) {
  const buffer = await request.arrayBuffer();
  return new TextDecoder().decode(buffer);
}

export async function POST(request) {
  try {
    // Получаем тело запроса как строку для создания подписи
    const bodyText = await readBodyAsString(request);
    const body = JSON.parse(bodyText);
    
    // Проверка подписи запроса от ЮКассы для безопасности
    const receivedSignature = request.headers.get('signature');
    if (!receivedSignature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    
    // Создаем HMAC-подпись для проверки
    const hmac = crypto.createHmac('sha1', process.env.YOOKASSA_SECRET_KEY);
    hmac.update(bodyText);
    const calculatedSignature = hmac.digest('hex');
    
    // Проверяем подпись
    if (receivedSignature !== calculatedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Получаем данные о платеже из запроса
    const { event, object } = body;
    
    // Получаем экземпляр Strapi API (без токена, т.к. это вебхук)
    const strapi = getStrapi();
    
    // Обрабатываем только события связанные с платежами
    if (event === 'payment.succeeded') {
      const { speakerId } = object.metadata;
      
      if (!speakerId) {
        console.error('Отсутствует speakerId в метаданных платежа:', object);
        return NextResponse.json({ error: 'Missing speakerId in payment metadata' }, { status: 400 });
      }
      
      // Обновляем статус оплаты спикера (isPaid = true)
      try {
        await strapi.update('api::speaker.speaker', speakerId, {
          data: { isPaid: true }
        });
        
        console.log(`Статус оплаты спикера ${speakerId} успешно обновлен через вебхук`);
        return NextResponse.json({ success: true });
      } catch (strapiError) {
        console.error('Ошибка при обновлении статуса оплаты:', strapiError);
        return NextResponse.json({ 
          error: 'Failed to update payment status',
          details: strapiError.message
        }, { status: 500 });
      }
    } 
    
    // Для других типов событий просто отвечаем успехом
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// Для вебхуков в App Router нужно явно разрешить OPTIONS запросы
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}