import { FaTelegram } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { useState } from "react";

function SpeakerContacts() {
  return (
    <div
      className="bg-fixed h-full flex flex-col items-center relative bg-[url('/images/bkground_1.png')]"
      id="contacts"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center my-10 ">
        <div className="w-[51px] h-[12px] bg-white mb-[57px]"></div>
        {/* <h1
          className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white font-bold mb-[57px]"
          dangerouslySetInnerHTML={{ __html: speekerContactsTitle }}
        ></h1> */}
        <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold">
          <p className="mb-[46px]">
            Хотите получать больше заказов на ваши образовательные услуги?
            Хотите получать прямые заказы от клиентов? Хотите работать без
            посредников? Тогда разместите анкету на нашем ресурсе
          </p>

          <div className="flex flex-col items-start">
            <button
              onClick={() => (window.location.href = "/pricing")} // Переход на страницу со стоимостями
              className="lg:w-[293px] lg:h-[61px] text-[18px] font-semibold uppercase duration-300 p-3 text-center bg-[#42484D] hover:bg-[#3742a3] text-[#fffffe]"
            >
              РАЗМЕСТИТЬ АНКЕТУ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakerContacts;
