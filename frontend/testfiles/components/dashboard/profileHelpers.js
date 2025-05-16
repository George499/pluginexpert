/**
 * Вспомогательный файл с утилитами для работы с профилем спикера
 */

const API_URL = "https://admin.pluginexpert.ru";

/**
 * Извлекает обычный текст из Rich Text формата Strapi
 * @param {Array} blocksField - Массив блоков Rich Text из Strapi
 * @returns {string} - Обычный текст с сохранением форматирования
 */
export const extractRichText = (blocksField) => {
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

/**
 * Создает Rich Text формат Strapi из обычного текста
 * @param {string} text - Обычный текст
 * @returns {Array} - Массив блоков в формате Rich Text Strapi
 */
export const createRichTextField = (text) => {
  if (!text) return [];
  
  // Разбиваем текст на строки
  const lines = text.split('\n');
  
  // Преобразуем каждую строку в отдельный параграф
  return lines.map(line => ({
    type: "paragraph",
    children: [{ text: line }]
  }));
};

/**
 * Преобразует данные формы в формат для отправки в API Strapi
 * @param {Object} formData - Данные формы
 * @returns {Object} - Данные в формате для Strapi API
 */
export const prepareSpeakerData = (formData) => {
  return {
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
};

/**
 * Загружает аватар на сервер
 * @param {File} avatarFile - Файл аватара
 * @param {string} speakerId - ID спикера
 * @param {string} token - JWT токен для авторизации
 * @returns {Promise<Object>} - Результат загрузки
 */
export const uploadAvatar = async (avatarFile, speakerId, token) => {
  if (!avatarFile || !speakerId || !token) {
    throw new Error("Не указаны обязательные параметры для загрузки аватара");
  }

  const formData = new FormData();
  formData.append('files', avatarFile);
  formData.append('ref', 'api::speaker.speaker');
  formData.append('refId', speakerId);
  formData.append('field', 'avatar');

  const uploadRes = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    console.error("Ошибка HTTP при загрузке аватара:", uploadRes.status);
    let errorText = await uploadRes.text();
    console.error("Ответ сервера при загрузке аватара:", errorText);
    
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(`Ошибка загрузки аватара: ${errorData.error?.message || 'Неизвестная ошибка'}`);
    } catch (parseError) {
      throw new Error(`Ошибка загрузки аватара: ${uploadRes.statusText}`);
    }
  }

  return uploadRes.json();
};

export default {
  extractRichText,
  createRichTextField,
  prepareSpeakerData,
  uploadAvatar,
  API_URL
};