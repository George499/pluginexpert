// app/api/payments/check/[id]/route.js - обновленная версия без модели payment
import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils/auth';
import getStrapi from '../../../utils/strapi';

// Добавляем специальный хендлер для OPTIONS запросов для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request, { params }) {
  try {
    console.log('Получен запрос на проверку статуса платежа. Параметры:', params);
    
    // Получаем ID платежа из URL параметров
    const { id } = params;
    
    if (!id) {
      console.error('ID платежа отсутствует в параметрах');
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }
    
    console.log('Проверка платежа с ID:', id);

    // Проверяем авторизацию пользователя
    const auth = await checkAuth(request);
    console.log('Результат проверки авторизации:', auth.authenticated ? 'Авторизован' : 'Не авторизован');
    
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Получаем JWT токен из заголовка
    let token = request.headers.get('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    
    // Проверяем наличие переменных окружения
    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      console.error('Отсутствуют необходимые переменные окружения для ЮКассы');
      return NextResponse.json({ 
        error: 'Missing Yookassa credentials',
        status: 'configuration_error'
      }, { status: 500 });
    }

    // Формируем строку для Basic Auth
    const authString = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64');
    
    // Отправляем запрос к API ЮКассы для получения статуса платежа
    console.log(`Отправляем запрос к ЮКассе на URL: https://api.yookassa.ru/v3/payments/${id}`);
    
    try {
      const response = await fetch(`https://api.yookassa.ru/v3/payments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
      });
      
      // Логируем результат запроса
      console.log('Получен ответ от ЮКассы. Статус:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка в ответе ЮКассы: ${response.status}`, errorText);
        
        return NextResponse.json({ 
          error: `Yookassa API error: ${response.status}`,
          details: errorText,
          status: 'api_error'
        }, { status: 502 });
      }

      // Получаем данные о платеже
      const paymentData = await response.json();
      console.log('Данные о платеже:', paymentData);

      // Если платеж успешно завершен
      if (paymentData.status === 'succeeded') {
        console.log('Платеж успешен. Обновляем статус в Strapi');
        
        // Получаем ID спикера из метаданных платежа
        const speakerId = paymentData.metadata?.speakerId;
        console.log(paymentId);
        
        if (speakerId) {
          console.log('Обновляем статус оплаты спикера с ID:', speakerId);
          
          try {
            // Получаем экземпляр Strapi API с токеном пользователя
            const strapi = getStrapi(token);
            
            // Обновляем статус оплаты спикера в Strapi (только поле isPaid)
            await strapi.update('api::speaker.speaker', speakerId, {
               isPaid: true 
            });
            
            console.log('Статус оплаты успешно обновлен в Strapi');
          } catch (strapiError) {
            console.error('Ошибка при обновлении статуса оплаты в Strapi:', strapiError);
            // Продолжаем выполнение, чтобы клиент получил статус платежа
          }
        } else {
          console.warn('ID спикера отсутствует в метаданных платежа');
        }

        return NextResponse.json({ status: 'succeeded' });
      } else {
        console.log(`Статус платежа: ${paymentData.status}`);
        return NextResponse.json({ status: paymentData.status });
      }
    } catch (fetchError) {
      console.error('Ошибка при запросе к API ЮКассы:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch payment data from Yookassa',
        details: fetchError.message,
        status: 'request_error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Общая ошибка проверки статуса платежа:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to check payment status',
      status: 'error'
    }, { status: 500 });
  }
}