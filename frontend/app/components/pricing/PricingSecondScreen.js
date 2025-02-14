"use client";

import Link from "next/link";
import useIntersectionObserver from "../../utils/useIntersectionObserver";

function PricingSecondScreen() {
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
            <p className="-mb-[30px] lg:-mb-[10px]">РАЗМЕЩЕНИЯ</p>
          </div>
        </div>
        <div className="text-[16px] lg:text-[20px] tracking-normal  ">
          <p>Разместив анкету вы получаете:</p>
          <ul className="list-disc pl-5 list-inside pt-3.5 mb-4">
            {[
              "Рост числа обращений",
              "Продвижение в поисковых сетях",
              "Самостоятельное обновления информации в анкете",
              "Прямую коммуникацию с клиентом / заказчиком",
              "Заказы без комиссий",
            ].map((li, index) => (
              <li key={index}>{li}</li>
            ))}
          </ul>
        </div>

        <div className="text-[16px] lg:text-[20px] tracking-normal mb-14 pt-7 ">
          <p>Три тарифа в зависимости от длительности размещения </p>
        </div>

        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold mb-8`}
        >
          <ul
            className={`w-full grid grid-cols-2 lg:flex lg:flex-row justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
          >
            <li className=" w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className=" mb-[30px] lg:-mb-[5px] ">3 МЕСЯЦА</p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">4 000</p>
              </div>
            </li>
            <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className=" mb-[30px] lg:-mb-[5px] ">6 МЕСЯЦЕВ</p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">6 000</p>
              </div>
            </li>
            <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0 mr-8">
              <div
                className={`h-[8px] w-2/5 lg:w-1/6 mb-[25px]`}
                style={{ backgroundColor: "#a786df" }}
              ></div>
              <p className=" mb-[30px] lg:-mb-[5px] ">10 МЕСЯЦЕВ</p>
              <div className="tracking-tighter leading-[4.5rem] lg:flex ">
                <p className="-mb-[30px] lg:-mb-[10px] text-[#a786df]">
                  12 000
                </p>
              </div>
            </li>
          </ul>
        </div>
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
      </div>
    </div>
  );
}

export default PricingSecondScreen;
