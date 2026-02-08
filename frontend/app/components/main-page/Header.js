"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import NavBar from "./NavBar";
import { usePathname, useRouter } from "next/navigation";
import * as Scroll from "react-scroll";

function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Используется вместо router.pathname
  const [dataToRef, setDataToRef] = useState("");
  const Events = Scroll.Events;
  const [nav, setNav] = useState(false);

  const scrollTo = (to) => {
    Scroll.scroller.scrollTo(to, {
      duration: 1500,
      delay: 100,
      smooth: true,
    });
  };

  const handleBurgerClick = (e) => {
    if (pathname !== "/") {
      router.push("/");
    }
    scrollTo(e.target.getAttribute("data-to"));
    setNav(!nav);
  };

  const handleNavBarClick = (e) => {
    if (pathname !== "/") {
      router.push("/");
    }
    setDataToRef(e.target.getAttribute("data-to"));
  };

  useEffect(() => {
    if (dataToRef) {
      Events.scrollEvent.register("end", function () {
        setDataToRef("");
      });
    }

    nav
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "visible");
  }, [dataToRef, nav]);

  return (
    <header className="w-full h-24 bg-transparent flex items-center absolute top-0 left-0 z-50">
  <div className="w-[90%] lg:w-2/3 mx-auto flex justify-between max-[380px]:justify-around  max-[320px]:w-[95%] items-center">

    {/* Логотип */}
    <Link
      href="/"
      onClick={() => setNav(false)}
      className="cursor-pointer tracking-wide text-[15px] max-[400px]:text-[12px] font-bold text-white z-20"
    >
      PLUG-IN
    </Link>

    {/* Центр — Войти / Регистрация (всегда видны) */}
    <div className="flex gap-6 mx-auto max-[380px]:gap-2">
    <Link href="/auth/signin" className="text-black uppercase font-bold hover:text-[#a7a7a7] text-[17px] max-[380px]:text-[12px]">
      ВОЙТИ
    </Link>
    <Link href="/auth/register" className="text-black uppercase font-bold hover:text-[#a7a7a7] text-[17px] max-[380px]:text-[12px]">
      РЕГИСТРАЦИЯ
    </Link>
</div>


    {/* Справа — навигация (desktop >400px) */}
    <div className="hidden min-[601px]:flex gap-6 ml-auto text-white font-bold uppercase">
      <Link href="/all-speakers" className="hover:text-[#42484D]">
        Все спикеры
      </Link>
      <Link href="/pricing" className="hover:text-[#42484D]">
        Цены
      </Link>
      <Link href="/blog" className="hover:text-[#42484D]">
        Блог
      </Link>
    </div>

    {/* Справа — бургер (mobile ≤400px) */}
    <div className="flex ml-auto min-[601px]:hidden">
      <div
        onClick={() => setNav(!nav)}
        className="z-20 cursor-pointer mx-4"
      >
        {!nav ? (
          <AiOutlineMenu className="h-10 w-10 max-[400px]:h-7 max-[400px]:w-7 text-white" />
        ) : (
          <AiOutlineClose className="h-10 w-10 max-[400px]:h-7 max-[400px]:w-7 text-white" />
        )}
      </div>
    </div>
  </div>

  {/* Выпадающее меню (только mobile ≤400px) */}
  <ul
    className={
      !nav
        ? "hidden"
        : "absolute z-10 top-0 left-0 w-full h-screen bg-[url('/images/bkground_1.png')] text-white flex flex-col justify-center items-center min-[601px]:hidden"
    }
  >
       {/* Спикеры */}
      <li className="py-6 text-4xl cursor-pointer">
        <a onClick={() => { router.push("/all-speakers"); setNav(!nav); }}>Спикеры</a>
      </li>

      {/* Цены */}
      <li className="py-6 text-4xl cursor-pointer">
        <a onClick={() => { router.push("/pricing"); setNav(!nav); }}>Цены</a>
      </li>

      {/* Блог */}
      <li className="py-6 text-4xl cursor-pointer">
        <a onClick={() => { router.push("/blog"); setNav(!nav); }}>Блог</a>
      </li>

      {/* Пропуск строки */}
      <li className="py-4"></li>

      {/* Войти */}
      <li className="py-6 text-4xl text-black cursor-pointer">
        <a onClick={() => { router.push("/auth/signin"); setNav(!nav); }}>Войти</a>
      </li>

      {/* Регистрация */}
      <li className="py-6 text-4xl text-black cursor-pointer">
        <a onClick={() => { router.push("/auth/register"); setNav(!nav); }}>Регистрация</a>
      </li>
  </ul>
</header>


  );
}

export default Header;
