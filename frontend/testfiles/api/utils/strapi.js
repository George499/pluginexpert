
// app/api/utils/strapi.js
/**
 * Утилиты для работы с Strapi API
 */

// URL вашего Strapi API
const STRAPI_API_URL = 'https://admin.pluginexpert.ru/api';

/**
 * Создает экземпляр объекта для работы с Strapi API
 * @param {string} token - JWT токен для аутентификации (опционально)
 * @returns {Object} Объект с методами для работы с API
 */
export default function getStrapi(token = null) {
  // Получаем токен из localStorage, если не передан
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
  }

  // Базовые заголовки для запросов
  const headers = {
    'Content-Type': 'application/json',
  };

  // Добавляем токен авторизации, если есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Выполняет запрос к Strapi API
   * @param {string} endpoint - Конечная точка API
   * @param {Object} options - Опции запроса
   * @returns {Promise} Результат запроса
   */
  const fetchAPI = async (endpoint, options = {}) => {
    const url = `${STRAPI_API_URL}/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Ошибка запроса к Strapi API');
    }

    return await response.json();
  };

  return {
    /**
     * Получает данные из коллекции
     * @param {string} collection - Название коллекции
     * @param {Object} params - Параметры запроса
     * @returns {Promise} Результат запроса
     */
    async find(collection, params = {}) {
      const queryParams = new URLSearchParams();
      
      // Добавляем фильтры, если есть
      if (params.filters) {
        queryParams.append('filters', JSON.stringify(params.filters));
      }
      
      // Добавляем сортировку, если есть
      if (params.sort) {
        queryParams.append('sort', params.sort);
      }
      
      // Добавляем пагинацию, если есть
      if (params.pagination) {
        queryParams.append('pagination', JSON.stringify(params.pagination));
      }
      
      // Добавляем поля, если есть
      if (params.fields) {
        queryParams.append('fields', params.fields.join(','));
      }
      
      // Добавляем populate, если есть
      if (params.populate) {
        queryParams.append('populate', params.populate);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return fetchAPI(`${collection}${queryString}`);
    },

    /**
     * Получает запись по ID
     * @param {string} collection - Название коллекции
     * @param {number|string} id - ID записи
     * @param {Object} params - Параметры запроса
     * @returns {Promise} Результат запроса
     */
    async findOne(collection, id, params = {}) {
      const queryParams = new URLSearchParams();
      
      // Добавляем поля, если есть
      if (params.fields) {
        queryParams.append('fields', params.fields.join(','));
      }
      
      // Добавляем populate, если есть
      if (params.populate) {
        queryParams.append('populate', params.populate);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return fetchAPI(`${collection}/${id}${queryString}`);
    },

    /**
     * Создает новую запись
     * @param {string} collection - Название коллекции
     * @param {Object} data - Данные для создания
     * @returns {Promise} Результат запроса
     */
    async create(collection, data) {
      return fetchAPI(collection, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /**
     * Обновляет запись
     * @param {string} collection - Название коллекции
     * @param {number|string|Object} idOrParams - ID записи или объект с параметрами (для фильтрации)
     * @param {Object} data - Данные для обновления
     * @returns {Promise} Результат запроса
     */
    async update(collection, idOrParams, data) {
      // Если передан объект с фильтрами, используем их для обновления через API
      if (typeof idOrParams === 'object' && idOrParams.filters) {
        // Сначала находим запись по фильтрам
        const result = await this.find(collection, { filters: idOrParams.filters });
        
        // Если найдена запись, обновляем ее
        if (result.data && result.data.length > 0) {
          const id = result.data[0].id;
          return fetchAPI(`${collection}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
        } else {
          throw new Error('Запись не найдена');
        }
      } else {
        // Если передан ID, просто обновляем запись
        return fetchAPI(`${collection}/${idOrParams}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }
    },

    /**
     * Удаляет запись
     * @param {string} collection - Название коллекции
     * @param {number|string} id - ID записи
     * @returns {Promise} Результат запроса
     */
    async delete(collection, id) {
      return fetchAPI(`${collection}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}