"use client";
import { useRouter } from "next/navigation";
import useIntersectionObserver from "../../utils/useIntersectionObserver";

function ThirdScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <div
      className={`h-full flex content-center justify-center items-center flex-col bg-fixed bg-[#42484d] `}
      id="process"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center font-semibold my-20">
        <div
          className={`w-[51px] h-[12px] mb-[15px] lg:mb-[21px] bg-[#a786df]`}
        ></div>
        <h2
          className={`text-[40px] lg:text-[57px] xl:text-[81px] leading-[3.5rem] lg:leading-[4.5rem] text-[#f0f0f0] font-bold mb-1 lg:mb-8`}
        >
          НАЙДИТЕ СПИКЕРА САМОСТОЯТЕЛЬНО
        </h2>
        <div
          className={`text-[16px] lg:text-[20px] tracking-normal mb-4 pt-7 text-[#f0f0f0] `}
        >
          <p className="mb-4">
            PLUG-IN SPEAKERS ACCELERATOR - ресурс по самостоятельному подбору
            спикеров.
          </p>

          <p>
            Ресурс на постоянной основе обновляет базу спикеров из различных
            сфер:
          </p>
          <ul className="list-disc pl-5 list-inside pt-3.5 mb-4">
            {["Продажи", "Маркетинг", "Big Data", "IT", "Digital"].map(
              (li, index) => (
                <li key={index}>{li}</li>
              )
            )}
          </ul>
          <p className="pt-3.5 mb-8">Наши клиенты работают со спикерами:</p>
        </div>
        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#f0f0f0] text-[14px] lg:text-[16px] font-bold`}
        >
          <ul
            className={`grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#f0f0f0] text-[14px] lg:text-[16px] font-bold`}
          >
            {[`БЕЗ КОМИССИЙ`, `БЕЗ ПОСРЕДНИКОВ`, `ПРЯМОЙ КОНТАКТ`].map(
              (li, id) => (
                <div className="flex lg:w-1/2" key={id}>
                  <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0">
                    <div
                      className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                      style={{ backgroundColor: "#a786df" }}
                    ></div>
                    <p dangerouslySetInnerHTML={{ __html: li }}></p>
                  </li>
                </div>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ThirdScreen;
