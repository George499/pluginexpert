'use client'
// app/components/PaymentModal.js
import React, { useState, useEffect } from 'react';

export const PaymentModal = ({ isOpen, onClose, onSelectPlan, speakerId }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Проверка speakerId при монтировании компонента
  useEffect(() => {
    if (isOpen && !speakerId) {
      console.error('PaymentModal opened with undefined speakerId');
      setError('ID спикера не указан. Пожалуйста, обновите страницу.');
    } else if (isOpen && error === 'ID спикера не указан. Пожалуйста, обновите страницу.') {
      // Если speakerId появился, а ошибка осталась - сбрасываем ошибку
      setError(null);
    }
  }, [isOpen, speakerId, error]);
  
  const plans = [
    { id: 1, duration: 3, price: 4000, label: '3 МЕСЯЦА' },
    { id: 2, duration: 6, price: 6000, label: '6 МЕСЯЦЕВ' },
    { id: 3, duration: 10, price: 12000, label: '10 МЕСЯЦЕВ' },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-800">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Выберите план подписки</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Ошибка</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan === plan.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{plan.label}</span>
                <span className="text-lg font-bold text-gray-900">{plan.price} ₽</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Отмена
          </button>
          
          <button
            onClick={async () => {
              const plan = plans.find(p => p.id === selectedPlan);
              if (plan) {
                if (!speakerId) {
                  setError('ID спикера не указан. Пожалуйста, обновите страницу.');
                  return;
                }
                
                setLoading(true);
                setError(null);
                try {
                  await createYookassaPayment(plan, speakerId);
                } catch (err) {
                  setError(err.message || 'Произошла ошибка при создании платежа');
                  setLoading(false);
                }
              }
            }}
            disabled={!selectedPlan || loading || !speakerId}
            className={`px-4 py-2 text-white rounded flex items-center justify-center ${
              selectedPlan && !loading && speakerId
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              'Перейти к оплате'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Функция для создания платежа через ЮКассу
export const createYookassaPayment = async (planData, speakerId) => {
  try {
    // Проверяем speakerId
    if (!speakerId) {
      throw new Error('ID спикера не указан');
    }
    
    // Получаем JWT токен из localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      throw new Error('Нет авторизации');
    }
    
    console.log('Создание платежа для спикера ID:', speakerId);
    
    // Запрос к бэкенду для создания платежа в ЮКассе
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        amount: planData.price,
        duration: planData.duration,
        speakerId: speakerId,
        description: `Подписка на ${planData.duration} месяцев`,
      }),
    });
    
    const responseText = await response.text();
    console.log('Raw response from server:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response:', data);
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error('Не удалось разобрать ответ сервера');
    }
    
    if (!response.ok) {
      const errorMessage = data.error || 'Ошибка при создании платежа';
      console.error('Server returned error:', data);
      throw new Error(errorMessage);
    }
    
    if (!data.paymentUrl) {
      console.error('Response does not contain paymentUrl:', data);
      throw new Error('Не удалось получить ссылку на оплату');
    }
    
    // ВАЖНАЯ ЧАСТЬ - сохраняем данные платежа в localStorage
    // Эти данные будут использоваться при возврате из ЮКассы
    if (data.storageData) {
      console.log('Сохраняем данные платежа в localStorage:', data.storageData);
      localStorage.setItem('currentPayment', JSON.stringify(data.storageData));
    } else if (data.paymentId) {
      // Запасной вариант, если сервер не вернул готовый объект storageData
      const paymentInfo = {
        paymentId: data.paymentId,
        speakerId: speakerId,
        timestamp: Date.now()
      };
      console.log('Сохраняем данные платежа в localStorage (запасной вариант):', paymentInfo);
      localStorage.setItem('currentPayment', JSON.stringify(paymentInfo));
    } else {
      console.warn('Не найдены данные для сохранения в localStorage');
    }
    
    // Перенаправляем пользователя на страницу оплаты ЮКассы
    console.log('Перенаправление на страницу оплаты:', data.paymentUrl);
    window.location.href = data.paymentUrl;
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    throw error; // Пробрасываем ошибку для обработки в компоненте
  }
};

// Функция для проверки статуса оплаты
export const checkPaymentStatus = async (paymentId) => {
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