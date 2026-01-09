"use client";

import { useState } from "react";
import { 
  FaTelegram, 
  FaWhatsapp, 
  FaFacebook, 
  FaVk, 
  FaInstagram, 
  FaLinkedin, 
  FaOdnoklassniki, 
  FaEnvelope, 
  FaPhone,
} from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";

function SpeakerContacts({ speaker }) {
  const [isContactsVisible, setIsContactsVisible] = useState(false);
  const handleClick = () => setIsContactsVisible(!isContactsVisible);

  // Социальные сети спикера
  const socials = [
    { 
      name: "telegram", 
      icon: <FaTelegram className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.telegram ? `https://t.me/${speaker.telegram.replace('@', '')}` : null
    },
    { 
      name: "whatsapp", 
      icon: <FaWhatsapp className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.whatsapp ? `https://wa.me/${speaker.whatsapp.replace(/\D/g, '')}` : null
    },
    { 
      name: "facebook", 
      icon: <FaFacebook className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.facebook
    },
    { 
      name: "vk", 
      icon: <FaVk className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.vk
    },
    { 
      name: "instagram", 
      icon: <FaInstagram className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.instagram
    },
    { 
      name: "linkedin", 
      icon: <FaLinkedin className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.linkedin
    },
    { 
      name: "ok", 
      icon: <FaOdnoklassniki className="text-white w-[30px] h-[30px] cursor-pointer" />,
      url: speaker.ok
    }
  ].filter(social => social.url); // Фильтруем только социальные сети, которые указаны у спикера

  return (
    <div
      className="bg-fixed h-full flex flex-col items-center relative bg-[url('/images/bkground_1.png')]"
      id="contacts"
    >
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center my-10 lg:my-[81px]">
        <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
        <h1 className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white font-bold mb-[57px]">
          КОНТАКТЫ СПИКЕРА
        </h1>
        <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-normal">
          <p className="mb-[46px]">
            Вас заинтересовал спикер {speaker.Name}? <br />
            Хотите привлечь данного спикера к обучению своих сотрудников или
            позвать на корпоративное мероприятие?
            <br />
           
            Свяжитесь со спикером напрямую
           и обсудите детали привлечения
            спикера в соответствии с вашим запросом.
          </p>

          {isContactsVisible ? (
            <div className="p-6 bg-[#42484D] rounded-lg shadow-lg text-[20px] tracking-normal grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Левая колонка — спикер */}
  <div>
    <p className="mb-4 font-bold uppercase">КОНТАКТЫ СПИКЕРА</p>
    {speaker.email && (
      <div className="flex items-center gap-3 mb-4">
        <FaEnvelope className="text-white w-[25px] h-[25px]" />
        <a href={`mailto:${speaker.email}`} className="hover:text-blue-300 transition-colors duration-200">
          {speaker.email}
        </a>
      </div>
    )}
    {speaker.tel && (
      <div className="flex items-center gap-3 mb-4">
        <FaPhone className="text-white w-[25px] h-[25px]" />
        <a href={`tel:${speaker.tel}`} className="hover:text-blue-300 transition-colors duration-200">
          {speaker.tel}
        </a>
      </div>
    )}

    {socials.length > 0 && (
      <div>
        <p className="mb-3">Социальные сети спикера:</p>
        <div className="flex flex-row items-center gap-4 flex-wrap">
          {socials.map((social, index) => (
            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" 
               className="hover:opacity-80 transition-opacity duration-200">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Правая колонка — агентство */}
  <div>
    <p className="mb-4 font-bold uppercase">КОНТАКТЫ АГЕНТСТВА</p>
    <div className="flex items-center gap-3 mb-4" id="contacts">
      <FaEnvelope className="text-white w-[25px] h-[25px]" />
      <a href="mailto:mailto:hello@pluginexpert.ru" className="hover:text-blue-300 transition-colors duration-200">
        hello@pluginexpert.ru
      </a>
    </div>
    <div className="flex items-center gap-3 mb-4">
      <FaPhone className="text-white w-[25px] h-[25px]" />
      <a href="tel:+79153857591" className="hover:text-blue-300 transition-colors duration-200">
        +7 (915) 385-75-91
      </a>
    </div>

    <p className="mb-3">Социальные сети агентства:</p>
    <div className="flex flex-row items-center gap-4">
      <a href="https://wa.me/+79153857591" className="hover:opacity-80 transition-opacity duration-200">
        <RiWhatsappFill
                               className={`w-[35px] h-[35px] cursor-pointer text-[#fffffe]`}
         />
      </a>
      <a href="https://t.me/+79153857591" className="hover:opacity-80 transition-opacity duration-200">
        <FaTelegram className="w-[30px] h-[30px] cursor-pointer ml-3 text-[#fffffe]" />
      </a>
    </div>
  </div>
</div>

          ) : (
            <button
              onClick={handleClick}
              className="bg-[#42484D] hover:bg-[#3742a3] lg:w-[293px] lg:h-[61px] text-white text-[20px] font-semibold uppercase duration-300 p-4 text-center rounded shadow-lg hover:shadow-xl"
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