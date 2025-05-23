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
  FaPhone 
} from "react-icons/fa";

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
        <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold">
          <p className="mb-[46px]">
            Вас заинтересовал спикер {speaker.Name}? <br />
            Хотите привлечь данного спикера к обучению своих сотрудников или
            позвать на корпоративное мероприятие?
            <br />
            Свяжитесь со спикером напрямую и обсудите детали привлечения
            спикера в соответствии с вашим запросом.
          </p>

          {isContactsVisible ? (
            <div className="p-6 bg-[#42484D] rounded-lg shadow-lg text-[20px] tracking-normal">
              {/* Контакты спикера */}
              {speaker.email && (
                <div className="flex items-center gap-3 mb-4">
                  <FaEnvelope className="text-white w-[25px] h-[25px]" />
                  <a 
                    href={`mailto:${speaker.email}`} 
                    className="hover:text-blue-300 transition-colors duration-200"
                  >
                    {speaker.email}
                  </a>
                </div>
              )}
              
              {speaker.tel && (
                <div className="flex items-center gap-3 mb-4">
                  <FaPhone className="text-white w-[25px] h-[25px]" />
                  <a 
                    href={`tel:${speaker.tel}`} 
                    className="hover:text-blue-300 transition-colors duration-200"
                  >
                    {speaker.tel}
                  </a>
                </div>
              )}
              
              {/* Общая контактная информация */}
              <div className="mt-6 mb-4">
                <p>Или обращайтесь в агентство:</p>
                <p className="my-2">Email: <a href="mailto:want@pluginagency.ru" className="hover:text-blue-300 transition-colors duration-200">want@pluginagency.ru</a></p>
                <p className="mb-4 hidden lg:block">Телефон: <a href="tel:+79652469191" className="hover:text-blue-300 transition-colors duration-200">+7 (965) 246 9191</a></p>
                <div className="mb-4 flex lg:hidden">
                  <p className="mr-2">Телефон:</p>
                  <a className="hover:text-blue-300 transition-colors duration-200" href="tel:+79652469191">
                    +7 (965) 246 9191
                  </a>
                </div>
              </div>

              {/* Социальные сети */}
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
              
              {/* Агентские соцсети */}
              <div className="mt-6">
                <p className="mb-3">Социальные сети агентства:</p>
                <div className="flex flex-row items-center gap-4">
                  <a href="https://wa.me/+79652469191" className="hover:opacity-80 transition-opacity duration-200">
                    <FaWhatsapp className="text-white w-[30px] h-[30px] cursor-pointer" />
                  </a>
                  <a href="https://t.me/+79652469191" className="hover:opacity-80 transition-opacity duration-200">
                    <FaTelegram className="text-white w-[30px] h-[30px] cursor-pointer" />
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