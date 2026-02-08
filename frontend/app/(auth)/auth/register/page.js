"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePersonal, setAgreePersonal] = useState(false);
  const [agreeMailing, setAgreeMailing] = useState(false);
  const [agreePhoto, setAgreePhoto] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError("Пароль должен быть минимум 6 символов, содержать одну заглавную букву и одну цифру.");
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

    setLoading(true);
    try {
      const response = await fetch(
        "https://admin.pluginexpert.ru/api/auth/local/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setError(result?.error?.message || "Произошла ошибка при регистрации.");
      }
    } catch (err) {
      setError("Ошибка при отправке данных. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all";
  const labelClasses = "block text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2";
  const checkboxLabelClasses = "text-sm text-gray-400 leading-relaxed";
  const linkClasses = "text-white hover:text-gray-300 underline transition-colors";

  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-fixed bg-center flex justify-center items-center px-4 py-20">
      <div className="w-full max-w-lg">
        {/* Header decoration */}
        <div className="mb-8">
          <div className="w-[51px] h-[12px] mb-5 bg-white"></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">
            Регистрация
          </h1>
          <div className="w-3/4 h-[1px] bg-white mt-4"></div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className={labelClasses}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClasses}>Пароль</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClasses} pr-20`}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                {passwordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClasses}>Подтвердите пароль</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClasses} pr-20`}
                required
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                {confirmPasswordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Нажимая кнопку &quot;Зарегистрироваться&quot;, я:
            </p>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 accent-white" required />
              <label htmlFor="agreeTerms" className={checkboxLabelClasses}>
                Ознакомлен и принимаю условия{" "}
                <a href="/docs/Пользовательское_соглашение.pdf" target="_blank" rel="noopener noreferrer" className={linkClasses}>Пользовательского соглашения</a>{" "}и{" "}
                <a href="/docs/Политика_конфиденциальности_ИП_Гузановский.pdf" target="_blank" rel="noopener noreferrer" className={linkClasses}>Положения об обработке персональных данных</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreePersonal" checked={agreePersonal} onChange={(e) => setAgreePersonal(e.target.checked)} className="mt-1 accent-white" required />
              <label htmlFor="agreePersonal" className={checkboxLabelClasses}>
                Даю{" "}
                <a href="/docs/Согласие_на_обработку_ПД.pdf" target="_blank" rel="noopener noreferrer" className={linkClasses}>согласие ИП Гузановскому А.С. на обработку своих персональных данных</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeMailing" checked={agreeMailing} onChange={(e) => setAgreeMailing(e.target.checked)} className="mt-1 accent-white" />
              <label htmlFor="agreeMailing" className={checkboxLabelClasses}>
                Даю{" "}
                <a href="/docs/Согласие_на_обработку_ПД_для_рассылки.pdf" target="_blank" rel="noopener noreferrer" className={linkClasses}>согласие на получение рекламных и информационных рассылок</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreePhoto" checked={agreePhoto} onChange={(e) => setAgreePhoto(e.target.checked)} className="mt-1 accent-white" />
              <label htmlFor="agreePhoto" className={checkboxLabelClasses}>
                Даю{" "}
                <a href="/docs/Согласие%20на%20публикацию%20фото.pdf" target="_blank" rel="noopener noreferrer" className={linkClasses}>согласие на использование моего фото</a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !agreeTerms || !agreePersonal || !agreeMailing || !agreePhoto}
            className="w-full py-4 font-semibold uppercase tracking-wider text-white bg-[#42484D] hover:bg-[#3742a3] duration-300 text-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-400 text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/signin" className={linkClasses}>Войти</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
