"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/auth/signin");
  };

  return (
    <header className="w-full h-20 backdrop-blur-md bg-black/30 border-b border-white/10 items-center flex fixed top-0 left-0 z-50">
      <div className="w-[90%] lg:w-2/3 mx-auto">
        <div className="w-full flex justify-between items-center text-white font-bold">
          <Link href="/" className="cursor-pointer text-lg tracking-[.25em] uppercase hover:text-[#a7a7a7] transition-colors">
            PLUG-IN
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-sm font-semibold uppercase tracking-wider bg-[#42484D] hover:bg-[#3742a3] text-white transition-all duration-300"
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
