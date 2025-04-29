import React from 'react';
import { Toaster } from "react-hot-toast";

const ProfileEditForm = ({ 
  formData, 
  profileExists, 
  saving, 
  avatarPreview, 
  fileInputRef, 
  handleInputChange, 
  handleAvatarChange, 
  handleSubmit,
  onCancel
}) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {profileExists ? "Редактировать профиль спикера" : "Создать профиль спикера"}
        </h1>

        {/* Загрузка аватара */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Аватар" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg text-sm transition"
          >
            {avatarPreview ? "Изменить фото" : "Загрузить фото"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Персональная информация */}
          <div>
            <label className="block text-black mb-2">ФИО</label>
            <input
              type="text"
              placeholder="Ваше полное имя"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Профессия</label>
            <input
              type="text"
              placeholder="Кто вы?"
              value={formData.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Биография</label>
            <textarea
              placeholder="Расскажите о себе"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Темы, образование, цена */}
          <div>
            <label className="block text-black mb-2">Темы выступлений</label>
            <textarea
              placeholder="О чем вы можете выступить"
              value={formData.speakingTopics}
              onChange={(e) => handleInputChange('speakingTopics', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Образование</label>
            <textarea
              placeholder="Ваше образование"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Стоимость выступления</label>
            <textarea
              placeholder="Укажите стоимость"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Контакты */}
          <div>
            <label className="block text-black mb-2">Телефон</label>
            <input
              type="text"
              placeholder="Ваш телефон"
              value={formData.tel}
              onChange={(e) => handleInputChange('tel', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Telegram</label>
            <input
              type="text"
              placeholder="@telegram_username"
              value={formData.telegram}
              onChange={(e) => handleInputChange('telegram', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">WhatsApp</label>
            <input
              type="text"
              placeholder="Номер WhatsApp"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Facebook</label>
            <input
              type="text"
              placeholder="Ваш профиль Facebook"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">ВКонтакте</label>
            <input
              type="text"
              placeholder="Ваш профиль ВКонтакте"
              value={formData.vk}
              onChange={(e) => handleInputChange('vk', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Одноклассники</label>
            <input
              type="text"
              placeholder="Ваш профиль Одноклассники"
              value={formData.ok}
              onChange={(e) => handleInputChange('ok', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Instagram</label>
            <input
              type="text"
              placeholder="Ваш профиль Instagram"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">LinkedIn</label>
            <input
              type="text"
              placeholder="Ваш профиль LinkedIn"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          {profileExists && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Отмена
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`${profileExists ? 'flex-1' : 'w-full'} py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {saving ? "Сохранение..." : (profileExists ? "Сохранить изменения" : "Создать профиль")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;