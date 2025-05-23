"use client";

import { HiOutlineArrowCircleDown } from "react-icons/hi";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import { useState, useEffect } from "react";

function SpeekerFirstScreen({ speaker }) {
  const [declinedCategory, setDeclinedCategory] = useState("");
  
  // Получаем URL аватара из новой структуры данных Strapi 5
  const avatarUrl = speaker.avatar?.data?.url 
    ? `https://admin.pluginexpert.ru${speaker.avatar.data.url}`
    : "/images/default.jpg"; // Фолбэк-изображение

  // Определение падежа вручную (аналог russian-nouns-js)
  useEffect(() => {
    if (speaker.categories?.data?.length > 0) {
      const category = speaker.categories.data[0]?.title || "";
      const gender = speaker.categories.data[0]?.gender || "male";

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
    <div className="bg-[url('/images/bkground_1.png')] bg-fixed min-h-screen">
      <div className="lg:h-full flex justify-center items-center flex-col">
        <div className="container flex flex-col w-4/5 lg:w-3/4 h-full font-semibold relative lg:mb-[81px] mt-[150px]">
          <div className="flex flex-col lg:flex-row mb-6 justify-between text-[40px] lg:text-[57px] xl:text-[60px] leading-[2.5rem] lg:leading-[4.5rem]">
            <div className="flex flex-col self-center mr-12">
              <p className="text-white">{nameParts[1]?.toUpperCase()}</p>
              <p className="text-white tracking-tighter">{nameParts[0]?.toUpperCase()}</p>

              <div className="text-white tracking-tighter relative">
                <div className="w-full h-[1px] ml-[5px] bg-white absolute top-[2px]"></div>
                <p className="text-black">ПОМОЩЬ</p>
                <p className="text-white tracking-tighter">
                  В {declinedCategory.toUpperCase()}
                </p>
              </div>
              <div className="font-play tracking-[.25em] leading-[1.5rem] text-white pt-6 text-[16px] lg:text-[20px]">
                <p className="pb-4">{speaker.Profession}</p>
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative aspect-[3/4]">
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt={speaker.Name || "Спикер"}
                  fill
                  className="object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  priority
                />
              )}
            </div>
          </div>

          <ScrollLink to="second screen" smooth duration={1000}>
            <HiOutlineArrowCircleDown className="text-white hidden lg:block hover:text-slate-200 w-[60px] h-[60px] cursor-pointer animate-bounce absolute -bottom-20 inset-x-1/2" />
          </ScrollLink>
        </div>
      </div>
    </div>
  );
}

export default SpeekerFirstScreen;