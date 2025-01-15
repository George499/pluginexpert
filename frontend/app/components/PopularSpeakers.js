"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/legacy/image";

const API_BASE_URL = "https://admin.pluginexpert.ru";

function PopularSpeakers() {
  const [popularSpeakers, setPopularSpeakers] = useState([]);

  useEffect(() => {
    const fetchPopularSpeakers = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/popular-speakers?populate=image`
        );
        if (!res.ok) throw new Error("Ошибка загрузки популярных спикеров");
        const data = await res.json();
        setPopularSpeakers(data.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchPopularSpeakers();
  }, []);

  return (
    <div className="bg-[#42484d]">
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-0"
      >
        {popularSpeakers?.map((speaker) => (
          <div className="group relative" key={speaker.id}>
            <Image
              src={`${API_BASE_URL}${speaker.image[0].url}`}
              alt={`Image of ${speaker.name}`}
              layout="responsive"
              width="100%"
              height="100%"
              objectFit="cover"
            />

            <div className="hidden absolute w-full h-full top-0 left-0 lg:flex">
              {/* Прозрачный фон */}
              <div className="absolute w-full h-full bg-[#4e5ac3] lg:opacity-0 lg:group-hover:opacity-50 opacity-60 transition-opacity-60 duration-700"></div>

              {/* Контент (name и description) */}
              <div className="cursor-pointer relative z-10 w-full h-full flex flex-col items-center justify-center text-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity-60 duration-700">
                <h3 className="text-[30px] text-[#000000]">{speaker.name}</h3>
                <p className="hidden lg:block lg:text-[15px] text-[#fffffe]">
                  {speaker.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default PopularSpeakers;
