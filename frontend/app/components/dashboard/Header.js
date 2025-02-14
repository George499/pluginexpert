"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Проверяем авторизацию при монтировании компонента
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Удаляем токен из localStorage при выходе
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/auth/signin"); // Перенаправляем на страницу входа
  };

  return (
    <header className="w-full h-24 bg-transparent items-center flex absolute top-0 left-0 z-50">
      <div className="w-[80%] lg:w-2/3 mx-auto">
        <div className="w-full flex justify-between items-center text-white font-bold text-base">
          <div className="z-20">
            <Link href="/" className="cursor-pointer tracking-wide text-[15px]">
              PLUG-IN
            </Link>
          </div>

          {isAuthenticated && (
            <div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-[#42484D] hover:bg-[#3742a3] text-[#fffffe] rounded-md"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
