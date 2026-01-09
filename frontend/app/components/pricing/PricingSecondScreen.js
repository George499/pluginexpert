"use client";

import Link from "next/link";
import useIntersectionObserver from "../../utils/useIntersectionObserver";

function PricingSecondScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
      className="h-full flex flex-col items-center justify-center bg-[#f0f0f0] text-[#1B1B1E]"
      id="second-screen"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-12 lg:my-20 items-start justify-center font-semibold">
        {/* маленький штрих */}
        <div className="w-[51px] h-[12px] mb-[15px] lg:mb-[21px] bg-[#a786df]" />

        {/* заголовок */}
        <div
              className="
                mb-6 lg:mb-8 max-[320px]:mb-4
                text-[32px] max-[450px]:text-[24px] lg:text-[57px] xl:text-[81px]
                uppercase heading-line
              "
            >
              <p className="leading-[1.8rem] lg:leading-[4.5rem]">
                СТОИМОСТЬ
              </p>
              <p className="leading-[1.8rem] lg:leading-[4.5rem]">
                РАЗМЕЩЕНИЯ
              </p>
        </div>

        {/* список преимуществ */}
        <div className="text-[15px] max-[450px]:text-[14px] lg:text-[20px] tracking-normal mb-6">
          <p>Разместив анкету вы получаете:</p>
          <ul className="list-disc pl-5 list-inside pt-3.5 space-y-2">
            {[
              "Рост числа обращений",
              "Продвижение в поисковых сетях",
              "Самостоятельное обновление информации в анкете",
              "Прямую коммуникацию с клиентом / заказчиком",
              "Заказы без комиссий",
            ].map((li, index) => (
              <li key={index}>{li}</li>
            ))}
          </ul>
        </div>

        {/* подзаголовок */}
        <div className="text-[15px] max-[450px]:text-[14px] lg:text-[20px] tracking-normal mb-8 lg:mb-14">
          <p>Три тарифа в зависимости от длительности размещения</p>
        </div>

        {/* тарифы */}
        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-8 w-full justify-start text-[14px] lg:text-[16px] font-bold mb-8`}
        >
          {[
            { period: "3 МЕСЯЦА", price: "4 000" },
            { period: "6 МЕСЯЦЕВ", price: "6 000" },
            { period: "10 МЕСЯЦЕВ", price: "12 000" },
          ].map((item, idx) => (
            <div key={idx} className="w-full lg:w-1/3 flex flex-col items-start">
              <div className="h-[6px] w-[40px] bg-[#a786df] mb-2" />
              <p className="uppercase mb-3">{item.period}</p>
              <p className="text-[#a786df] text-[18px] lg:text-[22px] font-semibold">
                {item.price}
              </p>
            </div>
          ))}
        </div>

        {/* кнопка */}
        <div className="w-full flex justify-center">
          <Link
            href="/auth/register"
            className="w-full lg:w-[293px] text-center font-semibold uppercase p-4 text-[18px] lg:text-[20px] text-white bg-[#3742a3] hover:bg-[#1d2357] duration-300 block no-underline"
          >
            СОЗДАТЬ АНКЕТУ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PricingSecondScreen;
