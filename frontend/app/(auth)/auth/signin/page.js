"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

    setLoading(true);
    try {
      const response = await fetch(
        "https://admin.pluginexpert.ru/api/auth/local",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: username, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", result.jwt);
        router.push("/dashboard");
      } else {
        setError(result?.error?.message || result?.message || "Неверный логин или пароль");
      }
    } catch (err) {
      setError("Ошибка при отправке данных. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-fixed bg-center flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        {/* Header decoration */}
        <div className="mb-8">
          <div className="w-[51px] h-[12px] mb-5 bg-white"></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">
            Вход
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
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all pr-20"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-semibold uppercase tracking-wider text-white bg-[#42484D] hover:bg-[#3742a3] duration-300 text-[16px] disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-400 text-sm">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-white hover:text-gray-300 underline transition-colors">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
