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
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 items-start justify-center font-semibold">
        <div
          className=" w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div>
        <div className="mb-8 text-[40px] lg:text-[57px] xl:text-[81px] ">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">PLUGIN</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px]">SPEAKERS</p>
            <p className="tracking-tighter leading-[4.5rem] lg:ml-5">
              ACCELERATOR
            </p>
          </div>
        </div>

        <div className="text-[16px] lg:text-[20px] tracking-normal mb-8 pt-7 ">
          <p>Площадка для прямых отношений между спикерами их их заказчиками</p>
        </div>
        <h2 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[4.5rem] font-bold mb-8">
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
            className={`grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
          >
            {[
              `КОНТАКТЫ СПИКЕРОВ`,
              `БЫСТРЫЙ ПОИСК СПИКЕРОВ`,
              `ПРОВЕРЕННЫЕ СПИКЕРЫ`,
              `НОВЫЕ СПИКЕРЫ`,
            ].map((li, id) => (
              <div className="flex lg:w-1/2" key={id}>
                <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0">
                  <div
                    className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                    style={{ backgroundColor: "#a786df" }}
                  ></div>
                  <p dangerouslySetInnerHTML={{ __html: li }}></p>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SecondScreen;
