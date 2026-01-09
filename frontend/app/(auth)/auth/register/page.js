"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
 // Чекбоксы
const [agreeTerms, setAgreeTerms] = useState(false);       // Пользовательское соглашение + политика
const [agreePersonal, setAgreePersonal] = useState(false); // Обработка ПД
const [agreeMailing, setAgreeMailing] = useState(false);   // Рассылки (опционально)
const [agreePhoto, setAgreePhoto] = useState(false);       // Фото (опционально)

// Логика показа пароля
const [passwordVisible, setPasswordVisible] = useState(false);
const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

const router = useRouter();

// Проверка пароля и обязательных чекбоксов
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
 if (!agreeTerms || !agreePersonal || !agreeMailing || !agreePhoto) {
  setError("Необходимо принять все условия соглашений.");
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
          username: email.split("@")[0],
          email: email,
          password: password,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Регистрация успешна!");
      router.push("/auth/signin");
    } else {
      setError(result.error.message || "Произошла ошибка при регистрации.");
    }
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
    setError("Ошибка при отправке данных. Попробуйте ещё раз.");
  }
};


  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-center flex justify-center items-center px-4 max-[460px]:px-2">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-4">Регистрация</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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

          {/* Пароль */}
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

          {/* Подтверждение пароля */}
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

                        {/* Подпись перед чекбоксами */}
              <p className="text-sm font-medium mb-2">
                Нажимая кнопку “Зарегистрироваться”, я:
              </p>

              {/* Чекбокс: пользовательское соглашение и политика */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm">
                  Ознакомлен и принимаю условия{" "}
                  <a
                    href="/docs/Пользовательское_соглашение.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Пользовательского соглашения
                  </a>{" "}
                  и{" "}
                  <a
                    href="/docs/Политика_конфиденциальности_ИП_Гузановский.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Положения об обработке персональных данных
                  </a>
                </label>
              </div>

              {/* Чекбокс: согласие на обработку ПД */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreePersonal"
                  checked={agreePersonal}
                  onChange={(e) => setAgreePersonal(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="agreePersonal" className="text-sm">
                  Даю{" "}
                  <a
                    href="/docs/Согласие_на_обработку_ПД.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    согласие ИП Гузановскому А.С. на обработку своих персональных данных
                  </a>
                </label>
              </div>

              {/* Чекбокс: рассылка */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeMailing"
                  checked={agreeMailing}
                  onChange={(e) => setAgreeMailing(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreeMailing" className="text-sm">
                  Даю{" "}
                  <a
                    href="/docs/Согласие_на_обработку_ПД_для_рассылки.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    согласие на получение рекламных и информационных рассылок
                  </a>
                </label>
              </div>

              {/* Чекбокс: фото */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreePhoto"
                  checked={agreePhoto}
                  onChange={(e) => setAgreePhoto(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreePhoto" className="text-sm">
                  Даю{" "}
                  <a
                    href="/docs/Согласие%20на%20публикацию%20фото.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    согласие на использование моего фото
                  </a>
                </label>
              </div>


          {/* Кнопка регистрации */}
          <div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded"
              disabled={!agreeTerms || !agreePersonal || !agreeMailing || !agreePhoto}
            >
              Зарегистрироваться
            </button>
          </div>

          {/* Ссылка на вход */}
          <div className="text-center mt-4">
            <p>
              Уже есть аккаунт?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:underline"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
