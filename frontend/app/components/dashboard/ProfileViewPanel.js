'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentModal, createYookassaPayment } from "./PaymentModal";

const SocialCard = ({ iconSrc, label, link, username }) => {
  if (!username) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-2 transition-all hover:bg-gray-100">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
        <img src={iconSrc} alt={label} width={24} height={24} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        {link ? (
          <a
            href={link.startsWith('http') ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3742a3] hover:text-[#42484D] transition-colors text-sm truncate block"
          >
            {username}
          </a>
        ) : (
          <div className="text-[#1B1B1E] text-sm truncate">{username}</div>
        )}
      </div>
    </div>
  );
};

const ProfileViewPanel = ({
  formData,
  avatarPreview,
  galleryPreviews = [],
  onEdit,
  speakerId,
  userEmail,
  speakerDocumentId,
  subscriptionExpiresAt,
  lastPaymentDate,
  lastPaymentAmount,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePersonal, setAgreePersonal] = useState(false);

  useEffect(() => {
    const openPayment = searchParams.get('openPayment');
    if (openPayment === 'true' && speakerId && !formData.isPaid) {
      setIsPaymentModalOpen(true);
    }
  }, [searchParams, formData, speakerId]);

  const handlePayButtonClick = () => {
    if (!speakerId) {
      alert('ID спикера не определен. Пожалуйста, обновите страницу.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleSelectPlan = (planData) => {
    if (!speakerId) {
      alert('ID спикера не определен. Пожалуйста, обновите страницу.');
      return;
    }
    setIsPaymentModalOpen(false);
    createYookassaPayment(planData, speakerId, userEmail, speakerDocumentId);
  };

  if (!formData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto mb-10 flex items-center justify-center">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#42484D] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка данных спикера...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto mb-10 overflow-hidden">
      {/* Header bar */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-200">
        <div>
          <div className="w-[40px] h-[8px] mb-3 bg-[#1B1B1E]"></div>
          <h2 className="text-3xl font-bold text-[#1B1B1E] uppercase tracking-[.16em] max-[450px]:text-2xl max-[400px]:text-xl">
            Профиль спикера
          </h2>
        </div>
        <button
          onClick={onEdit}
          className="bg-[#42484D] hover:bg-[#3742a3] text-white py-3 px-8 font-semibold transition-all duration-300 uppercase tracking-wider text-base"
        >
          Редактировать
        </button>
      </div>

      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-1">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center mb-8">
              {avatarPreview ? (
                <div className="border-2 border-gray-200 p-1 rounded-full mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={avatarPreview}
                      alt={formData.fullName}
                      className="w-full h-full object-cover"
                      key={`avatar-${Date.now()}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-gray-200 p-1 rounded-full mb-4">
                  <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Нет фото</span>
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#1B1B1E] text-center uppercase tracking-wide">{formData.fullName}</h3>
              <p className="text-gray-500 text-center mt-2 text-base">{formData.profession}</p>
            </div>

            {/* Contacts */}
            <div className="mb-6">
              <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-4 pb-2 border-b border-gray-200">
                Контакты
              </h4>
              {formData.email && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Email</div>
                  <div className="text-[#1B1B1E] text-sm">{formData.email}</div>
                </div>
              )}
              {formData.tel && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Телефон</div>
                  <div className="text-[#1B1B1E] text-sm">{formData.tel}</div>
                </div>
              )}

              <div className="mt-4">
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/telegram-app--v1.png"
                  label="Telegram"
                  username={formData.telegram}
                  link={formData.telegram ? `https://t.me/${formData.telegram.replace('@', '')}` : null}
                />
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/whatsapp--v1.png"
                  label="WhatsApp"
                  username={formData.whatsapp}
                  link={formData.whatsapp ? `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}` : null}
                />
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/facebook-new.png"
                  label="Facebook"
                  username={formData.facebook}
                  link={formData.facebook}
                />
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/vk-com.png"
                  label="ВКонтакте"
                  username={formData.vk}
                  link={formData.vk}
                />
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/instagram-new--v1.png"
                  label="Instagram"
                  username={formData.instagram}
                  link={formData.instagram ? `https://instagram.com/${formData.instagram.replace('@', '')}` : null}
                />
                <SocialCard
                  iconSrc="https://img.icons8.com/color/24/linkedin.png"
                  label="LinkedIn"
                  username={formData.linkedin}
                  link={formData.linkedin}
                />
              </div>
            </div>

            {/* Payment section */}
            {!formData.isPaid && speakerId && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-[#1B1B1E] mb-3 uppercase tracking-wider">
                  Нажимая кнопку &quot;Оплатить&quot;, я:
                </p>
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 accent-[#42484D]"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed">
                    Ознакомлен и принимаю условия{" "}
                    <a href="/docs/Пользовательское_соглашение.pdf" target="_blank" rel="noopener noreferrer" className="text-[#3742a3] hover:underline">
                      Пользовательского соглашения
                    </a>{" "}и{" "}
                    <a href="/docs/Политика_конфиденциальности_ИП_Гузановский.pdf" target="_blank" rel="noopener noreferrer" className="text-[#3742a3] hover:underline">
                      Положения об обработке персональных данных
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="agreePersonal"
                    checked={agreePersonal}
                    onChange={(e) => setAgreePersonal(e.target.checked)}
                    className="mt-1 accent-[#42484D]"
                  />
                  <label htmlFor="agreePersonal" className="text-xs text-gray-600 leading-relaxed">
                    Даю{" "}
                    <a href="/docs/Согласие_на_обработку_ПД.pdf" target="_blank" rel="noopener noreferrer" className="text-[#3742a3] hover:underline">
                      согласие ИП Гузановскому А.С. на обработку своих персональных данных
                    </a>
                  </label>
                </div>
                <button
                  onClick={handlePayButtonClick}
                  className="w-full bg-[#42484D] hover:bg-[#3742a3] text-white py-3 px-4 font-semibold transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!agreeTerms || !agreePersonal}
                >
                  Оплатить
                </button>
              </div>
            )}

            {formData.isPaid && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg mb-4">
                <div className="font-semibold mb-1 flex items-center gap-2 uppercase tracking-wider text-sm">
                  <span className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">&#10003;</span>
                  Оплачено
                </div>
                {lastPaymentDate && (
                  <div className="text-xs text-green-700 mt-1">Последняя оплата: <span className="font-medium">{new Date(lastPaymentDate).toLocaleDateString()}</span></div>
                )}
                {lastPaymentAmount && (
                  <div className="text-xs text-green-700">Сумма: <span className="font-medium">{lastPaymentAmount} &#8381;</span></div>
                )}
                {subscriptionExpiresAt && (
                  <div className="text-xs text-green-700">Действительно до: <span className="font-medium">{new Date(subscriptionExpiresAt).toLocaleDateString()}</span></div>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-3 pb-2 border-b border-gray-200">
                Биография
              </h4>
              <div className="whitespace-pre-line text-[#1B1B1E] leading-relaxed text-base">
                {formData.bio || <span className="text-gray-400 italic">Нет информации</span>}
              </div>
            </div>

            <div>
              <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-3 pb-2 border-b border-gray-200">
                Темы выступлений
              </h4>
              <div className="whitespace-pre-line text-[#1B1B1E] leading-relaxed text-base">
                {formData.speakingTopics || <span className="text-gray-400 italic">Нет информации</span>}
              </div>
            </div>

            <div>
              <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-3 pb-2 border-b border-gray-200">
                Образование
              </h4>
              <div className="whitespace-pre-line text-[#1B1B1E] leading-relaxed text-base">
                {formData.education || <span className="text-gray-400 italic">Нет информации</span>}
              </div>
            </div>

            <div>
              <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-3 pb-2 border-b border-gray-200">
                Стоимость услуг
              </h4>
              <div className="whitespace-pre-line text-[#1B1B1E] leading-relaxed text-base">
                {formData.price || <span className="text-gray-400 italic">Нет информации</span>}
              </div>
            </div>

            {galleryPreviews && galleryPreviews.length > 0 && (
              <div>
                <h4 className="text-base uppercase tracking-[.16em] text-[#1B1B1E] font-bold mb-3 pb-2 border-b border-gray-200">
                  Галерея
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryPreviews.map((image, index) => (
                    <div
                      key={`gallery-${index}-${Date.now()}`}
                      className="aspect-square overflow-hidden rounded-lg ring-1 ring-gray-200 cursor-pointer group"
                      onClick={() => {
                        const baseUrl = image.split('?')[0];
                        window.open(`${baseUrl}?t=${Date.now()}`, '_blank');
                      }}
                    >
                      <img
                        src={image}
                        alt={`Галерея ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {speakerId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          onSelectPlan={handleSelectPlan}
          speakerId={speakerId}
          userEmail={userEmail}
          speakerDocumentId={speakerDocumentId}
        />
      )}
    </div>
  );
};

export default ProfileViewPanel;
