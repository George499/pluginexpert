'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    const checkPayment = async () => {
      try {
        // Получаем данные платежа из localStorage
        const paymentData = localStorage.getItem('currentPayment');
        
        if (!paymentData) {
          setStatus('error');
          return;
        }
        
        const { paymentId, speakerId } = JSON.parse(paymentData);
        
        if (!paymentId) {
          setStatus('error');
          return;
        }
        
        // Проверяем статус платежа
        const response = await fetch(`/api/payments/check/${paymentId}`);
        const data = await response.json();
        
        if (data.status === 'succeeded') {
          setStatus('success');
          
          // Очищаем данные платежа из localStorage
          localStorage.removeItem('currentPayment');
          
          // Перенаправляем пользователя на страницу профиля через 3 секунды
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Ошибка проверки платежа:', error);
        setStatus('error');
      }
    };
    
    checkPayment();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Оплата</h1>
        
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Проверка статуса платежа...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-xl font-semibold">Оплата успешно завершена!</h2>
            </div>
            <p className="text-gray-600 mb-4">Спасибо за оплату. Ваша подписка активирована.</p>
            <p className="text-gray-500">Вы будете перенаправлены на страницу профиля через несколько секунд...</p>
          </div>
        )}
        
        {status === 'pending' && (
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold">Платеж обрабатывается</h2>
            </div>
            <p className="text-gray-600">Ваш платеж находится в обработке. Пожалуйста, подождите.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Проверить статус
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold">Ошибка проверки платежа</h2>
            </div>
            <p className="text-gray-600 mb-4">Не удалось проверить статус платежа. Пожалуйста, свяжитесь с поддержкой.</p>
            <button 
              onClick={() => router.push('/profile')}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Вернуться в профиль
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
