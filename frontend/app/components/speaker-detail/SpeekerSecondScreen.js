"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

function SpeakerSecondScreen({ speaker }) {
  const speechContent = Array.isArray(speaker.speech_topics)
    ? speaker.speech_topics
    : [
        {
          type: "paragraph",
          children: [
            { text: speaker.speech_topics || "Информация отсутствует." },
          ],
        },
      ];

  return (
    <div
      className="bg-[url('/images/bkground_1.png')] bg-fixed min-h-[580px] flex flex-col relative"
      id="contacts"
    >
      <div className="bg-[#42484d] flex content-center justify-center items-center flex-col mb-[81px]">
        <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center pt-[51px] lg:pt-[81px]">
          <div className="text-white xl:text-[20px] md:text-[18px] tracking-normal mb-[81px] font-play">
            <h1 className="text-2xl mb-5 font-bold text-white">
              О чем читает и чему учит:
            </h1>

            {/* ✅ Используем BlocksRenderer вместо PortableText */}
            {speechContent ? (
              <BlocksRenderer
                content={speechContent}
                blocks={{
                  paragraph: ({ children }) => (
                    <p className="font-play text-[16px] xl:text-[20px] md:text-[18px]">
                      {children}
                    </p>
                  ),
                  heading: ({ level, children }) => {
                    const Tag = `h${level}`;
                    return (
                      <Tag
                        className={`mt-5 text-md font-bold leading-[2.5rem] text-white`}
                      >
                        {children}
                      </Tag>
                    );
                  },
                  list: ({ children, format }) =>
                    format === "unordered" ? (
                      <ul className="mb-6 list-disc ml-4">{children}</ul>
                    ) : (
                      <ol className="mb-6 list-decimal ml-4">{children}</ol>
                    ),
                  listItem: ({ children }) => (
                    <li className="ml-4">{children}</li>
                  ),
                  link: ({ href, children }) => (
                    <a href={href} className="text-blue-500 hover:underline">
                      {children}
                    </a>
                  ),
                }}
              />
            ) : (
              "Пока ничего нет"
            )}

            <p>
              Не нашли подходящей темы - это еще не значит, что спикер по ней не
              проводит мастер-класс.
              <br />
              Для уточнения темы выступления спикера свяжитесь с нами по почте
              want@plugin.expert
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakerSecondScreen;
