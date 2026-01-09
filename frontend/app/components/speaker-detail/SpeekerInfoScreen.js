"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeekerInfoScreen({ speaker }) {
  return (
    <div className="bg-white flex content-center justify-center items-center flex-col">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-100 items-start justify-center mt-[81px] max-[600px]:mt-[50px]">
        <div className="w-[51px] h-[12px] mb-[21px] bg-[#4e5ac3]"></div>
          <h2
            className="
             text-[40px] lg:text-[57px] max-[350px]:text-[30px] xl:text-[81px]
              leading-[2.5rem] md:leading-[3.5rem] xl:leading-[4.5rem]
              text-[#42484D] font-bold mb-6 lg:mb-8
          "
            >
              ИНФОРМАЦИЯ <br /> О СПИКЕРЕ
            </h2>


        {/* ✅ Рендер Rich Text с BlocksRenderer */}
        <div className="text-[#1B1B1E] text-[16px] lg:text-[20px] tracking-normal font-play mb-[81px] max-[1000px]:mb-[20px]">
          {speaker.Bio ? (
            <BlocksRenderer
              content={speaker.Bio} // 🚀 Используем Bio из Strapi
              blocks={{
                paragraph: ({ children }) => (
                  <p className="my-5 text-xl font-normal leading-relaxed">{children}</p>
                ),
                heading: ({ level, children }) => {
                  const Tag = `h${level}`;
                  return (
                    <Tag
                      className={`my-5 text-${
                        level === 1 ? "2xl" : "xl"
                      } font-bold text-[#42484D]`}
                    >
                      {children}
                    </Tag>
                  );
                },
                list: ({ children, format }) =>
                  format === "unordered" ? (
                    <ul className="ml-4 list-disc my-4">{children}</ul>
                  ) : (
                    <ol className="ml-4 list-decimal my-4">{children}</ol>
                  ),
                listItem: ({ children }) => (
                  <li className="ml-4 my-2">{children}</li>
                ),
                link: ({ href, children }) => (
                  <a href={href} className="text-blue-600 hover:underline transition-colors duration-200">
                    {children}
                  </a>
                ),
              }}
            />
          ) : (
            <p className="my-5 text-xl font-normal">Информация о спикере будет добавлена в ближайшее время.</p>
          )}
        </div>
        
        {/* Добавляем секцию с образованием */}
            {speaker.education && speaker.education.length > 0 && (
        <div className="mb-[81px] w-full">
          <h3 className="text-[30px] lg:text-[40px] text-[#42484D] font-bold mb-[30px]">
            ОБРАЗОВАНИЕ
          </h3>
          <div className="text-[#1B1B1E] text-[16px] lg:text-[20px] tracking-normal font-play leading-relaxed">
            <BlocksRenderer content={speaker.education} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default SpeekerInfoScreen;