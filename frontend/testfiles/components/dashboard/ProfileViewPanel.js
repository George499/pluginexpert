'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentModal, createYookassaPayment } from "./PaymentModal";

// Вспомогательный компонент для отображения карточки социальной сети
const SocialCard = ({ icon, label, link, username }) => {
  if (!username) return null;
  
  return (
    <div className="flex items-center p-3 border rounded-lg mb-2 bg-gray-50">
      <div className="mr-3 text-xl text-blue-500">{icon}</div>
      <div>
        <div className="font-semibold text-gray-700">{label}</div>
        {link ? (
          <a 
            href={link.startsWith('http') ? link : `https://${link}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {username}
          </a>
        ) : (
          <div className="text-gray-700">{username}</div>
        )}
      </div>
    </div>
  );
};

// profile.id передается отдельно, так как его нет в formData
const ProfileViewPanel = ({ formData, avatarPreview, galleryPreviews = [], onEdit, speakerId, isPaid }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const searchParams = useSearchParams();
  
  console.log('ProfileViewPanel formData:', isPaid);
 
  
  // Проверяем, нужно ли открыть модальное окно оплаты при загрузке
  useEffect(() => {
    const openPayment = searchParams.get('openPayment');
    if (openPayment === 'true' && speakerId && !formData.isPaid) {
      setIsPaymentModalOpen(true);
    }
  }, [searchParams, formData, speakerId]);
  
  const handlePayButtonClick = () => {
    // Проверяем наличие ID перед открытием модального окна
    if (!speakerId) {
      console.error('Cannot open payment modal: Speaker ID is undefined');
      alert('Ошибка: ID спикера не определен. Пожалуйста, обновите страницу или свяжитесь с поддержкой.');
      return;
    }
    
    setIsPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  const handleSelectPlan = (planData) => {
    // Убедимся, что speakerId определен
    if (!speakerId) {
      console.error('Cannot create payment: Speaker ID is undefined');
      alert('Ошибка: ID спикера не определен. Пожалуйста, обновите страницу или свяжитесь с поддержкой.');
      return;
    }
    
    console.log('Creating payment for speaker ID:', speakerId);
    setIsPaymentModalOpen(false);
    createYookassaPayment(planData, speakerId);
  };

  // Если данные еще не загружены, показываем сообщение о загрузке
  if (!formData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto mb-10 flex items-center justify-center">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных спикера...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Профиль спикера</h2>
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Редактировать
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка: фото и контакты */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center mb-6">
            {avatarPreview ? (
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                {/* Добавляем ключ для принудительного перерисовывания и метку времени, чтобы избежать кэширования */}
                <img 
                  src={avatarPreview}
                  alt={formData.fullName} 
                  className="w-full h-full object-cover"
                  key={`avatar-${Date.now()}`}
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 mb-4">
                <span className="text-gray-500">Нет фото</span>
              </div>
            )}
            <h3 className="text-xl font-semibold text-center text-gray-800">{formData.fullName}</h3>
            <p className="text-gray-600 text-center">{formData.profession}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Контактная информация</h4>
            {formData.email && (
              <div className="mb-3">
                <div className="font-medium text-gray-700">Email:</div>
                <div className="text-blue-500">{formData.email}</div>
              </div>
            )}
            
            {!formData.isPaid && speakerId && (
              <button
                onClick={handlePayButtonClick}
                className="bg-green-500 hover:bg-green-600 w-[90%] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              >
                Оплатить
              </button>
            )}
            
            {formData.isPaid && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-4">
                <span className="font-medium">✓ Оплачено</span>
              </div>
            )}
            
            {formData.tel && (
              <div className="mb-3">
                <div className="font-medium text-gray-700">Телефон:</div>
                <div className="text-gray-700">{formData.tel}</div>
              </div>
            )}
            
            <div className="mt-4">
              <SocialCard 
                icon="📱" 
                label="Telegram" 
                username={formData.telegram} 
                link={formData.telegram ? `https://t.me/${formData.telegram.replace('@', '')}` : null} 
              />
              
              <SocialCard 
                icon="📱" 
                label="WhatsApp" 
                username={formData.whatsapp} 
                link={formData.whatsapp ? `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}` : null} 
              />
              
              <SocialCard 
                icon="📱" 
                label="Facebook" 
                username={formData.facebook} 
                link={formData.facebook} 
              />
              
              <SocialCard 
                icon="📱" 
                label="ВКонтакте" 
                username={formData.vk} 
                link={formData.vk} 
              />
              
              <SocialCard 
                icon="📱" 
                label="Instagram" 
                username={formData.instagram} 
                link={formData.instagram ? `https://instagram.com/${formData.instagram.replace('@', '')}` : null} 
              />
              
              <SocialCard 
                icon="📱" 
                label="LinkedIn" 
                username={formData.linkedin} 
                link={formData.linkedin} 
              />
            </div>
          </div>
        </div>
        
        {/* Правая колонка: информация */}
        <div className="md:col-span-2">
          {/* Биография */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Биография</h4>
            <div className="whitespace-pre-line text-gray-700">{formData.bio || "Нет информации"}</div>
          </div>
          
          {/* Темы выступлений */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Темы выступлений</h4>
            <div className="whitespace-pre-line text-gray-700">{formData.speakingTopics || "Нет информации"}</div>
          </div>
          
          {/* Образование */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Образование</h4>
            <div className="whitespace-pre-line text-gray-700">{formData.education || "Нет информации"}</div>
          </div>
          
          {/* Стоимость услуг */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Стоимость услуг</h4>
            <div className="whitespace-pre-line text-gray-700">{formData.price || "Нет информации"}</div>
          </div>
          
          {/* Галерея изображений */}
          {galleryPreviews && galleryPreviews.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">Галерея</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryPreviews.map((image, index) => (
                  <div key={`gallery-${index}-${Date.now()}`} className="aspect-square overflow-hidden rounded-lg border">
                    <img 
                      src={image} 
                      alt={`Галерея ${index+1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => {
                        // При клике открываем изображение с новой временной меткой для предотвращения кэширования
                        const baseUrl = image.split('?')[0];
                        const cacheBuster = `?t=${new Date().getTime()}`;
                        window.open(baseUrl + cacheBuster, '_blank');
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Модальное окно выбора плана оплаты - показываем только если есть ID спикера */}
      {speakerId && (
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={handleClosePaymentModal} 
          onSelectPlan={handleSelectPlan}
          speakerId={speakerId}
        />
      )}
    </div>
  );
};

export default ProfileViewPanel;