"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const API_URL = "https://admin.pluginexpert.ru";

export function ProfileForm() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  
  // Состояния для аватара
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Состояния для галереи
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  // Состояния для категорий
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Основные данные формы
  const [formData, setFormData] = useState({
    fullName: "",
    profession: "",
    bio: "",
    speakingTopics: "",
    education: "",
    price: "",
    tel: "",
    telegram: "",
    email: "",
    whatsapp: "",
    facebook: "",
    vk: "",
    ok: "",
    instagram: "",
    linkedin: ""
  });
  
  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Загрузка категорий");
        const response = await fetch(`${API_URL}/api/categories`);
        
        if (!response.ok) {
          console.error("Ошибка загрузки категорий:", response.status);
          return;
        }
        
        const data = await response.json();
        console.log("Загруженные категории:", data);
        
        if (data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    fetchCategories();
  }, []);
  
  // Загрузка данных пользователя и профиля
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem("authToken");
        console.log("Токен авторизации:", token ? "Токен существует" : "Токен отсутствует");
        
        if (!token) {
          console.log("Перенаправление на страницу входа из-за отсутствия токена");
          window.location.href = "/auth/signin";
          return;
        }

        // Загружаем данные пользователя
        console.log("Отправка запроса для получения данных пользователя");
        const userRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) {
          console.error("Ошибка получения данных пользователя:", userRes.status);
          throw new Error("Не удалось загрузить данные пользователя");
        }

        const userData = await userRes.json();
        console.log("Данные пользователя получены:", userData);

        // Проверяем наличие связанного спикера
        const speakerRes = await fetch(`${API_URL}/api/users/me?populate=speaker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!speakerRes.ok) {
          console.error("Ошибка получения данных спикера:", speakerRes.status);
          throw new Error("Не удалось загрузить данные спикера");
        }
        
        const speakerData = await speakerRes.json();
        console.log("Данные о связи с спикером:", speakerData.speaker);
        
        if (speakerData.speaker) {
          setProfileExists(true);
          
          // Загружаем полные данные спикера, включая категории и изображения
          const speakerDetailsRes = await fetch(
            `${API_URL}/api/speakers/${speakerData.speaker.id}?populate=categories,avatar,gallery,Image`, 
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          if (speakerDetailsRes.ok) {
            const speakerDetails = await speakerDetailsRes.json();
            console.log("Детальные данные спикера:", speakerDetails);
            
            const speaker = speakerDetails.data.attributes;
            
            // Устанавливаем данные в форму
            setProfile({
              id: speakerData.speaker.id,
              ...speaker
            });
            
            // Извлекаем ID выбранных категорий
            if (speaker.categories && speaker.categories.data) {
              const categoryIds = speaker.categories.data.map(cat => cat.id);
              console.log("Выбранные категории:", categoryIds);
              setSelectedCategories(categoryIds);
            }
            
            // Устанавливаем превью аватара
            if (speaker.avatar?.data) {
              setAvatarPreview(`${API_URL}${speaker.avatar.data.attributes.url}`);
            } else if (speaker.Image?.data && speaker.Image.data.length > 0) {
              // Если аватара нет, но есть изображения в Image, используем первое
              setAvatarPreview(`${API_URL}${speaker.Image.data[0].attributes.url}`);
            }
            
            // Устанавливаем превью галереи
            if (speaker.gallery?.data && speaker.gallery.data.length > 0) {
              const previews = speaker.gallery.data.map(img => 
                `${API_URL}${img.attributes.url}`
              );
              setGalleryPreviews(previews);
            } else if (speaker.Image?.data && speaker.Image.data.length > 1) {
              // Если галереи нет, но есть изображения в Image, используем остальные
              const previews = speaker.Image.data.slice(1).map(img => 
                `${API_URL}${img.attributes.url}`
              );
              setGalleryPreviews(previews);
            }
            
            // Заполняем форму данными
            setFormData({
              fullName: speaker.Name || "",
              profession: speaker.Profession || "",
              bio: extractTextFromRichField(speaker.Bio),
              speakingTopics: extractTextFromRichField(speaker.speech_topics),
              education: extractTextFromRichField(speaker.education),
              price: extractTextFromRichField(speaker.Price),
              tel: speaker.tel || "",
              telegram: speaker.telegram || "",
              email: speaker.email || "",
              whatsapp: speaker.whatsapp || "",
              facebook: speaker.facebook || "",
              vk: speaker.vk || "",
              ok: speaker.ok || "",
              instagram: speaker.instagram || "",
              linkedin: speaker.linkedin || ""
            });
          }
        } else {
          console.log("У пользователя нет профиля спикера");
          setProfileExists(false);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast.error("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Функция для извлечения текста из rich-text поля
  const extractTextFromRichField = (richField) => {
    if (!richField) return "";
    
    try {
      // Если это строка, возвращаем как есть
      if (typeof richField === 'string') return richField;
      
      // Если это массив с объектами children
      if (Array.isArray(richField) && richField[0]?.children) {
        return richField[0].children
          .map(item => {
            if (item.children && item.children[0] && item.children[0].text) {
              return item.children[0].text;
            }
            return "";
          })
          .filter(text => text)
          .join("\n");
      }
      
      // Если не удалось разобрать формат
      console.log("Неизвестный формат rich-text поля:", richField);
      return "";
    } catch (error) {
      console.error("Ошибка при обработке rich-text поля:", error);
      return "";
    }
  };
  
  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработка выбора категорий
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  // Обработка выбора аватара
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.includes('image/')) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }
    
    setAvatarFile(file);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Обработка выбора фото для галереи
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Ограничение количества файлов
    const allowedFiles = files.slice(0, 5 - galleryFiles.length - galleryPreviews.length);
    if (allowedFiles.length < files.length) {
      toast.error(`Можно загрузить максимум 5 фотографий (${5 - galleryPreviews.length} осталось)`);
    }
    
    // Проверка типа файлов
    const imageFiles = allowedFiles.filter(file => file.type.includes('image/'));
    if (imageFiles.length < allowedFiles.length) {
      toast.error("Пожалуйста, выбирайте только изображения");
    }
    
    setGalleryFiles(prev => [...prev, ...imageFiles]);
    
    // Создаем превью для каждого файла
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Удаление фото из галереи (только для предпросмотра)
  const removeGalleryImage = (index) => {
    // Если это новый файл (локальное превью)
    if (index < galleryFiles.length) {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    }
    
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Создание структуры rich-text для Strapi
  const createRichTextField = (text) => {
    if (!text) return [];
    
    try {
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length === 0) return [];
      
      return [{
        type: "list",
        format: "unordered",
        children: lines.map(line => ({
          type: "list-item",
          children: [{ text: line, type: "text" }]
        }))
      }];
    } catch (error) {
      console.error("Ошибка при создании rich-text:", error);
      return [];
    }
  };
  
  // Загрузка файлов изображений
  const uploadImages = async (speakerId, token) => {
    const uploads = [];
    
    // Загрузка аватара, если выбран
    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append('files', avatarFile);
        formData.append('ref', 'api::speaker.speaker');
        formData.append('refId', speakerId);
        formData.append('field', 'avatar');
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!uploadRes.ok) {
          console.error("Ошибка загрузки аватара");
          throw new Error("Ошибка загрузки аватара");
        }
        
        console.log("Аватар успешно загружен");
      } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
        toast.error("Не удалось загрузить аватар");
      }
    }
    
    // Загрузка галереи, если есть файлы
    if (galleryFiles.length > 0) {
      try {
        const galleryFormData = new FormData();
        galleryFiles.forEach(file => {
          galleryFormData.append('files', file);
        });
        galleryFormData.append('ref', 'api::speaker.speaker');
        galleryFormData.append('refId', speakerId);
        galleryFormData.append('field', 'gallery');
        
        const uploadGalleryRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: galleryFormData,
        });
        
        if (!uploadGalleryRes.ok) {
          console.error("Ошибка загрузки галереи");
          throw new Error("Ошибка загрузки фотографий для галереи");
        }
        
        console.log("Галерея успешно загружена");
      } catch (error) {
        console.error("Ошибка при загрузке галереи:", error);
        toast.error("Не удалось загрузить фотографии для галереи");
      }
    }
    
    return true;
  };
  
  // Сохранение профиля
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }
      console.log("Выбранные категории:", selectedCategories);
      // Подготавливаем данные для обновления/создания
      const speakerData = {
        Name: formData.fullName,
        Profession: formData.profession,
        Bio: createRichTextField(formData.bio),
        speech_topics: createRichTextField(formData.speakingTopics),
        education: createRichTextField(formData.education),
        Price: createRichTextField(formData.price),
        tel: formData.tel,
        telegram: formData.telegram,
        email: formData.email,
        whatsapp: formData.whatsapp,
        facebook: formData.facebook,
        vk: formData.vk,
        ok: formData.ok,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        // categories: {
        //   connect: selectedCategories.map(id => ({ id }))
        // }
      };
      
      console.log("Данные для сохранения:", speakerData);
      
      let speakerId;
      
      if (profileExists && profile?.id) {
        // Обновляем существующий профиль
        speakerId = profile.id;
        console.log("Обновление существующего профиля:", speakerId);
        
        const updateRes = await fetch(`${API_URL}/api/speakers/${speakerId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: speakerData })
        });
        
        if (!updateRes.ok) {
          const error = await updateRes.json();
          console.error("Ошибка обновления профиля:", error);
          throw new Error(error.error?.message || "Ошибка обновления профиля");
        }
        
        console.log("Профиль успешно обновлен");
      } else {
        // Создаем новый профиль
        console.log("Создание нового профиля");
        
        // Получаем ID пользователя
        const userRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = await userRes.json();
        console.log("ID пользователя для связи:", userData.documentId);
        
        const createRes = await fetch(`${API_URL}/api/speakers`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              ...speakerData,
              // users_permissions_user: {
              //   connect: [userData.id]
              // }
            },
          })
        });
        
        if (!createRes.ok) {
          const error = await createRes.json();
          console.error("Ошибка создания профиля:", error);
          throw new Error(error.error?.message || "Ошибка создания профиля");
        }
        
        const result = await createRes.json();
        speakerId = result.data.id;
        
        console.log("Профиль успешно создан, ID:", speakerId);
        setProfileExists(true);
        setProfile({ id: speakerId, ...result.data.attributes });
      }
      
      // Загружаем изображения, если они есть
      if (avatarFile || galleryFiles.length > 0) {
        await uploadImages(speakerId, token);
      }
      
      toast.success(profileExists ? "Профиль успешно обновлен!" : "Профиль спикера успешно создан!");
      
      // Перезагружаем страницу, чтобы обновить данные
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Даем время увидеть уведомление
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      toast.error(`Ошибка: ${error.message || "Не удалось сохранить профиль"}`);
    } finally {
      setSaving(false);
    }
  };
  
  // Отображение загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold text-black mb-6">
        {profileExists ? "Редактирование профиля спикера" : "Создание профиля спикера"}
      </h1>
      
      {/* Форма профиля */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ФИО */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Основная информация</h2>
          
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              ФИО
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
              Профессия
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>
        </div>
        
        {/* Аватар */}
        <div className="bg-gray-50 p-6 rounded-lg">
  <h2 className="text-xl font-semibold text-black mb-4">Аватар</h2>
  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
    <div className="flex-shrink-0">
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Предпросмотр аватара"
          className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">Нет фото</span>
        </div>
      )}
    </div>
    <div className="flex-grow">
      <label className="block text-sm font-medium text-gray-700 mb-2 justify-self-center">
        Загрузите основное фото профиля
      </label>
      <div className="relative">
        <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Выбрать фото
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        {avatarFile && (
          <span className="inline-block ml-2 text-sm text-green-600">
            Выбрано: {avatarFile.name}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Рекомендуемый размер: 500x500 пикселей, JPG или PNG
      </p>
    </div>
  </div>
</div>
        
        {/* Галерея */}
        <div className="bg-gray-50 p-6 rounded-lg">
  <h2 className="text-xl font-semibold text-black mb-4">Галерея фотографий</h2>
  <div className="mb-4">
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Дополнительные фотографии (максимум 5)
        </label>
        <span className="text-sm text-gray-500">
          {galleryPreviews.length}/5 фото
        </span>
      </div>
      
      <label 
        htmlFor="gallery-upload" 
        className={`
          cursor-pointer flex items-center justify-center px-4 py-2 
          ${galleryPreviews.length >= 5 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
          } 
          text-white rounded-md transition-colors shadow-sm w-full md:w-auto
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
        </svg>
        Загрузить фото
      </label>
      <input
        id="gallery-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
        className="hidden"
        disabled={galleryPreviews.length >= 5}
      />
      <p className="text-sm text-gray-500 mt-1">
        Вы можете выбрать до 5 фотографий для вашей галереи
      </p>
    </div>
  </div>
   {/* Превью галереи */}
   {galleryPreviews.length > 0 && (
    <div>
      <h3 className="text-md font-medium text-gray-700 mb-2">Предпросмотр галереи</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {galleryPreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-300">
              <img
                src={preview}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                  title="Удалить"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <span className="mt-1 text-xs text-gray-500 block text-center">Фото {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
        
        {/* Категории */}
        {categories.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-black mb-4">Категории</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700">
                    {category.title || `Категория #${category.id}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Биография */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Биография</h2>
          <div>
            <textarea
              name="bio"
              id="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full h-40 p-3 border border-gray-300 rounded text-black"
              placeholder="Расскажите о себе..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Используйте новую строку для элементов списка</p>
          </div>
        </div>
        
        {/* Темы выступлений */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Темы выступлений</h2>
          <div>
            <textarea
              name="speakingTopics"
              id="speakingTopics"
              value={formData.speakingTopics}
              onChange={handleInputChange}
              className="w-full h-40 p-3 border border-gray-300 rounded text-black"
              placeholder="Перечислите темы ваших выступлений..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Используйте новую строку для каждой темы</p>
          </div>
        </div>
        
        {/* Образование */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Образование</h2>
          <div>
            <textarea
              name="education"
              id="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full h-40 p-3 border border-gray-300 rounded text-black"
              placeholder="Укажите ваше образование..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Используйте новую строку для каждого учебного заведения</p>
          </div>
        </div>
        
        {/* Стоимость */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Стоимость услуг</h2>
          <div>
            <textarea
              name="price"
              id="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full h-40 p-3 border border-gray-300 rounded text-black"
              placeholder="Укажите стоимость ваших услуг..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Например: "Выступление - от 50 000 ₽"</p>
          </div>
        </div>
        
        {/* Контакты */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">
                Telegram
              </label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="vk" className="block text-sm font-medium text-gray-700 mb-1">
                VK
              </label>
              <input
                type="text"
                id="vk"
                name="vk"
                value={formData.vk}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="ok" className="block text-sm font-medium text-gray-700 mb-1">
                Одноклассники
              </label>
              <input
                type="text"
                id="ok"
                name="ok"
                value={formData.ok}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
          </div>
        </div>
        
        {/* Кнопка отправки */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-md font-medium`}
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              "Сохранить профиль"
            )}
          </button>
          
          {profileExists && (
            <button
              type="button"
              className="mt-4 md:mt-0 md:ml-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              onClick={() => toast.info("Функция оплаты и публикации будет доступна в следующей версии")}
            >
              Оплатить и опубликовать
            </button>
          )}
          
          {profileExists && (
            <p className="mt-4 text-sm text-gray-600">
              Профиль создан. Чтобы опубликовать его, необходимо оплатить размещение.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}