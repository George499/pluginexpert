"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeekerInfoScreen({ speaker }) {
  return (
    <div className="bg-white flex content-center justify-center items-center flex-col ">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-100 items-start justify-center mt-[81px]">
        <div className="w-[51px] h-[12px] mb-[21px] bg-[#4e5ac3]"></div>
        <h2 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[3.5rem] lg:leading-[4.5rem] text-[#42484D] font-bold lg:mb-[57px] mb-[20px]">
          ИНФОРМАЦИЯ О СПИКЕРЕ
        </h2>

        {/* ✅ Новый рендер Rich Text с BlocksRenderer */}
        <div className="text-[#1B1B1E] text-[16px] lg:text-[20px] tracking-normal font-play mb-[81px]">
          <BlocksRenderer
            content={speaker.Bio} // 🚀 Используем Bio из Strapi
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
                  <ul className="ml-4 list-disc">{children}</ul>
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
    </div>
  );
}

export default SpeekerInfoScreen;
