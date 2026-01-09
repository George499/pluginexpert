"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";

function SecondScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
      className={`h-full flex content-center justify-center items-center flex-col text-[#1B1B1E]`}
      style={{ backgroundColor: "#f0f0f0" }}
      id="second screen"
    >
    <div
    className="
      container flex flex-col
      w-4/5 lg:w-2/3 my-20
      items-start justify-center font-semibold
      max-[560px]:w-11/12 max-[560px]:my-10 max-[560px]:px-4
      max-[320px]:w-11/12 max-[320px]:px-3 max-[320px]:my-8
    "
  >
        <div
          className=" w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div>
         <div
                className="
                  heading-line 
                  text-[40px] lg:text-[57px] xl:text-[81px]
                  leading-[2.5rem] lg:leading-[3.5rem] xl:leading-[4.5rem]
                  font-bold
                  mb-6 lg:mb-8 max-[320px]:mb-4
                "
              >
                <p className="text-[#1B1B1E]">PLUGIN</p>

                <div className="tracking-tighter lg:flex">
                  <p className="text-[#1B1B1E] lg:mr-5">SPEAKERS</p>
                  <p className="text-[#1B1B1E]">ACCELERATOR</p>
                </div>
              </div>

        <div className="text-[16px] lg:text-[20px] tracking-normal mb-8 max-[531px]:mb-2 pt-7 max-[531px]:pt-3 
        max-[320px]:text-[13px] max-[320px]:pt-2 max-[320px]:mb-3
        ">
          <p>Площадка для прямых отношений между спикерами и их заказчиками</p>
        </div>
        <h2
          className="
            text-[40px] lg:text-[57px] xl:text-[81px]
            leading-[2.5rem] lg:leading-[3.5rem] xl:leading-[4.5rem]
            font-bold
            mb-6 lg:mb-8 max-[320px]:mb-4
          "
        >
          СПИКЕРЫ
          <br className="hidden lg:block" /> БЕЗ ПОСРЕДНИКОВ
        </h2>

        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
        >
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 
                      lg:flex lg:flex-row lg:gap-x-10 
                      w-full justify-start text-[#1B1B1E] 
                      text-[14px] lg:text-[16px] font-bold"
          >
            {[
              `КОНТАКТЫ СПИКЕРОВ`,
              `БЫСТРЫЙ ПОИСК СПИКЕРОВ`,
              `ПРОВЕРЕННЫЕ СПИКЕРЫ`,
              `НОВЫЕ СПИКЕРЫ`,
            ].map((li, id) => (
              <li
                key={id}
                className="flex flex-col items-start w-full lg:w-1/4"
              >
                <div
                  className="h-[6px] w-[40px] bg-[#a786df] mb-2"
                ></div>
                <p dangerouslySetInnerHTML={{ __html: li }}></p>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}

export default SecondScreen;
