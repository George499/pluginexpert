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
  // Новые пропсы для индикаторов сжатия
  isCompressingAvatar,
  isCompressingGallery,
  // Пропсы для галереи
  galleryPreviews,
  galleryInputRef,
  handleGalleryChange,
  handleRemoveGalleryImage,
  // Новые пропсы для категорий
  availableCategories = [],
  handleCategoriesChange,
}) => {
  // Функция для обработки изменения категорий
  const onCategoryToggle = (categoryId) => {
    const currentCategories = formData.categories || [];
    const isSelected = currentCategories.some((cat) => cat.id === categoryId);

    let updatedCategories;
    if (isSelected) {
      // Удаляем категорию
      updatedCategories = currentCategories.filter(
        (cat) => cat.id !== categoryId
      );
    } else {
      // Добавляем категорию
      const categoryToAdd = availableCategories.find(
        (cat) => cat.id === categoryId
      );
      if (categoryToAdd) {
        updatedCategories = [...currentCategories, categoryToAdd];
      }
    }

    handleCategoriesChange(updatedCategories);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 shadow-md text-black"
    >
     <h2 className="text-xl font-semibold mb-4 leading-snug mt-0">
        {profileExists ? (
          <>
            {/* Для экранов шире 550px — одна строка */}
            <span className="hidden min-[551px]:inline">Редактирование профиля</span>
            {/* Для экранов до 550px — перенос */}
            <span className="block min-[551px]:hidden">
              Редактирование <br /> профиля
            </span>
          </>
        ) : (
          <>
            <span className="hidden min-[551px]:inline">Создание профиля</span>
            <span className="block min-[551px]:hidden">
              Создание <br /> профиля
            </span>
          </>
        )}
      </h2>

      {/* Аватар */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Фото профиля</label>
        <div className="flex items-start">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-2">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Аватар"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Нет фото</span>
              )}

              {/* Индикатор сжатия аватара */}
              {isCompressingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-sm text-blue-600 hover:text-blue-800"
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

          <div className="ml-4 text-sm text-gray-600">
            <p>Рекомендуемый размер: 400x400 пикселей</p>
            <p>Максимальный размер файла: 5 МБ</p>
            <p>Поддерживаемые форматы: JPG, PNG, GIF</p>
            {avatarPreview && (
              <p>Изображения больше 5 МБ будут автоматически сжаты</p>
            )}
          </div>
        </div>
      </div>

      {/* Галерея изображений */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Галерея изображений</label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {galleryPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div
                className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden"
                style={{ height: "160px", width: "100%" }}
              >
                <img
                  src={preview}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Удалить изображение"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}

          <div
            onClick={() =>
              !isCompressingGallery && galleryInputRef.current.click()
            }
            className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative"
            style={{ height: "160px", width: "100%" }}
          >
            {isCompressingGallery ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="mt-2 text-sm text-gray-600">Обработка...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="mt-2 text-sm text-gray-600">
                  Добавить фото
                </span>
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

        <div className="text-sm text-gray-600">
          <p>Максимальный размер файла: 5 МБ</p>
          <p>Поддерживаемые форматы: JPG, PNG, GIF</p>
          <p>Изображения больше 5 МБ будут автоматически сжаты</p>
        </div>
      </div>

      {/* Основная информация */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Основная информация</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">ФИО *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Профессия</label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          Категории выступлений
        </label>
        <div className="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableCategories
              .sort((a, b) => (a.index || 0) - (b.index || 0))
              .map((category) => (
                <label
                  key={category.id}
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.categories?.some(
                        (cat) => cat.id === category.id
                      ) || false
                    }
                    onChange={() => onCategoryToggle(category.id)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{category.title}</span>
                </label>
              ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Выбрано категорий: {formData.categories?.length || 0}
        </p>
      </div>

      {/* Биография */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">О себе</label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
      </div>

      {/* Темы выступлений */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Темы выступлений
        </label>
        <textarea
          value={formData.speakingTopics}
          onChange={(e) => handleInputChange("speakingTopics", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Укажите темы, по которым вы выступаете (каждая тема с новой строки)"
        />
      </div>

      {/* Образование */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Образование</label>
        <textarea
          value={formData.education}
          onChange={(e) => handleInputChange("education", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Укажите ваше образование (каждое учебное заведение с новой строки)"
        />
      </div>

      {/* Стоимость услуг */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Стоимость услуг
        </label>
        <textarea
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Укажите стоимость ваших услуг (каждый пункт с новой строки)"
        />
      </div>

      {/* Контактная информация */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Контактная информация</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Телефон</label>
            <input
              type="tel"
              value={formData.tel}
              onChange={(e) => handleInputChange("tel", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Телеграм</label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => handleInputChange("telegram", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Социальные сети */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Социальные сети</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => handleInputChange("facebook", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ВКонтакте</label>
            <input
              type="text"
              value={formData.vk}
              onChange={(e) => handleInputChange("vk", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Одноклассники
            </label>
            <input
              type="text"
              value={formData.ok}
              onChange={(e) => handleInputChange("ok", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleInputChange("instagram", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={saving || isCompressingAvatar || isCompressingGallery}
        >
          Отмена
        </button>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={saving || isCompressingAvatar || isCompressingGallery}
        >
          {saving ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
