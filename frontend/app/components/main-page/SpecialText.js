"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useEffect, useState } from "react";

function SpecialText() {
  const [specialText, setSpecialText] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://admin.pluginexpert.ru/api/special-texts"
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

  const customComponents = {
    heading: ({ level, children }) => {
      const Tag = `h${level}`;
      const classes =
        level === 1
          ? "text-md font-bold leading-[2.5rem] lg:leading-[4.5rem] "
          : "my-5 text-md font-bold";
      return <Tag className={classes}>{children}</Tag>;
    },
    paragraph: ({ children }) => (
      <p className="font-play text-sm font-normal">{children}</p>
    ),
    list: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
    "list-item": ({ children }) => (
      <li className="font-play ml-4 text-sm">{children}</li>
    ),
    link: ({ href, children }) => (
      <a href={href} className="text-white hover:underline">
        {children}
      </a>
    ),
  };

  return (
    <div className="bg-fixed flex justify-center w-full  bg-[white] text-black">
      <div className="shadow-neutral-500/50 w-full flex justify-center">
        <div className="container w-4/5 flex flex-col my-10">
          <BlocksRenderer content={blocks} components={customComponents} />
        </div>
      </div>
    </div>
  );
}

export default SpecialText;
