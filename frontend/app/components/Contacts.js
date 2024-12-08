"use client";

import { FaTelegram } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { useState } from "react";

const Contacts = () => {
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const handleClick = () => setIsContactsVisible(!isContactsVisible);

  return (
    <div
      className="bg-fixed flex flex-col relative bg-[url('/images/bkground_1.png')]"
      id="contacts"
    >
      <div className="flex content-center justify-center items-center flex-col ">
        <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center pt-[81px] font-semibold ">
          <div className="w-[51px] h-[12px] mb-[21px] bg-[#fffffe]"></div>
          <h2 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[3.5rem] lg:leading-[4.5rem] font-bold mb-[57px] text-[#fffffe]">
            СВЯЖИТЕСЬ
            <br /> С НАМИ
          </h2>
          <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold mb-[57px]">
            <p>ДЛЯ РАЗМЕЩЕНИ АНКЕТЫ НА НАШЕМ РЕСУРСЕ – СВЯЖИТЕСЬ С НАМИ</p>
          </div>
          <div className="container flex flex-col h-full justify-center ">
            {isContactsVisible ? (
              <div className="text-black text-[20px] tracking-normal mb-[81px]">
                <p>Пишите: want@pluginagency.ru</p>
                <p className="mb-[57px] hidden lg:block">
                  Звоните: +7 (965) 246 9191{" "}
                </p>
                <div className="mb-4 flex">
                  <p className="lg:hidden ">Звоните:</p>
                  <a className="block lg:hidden" href="tel:+7 (965) 246 9191">
                    +7 (965) 246 9191
                  </a>
                </div>

                <div className="flex flex-raw items-center">
                  <a href="https://wa.me/+79652469191">
                    <RiWhatsappFill
                      className={` w-[35px] h-[35px] cursor-pointer text-[#fffffe]`}
                    />
                  </a>
                  <a href="https://t.me/+79652469191">
                    <FaTelegram className="w-[30px] h-[30px] cursor-pointer ml-3 text-[#fffffe]" />
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClick}
                className="lg:w-[293px] lg:h-[61px] text-white text-[20px] font-semibold uppercase duration-300 p-4 text-center mb-[57px] bg-[#3742a3] hover:bg-[#1d2357] text-[#fffffe]"
              >
                Показать контакты
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
