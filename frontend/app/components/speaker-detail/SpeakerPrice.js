"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeakerPrice({ speaker }) {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
      className={`h-full flex content-center justify-center items-center flex-col text-[#1B1B1E]`}
      style={{ backgroundColor: "#f0f0f0" }}
      id="second screen"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 items-start justify-center font-semibold">
        <div
          className=" w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div>
        <div className="mb-14 text-[40px] lg:text-[57px] xl:text-[81px]">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">СТОИМОСТЬ</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px]">УСЛУГ</p>
          </div>
        </div>
        <BlocksRenderer
          content={speaker.Price} // 🚀 Используем Bio из Strapi
          blocks={{
            paragraph: ({ children }) => (
              <p className="my-5 text-xl font-normal">{children}</p>
            ),
            heading: ({ level, children }) => {
              const Tag = `h${level}`;
              return (
                <Tag
                  className={`my-5 text-${
                    level === 1 ? "2xl" : "xl"
                  } font-bold`}
                >
                  {children}
                </Tag>
              );
            },
            list: ({ children, format }) =>
              format === "unordered" ? (
                <ul className="ml-4 list-disc text-[20px]">{children}</ul>
              ) : (
                <ol className="ml-4 list-decimal">{children}</ol>
              ),
            listItem: ({ children }) => <li className="ml-4">{children}</li>,
            link: ({ href, children }) => (
              <a href={href} className="text-blue-500 hover:underline">
                {children}
              </a>
            ),
          }}
        />
      </div>
    </div>
  );
}

export default SpeakerPrice;
