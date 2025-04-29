'use client'
import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import ProfileViewPanel from "./ProfileViewPanel";
import ProfileEditForm from "./ProfileEditForm";

const API_URL = "https://admin.pluginexpert.ru";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    profession: '',
    bio: '',
    speakingTopics: '',
    education: '',
    price: '',
    tel: '',
    telegram: '',
    email: '',
    whatsapp: '',
    facebook: '',
    vk: '',
    ok: '',
    instagram: '',
    linkedin: '',
  });

  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Функция для извлечения текста из полей с rich text форматом
  const extractRichText = (blocksField) => {
    if (!blocksField) return '';
    if (!Array.isArray(blocksField) || blocksField.length === 0) return '';
    
    try {
      // Собираем текст из всех блоков и их дочерних элементов
      return blocksField.map(block => {
        if (!block.children) return '';
        
        // Учитываем тип блока для форматирования
        const isListItem = block.type === 'list-item';
        const prefix = isListItem ? '• ' : '';
        
        // Для списков особое форматирование
        if (block.type === 'list') {
          // Обрабатываем вложенные элементы списков
          return block.children.map(item => {
            if (!item.children) return '';
            return '• ' + item.children.map(child => child.text || '').join('');
          }).join('\n');
        }
        
        // Обычный текст
        const text = prefix + block.children.map(child => child.text || '').join('');
        return text;
      }).join('\n');
    } catch (error) {
      console.error("Ошибка извлечения текста из rich text:", error);
      return '';
    }
  };

  // Функция для создания rich text формата из обычного текста
  const createRichTextField = (text) => {
    if (!text) return [];
    
    // Разбиваем текст на строки
    const lines = text.split('\n');
    
    // Преобразуем каждую строку в отдельный параграф
    return lines.map(line => ({
      type: "paragraph",
      children: [{ text: line }]
    }));
  };

  // Обработчик изменения полей формы
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/auth/signin";
          return;
        }

        // Получаем данные пользователя с включенным спикером и аватаром
        const res = await fetch(`${API_URL}/api/users/me?populate[speaker][populate]=avatar`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Ошибка получения данных пользователя");
        }

        const userData = await res.json();
        console.log("Полученные данные профиля:", userData);

        if (userData.speaker) {
          setProfile(userData.speaker);
          setProfileExists(true);
          
          // Извлекаем данные из полей
          setFormData({
            fullName: userData.speaker.Name || '',
            profession: userData.speaker.Profession || '',
            bio: extractRichText(userData.speaker.Bio),
            speakingTopics: extractRichText(userData.speaker.speech_topics),
            education: extractRichText(userData.speaker.education),
            price: extractRichText(userData.speaker.Price),
            tel: userData.speaker.tel || '',
            telegram: userData.speaker.telegram || '',
            email: userData.speaker.email || '',
            whatsapp: userData.speaker.whatsapp || '',
            facebook: userData.speaker.facebook || '',
            vk: userData.speaker.vk || '',
            ok: userData.speaker.ok || '',
            instagram: userData.speaker.instagram || '',
            linkedin: userData.speaker.linkedin || '',
          });
          
          // Устанавливаем аватар (учитываем различные форматы Strapi)
          if (userData.speaker.avatar) {
            // Для Strapi 5
            if (userData.speaker.avatar.url) {
              setAvatarPreview(`${API_URL}${userData.speaker.avatar.url}`);
            } 
            // Для структуры с nested data
            else if (userData.speaker.avatar.data && userData.speaker.avatar.data.attributes) {
              setAvatarPreview(`${API_URL}${userData.speaker.avatar.data.attributes.url}`);
            }
          }
        } else {
          setProfileExists(false);
          setIsEditing(true); // Если профиля нет, сразу показываем форму редактирования
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

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
      };

      let speakerId;

      // Сначала создаем или обновляем основные данные спикера
      if (profileExists && profile?.id) {
        speakerId = profile.id;
        
        console.log("Обновление существующего профиля:", speakerId);
        console.log("Отправляемые данные:", JSON.stringify(speakerData, null, 2));
        
        // В Strapi 5 формат запроса изменился
        const updateRes = await fetch(`${API_URL}/api/speakers/${speakerId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Для Strapi 5 иногда не требуется оборачивание в data объект
          body: JSON.stringify(speakerData),
        });

        if (!updateRes.ok) {
          console.error("Ошибка HTTP при обновлении:", updateRes.status, updateRes.statusText);
          let errorText = await updateRes.text();
          console.error("Ответ сервера:", errorText);
          
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error?.message || "Ошибка обновления профиля");
          } catch (parseError) {
            throw new Error(`Ошибка обновления профиля: ${updateRes.statusText}`);
          }
        }
      } else {
        console.log("Создание нового профиля");
        console.log("Отправляемые данные:", JSON.stringify(speakerData, null, 2));
        
        // Для создания нового профиля
        const createRes = await fetch(`${API_URL}/api/speakers`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Изменено для совместимости с Strapi 5
          body: JSON.stringify(speakerData),
        });

        if (!createRes.ok) {
          console.error("Ошибка HTTP при создании:", createRes.status, createRes.statusText);
          let errorText = await createRes.text();
          console.error("Ответ сервера:", errorText);
          
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error?.message || "Ошибка создания профиля");
          } catch (parseError) {
            throw new Error(`Ошибка создания профиля: ${createRes.statusText}`);
          }
        }

        const result = await createRes.json();
        
        // В Strapi 5 может быть другая структура ответа
        speakerId = result.id || (result.data && result.data.id);
        
        if (!speakerId) {
          console.error("Неожиданный формат ответа:", result);
          throw new Error("Не удалось получить ID созданного профиля");
        }
        
        console.log("Созданный профиль ID:", speakerId);
        
        // Связываем созданный профиль с пользователем
        try {
          const linkRes = await fetch(`${API_URL}/api/users/me`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              speaker: speakerId
            }),
          });
          
          if (!linkRes.ok) {
            console.warn("Не удалось связать профиль с пользователем:", linkRes.status);
          } else {
            console.log("Профиль успешно связан с пользователем");
          }
        } catch (linkError) {
          console.warn("Ошибка при связывании профиля:", linkError);
        }
        
        setProfileExists(true);
        setProfile({ id: speakerId, ...speakerData });
      }

      // Загружаем аватар, если он был выбран
      if (avatar) {
        const formData = new FormData();
        formData.append('files', avatar);
        formData.append('ref', 'api::speaker.speaker');
        formData.append('refId', speakerId);
        formData.append('field', 'avatar');

        try {
          const uploadRes = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadRes.ok) {
            console.error("Ошибка HTTP при загрузке аватара:", uploadRes.status, uploadRes.statusText);
            let errorText = await uploadRes.text();
            console.error("Ответ сервера при загрузке аватара:", errorText);
            
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(`Ошибка загрузки аватара: ${errorData.error?.message || 'Неизвестная ошибка'}`);
            } catch (parseError) {
              throw new Error(`Ошибка загрузки аватара: ${uploadRes.statusText}`);
            }
          }

          const uploadData = await uploadRes.json();
          console.log("Аватар успешно загружен:", uploadData);
        } catch (error) {
          console.error("Ошибка загрузки аватара:", error);
          toast.error(`Ошибка загрузки аватара: ${error.message}`);
          // Продолжаем выполнение, чтобы сохранить остальные данные, даже если аватар не загрузился
        }
      }

      toast.success(profileExists ? "Профиль успешно обновлен!" : "Профиль успешно создан!");
      
      // Обновляем экран через некоторое время
      setTimeout(() => {
        setIsEditing(false); // После сохранения переходим в режим просмотра
        window.location.reload(); // Обновляем страницу для получения обновленных данных
      }, 1500);

    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      toast.error(`Ошибка: ${error.message || "Не удалось сохранить профиль"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-black">Загрузка данных...</div>;

  // Передаем нужные данные и обработчики в компоненты в зависимости от текущего режима
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
    />
  ) : (
    <ProfileViewPanel 
      formData={formData}
      avatarPreview={avatarPreview}
      onEdit={() => setIsEditing(true)}
    />
  );
};

export default ProfileForm;