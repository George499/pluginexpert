import { useState, useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/all-speakers/ProductCard";

function AllSpeakers({ allSpeakers, allCategories }) {
  const [categories, setCategories] = useState([]);
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all-categories");
  const [visibleCount, setVisibleCount] = useState(15);
  const [speakers, setSpeakers] = useState([]);

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

  console.log("Speakers in AllSpeakers:", speakers || allSpeakers);

  const handleClick = (slug) => {
    setSelectedCategory((prev) => (prev === slug ? "all-categories" : slug));
  };

  const handleButtonClick = () => setIsContactsVisible(!isContactsVisible);

  return (
    <div className="bg-hero-image bg-fixed flex content-center justify-center items-center flex-col h-full w-full">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center font-semibold mt-[120px]  relative">
        <div className="relative mb-[10px] w-full upfront">
          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <h1 className="heading-line text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white ">
            ПОДБОР СПИКЕРОВ
          </h1>
          <div className="w-3/4 max-[1000px]:w-2/3 h-[1px] ml-[5px] bg-white absolute -bottom-5"></div>
        </div>

        <span className="heading-line text-[40px] lg:text-[57px] mt-5 xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-black tracking-tighter mb-[34px]">
          ПО КАТЕГОРИЯМ
        </span>

        <div className="text-white text-[15px] lg:text-[20px] font-play tracking-normal ">
          <p className="mb-[34px]">
            МЫ НА ПОСТОЯННОЙ ОСНОВЕ ОБНОВЛЯЕМ БАЗУ СПИКЕРОВ ПО РАЗЛИЧНЫМ
            КАТЕГОРИЯМ
          </p>
           <p>В АНКЕТЕ КАЖДОГО СПИКЕРА:</p>
          <ul className="list-disc list-inside mb-[34px]">
            <li>ПРЯМЫЕ КОНТАКТЫ</li>
            <li>ТЕМЫ ВЫСТУПЛЕНИЙ</li>
            <li>РЕГАЛИИ И ЗВАНИЯ</li>
            <li>ТЕМЫ ЛЕКЦИЙ И ВЫСТУПЛЕНИЙ</li>
          </ul>
          <p className="mb-[34px] uppercase">
            ДЛЯ РАЗМЕЩЕНИ АНКЕТЫ НА НАШЕМ РЕСУРСЕ – СВЯЖИТЕСЬ С НАМИ
          </p>
        </div>
        <Link href="/pricing">
          <button
            onClick={handleButtonClick}
            className="bg-[#42484D] hover:bg-[#3742a3] lg:w-[293px] lg:h-[61px] text-white text-[20px] font-semibold uppercase duration-300 p-4 text-center mb-[34px]"
          >
            РАЗМЕСТИТЬ АНКЕТУ
          </button>
        </Link>
      </div>

      <div className="w-full bg-white h-full mb-[87px] max-[450px]:mb-[40px] flex flex-col items-center justify-center">
        <div className="w-4/5 lg:w-2/3 container mx-auto h-full">
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
                  {speakers.map((speaker) => (
                    <ProductCard
                      key={speaker.id}
                      speaker={speaker}
                      setSelectedCategory={setSelectedCategory}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllSpeakers;
