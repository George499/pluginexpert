"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useEffect, useState } from "react";

function SpecialText() {
  const [specialText, setSpecialText] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  console.log("BlocksRenderer импортирован из:", require.resolve("@strapi/blocks-react-renderer"));


  useEffect(() => {
    async function fetchData() {
      try {
       const response = await fetch(
        "https://admin.pluginexpert.ru/api/special-texts?filters[page][$eq]=home%20page&populate=*",
        { cache: "no-store" }
        );
        const data = await response.json();
        setSpecialText(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!specialText) {
    return <div>Loading...</div>;
  }

  // Получаем непосредственно массив блоков
  const blocks = specialText?.data?.[0]?.body;
  if (!blocks) {
    return <div>No content available</div>;
  }

  console.log(
  Array.isArray(blocks) ? blocks.map(b => b.type + (b.type === "heading" ? ` h${b.level}` : "")) : typeof blocks
);

const customBlocks = {
  heading: ({ level, children }) => {
    const Tag = `h${level}`;
    let classes = "";

    switch (level) {
      case 1:
        classes = "text-3xl font-bold leading-tight mb-6";
        break;
      case 2:
        classes = "text-2xl font-semibold leading-snug mb-4";
        break;
      case 3:
        classes = "text-xl font-medium leading-normal mb-3";
        break;
      default:
        classes = "text-lg font-bold mb-2";
    }

    return <Tag className={classes}>{children}</Tag>;
  },

  paragraph: ({ children }) => (
    <p className="font-play text-base font-normal mb-4">{children}</p>
  ),

  list: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,

  "list-item": ({ children }) => (
    <li className="font-play ml-4 text-base">{children}</li>
  ),

  link: ({ href, children }) => (
    <a href={href} className="text-blue-500 hover:underline">
      {children}
    </a>
  ),

  // ✨ Добавляем поддержку жирного, курсивного и подчеркивания
  bold: ({ children }) => <strong>{children}</strong>,
  italic: ({ children }) => <em>{children}</em>,
  underline: ({ children }) => <u>{children}</u>,
};




  return (
  <div className="bg-fixed flex justify-center w-full bg-[white] text-black">
    <div className="shadow-neutral-500/50 w-full flex justify-center">
      <div className="container w-4/5 flex flex-col my-10">

        {/* Версия для больших экранов */}
        <div className="hidden max-[450px]:hidden md:block">
          <BlocksRenderer content={blocks} blocks={customBlocks}  />
        </div>

        {/* Версия для маленьких экранов */}
        <div className="block md:hidden">
          <div className={`${!isExpanded ? "line-clamp-5" : ""}`}>
            <BlocksRenderer content={blocks} blocks={customBlocks}  />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-[#42484D] text-white rounded hover:bg-[#3742a3] duration-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Скрыть" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default SpecialText;
