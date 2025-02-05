"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Валидация пароля (можно добавить более строгую логику в зависимости от требований)
  const validatePassword = () => {
    if (!password) {
      setError("Пароль не может быть пустым");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    // Формируем данные для отправки
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      // Отправка данных на сервер
      const response = await fetch(
        "https://admin.pluginexpert.ru/api/auth/login",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Вход успешен!");
        // После успешного входа, можно перенаправить пользователя, например, на страницу профиля
        // window.location.href = '/profile';
      } else {
        setError(result.message || "Неверный логин или пароль");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      setError("Ошибка при отправке данных. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-center flex justify-center items-center text-black">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Вход</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Логин */}
          <div>
            <label htmlFor="username" className="block">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Пароль */}
          <div>
            <label htmlFor="password" className="block">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Кнопка отправки */}
          <div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
