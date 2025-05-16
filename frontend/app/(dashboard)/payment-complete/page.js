'use client'
// app/(dashboard)/payment-complete/page.js с дополнительным логированием и обработкой ошибок
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Функция проверки статуса платежа (внедрена напрямую для упрощения отладки)
const checkPaymentStatus = async (paymentId) => {
  try {
    console.log('Проверка статуса платежа для ID:', paymentId);
    
    // Проверяем ID платежа
    if (!paymentId) {
      console.error('Ошибка: ID платежа не указан');
      return 'error';
    }
    
    // Получаем JWT токен из localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      console.error('Ошибка: Нет авторизации (токен отсутствует)');
      return 'error';
    }
    
    console.log('Отправка запроса к API для проверки статуса платежа...');
    
    // Полный URL для отладки
    const url = `/api/payments/check/${paymentId}`;
    console.log('URL запроса:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Получен ответ от API. Статус:', response.status);
    
    // Получаем тело ответа
    const responseText = await response.text();
    console.log('Тело ответа (raw):', responseText);
    
    // Если ответ пустой, возвращаем unknown
    if (!responseText || responseText.trim() === '') {
      console.error('Получен пустой ответ от сервера');
      return 'unknown';
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Разобранные данные ответа:', data);
    } catch (e) {
      console.error('Ошибка разбора JSON-ответа:', e);
      return 'error';
    }
    
    if (!response.ok) {
      console.error('Ошибка проверки статуса платежа:', data);
      return 'error';
    }
    
    // Проверяем наличие статуса в ответе
    if (!data.status) {
      console.error('В ответе отсутствует поле status:', data);
      return 'unknown';
    }
    
    console.log('Статус платежа:', data.status);
    return data.status;
  } catch (error) {
    console.error('Ошибка при проверке статуса платежа:', error);
    return 'error';
  }
};

export default function PaymentComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Проверка статуса платежа...');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  
  // Получаем параметры из URL (если есть)
  const paymentId = searchParams.get('paymentId');
  const speakerId = searchParams.get('speakerId');

  console.log('Инициализация страницы подтверждения платежа');
  console.log('Параметры URL:', { paymentId, speakerId });

  useEffect(() => {
    console.log('Эффект запущен. Проверка авторизации...');
    
    // Проверяем авторизацию
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.log('Токен авторизации отсутствует. Перенаправление на страницу входа...');
      router.push('/login');
      return;
    }
    
    console.log('Пользователь авторизован');
    setIsAuthenticated(true);
    
    // Пытаемся получить информацию о платеже из localStorage
    console.log('Поиск информации о платеже в localStorage...');
    const storedPaymentStr = localStorage.getItem('currentPayment');
    let storedPayment = null;
    
    if (storedPaymentStr) {
      try {
        storedPayment = JSON.parse(storedPaymentStr);
        console.log('Найдены данные о платеже в localStorage:', storedPayment);
        
        // Проверяем, что данные не устарели (не старше 1 часа)
        const paymentAge = Date.now() - (storedPayment.timestamp || 0);
        const isPaymentExpired = paymentAge > 60 * 60 * 1000; // 1 час
        
        if (isPaymentExpired) {
          console.log('Данные о платеже устарели');
          storedPayment = null;
          localStorage.removeItem('currentPayment');
        } else {
          setPaymentInfo(storedPayment);
        }
      } catch (e) {
        console.error('Ошибка при разборе данных платежа из localStorage:', e);
        localStorage.removeItem('currentPayment');
      }
    } else {
      console.log('Данные о платеже в localStorage не найдены');
    }
    
    // Определяем ID платежа и спикера (приоритет: URL, затем localStorage)
    const effectivePaymentId = paymentId || (storedPayment && storedPayment.paymentId);
    const effectiveSpeakerId = speakerId || (storedPayment && storedPayment.speakerId);
    
    console.log('Эффективные данные платежа:', { 
      effectivePaymentId, 
      effectiveSpeakerId 
    });

    // Если нет ни ID платежа, ни ID спикера, перенаправляем в личный кабинет
    if (!effectivePaymentId && !effectiveSpeakerId) {
      console.log('Отсутствуют необходимые данные. Перенаправление в личный кабинет...');
      setLoadingMessage('Недостаточно данных. Перенаправление...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return;
    }

    // Проверяем статус платежа по ID
    if (effectivePaymentId) {
      const checkStatus = async () => {
        console.log('Проверка статуса платежа...');
        setLoadingMessage('Проверка статуса платежа...');
        
        try {
          const status = await checkPaymentStatus(effectivePaymentId);
          console.log('Получен статус платежа:', status);
          setPaymentStatus(status);
          
          // Если платеж успешен, очищаем данные из localStorage
          if (status === 'succeeded') {
            console.log('Платеж успешен. Очищаем данные из localStorage');
            localStorage.removeItem('currentPayment');
          }
        } catch (error) {
          console.error('Ошибка при проверке статуса платежа:', error);
          setPaymentStatus('error');
          setErrorDetails(error.message || 'Неизвестная ошибка');
        }
      };

      checkStatus();

      // Проверяем статус каждые 5 секунд, если платеж в обработке
      console.log('Настройка периодической проверки статуса...');
      const interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(effectivePaymentId);
          console.log('Периодическая проверка статуса:', status);
          setPaymentStatus(status);
          
          // Если статус изменился на успешный, прекращаем проверку
          if (status === 'succeeded') {
            console.log('Платеж успешен. Очищаем данные и останавливаем проверки');
            clearInterval(interval);
            localStorage.removeItem('currentPayment');
          }
        } catch (error) {
          console.error('Ошибка в интервальной проверке статуса платежа:', error);
          // Не меняем статус, продолжаем попытки
        }
      }, 5000);

      return () => {
        console.log('Очистка эффекта. Остановка периодических проверок');
        clearInterval(interval);
      };
    }
  }, [paymentId, speakerId, router]);

  // Отображаем пустой компонент во время проверки авторизации
  if (!isAuthenticated) {
    console.log('Пользователь не авторизован. Не рендерим основной контент');
    return null;
  }

  // Получаем эффективный ID спикера (из URL или localStorage)
  const effectiveSpeakerId = speakerId || (paymentInfo && paymentInfo.speakerId);
  console.log('Рендеринг с effectiveSpeakerId:', effectiveSpeakerId);

  // Отображаем соответствующий контент в зависимости от статуса платежа
  const renderContent = () => {
    console.log('Рендеринг контента для статуса:', paymentStatus);
    
    switch (paymentStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg">{loadingMessage}</p>
          </div>
        );
      
      case 'succeeded':
        return (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">Оплата прошла успешно!</h2>
            <p className="mb-6">Профиль спикера был активирован и теперь доступен для всех пользователей.</p>
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
                Вернуться в личный кабинет
              </button>
            </Link>
          </div>
        );
      
      case 'pending':
      case 'waiting_for_capture':
        return (
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⌛</div>
            <h2 className="text-2xl font-bold mb-4">Платеж в обработке</h2>
            <p className="mb-6">Ваш платеж обрабатывается. Это может занять некоторое время. Пожалуйста, не закрывайте эту страницу.</p>
          </div>
        );
      
      case 'canceled':
        return (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold mb-4">Платеж отменен</h2>
            <p className="mb-6">К сожалению, платеж был отменен или произошла ошибка.</p>
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md mr-4">
                Вернуться в личный кабинет
              </button>
            </Link>
            <button 
              onClick={() => router.push(`/dashboard?openPayment=true&speakerId=${effectiveSpeakerId}`)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md"
            >
              Попробовать снова
            </button>
          </div>
        );
      
      case 'not_found':
        return (
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Информация о платеже не найдена</h2>
            <p className="mb-6">Не удалось найти информацию о платеже. Возможно, платеж не был создан или был обработан некорректно.</p>
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
                Вернуться в личный кабинет
              </button>
            </Link>
          </div>
        );
        
      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Ошибка при проверке статуса</h2>
            <p className="mb-6">Произошла ошибка при проверке статуса платежа.</p>
            {errorDetails && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-left">
                <p className="font-bold">Детали ошибки:</p>
                <p className="text-sm break-words">{errorDetails}</p>
              </div>
            )}
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
                Вернуться в личный кабинет
              </button>
            </Link>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Неизвестный статус платежа</h2>
            <p className="mb-6">Не удалось определить статус платежа. Пожалуйста, свяжитесь с поддержкой.</p>
            <p className="text-gray-500 mb-4">Полученный статус: {paymentStatus || 'не определен'}</p>
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
                Вернуться в личный кабинет
              </button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 text-black">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Статус оплаты</h1>
        {renderContent()}
      </div>
    </div>
  );
}