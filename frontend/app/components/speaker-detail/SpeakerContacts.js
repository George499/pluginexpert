"use client";

import { FaTelegram } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { useState } from "react";

function SpeakerContacts({ speaker }) {
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const handleClick = () => setIsContactsVisible(!isContactsVisible);
  return (
    <div
      className="bg-fixed h-full flex flex-col items-center relative bg-[url('/images/bkground_1.png')]"
      id="contacts"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center my-10 lg:my-[81px] ">
        <div className="w-[51px] h-[12px] mb-[21px] bg-white "></div>
        <h1 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white font-bold mb-[57px]">
          {speaker.Name}
        </h1>
        <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold">
          <p className="mb-[46px]">
            Вас заинтересовал спикер {speaker.Name}? <br />
            Хотите привлечь данного спикера к обучению своих сотрудников или
            позвать на корпоративное мероприятие?
            <br />
            Свяжитесь с нами и мы обсудим детали привлечения спикера в
            соответствии с вашим запросом.
          </p>

          {isContactsVisible ? (
            <div className=" text-[20px] tracking-normal   ">
              <p>Пишите: want@pluginagency.ru</p>
              <p className="mb-4 hidden lg:block">
                Звоните: +7 (965) 246 9191{" "}
              </p>
              <div className="mb-4 flex">
                <p className="lg:hidden ">Звоните:</p>
                <a className="block lg:hidden" href="tel:+7 (965) 246 9191">
                  +7 (965) 246 9191
                </a>
              </div>

              <div className="flex flex-row items-center">
                <a href="https://wa.me/+79652469191">
                  <RiWhatsappFill className="text-white w-[35px] h-[35px] cursor-pointer" />
                </a>
                <a href="https://t.me/+79652469191">
                  <FaTelegram className="text-white w-[30px] h-[30px] cursor-pointer ml-3" />
                </a>
              </div>
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="bg-[#42484D] hover:bg-[#3742a3] lg:w-[293px] lg:h-[61px] text-white text-[20px] font-semibold uppercase duration-300 p-4 text-center"
            >
              Показать контакты
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeakerContacts;
