"use client";

const ProfileEditForm = ({
  formData,
  profileExists,
  saving,
  avatarPreview,
  fileInputRef,
  handleInputChange,
  handleAvatarChange,
  handleSubmit,
  onCancel,
  isCompressingAvatar,
  isCompressingGallery,
  galleryPreviews,
  galleryInputRef,
  handleGalleryChange,
  handleRemoveGalleryImage,
  availableCategories = [],
  handleCategoriesChange,
}) => {
  const onCategoryToggle = (categoryId) => {
    const currentCategories = formData.categories || [];
    const isSelected = currentCategories.some((cat) => cat.id === categoryId);
    let updatedCategories;
    if (isSelected) {
      updatedCategories = currentCategories.filter((cat) => cat.id !== categoryId);
    } else {
      const categoryToAdd = availableCategories.find((cat) => cat.id === categoryId);
      if (categoryToAdd) {
        updatedCategories = [...currentCategories, categoryToAdd];
      }
    }
    handleCategoriesChange(updatedCategories);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#1B1B1E] placeholder-gray-400 focus:outline-none focus:border-[#3742a3] focus:ring-1 focus:ring-[#3742a3] transition-all";
  const textareaClasses =
    "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#1B1B1E] placeholder-gray-400 focus:outline-none focus:border-[#3742a3] focus:ring-1 focus:ring-[#3742a3] transition-all h-32 resize-none";
  const labelClasses = "block text-sm font-semibold text-[#1B1B1E] uppercase tracking-wider mb-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 text-[#1B1B1E]"
    >
      <div className="mb-8">
        <div className="w-[40px] h-[8px] mb-4 bg-[#1B1B1E]"></div>
        <h2 className="text-2xl font-bold uppercase tracking-[.16em]">
          {profileExists ? (
            <>
              <span className="hidden min-[551px]:inline">Редактирование профиля</span>
              <span className="block min-[551px]:hidden">Редактирование<br />профиля</span>
            </>
          ) : (
            <>
              <span className="hidden min-[551px]:inline">Создание профиля</span>
              <span className="block min-[551px]:hidden">Создание<br />профиля</span>
            </>
          )}
        </h2>
        <div className="w-2/3 h-[1px] bg-gray-300 mt-4"></div>
      </div>

      {/* Avatar */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Фото профиля
        </h3>
        <div className="flex items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Аватар" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Нет фото</span>
              )}
              {isCompressingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-3 text-sm text-[#3742a3] hover:text-[#42484D] font-medium transition-colors underline"
              disabled={isCompressingAvatar}
            >
              {isCompressingAvatar ? "Сжатие..." : "Изменить фото"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              disabled={isCompressingAvatar}
            />
          </div>
          <div className="text-sm text-gray-500 space-y-1 pt-2">
            <p>Рекомендуемый размер: 400x400 пикселей</p>
            <p>Максимальный размер файла: 5 МБ</p>
            <p>Поддерживаемые форматы: JPG, PNG, GIF</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Галерея изображений
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {galleryPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-200">
                <img
                  src={preview}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(index)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Удалить изображение"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div
            onClick={() => !isCompressingGallery && galleryInputRef.current.click()}
            className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#3742a3] transition-all"
          >
            {isCompressingGallery ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#42484D] border-t-transparent"></div>
                <span className="mt-2 text-xs text-gray-500">Обработка...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 text-xs text-gray-500">Добавить фото</span>
              </>
            )}
          </div>
        </div>
        <input
          type="file"
          multiple
          ref={galleryInputRef}
          onChange={handleGalleryChange}
          accept="image/*"
          className="hidden"
          disabled={isCompressingGallery}
        />
        <p className="text-xs text-gray-500">Макс. 5 МБ на файл. JPG, PNG, GIF. Большие файлы сжимаются автоматически.</p>
      </div>

      {/* Main info */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Основная информация
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>ФИО *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Профессия</label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Категории выступлений
        </h3>
        <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {availableCategories
              .sort((a, b) => (a.index || 0) - (b.index || 0))
              .map((category) => (
                <label
                  key={category.id}
                  className="flex items-center cursor-pointer hover:bg-gray-100 p-2.5 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories?.some((cat) => cat.id === category.id) || false}
                    onChange={() => onCategoryToggle(category.id)}
                    className="mr-3 h-4 w-4 accent-[#42484D] rounded"
                  />
                  <span className="text-[#1B1B1E] text-sm">{category.title}</span>
                </label>
              ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Выбрано категорий: {formData.categories?.length || 0}</p>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className={labelClasses}>О себе</label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className={textareaClasses}
        />
      </div>

      {/* Topics */}
      <div className="mb-6">
        <label className={labelClasses}>Темы выступлений</label>
        <textarea
          value={formData.speakingTopics}
          onChange={(e) => handleInputChange("speakingTopics", e.target.value)}
          className={textareaClasses}
          placeholder="Укажите темы, по которым вы выступаете (каждая тема с новой строки)"
        />
      </div>

      {/* Education */}
      <div className="mb-6">
        <label className={labelClasses}>Образование</label>
        <textarea
          value={formData.education}
          onChange={(e) => handleInputChange("education", e.target.value)}
          className={textareaClasses}
          placeholder="Укажите ваше образование (каждое учебное заведение с новой строки)"
        />
      </div>

      {/* Price */}
      <div className="mb-8">
        <label className={labelClasses}>Стоимость услуг</label>
        <textarea
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className={textareaClasses}
          placeholder="Укажите стоимость ваших услуг (каждый пункт с новой строки)"
        />
      </div>

      {/* Contacts */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Контактная информация
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Телефон</label>
            <input type="tel" value={formData.tel} onChange={(e) => handleInputChange("tel", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Email *</label>
            <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={inputClasses} required />
          </div>
          <div>
            <label className={labelClasses}>Телеграм</label>
            <input type="text" value={formData.telegram} onChange={(e) => handleInputChange("telegram", e.target.value)} className={inputClasses} placeholder="@username" />
          </div>
          <div>
            <label className={labelClasses}>WhatsApp</label>
            <input type="text" value={formData.whatsapp} onChange={(e) => handleInputChange("whatsapp", e.target.value)} className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1B1B1E] uppercase tracking-[.16em] mb-4 pb-2 border-b border-gray-200">
          Социальные сети
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Facebook</label>
            <input type="text" value={formData.facebook} onChange={(e) => handleInputChange("facebook", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>ВКонтакте</label>
            <input type="text" value={formData.vk} onChange={(e) => handleInputChange("vk", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Одноклассники</label>
            <input type="text" value={formData.ok} onChange={(e) => handleInputChange("ok", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Instagram</label>
            <input type="text" value={formData.instagram} onChange={(e) => handleInputChange("instagram", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>LinkedIn</label>
            <input type="text" value={formData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-[#1B1B1E] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium transition-all uppercase tracking-wider text-sm"
          disabled={saving || isCompressingAvatar || isCompressingGallery}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-8 py-3 text-white bg-[#42484D] hover:bg-[#3742a3] font-semibold transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50"
          disabled={saving || isCompressingAvatar || isCompressingGallery}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          ) : (
            "Сохранить"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
