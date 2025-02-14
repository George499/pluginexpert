"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter(); // Создаем экземпляр роутера

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Пароль должен быть минимум 6 символов, содержать одну заглавную букву и одну цифру."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      const response = await fetch(
        "https://admin.pluginexpert.ru/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.split("@")[0], // Уникальное имя пользователя на основе email
            email: email,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Регистрация успешна!");

        // После успешной регистрации редиректим на страницу логина
        router.push("/auth/signin"); // Переход на страницу логина
      } else {
        setError(result.error.message || "Произошла ошибка при регистрации.");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      setError("Ошибка при отправке данных. Попробуйте ещё раз.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-center flex justify-center items-center">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-4">Регистрация</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block">
              Пароль
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {confirmPasswordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
