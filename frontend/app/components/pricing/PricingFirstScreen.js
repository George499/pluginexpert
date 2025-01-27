"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";

function PricingFirstScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
      className={` flex content-center justify-center items-center flex-col bg-[url('/images/bkground_1.png')] bg-fixed relative bg-cover `}
      id="second screen"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 items-start justify-center font-semibold mt-[200px]">
        {/* <div
          className=" w-[51px] h-[12px] mb-[21px]"
          style={{ backgroundColor: "#a786df" }}
        ></div> */}
        <div className="mb-8 text-[40px] lg:text-[57px] xl:text-[81px] text-white">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">
            РАЗМЕСТИТЬ АНКЕТУ
          </p>
        </div>

        <div className="text-[16px] lg:text-[20px] tracking-normal mb-8 pt-7 text-white">
          <p>Размещение анкеты на ресурсе </p>
        </div>
        <div className="mb-[30px] text-[40px] lg:text-[57px] xl:text-[81px] text-[#1B1B1E]">
          <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] text-white">
            PLUGIN
          </p>
          <div className="tracking-tighter leading-[4.5rem] lg:flex ">
            <p className="-mb-[30px] lg:-mb-[10px]">SPEAKERS</p>
            <p className="tracking-tighter leading-[4.5rem] lg:ml-5">
              ACCELERATOR
            </p>
          </div>
        </div>
        <div className="text-[16px] lg:text-[20px] tracking-normal mb-8 pt-7  text-white">
          <p>Преимущества размещения анкеты на Plug-In Speakers Accelerator</p>
        </div>

        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold pt-7`}
        >
          <ul
            className={`grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold`}
          >
            {[
              `Увеличение заказов`,
              `Без агентств`,
              `Прямой контакт с клиентом`,
            ].map((li, id) => (
              <div className="flex lg:w-1/2" key={id}>
                <li className="w-1/2 lg:w-3/4 mb-8 lg:mb-0 uppercase">
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

export default PricingFirstScreen;
