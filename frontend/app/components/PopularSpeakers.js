"use client";

import { useState, useEffect } from "react";
import Product from "./Product";
import { motion } from "framer-motion";

function SixthScreen() {
  const [popularSpeakers, setPopularSpeakers] = useState([]);

  useEffect(() => {
    const fetchPopularSpeakers = async () => {
      try {
        const res = await fetch(
          "https://admin.pluginexpert.ru/api/popular-speakers"
        );
        if (!res.ok) throw new Error("Ошибка загрузки популярных спикеров");
        const data = await res.json();
        console.log(data);
        setPopularSpeakers(data.data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchPopularSpeakers();
  }, []);

  return (
    <div className="bg-fixed h-full flex flex-col">
      <div
        className={`flex content-center justify-center items-center flex-col bg-white`}
      >
        <div className="w-full h-full items-center justify-center">
          <div className="flex flex-col justify-center">
            <div className="bg-[#42484d] mb-[81px] w-full">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 ">
                <motion.div
                  initial={{ x: "-100vw" }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 50 }}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
                    {popularSpeakers.map((speaker) => (
                      <Product key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SixthScreen;
