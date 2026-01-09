"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeakerPrice({ speaker }) {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  
  return (
    <div
      ref={ref}
      className={`h-full flex content-center justify-center items-center flex-col text-[#1B1B1E] transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "#f0f0f0" }}
      id="price"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 max-[600px]:my-10 items-start justify-center font-semibold">
        <div
          className="w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div>
        <div className="mb-14 text-[40px] lg:text-[57px] xl:text-[81px]">
          <p className="leading-[4.5rem] max-[1000px]:leading-[2rem] mb-[30px] lg:-mb-[5px]">СТОИМОСТЬ</p>
          <div className="tracking-tighter leading-[4.5rem] max-[1000px]:leading-[2rem] lg:flex">
            <p className="-mb-[30px] lg:-mb-[10px]">УСЛУГ</p>
          </div>
        </div>
        
        {speaker.Price ? (
          <BlocksRenderer
            content={speaker.Price}
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
                    } font-bold`}
                  >
                    {children}
                  </Tag>
                );
              },
              list: ({ children, format }) =>
                format === "unordered" ? (
                  <ul className="ml-4 list-disc text-[20px] my-4 space-y-2">{children}</ul>
                ) : (
                  <ol className="ml-4 list-decimal text-[20px] my-4 space-y-2">{children}</ol>
                ),
              listItem: ({ children }) => <li className="ml-4">{children}</li>,
              link: ({ href, children }) => (
                <a href={href} className="text-blue-600 hover:underline transition-colors duration-200">
                  {children}
                </a>
              ),
            }}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <p className="text-xl">
              Информация о стоимости услуг будет добавлена в ближайшее время. 
              Для получения актуальной информации о ценах, пожалуйста, свяжитесь со спикером напрямую.
            </p>
          </div>
        )}
        
        {/* Если спикер платный, показываем соответствующую информацию */}
        {speaker.isPaid && (
          <div className="mt-8 bg-[#a786df] text-white p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold">
              ✓ Премиум-спикер с проверенной квалификацией
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeakerPrice;