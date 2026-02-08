'use client'
import React, { useState, useEffect } from 'react';

export const PaymentModal = ({ isOpen, onClose, onSelectPlan, speakerId, userEmail, speakerDocumentId }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && !speakerId) {
      setError('ID спикера не указан. Пожалуйста, обновите страницу.');
    } else if (isOpen && error === 'ID спикера не указан. Пожалуйста, обновите страницу.') {
      setError(null);
    }
  }, [isOpen, speakerId, error]);

  const plans = [
    { id: 1, duration: 3, price: 4000, label: '3 месяца', perMonth: '1 333' },
    { id: 2, duration: 6, price: 6000, label: '6 месяцев', perMonth: '1 000', badge: 'Популярный' },
    { id: 3, duration: 10, price: 12000, label: '10 месяцев', perMonth: '1 200' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="mb-6">
          <div className="w-[30px] h-[6px] mb-3 bg-[#1B1B1E]"></div>
          <h3 className="text-2xl font-bold text-[#1B1B1E] uppercase tracking-[.16em]">Выберите тариф</h3>
          <p className="text-sm text-gray-500 mt-2">Активируйте профиль спикера для публикации на сайте</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-8">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-[#3742a3] bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 bg-[#42484D] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#1B1B1E] text-lg">{plan.label}</span>
                  <div className="text-xs text-gray-500 mt-0.5">{plan.perMonth} &#8381;/мес</div>
                </div>
                <span className="text-xl font-bold text-[#1B1B1E]">{plan.price.toLocaleString()} &#8381;</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-[#1B1B1E] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium transition-all uppercase tracking-wider text-sm"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            onClick={async () => {
              const plan = plans.find(p => p.id === selectedPlan);
              if (plan) {
                if (!speakerId) {
                  setError('ID спикера не указан.');
                  return;
                }
                setLoading(true);
                setError(null);
                try {
                  await createYookassaPayment(plan, speakerId, userEmail, speakerDocumentId);
                } catch (err) {
                  setError(err.message || 'Произошла ошибка при создании платежа');
                  setLoading(false);
                }
              }
            }}
            disabled={!selectedPlan || loading || !speakerId}
            className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold flex items-center justify-center transition-all duration-300 uppercase tracking-wider text-sm ${
              selectedPlan && !loading && speakerId
                ? 'bg-[#42484D] hover:bg-[#3742a3]'
                : 'bg-gray-300 cursor-not-allowed'
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

export const createYookassaPayment = async (planData, speakerId, userEmail, speakerDocumentId) => {
  try {
    if (!speakerId) throw new Error('ID спикера не указан');
    if (!userEmail) throw new Error('Email пользователя не найден');

    const response = await fetch('/api/yookassa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: planData.price,
        description: `Подписка на ${planData.duration} месяцев`,
        speakerId,
        planId: planData.id,
        email: userEmail,
        speakerDocumentId: speakerDocumentId
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка при создании платежа');
    }

    if (!data.paymentUrl) {
      throw new Error('Не удалось получить ссылку на оплату');
    }

    if (data.storageData) {
      localStorage.setItem('currentPayment', JSON.stringify(data.storageData));
    } else if (data.paymentId) {
      localStorage.setItem('currentPayment', JSON.stringify({
        paymentId: data.paymentId,
        speakerId,
        timestamp: Date.now(),
        speakerDocumentId
      }));
    }

    window.location.href = data.paymentUrl;
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId) => {
  try {
    if (!paymentId) return 'error';

    const authToken = localStorage.getItem('authToken');
    if (!authToken) return 'error';

    const url = `/api/payments/check/${paymentId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') return 'unknown';

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return 'error';
    }

    if (!response.ok) return 'error';
    if (!data.status) return 'unknown';

    return data.status;
  } catch (error) {
    console.error('Ошибка при проверке статуса платежа:', error);
    return 'error';
  }
};
