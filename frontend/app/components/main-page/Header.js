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
    <header className="w-full h-24 bg-transparent items-center flex absolute top-0 left-0 z-50">
      <div className="lg:flex lg:flex-col items-start absolute">
        <Link href="/auth/signin" key="signin" legacyBehavior>
          <a className="mx-4 text-black uppercase font-bold hover:text-[#42484D]">
            ВОЙТИ
          </a>
        </Link>
        <Link href="/auth/register" key="register" legacyBehavior>
          <a className="mx-4 text-black uppercase font-bold hover:text-[#42484D]">
            РЕГИСТРАЦИЯ
          </a>
        </Link>
      </div>
      <div className="w-[80%] lg:w-2/3 mx-auto">
        <div className="w-full flex justify-between items-center text-white font-bold text-base">
          <div className="z-20">
            <Link
              href="/"
              onClick={() => setNav(false)}
              className="cursor-pointer tracking-wide text-[15px]"
            >
              PLUG-IN
            </Link>
          </div>
          <NavBar handleClick={handleNavBarClick} />
        </div>
        <div className="ml-auto font-medium flex lg:hidden">
          <div
            onClick={() => setNav(!nav)}
            className="z-20 cursor-pointer align-self-center mx-4"
          >
            {!nav ? (
              <AiOutlineMenu className="h-10 w-10 text-white" />
            ) : (
              <AiOutlineClose className="h-10 w-10 text-white" />
            )}
          </div>

          <ul
            className={
              !nav
                ? "hidden"
                : "absolute z-10 top-0 left-0 w-full h-screen bg-[url('/images/bkground_1.png')] text-white flex flex-col justify-center items-center"
            }
          >
            <li
              className="py-6 text-4xl cursor-pointer"
              data-to="process"
              onClick={(e) => handleBurgerClick(e)}
            >
              Спикеры
            </li>
            <li
              className="py-6 text-4xl cursor-pointer"
              data-to="production"
              onClick={(e) => handleBurgerClick(e)}
            >
              Продакшн
            </li>
            <li className="py-6 text-4xl cursor-pointer">
              <a
                onClick={() => {
                  router.push("/all-categories");
                  setNav(!nav);
                }}
              >
                Все спикеры
              </a>
            </li>
            <li
              className="py-6 text-4xl cursor-pointer"
              onClick={(e) => handleBurgerClick(e)}
              data-to="contacts"
            >
              Контакты
            </li>
            <li className="py-6 text-4xl cursor-pointer">
              <a
                onClick={() => {
                  router.push("/forSpeekers");
                  setNav(!nav);
                }}
              >
                Спикерам
              </a>
            </li>
            <li className="py-6 text-4xl cursor-pointer">
              <a
                onClick={() => {
                  router.push("/blog");
                  setNav(!nav);
                }}
              >
                Блог
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
