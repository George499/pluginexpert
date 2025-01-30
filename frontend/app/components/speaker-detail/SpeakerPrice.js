"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";

function SpeakerPrice({ speaker }) {
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
            <p className="-mb-[30px] lg:-mb-[10px]">УСЛУГ</p>
          </div>
        </div>
        <div
          ref={ref}
          className={`${
            isVisible ? "animate-fadeIn" : ""
          } grid grid-cols-2 lg:flex lg:flex-row w-full justify-start text-[#1B1B1E] text-[14px] lg:text-[16px] font-bold mb-8`}
        >
          <div className="mb-14 text-[40px] lg:text-[57px] xl:text-[81px]">
            <p className="leading-[4.5rem] mb-[30px] lg:-mb-[5px] ">1 СЕССИЯ</p>
            <div className="tracking-tighter leading-[4.5rem] lg:flex text-[#a786df] ">
              <p className="-mb-[30px] lg:-mb-[10px]">{speaker.Price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakerPrice;
