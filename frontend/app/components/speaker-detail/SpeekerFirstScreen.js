"use client";

import { HiOutlineArrowCircleDown } from "react-icons/hi";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

function SpeekerFirstScreen({ speaker }) {
  const [declinedCategory, setDeclinedCategory] = useState("");

  // Получаем URL аватара из новой структуры данных Strapi 5
  const avatarUrl = speaker.gallery?.[0]?.url
    ? `https://admin.pluginexpert.ru${speaker.gallery[0].url}`
    : "/images/default.jpg";


  useEffect(() => {
  console.log("Speaker object:", speaker);
  console.log("Speaker categories raw:", speaker.categories);
}, [speaker]);

  // Определение падежа вручную (аналог russian-nouns-js)
useEffect(() => {
  if (speaker.categories?.length > 0) {
    const category = speaker.categories[0]?.title || "";
    const gender = speaker.categories[0]?.gender || "male";

    let declined = category;
    if (gender === "female") {
      declined = category.endsWith("а")
        ? category.slice(0, -1) + "е"
        : category;
    } else {
      declined = category.endsWith("й")
        ? category.slice(0, -1) + "е"
        : category + "е";
    }

    setDeclinedCategory(declined);
  }
}, [speaker]);



  // Разделяем имя на части
  const nameParts = speaker.Name?.split(" ") || ["", ""];

  return (
   <div className="
  bg-[url('/images/bkground_1.png')]
  bg-fixed
  min-h-screen
  max-[1700px]:min-h-0
">
  <div className="flex justify-center items-center flex-col">
    <div
      className="
        container flex flex-col
        w-4/5 lg:w-3/4
        font-semibold relative
        mt-[80px] lg:mt-[150px]
        mb-10 xl:mb-0
      "
    >
       {/* Хлебные крошки */}
        <nav className="text-sm text-gray-200 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-white text-white/80">
                Главная
              </Link>
            </li>
            <li className="text-white/50">/</li>
            <li>
              <Link href="/all-speakers" className="hover:text-white text-white/80">
                База спикеров
              </Link>
            </li>
            <li className="text-white/50">/</li>
            <li className="text-white line-clamp-1">
              {speaker?.Name || "Спикер"}
            </li>
          </ol>
        </nav>
      <div className="flex flex-col lg:flex-row justify-between
      text-[40px] lg:text-[57px] xl:text-[60px]
      leading-[2.5rem] lg:leading-[4.5rem]
      max-[500px]:text-[28px] max-[500px]:leading-[2rem]
      ">
        {/* Левая часть */}
        <div className=" flex flex-col max-[1000px]:self-start self-center mr-12">
          <p className="text-white">{nameParts[1]?.toUpperCase()}</p>
          <p className="text-white tracking-tighter max-[1000px]:mb-5 ">
            {nameParts[0]?.toUpperCase()}
          </p>

          <div className="text-white tracking-tighter relative">
            <div className="w-full h-[1px] ml-[5px] bg-white absolute max-[500px]:w-1/2"></div>
            <p className="text-black max-[1000px]:mt-5">ПОМОЩЬ</p>
            <p className="text-white tracking-tighter">
              В {declinedCategory.toUpperCase()}
            </p>
          </div>

          <div className="font-play tracking-[.25em] leading-[1.5rem] text-white pt-6 text-[16px] lg:text-[20px]">
            <p className="pb-4">{speaker.Profession}</p>
          </div>
        </div>

        {/* Фото */}
        <div className="lg:w-1/2 w-full relative aspect-[3/4]">
            {avatarUrl && (
                <div className="relative w-full aspect-square">
                  <Image
                    src={avatarUrl}
                    alt={speaker?.Name || "Спикер"}
                    fill
                    className="object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

        </div>
      </div>

      {/* Стрелка вниз ― только на XL */}
      <ScrollLink to="second screen" smooth duration={1000}>
       <HiOutlineArrowCircleDown className="text-white max-[1700px]:hidden min-[1701px]:block hover:text-slate-200 w-[60px] h-[60px] cursor-pointer animate-bounce absolute -bottom-20 max-[1700px]:-bottom-10 inset-x-1/2" />
      </ScrollLink>
    </div>
  </div>
</div>

  );
}

export default SpeekerFirstScreen;
