"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  // Проверяем, есть ли уже кука
  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie_consent="));
    if (!consent) setShow(true);
  }, []);

  // Устанавливаем куку
  const setCookie = (value) => {
    document.cookie = `cookie_consent=${value}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`; // хранение 7 дней
    setShow(false);

    if (value === "accepted") {
      console.log("✅ Пользователь согласился на куки");
    } else {
      console.log("❌ Пользователь отказался от куки");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center z-50">
      <p className="mr-4">
        Мы используем cookies, чтобы улучшить работу сайта. Продолжая
        пользоваться сайтом, вы соглашаетесь с нашей{" "}
        <a href="/privacy" className="underline">
          политикой конфиденциальности
        </a>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setCookie("accepted")}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Принять
        </button>
        <button
          onClick={() => setCookie("declined")}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Отклонить
        </button>
      </div>
    </div>
  );
}
