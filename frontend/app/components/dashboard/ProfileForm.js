"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ProfileViewPanel from "./ProfileViewPanel";
import ProfileEditForm from "./ProfileEditForm";
import imageCompression from "browser-image-compression";

const API_URL = "https://admin.pluginexpert.ru";

const ProfileForm = () => {
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
    linkedin: "",
    isPaid: "",
    categories: [], // Добавляем поле для категорий
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Аватар профиля
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Галерея изображений
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const galleryInputRef = useRef(null);

  const [isCompressingAvatar, setIsCompressingAvatar] = useState(false);
  const [isCompressingGallery, setIsCompressingGallery] = useState(false);
  
  // Состояние для доступных категорий
  const [availableCategories, setAvailableCategories] = useState([]);
  
  console.log(profile);
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB в байтах
  // Целевой размер после сжатия (немного меньше лимита)
  const TARGET_SIZE = 4.9 * 1024 * 1024; // 4.9MB в байтах

  // Функция для сжатия изображений
  const compressImage = async (file) => {
    // Если файл уже меньше целевого размера, возвращаем его как есть
    if (file.size <= TARGET_SIZE) {
      return file;
    }

    // Опции для сжатия изображения
    let options = {
      maxSizeMB: TARGET_SIZE / (1024 * 1024), // Конвертируем байты в MB
      maxWidthOrHeight: 2000, // Ограничение размера по ширине/высоте
      useWebWorker: true,
      initialQuality: 0.9, // Начальное качество
    };

    try {
      const compressedFile = await imageCompression(file, options);

      // Если после сжатия файл все еще слишком большой, сжимаем еще сильнее
      if (compressedFile.size > TARGET_SIZE) {
        options.initialQuality = 0.8;
        options.maxWidthOrHeight = 1800;
        return await imageCompression(file, options);
      }

      return compressedFile;
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
      throw error;
    }
  };

  // Функция для извлечения текста из полей с rich text форматом
  const extractRichText = (blocksField) => {
    if (!blocksField) return "";
    if (!Array.isArray(blocksField) || blocksField.length === 0) return "";

    try {
      return blocksField
        .map((block) => {
          if (!block.children) return "";

          const isListItem = block.type === "list-item";
          const prefix = isListItem ? "• " : "";

          if (block.type === "list") {
            return block.children
              .map((item) => {
                if (!item.children) return "";
                return (
                  "• " + item.children.map((child) => child.text || "").join("")
                );
              })
              .join("\n");
          }

          const text =
            prefix + block.children.map((child) => child.text || "").join("");
          return text;
        })
        .join("\n");
    } catch (error) {
      console.error("Ошибка извлечения текста из rich text:", error);
      return "";
    }
  };

  // Функция для создания rich text формата из обычного текста
  const createRichTextField = (text) => {
    if (!text) return [];

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) return [];

    return lines.map((line) => ({
      type: "paragraph",
      children: [
        {
          type: "text",
          text: line,
        },
      ],
    }));
  };

  // Проверка доступности поля categories в схеме
  useEffect(() => {
    const checkCategoriesField = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token || !profile?.documentId) return;
        
        // Делаем запрос с populate для categories
        const response = await fetch(
          `${API_URL}/api/speakers/${profile.documentId}?populate=categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Speaker schema check:', data);
          console.log('Categories field exists:', 'categories' in (data.data || data));
        }
      } catch (error) {
        console.error('Error checking categories field:', error);
      }
    };
    
    if (profileExists) {
      checkCategoriesField();
    }
  }, [profileExists, profile]);

  // Загрузка доступных категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories?populate=*&pagination[pageSize]=100`);
        const data = await response.json();
        
        // Обрабатываем разные структуры данных
        let categoryArray = [];
        if (Array.isArray(data)) {
          categoryArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          categoryArray = data.data;
        }
        
        // Преобразуем данные и фильтруем категорию "Все спикеры"
        const categories = categoryArray
          .filter(item => item.slug !== 'all-categories')
          .map(item => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            gender: item.gender,
            index: item.index
          }));
        
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Не удалось загрузить категории');
      }
    };
    
    fetchCategories();
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Обработчик изменения категорий
  const handleCategoriesChange = (categories) => {
    setFormData(prev => ({
      ...prev,
      categories
    }));
  };

  // Функция обновления профиля с сервера
  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Токен авторизации не найден");
        window.location.href = "/auth/signin";
        return;
      }

      // Добавляем timestamp к запросу, чтобы избежать кэширования
      const timestamp = new Date().getTime();
      const url = `${API_URL}/api/users/me?populate[speaker][populate][0]=avatar&populate[speaker][populate][1]=gallery&populate[speaker][populate][2]=categories&t=${timestamp}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth/signin";
          return;
        }

        throw new Error(`Ошибка получения данных пользователя: ${res.status}`);
      }

      const userData = await res.json();
      setCurrentUser(userData);

      if (userData.speaker) {
        const profileId = userData.speaker.id;

        if (!profileId) {
          toast.error("Ошибка загрузки профиля: отсутствует ID");
          return;
        }

        // Сохраняем профиль в состоянии
        setProfile({
          ...userData.speaker,
          documentId: userData.speaker.documentId,
        });
        setProfileExists(true);

        // Обновляем данные формы
        setFormData({
          fullName: userData.speaker.Name || "",
          profession: userData.speaker.Profession || "",
          bio: extractRichText(userData.speaker.Bio),
          speakingTopics: extractRichText(userData.speaker.speech_topics),
          education: extractRichText(userData.speaker.education),
          price: extractRichText(userData.speaker.Price),
          tel: userData.speaker.tel || "",
          telegram: userData.speaker.telegram || "",
          email: userData.speaker.email || userData.email || "",
          whatsapp: userData.speaker.whatsapp || "",
          facebook: userData.speaker.facebook || "",
          vk: userData.speaker.vk || "",
          ok: userData.speaker.ok || "",
          instagram: userData.speaker.instagram || "",
          linkedin: userData.speaker.linkedin || "",
          isPaid: userData.speaker.isPaid || false,
          categories: (() => {
            const cats = userData.speaker.categories;
            let categoryArray = [];
            
            // Обрабатываем разные структуры данных
            if (Array.isArray(cats)) {
              categoryArray = cats;
            } else if (cats?.data && Array.isArray(cats.data)) {
              categoryArray = cats.data;
            }
            
            return categoryArray.map(cat => ({
              id: cat.id,
              title: cat.title,
              slug: cat.slug,
              gender: cat.gender,
              index: cat.index
            })).filter(cat => cat.slug !== 'all-categories');
          })() || [],
        });

        // Добавляем метку времени к URL изображений для предотвращения кэширования
        const cacheBuster = `?t=${timestamp}`;

        // Загрузка аватара
        if (userData.speaker.avatar) {
          let avatarUrl = null;

          if (userData.speaker.avatar.url) {
            avatarUrl = `${API_URL}${userData.speaker.avatar.url}${cacheBuster}`;
          } else if (
            userData.speaker.avatar.data &&
            userData.speaker.avatar.data.attributes
          ) {
            avatarUrl = `${API_URL}${userData.speaker.avatar.data.attributes.url}${cacheBuster}`;
          } else if (
            userData.speaker.avatar.data &&
            userData.speaker.avatar.data.url
          ) {
            avatarUrl = `${API_URL}${userData.speaker.avatar.data.url}${cacheBuster}`;
          }

          if (avatarUrl) {
            setAvatarPreview(avatarUrl);
          }
        } else {
          setAvatarPreview(null);
        }

        // Загрузка галереи изображений
        let galleryUrls = [];

        if (
          userData.speaker.gallery &&
          userData.speaker.gallery.data &&
          Array.isArray(userData.speaker.gallery.data)
        ) {
          galleryUrls = userData.speaker.gallery.data
            .filter((item) => item.attributes && item.attributes.url)
            .map((item) => `${API_URL}${item.attributes.url}${cacheBuster}`);
        } else if (
          userData.speaker.gallery &&
          Array.isArray(userData.speaker.gallery)
        ) {
          galleryUrls = userData.speaker.gallery
            .filter((item) => item.url)
            .map((item) => `${API_URL}${item.url}${cacheBuster}`);
        }

        setGalleryPreviews(galleryUrls.length > 0 ? galleryUrls : []);

        // Сбрасываем состояние загружаемых файлов
        setAvatar(null);
        setGalleryImages([]);
      } else {
        // Если профиль не найден, переходим в режим редактирования
        setFormData((prev) => ({
          ...prev,
          email: userData.email || "",
          categories: [], // Инициализируем пустой массив категорий
        }));
        setProfileExists(false);
        setIsEditing(true);
        setAvatarPreview(null);
        setGalleryPreviews([]);
      }
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      toast.error("Ошибка загрузки обновленных данных");
    }
  };

  // Загрузка профиля при монтировании компонента
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/auth/signin";
          return;
        }

        const res = await fetch(
          `${API_URL}/api/users/me?populate[speaker][populate][0]=avatar&populate[speaker][populate][1]=gallery&populate[speaker][populate][2]=categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Ошибка получения данных пользователя");
        }

        const userData = await res.json();

        setCurrentUser(userData);

        if (userData.speaker) {
          setProfile(userData.speaker);
          setProfileExists(true);

          setFormData({
            fullName: userData.speaker.Name || "",
            profession: userData.speaker.Profession || "",
            bio: extractRichText(userData.speaker.Bio),
            speakingTopics: extractRichText(userData.speaker.speech_topics),
            education: extractRichText(userData.speaker.education),
            price: extractRichText(userData.speaker.Price),
            tel: userData.speaker.tel || "",
            telegram: userData.speaker.telegram || "",
            email: userData.speaker.email || userData.email || "",
            whatsapp: userData.speaker.whatsapp || "",
            facebook: userData.speaker.facebook || "",
            vk: userData.speaker.vk || "",
            ok: userData.speaker.ok || "",
            instagram: userData.speaker.instagram || "",
            linkedin: userData.speaker.linkedin || "",
            isPaid: userData.speaker.isPaid || false,
            categories: (() => {
              const cats = userData.speaker.categories;
              let categoryArray = [];
              
              // Обрабатываем разные структуры данных
              if (Array.isArray(cats)) {
                categoryArray = cats;
              } else if (cats?.data && Array.isArray(cats.data)) {
                categoryArray = cats.data;
              }
              
              return categoryArray.map(cat => ({
                id: cat.id,
                title: cat.title,
                slug: cat.slug,
                gender: cat.gender,
                index: cat.index
              })).filter(cat => cat.slug !== 'all-categories');
            })() || [],
          });

          // Загрузка аватара
          if (userData.speaker.avatar) {
            if (userData.speaker.avatar.url) {
              setAvatarPreview(`${API_URL}${userData.speaker.avatar.url}`);
            } else if (
              userData.speaker.avatar.data &&
              userData.speaker.avatar.data.attributes
            ) {
              setAvatarPreview(
                `${API_URL}${userData.speaker.avatar.data.attributes.url}`
              );
            }
          }

          // Загрузка галереи изображений
          if (
            userData.speaker.gallery &&
            userData.speaker.gallery.data &&
            Array.isArray(userData.speaker.gallery.data)
          ) {
            const galleryUrls = userData.speaker.gallery.data
              .map((item) => {
                if (item.attributes && item.attributes.url) {
                  return `${API_URL}${item.attributes.url}`;
                }
                return null;
              })
              .filter(Boolean);

            setGalleryPreviews(galleryUrls);
          } else if (
            userData.speaker.gallery &&
            Array.isArray(userData.speaker.gallery)
          ) {
            const galleryUrls = userData.speaker.gallery
              .map((item) => {
                if (item.url) {
                  return `${API_URL}${item.url}`;
                }
                return null;
              })
              .filter(Boolean);

            setGalleryPreviews(galleryUrls);
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            email: userData.email || "",
            categories: [], // Инициализируем пустой массив категорий
          }));
          setProfileExists(false);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        toast.error("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Обработчик изменения аватара
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Проверка размера файла
      if (file.size > MAX_SIZE) {
        // Устанавливаем индикатор сжатия
        setIsCompressingAvatar(true);
        // Заменяем toast.info на toast
        toast(
          `Файл слишком большой (${(file.size / (1024 * 1024)).toFixed(
            2
          )}MB). Автоматическое сжатие...`
        );

        // Добавляем задержку перед сжатием, чтобы индикатор загрузки был заметен
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Сжимаем изображение
        const compressedFile = await compressImage(file);

        // Добавляем еще небольшую задержку для наглядности процесса
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Проверяем, успешно ли сжалось изображение
        if (compressedFile.size > MAX_SIZE) {
          toast.error(
            `Не удалось сжать изображение до требуемого размера. Пожалуйста, выберите другой файл.`
          );
          setIsCompressingAvatar(false);
          return;
        }

        toast.success(
          `Изображение успешно сжато до ${(
            compressedFile.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        setAvatar(compressedFile);

        // Создаем превью для сжатого изображения
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
          // Задержка, чтобы видеть завершение процесса сжатия
          setTimeout(() => {
            setIsCompressingAvatar(false);
          }, 300);
        };
        reader.readAsDataURL(compressedFile);
      } else {
        // Если файл в пределах допустимого размера
        setAvatar(file);

        // Создаем превью
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Ошибка при обработке аватара:", error);
      toast.error("Не удалось обработать изображение");
      setIsCompressingAvatar(false);
    }
  };

  // Обработчик изменения галереи
  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Устанавливаем индикатор сжатия
    setIsCompressingGallery(true);

    // Добавляем задержку, чтобы индикатор был виден
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Массивы для результатов обработки
      const processedImages = [];
      const newPreviews = [];
      let compressedCount = 0;

      // Обрабатываем каждый файл
      for (const file of files) {
        // Проверяем размер файла
        if (file.size > MAX_SIZE) {
          try {
            // Показываем, какой файл обрабатывается
            toast(`Обработка ${file.name}...`);

            // Сжимаем изображение
            const compressedFile = await compressImage(file);

            // Проверяем, успешно ли сжалось изображение
            if (compressedFile.size > MAX_SIZE) {
              toast.error(
                `Не удалось сжать изображение ${file.name} до требуемого размера.`
              );
              continue;
            }

            compressedCount++;
            processedImages.push(compressedFile);

            // Создаем превью для сжатого изображения
            const reader = new FileReader();
            reader.onloadend = () => {
              newPreviews.push(reader.result);
              // Если это последнее изображение, обновляем state
              if (newPreviews.length === processedImages.length) {
                updateGalleryState(processedImages, newPreviews);
              }
            };
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            console.error(`Ошибка при сжатии изображения ${file.name}:`, error);
            toast.error(`Не удалось обработать изображение ${file.name}`);
          }
        } else {
          // Если файл в пределах допустимого размера
          processedImages.push(file);

          // Создаем превью
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result);
            // Если это последнее изображение, обновляем state
            if (newPreviews.length === processedImages.length) {
              updateGalleryState(processedImages, newPreviews);
            }
          };
          reader.readAsDataURL(file);
        }
      }

      // Функция для обновления state галереи
      const updateGalleryState = (images, previews) => {
        // Небольшая задержка для видимости процесса
        setTimeout(() => {
          setGalleryImages((prevImages) => [...prevImages, ...images]);
          setGalleryPreviews((prevPreviews) => [...prevPreviews, ...previews]);

          if (compressedCount > 0) {
            toast.success(
              `${compressedCount} изображений были автоматически сжаты`
            );
          }

          setIsCompressingGallery(false);
        }, 500);
      };

      // Если нет изображений для обработки, сбрасываем индикатор загрузки
      if (processedImages.length === 0) {
        setTimeout(() => {
          setIsCompressingGallery(false);
        }, 500);
      }
    } catch (error) {
      console.error("Ошибка при обработке галереи:", error);
      toast.error("Не удалось обработать изображения");
      setIsCompressingGallery(false);
    }
  };

  // Удаление изображения из галереи
  const handleRemoveGalleryImage = (index) => {
    setGalleryPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setGalleryImages((prevImages) => {
      const newImages = [...prevImages];
      if (index < newImages.length) {
        newImages.splice(index, 1);
      }
      return newImages;
    });
  };

  // Функция для обновления категорий спикера
  const updateSpeakerCategories = async (token, speakerId, documentId, categories) => {
    try {
      // Сначала попробуем простой массив ID
      let updateData = {
        data: {
          categories: categories
            .filter(cat => cat.slug !== 'all-categories')
            .map(cat => cat.id)
        }
      };
      
      console.log('Updating categories with:', updateData);
      
      const response = await fetch(`${API_URL}/api/speakers/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        // Если не работает, пробуем формат connect/disconnect
        console.log('Simple array format failed, trying connect/disconnect format');
        
        updateData = {
          data: {
            categories: {
              set: categories
                .filter(cat => cat.slug !== 'all-categories')
                .map(cat => cat.id)
            }
          }
        };
        
        const response2 = await fetch(`${API_URL}/api/speakers/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response2.ok) {
          console.error('Failed to update categories with both formats');
          const error = await response2.json();
          console.error('Error details:', error);
          return false;
        }
      }
      
      console.log('Categories updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating categories:', error);
      return false;
    }
  };

  // Функция для загрузки аватара
  const uploadAvatar = async (token, profile) => {
    if (!avatar) {
      return false;
    }

    if (!profile || !profile.id) {
      console.error("Отсутствует необходимый ID профиля для загрузки аватара");
      return false;
    }

    if (avatar.size > MAX_SIZE) {
      toast.error(
        `Файл слишком большой! Максимальный размер: 5MB. Текущий: ${(
          avatar.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      return false;
    }

    try {
      // Используем profile.id для refId
      const refId = profile.id;

      const formData = new FormData();
      formData.append("files", avatar);
      formData.append("ref", "api::speaker.speaker");
      formData.append("refId", refId);
      formData.append("field", "avatar");

      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        let errorMessage = `Ошибка загрузки аватара: ${uploadRes.status}`;
        try {
          const errorData = await uploadRes.json();
          errorMessage = `Ошибка загрузки аватара: ${
            errorData.error?.message || uploadRes.status
          }`;
        } catch (e) {
          const errorText = await uploadRes.text();
          console.error(
            "Ошибка загрузки аватара:",
            uploadRes.status,
            errorText
          );
        }
        toast.error(errorMessage);
        return false;
      }

      const result = await uploadRes.json();

      if (Array.isArray(result) && result.length > 0) {
        // Обновляем превью аватара с новым URL
        setAvatarPreview(`${API_URL}${result[0].url}?t=${Date.now()}`);

        // Обновляем связь аватара у спикера
        const updateAvatarRes = await fetch(
          `${API_URL}/api/speakers/${profile.documentId || profile.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                avatar: result[0].id,
              },
            }),
          }
        );

        if (!updateAvatarRes.ok) {
          const errorText = await updateAvatarRes.text();
          console.error(
            "Ошибка обновления аватара:",
            updateAvatarRes.status,
            errorText
          );
          toast.error("Не удалось обновить аватар");
          return false;
        } else {
          toast.success("Аватар успешно обновлен");
        }
      }

      return true;
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error);
      toast.error(
        `Ошибка загрузки аватара: ${error.message || "Неизвестная ошибка"}`
      );
      return false;
    }
  };

  // Функция подготовки данных галереи перед сохранением
  const prepareGalleryData = async () => {
    // Если нет превью, значит галерея пуста
    if (galleryPreviews.length === 0) {
      return [];
    }

    // Показываем индикатор загрузки
    setIsCompressingGallery(true);
    toast("Подготовка данных галереи...");

    try {
      const allFiles = [];

      // Сначала добавляем все новые изображения
      // (это те файлы, которые уже существуют в galleryImages)
      if (galleryImages.length > 0) {
        allFiles.push(...galleryImages);
      }

      // Затем обрабатываем изображения из галереи
      const existingImagePromises = [];
      const dataUrlIndices = [];

      // Определяем, какие превью являются серверными URL, а какие data:// URL
      galleryPreviews.forEach((previewUrl, index) => {
        if (previewUrl.startsWith("data:")) {
          // Это data URL - отмечаем, что это новое изображение
          dataUrlIndices.push(index);
        } else if (previewUrl.includes(API_URL)) {
          // Это серверное изображение - добавляем промис для его обработки
          const promise = (async () => {
            try {
              // Скачиваем изображение
              const response = await fetch(previewUrl);
              const blob = await response.blob();

              // Получаем имя файла из URL
              const fileName = previewUrl.split("/").pop().split("?")[0];

              // Создаем File объект
              return new File([blob], fileName, {
                type: blob.type || "image/jpeg",
              });
            } catch (error) {
              console.error(
                `Ошибка обработки изображения ${previewUrl}:`,
                error
              );
              toast.error(`Не удалось обработать одно из изображений`);
              return null;
            }
          })();

          existingImagePromises.push(promise);
        }
      });

      // Дожидаемся завершения всех промисов для существующих изображений
      if (existingImagePromises.length > 0) {
        const existingFiles = await Promise.all(existingImagePromises);
        // Фильтруем null значения (если была ошибка) и добавляем в общий массив
        allFiles.push(...existingFiles.filter((file) => file !== null));
      }

      // Добавляем лог для отладки
      console.log(
        `Подготовлено ${allFiles.length} файлов для сохранения`,
        allFiles
      );

      toast.success(
        `Подготовлено ${allFiles.length} изображений для сохранения`
      );
      return allFiles;
    } catch (error) {
      console.error("Ошибка подготовки данных галереи:", error);
      toast.error("Не удалось подготовить данные галереи");
      return [];
    } finally {
      setIsCompressingGallery(false);
    }
  };

  // Новая функция для обновления галереи (удаление + загрузка)
  const updateGallery = async (token, profile, galleryFiles) => {
    if (!profile || !profile.id) {
      console.error(
        "Отсутствует необходимый ID профиля для обновления галереи"
      );
      return false;
    }

    try {
      // Сначала удаляем все связи с текущими изображениями в галерее
      const updateRelationUrl = `${API_URL}/api/speakers/${
        profile.documentId || profile.id
      }`;
      const updateRelationBody = {
        data: {
          gallery: [], // Очищаем ассоциации с галереей
        },
      };

      // Обновляем связи (удаляем все существующие)
      const updateRelationRes = await fetch(updateRelationUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRelationBody),
      });

      if (!updateRelationRes.ok) {
        toast.error("Не удалось обновить галерею");
        return false;
      }

      // Теперь загружаем новые изображения, если они есть
      if (galleryFiles && galleryFiles.length > 0) {
        // Создаем FormData для отправки файлов
        const formData = new FormData();

        // Добавляем все файлы галереи
        for (let i = 0; i < galleryFiles.length; i++) {
          formData.append("files", galleryFiles[i]);
        }

        // Добавляем параметры согласно документации Strapi
        formData.append("ref", "api::speaker.speaker");
        formData.append("refId", profile.id);
        formData.append("field", "gallery");

        // Отправляем запрос на загрузку файлов
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          let errorMessage = `Ошибка загрузки галереи: ${uploadRes.status}`;
          try {
            const errorData = await uploadRes.json();
            errorMessage = `Ошибка загрузки галереи: ${
              errorData.error?.message || uploadRes.status
            }`;
          } catch (e) {
            const errorText = await uploadRes.text();
            console.error(
              "Ошибка загрузки галереи:",
              uploadRes.status,
              errorText
            );
          }

          toast.error(errorMessage);
          return false;
        }

        // Обрабатываем успешный ответ
        const result = await uploadRes.json();

        // Если результат успешный
        if (Array.isArray(result) && result.length > 0) {
          toast.success(
            `Галерея успешно обновлена (загружено ${result.length} файлов)`
          );

          // Обновляем связи в спикере с id загруженных файлов
          const fileIds = result.map((file) => file.id);
          const updateSpeakerRes = await fetch(updateRelationUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                gallery: fileIds,
              },
            }),
          });

          if (!updateSpeakerRes.ok) {
            const updateErrorText = await updateSpeakerRes.text();
            console.error(
              "Ошибка обновления связей галереи:",
              updateSpeakerRes.status,
              updateErrorText
            );
            toast.error("Не удалось обновить связи галереи после загрузки");
            return false;
          } else {
            toast.success("Связи галереи успешно обновлены");
          }
        }
      } else {
        // Если нет новых изображений, значит галерея была очищена
        toast.success("Галерея успешно очищена");
      }

      // Очищаем список загружаемых файлов
      setGalleryImages([]);

      return true;
    } catch (error) {
      console.error("Ошибка обновления галереи:", error);
      toast.error(
        `Ошибка обновления галереи: ${error.message || "Неизвестная ошибка"}`
      );
      return false;
    }
  };

  // функция отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация обязательных полей
    if (!formData.email) {
      toast.error("Email является обязательным полем");
      return;
    }

    // Включаем индикатор сохранения
    setSaving(true);

    try {
      // Получаем токен авторизации
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

      // Получаем ID пользователя
      const userId = currentUser?.id;
      if (!userId) {
        throw new Error("Не удалось получить ID пользователя");
      }

      // Формируем данные для профиля спикера БЕЗ категорий
      const speakerData = {
        Name: formData.fullName || "Спикер",
        Profession: formData.profession || "",
        Bio: createRichTextField(formData.bio),
        speech_topics: createRichTextField(formData.speakingTopics),
        education: createRichTextField(formData.education),
        Price: createRichTextField(formData.price),
        tel: formData.tel || "",
        telegram: formData.telegram || "",
        email: formData.email,
        whatsapp: formData.whatsapp || "",
        facebook: formData.facebook || "",
        vk: formData.vk || "",
        ok: formData.ok || "",
        instagram: formData.instagram || "",
        linkedin: formData.linkedin || "",
        Slug: profile?.Slug || "",
        isPaid: profile?.isPaid || false,
      };

      // Подготавливаем данные галереи и получаем массив файлов
      const galleryFiles = await prepareGalleryData();

      // ОБНОВЛЕНИЕ СУЩЕСТВУЮЩЕГО ПРОФИЛЯ
      if (profileExists && profile) {
        // Получаем documentId из профиля
        const documentId = profile.documentId || profile.id;

        if (!documentId) {
          console.error(
            "Не удалось определить documentId профиля для обновления"
          );
          toast.error("Не удалось найти корректный идентификатор профиля");
          setSaving(false);
          return;
        }

        try {
          // Используем documentId для обновления профиля в Strapi
          const updateUrl = `${API_URL}/api/speakers/${documentId}`;
          const requestBody = { data: speakerData };
          
          // Логируем данные для отладки
          console.log('Updating speaker with data:', requestBody);

          const updateRes = await fetch(updateUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (updateRes.ok) {
            // Профиль успешно обновлен
            const result = await updateRes.json();

            // Сохраняем обновленный профиль в состоянии
            const updatedProfile = {
              ...profile,
              ...speakerData,
              documentId, // Сохраняем documentId в обновленном профиле
            };
            setProfile(updatedProfile);

            toast.success("Профиль успешно обновлен!");
            
            // Пробуем обновить категории отдельно
            const categoriesUpdated = await updateSpeakerCategories(token, profile.id, documentId, formData.categories);
            if (categoriesUpdated) {
              toast.success("Категории успешно обновлены!");
            } else {
              toast.warning("Не удалось обновить категории. Возможно, это поле недоступно.");
            }

            // Обновляем галерею, передавая подготовленные файлы
            await updateGallery(token, profile, galleryFiles);

            // Загружаем аватар, если он был выбран
            if (avatar) {
              const avatarUploaded = await uploadAvatar(token, profile);
              if (avatarUploaded) {
                toast.success("Аватар успешно обновлен!");
              }
            }

            // Завершаем редактирование и обновляем данные
            setIsEditing(false);
            // Обновляем данные профиля с категориями
            setTimeout(() => refreshProfile(), 1000);
          } else {
            // Обработка ошибки обновления профиля
            let errorMessage = "Не удалось обновить профиль на сервере";
            try {
              const errorData = await updateRes.json();
              console.error("Ошибка обновления профиля:", errorData);
              errorMessage = `Ошибка обновления профиля: ${
                errorData.error?.message || "Неизвестная ошибка"
              }`;
            } catch (e) {
              const errorText = await updateRes.text();
              console.error("Ошибка обновления профиля:", errorText);
              errorMessage = `Ошибка обновления профиля: ${
                errorText || updateRes.status
              }`;
            }

            toast.error(errorMessage);

            // Пробуем обновить только аватар и галерею, даже если обновление профиля не удалось
            if (avatar) {
              await uploadAvatar(token, profile);
            }

            await updateGallery(token, profile, galleryFiles);

            // Обновляем локальное состояние, даже если обновление на сервере не удалось
            setProfile({ ...profile, ...speakerData });
            setIsEditing(false);
          }
        } catch (updateError) {
          console.error("Ошибка при обновлении:", updateError);
          toast.error(
            `Ошибка обновления профиля: ${
              updateError.message || "Неизвестная ошибка"
            }`
          );
          setProfile({ ...profile, ...speakerData });
        }
      }
      // СОЗДАНИЕ НОВОГО ПРОФИЛЯ
      else {
        try {
          const createUrl = `${API_URL}/api/speakers`;
          const requestBody = { data: speakerData };

          const createRes = await fetch(createUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (createRes.ok) {
            const result = await createRes.json();

            // Определяем id и documentId нового профиля
            let newId, newDocumentId;

            if (result.data) {
              // Strapi v5 формат
              newId = result.data.id;
              newDocumentId =
                result.data.attributes?.documentId || result.data.documentId;
            } else {
              // Старый формат или другая структура
              newId = result.id;
              newDocumentId = result.documentId;
            }

            if (!newDocumentId) {
              // Если documentId отсутствует, используем id как fallback
              newDocumentId = newId;
            }

            // Создаем объект нового профиля
            const newProfile = {
              id: newId,
              documentId: newDocumentId,
              ...speakerData,
            };

            // Связываем профиль с пользователем
            try {
              const updateUserRes = await fetch(
                `${API_URL}/api/users/${userId}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ speaker: newId }),
                }
              );

              if (!updateUserRes.ok) {
                toast.error("Профиль создан, но не связан с вашим аккаунтом");
              }
            } catch (userUpdateError) {
              console.error(
                "Ошибка связывания профиля с пользователем:",
                userUpdateError
              );
            }

            // Загружаем аватар для нового профиля
            if (avatar) {
              await uploadAvatar(token, newProfile);
            }

            // Загружаем галерею для нового профиля, передавая подготовленные файлы
            await updateGallery(token, newProfile, galleryFiles);
            
            // Пробуем обновить категории для нового профиля
            const categoriesUpdated = await updateSpeakerCategories(token, newId, newDocumentId, formData.categories);
            if (categoriesUpdated) {
              console.log("Категории успешно добавлены к новому профилю");
            }

            // Обновляем состояние приложения
            setProfile(newProfile);
            setProfileExists(true);
            toast.success("Профиль успешно создан!");
            setIsEditing(false);

            // Обновляем данные профиля с категориями
            setTimeout(() => refreshProfile(), 1000);
          } else {
            // Обработка ошибки создания профиля
            let errorMessage = "Не удалось создать профиль";
            try {
              const errorData = await createRes.json();
              console.error("Ошибка создания профиля:", errorData);
              errorMessage = `Ошибка создания профиля: ${
                errorData.error?.message || "Неизвестная ошибка"
              }`;
            } catch (e) {
              const errorText = await createRes.text();
              console.error("Ошибка создания профиля (текст):", errorText);
              errorMessage = `Ошибка создания профиля: ${
                errorText || createRes.status
              }`;
            }
            throw new Error(errorMessage);
          }
        } catch (createError) {
          console.error("Ошибка при создании профиля:", createError);
          toast.error(`Не удалось создать профиль: ${createError.message}`);
        }
      }
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      toast.error(`Ошибка: ${error.message || "Не удалось сохранить профиль"}`);
    } finally {
      // Сбрасываем состояние загрузки
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-black">Загрузка данных...</div>
    );

  return isEditing ? (
    <ProfileEditForm
      formData={formData}
      profileExists={profileExists}
      saving={saving}
      avatarPreview={avatarPreview}
      fileInputRef={fileInputRef}
      handleInputChange={handleInputChange}
      handleAvatarChange={handleAvatarChange}
      handleSubmit={handleSubmit}
      onCancel={() => setIsEditing(false)}
      isCompressingAvatar={isCompressingAvatar}
      isCompressingGallery={isCompressingGallery}
      // Пропсы для галереи
      galleryPreviews={galleryPreviews}
      galleryInputRef={galleryInputRef}
      handleGalleryChange={handleGalleryChange}
      handleRemoveGalleryImage={handleRemoveGalleryImage}
      // Новые пропсы для категорий
      availableCategories={availableCategories}
      handleCategoriesChange={handleCategoriesChange}
    />
  ) : (
    <ProfileViewPanel
      formData={{ ...formData }}
      avatarPreview={avatarPreview}
      galleryPreviews={galleryPreviews}
      onEdit={() => setIsEditing(true)}
      speakerId={profile?.id}
      isPaid={profile?.isPaid}
      userEmail={profile?.email}
      speakerDocumentId={profile?.documentId}
      subscriptionExpiresAt={profile?.subscriptionExpiresAt}
      lastPaymentDate={profile?.lastPaymentDate}
      lastPaymentAmount={profile?.lastPaymentAmount}
    />
  );
};

export default ProfileForm;