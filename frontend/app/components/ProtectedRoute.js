"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const authToken = localStorage.getItem("authToken");

    // Если токен отсутствует, перенаправляем на страницу логина
    if (!authToken) {
      router.push("/auth/signin");
    } else {
      setLoading(false); // Если токен есть, продолжаем загрузку страницы
    }
  }, [router]);

  // Пока проверяем авторизацию, показываем индикатор загрузки или пустой экран
  if (loading) {
    return <div>Loading...</div>;
  }

  // Возвращаем дочерние компоненты, если пользователь авторизован
  return <>{children}</>;
};

export default ProtectedRoute;
