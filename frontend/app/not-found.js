"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineSearch, AiOutlineHome } from "react-icons/ai";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to all-speakers page with search query
      router.push(`/all-speakers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-[url('/images/bkground_1.png')] flex flex-col">
      {/* Header */}
      <header className="w-full h-24 bg-transparent flex items-center">
        <div className="w-[90%] lg:w-2/3 mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="cursor-pointer tracking-wide text-[15px] max-[400px]:text-[12px] font-bold text-white z-20"
          >
            PLUG-IN
          </Link>
          <div className="flex gap-6 mx-auto max-[380px]:gap-2">
            <Link href="/auth/signin" className="text-black uppercase font-bold hover:text-[#a7a7a7] text-[17px] max-[380px]:text-[12px]">
              ВОЙТИ
            </Link>
            <Link href="/auth/register" className="text-black uppercase font-bold hover:text-[#a7a7a7] text-[17px] max-[380px]:text-[12px]">
              РЕГИСТРАЦИЯ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-bold text-white leading-none mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 uppercase tracking-wide">
            Страница не найдена
          </h2>

          <p className="text-white text-lg md:text-xl mb-8 max-w-lg mx-auto">
            К сожалению, запрашиваемая страница не существует. Но вы можете найти то, что ищете:
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск спикеров..."
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white"
                />
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#1B1B1E] font-bold uppercase rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="mb-8">
            <p className="text-white text-sm md:text-base mb-4 uppercase tracking-wide">
              Популярные разделы:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/all-speakers"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold uppercase rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Все спикеры
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold uppercase rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Блог
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold uppercase rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Цены
              </Link>
            </div>
          </div>

          {/* Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1B1B1E] font-bold uppercase rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            <AiOutlineHome className="text-xl" />
            На главную
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center">
        <p className="text-white/70 text-sm">
          © 2025 PLUG-IN SOLUTIONS
        </p>
      </footer>
    </div>
  );
}

