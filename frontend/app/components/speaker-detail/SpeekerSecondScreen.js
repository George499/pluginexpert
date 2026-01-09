"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeakerSecondScreen({ speaker }) {
  // Получаем контент из структуры данных Strapi 5
  const speechContent = speaker.speech_topics || [
    {
      type: "paragraph",
      children: [{ text: "Информация отсутствует." }],
    },
  ];

  return (
    <div
      className="bg-[url('/images/bkground_1.png')] bg-fixed min-h-[580px] flex flex-col relative"
      id="speech-topics"
    >
      <div className="bg-[#42484d] flex content-center justify-center items-center flex-col mb-[81px] ">
        <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center pt-[51px] lg:pt-[81px]">
          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <h2 className="text-[40px] lg:text-[57px] max-[350px]:text-[30px] leading-[3.5rem] lg:leading-[4.5rem] text-white font-bold mb-[30px]">
            ТЕМЫ ВЫСТУПЛЕНИЙ
          </h2>
          
          <div className="text-white xl:text-[20px] md:text-[18px] tracking-normal mb-[81px] max-[1000px]:mb-[20px]  font-play">
            {speechContent ? (
                      <BlocksRenderer
          content={speechContent}
          blocks={{
            paragraph: ({ children }) => (
              <p className="font-play text-[16px] xl:text-[20px] md:text-[18px] my-3 lg:my-4 leading-relaxed">
                {children}
              </p>
            ),
            heading: ({ level, children }) => {
              const Tag = `h${level}`;
              return (
                <Tag className="mt-4 lg:mt-5 mb-2 lg:mb-3 text-md font-bold leading-[2rem] lg:leading-[2.5rem] text-white">
                  {children}
                </Tag>
              );
            },
            list: ({ children, format }) =>
              format === "unordered" ? (
                <ul className="mb-4 lg:mb-6 list-disc ml-4 space-y-1.5 lg:space-y-2">{children}</ul>
              ) : (
                <ol className="mb-4 lg:mb-6 list-decimal ml-4 space-y-1.5 lg:space-y-2">{children}</ol>
              ),
            listItem: ({ children }) => <li className="ml-4">{children}</li>,
            link: ({ href, children }) => (
              <a href={href} className="text-blue-300 hover:underline transition-colors duration-200">
                {children}
              </a>
            ),
          }}
        />

            ) : (
              <p className="my-4 text-xl">Информация о темах выступлений будет добавлена в ближайшее время.</p>
            )}

            <div className="mt-10 p-6 bg-[#363b3f] rounded-lg shadow-md">
              <p className="text-lg">
                Не нашли подходящей темы? Это ещё не значит, что спикер по ней не
                проводит мастер-класс.
                <br />
                Для уточнения темы выступления спикера  <a href="#contacts" className="text-[#4e5ac3] hover:underline">
                                                          свяжитесь с нами по почте
                                                        </a>{" "}
                <a 
                  href="mailto:mailto:hello@pluginexpert.ru" 
                  className="text-blue-300 hover:underline transition-colors duration-200"
                >
                  hello@pluginexpert.ru
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakerSecondScreen;