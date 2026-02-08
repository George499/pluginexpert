"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// import CustomButton from "./CustomButton"; // Assuming CustomButton is a separate component
import Product from "./Product";

function ForthScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all-categories");
  const [speakers, setSpeakers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://admin.pluginexpert.ru/api/categories?pagination[page]=1&pagination[pageSize]=100"
        );
        if (!res.ok) throw new Error("Ошибка загрузки категорий");
        const data = await res.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        let url =
          "https://admin.pluginexpert.ru/api/speakers?populate[0]=categories&populate[1]=gallery";
        if (selectedCategory !== "all-categories") {
          url += `&filters[categories][slug][$eq]=${selectedCategory}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          console.warn(
            "Ошибка загрузки спикеров:",
            res.status,
            res.statusText,
            text.slice(0, 200)
          );
          setSpeakers([]);
          return;
        }
        const data = await res.json();
        setSpeakers(data.data ?? []);
      } catch (error) {
        console.warn("Ошибка загрузки спикеров:", error?.message ?? error);
        setSpeakers([]);
      }
    };

    fetchSpeakers();
  }, [selectedCategory]);

  const handleClick = (slug) => {
    if (selectedCategory === slug) {
      setSelectedCategory("all-categories");
      setSpeakers([]);
    } else {
      setSelectedCategory(slug);
    }
  };

  return (
    <div className="bg-hero-image bg-fixed flex content-center justify-center items-center flex-col h-full w-full">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center font-semibold mt-[120px] max-[900px]:mt-[60px] mb-10 lg:mb-[87px] relative">
        <div className="relative mb-[10px] w-full">
          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <p className="heading-line text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white ">
            ПОДБОР СПИКЕРОВ
          </p>
          <div className="w-3/4 max-[900px]:w-1/2 h-[1px] ml-[5px] bg-white absolute -bottom-3"></div>
        </div>

        <span className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-black tracking-tighter">
          ПО КАТЕГОРИЯМ
        </span>

        <div
          className={`text-[16px] lg:text-[20px] tracking-normal mb-4 pt-7 text-[#0e172c] `}
        >
          <p>БАЗА СПИКЕРОВ ОБНОВЛЯЕТСЯ НА ПОСТОЯННОЙ ОСНОВЕ</p>
        </div>
      </div>

      <div className="w-full bg-white h-full mb-[87px] flex flex-col items-center justify-center">
        <div className="w-4/5 lg:w-2/3 container mx-auto h-full ">
          <div className="justify-start font-bold text-[16px] lg:text-[20px] text-[#42484D] tracking-[.25em]">
            <div className="text-[16px] lg:text-[20px] tracking-normal mb-4 pt-7 p-[10px]">
              <p>КАТЕГОРИИ И НАПРАВЛЕНИЯ ВЫСТУПЛЕНИЯ СПИКЕРОВ:</p>
            </div>
            <div className="columns-auto gap-6 pt-2 mb-[10px]" role="group">
              {categories.length === 0 ? (
                <p>Загрузка...</p>
              ) : (
                categories
                  .sort((a, b) => a.index - b.index)
                  .slice(0, visibleCount)  
                  .map((category, index) => (
                    <button
                      onClick={() => handleClick(category.slug)}
                      key={category._id || index}
                      className={`p-[10px] lg:m-1 text-[16px] lg:text-[18px] uppercase bg-white tracking-normal ${
                        selectedCategory === category.slug
                          ? "text-[#4e5ac3]"
                          : "text-[#42484D]"
                      } hover:text-[#4e5ac3]`}
                    >
                      {category.title}
                    </button>
                  ))
              )}
            </div>
            {visibleCount < categories.length && (
              <div className="w-full flex justify-start mt-2 mb-[34px]">
                <button
                  onClick={() => setVisibleCount(prev => prev + 15)}
                  className="bg-[#42484D] hover:bg-[#3742a3] text-white px-6 py-2 rounded duration-300 uppercase tracking-tight"
                >
                  Ещё категории
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-full items-center justify-center mb-[57px]">
          {speakers.length === 0 ? (
            <div className="text-[20px] lg:text-[24px] tracking-normal mb-[57px] font-semibold text-[#fffffe]">
              Скоро здесь будут наши проекты
            </div>
          ) : (
            <div className="flex flex-col justify-center">
              <div className="w-full">
                <motion.div
                  initial={{ x: "0vw" }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 50 }}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
                    {speakers.map((speaker) => (
                      <Product key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
        <div className="
            container 
            flex flex-row 
            h-full 
            justify-center 
            gap-6 
            items-center 
            max-[650px]:gap-4 
            max-[650px]:px-4
            max-[450px]:flex-col max-[450px]:gap-6
          ">
            <Link
              href="/all-speakers"
              className="
                w-full
                lg:w-[293px]
                lg:h-auto
                text-center
                font-semibold
                uppercase
                mb-[20px] max-[450px]:mb-0
                px-4 py-2 max-[650px]:px-3 max-[650px]:py-2
                text-[18px] max-[650px]:text-[16px]
                text-[#fffffe]
                bg-[#3742a3]
                hover:bg-[#1d2357]
                duration-300
                block
                no-underline
              "
            >
              Все спикеры
            </Link>

            <Link
              href="/pricing"
              className="
                w-full
                lg:w-[293px]
                lg:h-auto
                text-center
                font-semibold
                uppercase
                mb-[20px]
                px-4 py-2 max-[650px]:px-3 max-[650px]:py-2
                text-[18px] max-[650px]:text-[16px]
                text-[#fffffe]
                bg-[#A786DF]
                hover:bg-[#1d2357]
                duration-300
                block
                no-underline
              "
            >
              Разместиться
            </Link>
          </div>

      </div>
    </div>
  );
}

export default ForthScreen;
