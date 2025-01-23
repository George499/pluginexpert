"use client";

import Link from "next/link";
import useIntersectionObserver from "../../utils/useIntersectionObserver";

function PricingSecondScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
      className={`h-full flex content-center justify-center items-center flex-col`}
      style={{ backgroundColor: "#f0f0f0" }}
      id="second screen"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 items-start justify-center font-semibold">
        <div
          className=" w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div>
        <div className="mb-8x] text-[40px] lg:text-[57px] xl:text-[81px]">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">СТОИМОСТЬ</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px]">РАЗМЕЩЕНИЯ</p>
          </div>
        </div>

        <div className="text-[16px] lg:text-[20px] tracking-normal mb-8 pt-7 ">
          <p>Три тарифа в зависимости от длительности размещения </p>
        </div>

        {/* <div className="mb-8x] text-[40px] lg:text-[57px] xl:text-[81px] mb-8">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">3 МЕСЯЦА</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">3 000 </p>
          </div>
        </div>
        <div className="mb-8x] text-[40px] lg:text-[57px] xl:text-[81px] mb-8">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">6 МЕСЯЦЕВ</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">5 000 </p>
          </div>
        </div>
        <div className="mb-8x] text-[40px] lg:text-[57px] xl:text-[81px] mb-8">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">12 МЕСЯЦЕВ</p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">12 000 </p>
          </div>
        </div> */}

        <div className="container flex flex-col h-full justify-center items-center">
          <Link
            href="/all-speakers"
            className="
            w-full
            lg:w-[293px]
            lg:h-auto
            text-center
            font-semibold
            uppercase
            mb-[57px]
            p-4
            text-[20px]
            text-[#fffffe]
            bg-[#3742a3]
            hover:bg-[#1d2357]
            duration-300
            block
            no-underline
          "
          >
            СОЗДАТЬ АНКЕТУ
          </Link>
        </div>

        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
        >
          <ul
            className={`grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
          >
            <li className=" w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">
                3 МЕСЯЦА
              </p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">3 000</p>
              </div>
            </li>
            <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">
                6 МЕСЯЦЕВ
              </p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">5 000</p>
              </div>
            </li>
            <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">
                12 МЕСЯЦЕВ
              </p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">
                  12 000
                </p>
              </div>
            </li>
            {/* {[
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
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PricingSecondScreen;
