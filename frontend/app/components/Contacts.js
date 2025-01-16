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
      <div className="flex content-center justify-center items-center flex-col">
        <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center py-[81px] font-semibold">
          <div className="w-[51px] h-[12px] mb-[21px] bg-[#fffffe]"></div>
          <h2 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[3.5rem] lg:leading-[4.5rem] font-bold mb-[57px] text-[#fffffe]">
            СВЯЖИТЕСЬ
            <br /> С НАМИ
          </h2>
          <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold mb-[57px]">
            <p>ДЛЯ РАЗМЕЩЕНИЯ АНКЕТЫ НА НАШЕМ РЕСУРСЕ – СВЯЖИТЕСЬ С НАМИ</p>
          </div>

          {/* Блоки в строку */}
          <div className="flex flex-col lg:flex-row w-full justify-between items-start  gap-6">
            {/* Блок 1: Размещение анкет */}
            <div className="flex flex-col items-start">
              <h3 className="text-[20px] lg:text-[24px] font-bold text-[#fffffe] mb-3">
                РАЗМЕЩЕНИЯ АНКЕТЫ
              </h3>
              <button
                onClick={() => (window.location.href = "/pricing")} // Переход на страницу со стоимостями
                className="lg:w-[200px] lg:h-[50px] text-white text-[18px] font-semibold uppercase duration-300 p-3 text-center bg-[#3742a3] hover:bg-[#1d2357] text-[#fffffe]"
              >
                Подробнее
              </button>
            </div>

            {/* Блок 2: Вопросы и предложения */}
            <div className="flex flex-col items-start">
              <h3 className="text-[20px] lg:text-[24px] font-bold text-[#fffffe] mb-3">
                ВОПРОСЫ И ПРЕДЛОЖЕНИЯ
              </h3>
              {isContactsVisible ? (
                <div className="text-black text-[20px] tracking-normal">
                  <p>Пишите: want@pluginagency.ru</p>
                  <p className="hidden lg:block">Звоните: +7 (965) 246 9191</p>
                  <div className="mb-4 flex">
                    <p className="lg:hidden">Звоните:</p>
                    <a className="block lg:hidden" href="tel:+7 (965) 246 9191">
                      +7 (965) 246 9191
                    </a>
                  </div>
                  <div className="flex flex-raw items-center">
                    <a href="https://wa.me/+79652469191">
                      <RiWhatsappFill
                        className={`w-[35px] h-[35px] cursor-pointer text-[#fffffe]`}
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
                  className="lg:w-[200px] lg:h-[50px] text-white text-[18px] font-semibold uppercase duration-300 p-3 text-center bg-[#3742a3] hover:bg-[#1d2357] text-[#fffffe]"
                >
                  Связаться
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
