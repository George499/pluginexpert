// app/utils/auth.js - Утилиты для проверки авторизации
import { cookies } from 'next/headers';

// Функция для проверки авторизации в API маршрутах
export async function checkAuth(req) {
  // Сначала пытаемся получить токен из заголовка Authorization
  let token = req.headers.get('Authorization');
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  } else {
    // Если нет в заголовке, пытаемся получить из cookie
    const cookieStore = cookies();
    token = cookieStore.get('authToken')?.value;
  }

  if (!token) {
    return { authenticated: false };
  }

  try {
    // Проверяем токен, отправляя запрос в Strapi
    const response = await fetch('https://admin.pluginexpert.ru/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    const userData = await response.json();
    return { 
      authenticated: true, 
      user: userData 
    };
  } catch (error) {
    console.error('Ошибка проверки аутентификации:', error);
    return { authenticated: false };
  }
}