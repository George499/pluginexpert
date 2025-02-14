import { useState } from "react";
import { FaTelegram } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/all-speakers/ProductCard";

function AllSpeakers({ allSpeakers, allCategories }) {
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all-categories");

  const filteredSpeakers =
    selectedCategory === "all-categories"
      ? allSpeakers
      : allSpeakers.filter((speaker) =>
          speaker.categories?.data?.some(
            (category) => category.slug === selectedCategory
          )
        );

  const handleClick = (slug) => {
    setSelectedCategory((prev) => (prev === slug ? "all-categories" : slug));
  };

  const handleButtonClick = () => setIsContactsVisible(!isContactsVisible);

  return (
    <div className="bg-hero-image bg-fixed flex content-center justify-center items-center flex-col h-full w-full">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center font-semibold mt-[120px]  relative">
        <div className="relative mb-[10px] w-full upfront">
          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <p className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white ">
            ПОДБОР СПИКЕРОВ
          </p>
          <div className="w-3/4 h-[1px] ml-[5px] bg-white absolute bottom-1"></div>
        </div>

        <span className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-black tracking-tighter mb-[34px]">
          ПО КАТЕГОРИЯМ
        </span>

        <div className="text-white text-[15px] lg:text-[20px] font-play tracking-normal ">
          <p className="mb-[34px]">
            МЫ НА ПОСТОЯННОЙ ОСНОВЕ ОБНОВЛЯЕМ БАЗУ СПИКЕРОВ ПО РАЗЛИЧНЫМ
            КАТЕГОРИЯМ
          </p>
          <p>В ОПИСАНИИ КАЖДОГО СПИКЕРА:</p>
          <ul className="list-disc list-inside mb-[34px]">
            <li>Прямые контакты</li>
            <li>РЕГАЛИИ</li>
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

      <div className="w-full bg-white h-full mb-[87px] flex flex-col items-center justify-center">
        <div className="w-4/5 lg:w-2/3 container mx-auto h-full">
          <div className="text-[16px] lg:text-[20px] tracking-normal mb-4 pt-7 p-[10px] text-black">
            <p>КАТЕГОРИИ И НАПРАВЛЕНИЯ ВЫСТУПЛЕНИЯ СПИКЕРОВ:</p>
          </div>
          <div className="columns-auto gap-6 pt-2 mb-[57px]" role="group">
            {allCategories
              .sort((a, b) => a.index - b.index) // Сортировка по index
              .map((category, index) => (
                <button
                  onClick={() => handleClick(category.slug)}
                  key={category.id || index}
                  className={`p-[10px] lg:m-1 text-[16px] lg:text-[18px] uppercase bg-white tracking-normal ${
                    selectedCategory === category.slug
                      ? "text-[#4e5ac3]"
                      : "text-[#42484D]"
                  } hover:text-[#4e5ac3]`}
                >
                  {category.title}
                </button>
              ))}
          </div>
        </div>

        <div className="w-full h-full items-center justify-center mb-[57px]">
          {filteredSpeakers.length === 0 ? (
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
                  {filteredSpeakers.map((speaker) => (
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
