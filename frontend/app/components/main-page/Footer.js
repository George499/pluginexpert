"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaDownload
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#2f2e2e] text-white pt-4 pb-4">
      <div
        className="
          container w-4/5 lg:w-2/3 mx-auto
          flex justify-between items-start gap-8
          max-[600px]:w-11/12 max-[600px]:flex-col max-[600px]:gap-6
        "
      >
        {/* Блок 1 — бренд + почта */}
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[16px] lg:text-[20px] font-normal">
            <span className="hidden lg:inline">© {year}</span>
            <span>PLUG-IN SOLUTIONS</span>
          </p>
          <a
            href="mailto:hello@pluginexpert.ru"
            className="block mt-2 text-[14px] text-blue-300 hover:underline break-all"
          >
            hello@pluginexpert.ru
          </a>
          <a
            href="tel:+79153857591"
            className="block mt-2 text-[14px] text-blue-300 hover:underline"
          >
            Звоните: +7 (915) 385-75-91
          </a>
        </div>

        {/* Блок 2 — навигация */}
        <nav
          className="
            flex flex-col gap-3
            text-[14px] lg:text-[16px] font-normal
            whitespace-normal break-words
            max-[600px]:w-full
          "
        >
          <Link
            href="https://pluginexpert.ru/pricing"
            className="hover:text-slate-300 leading-snug"
          >
            СПИКЕРАМ – РАЗМЕСТИТЬ АНКЕТУ
          </Link>
          <Link href="/speakers/blog" className="hover:text-slate-300">
            БЛОГ
          </Link>

          {/* Ссылки на документы */}
        <div className="flex flex-col gap-2 text-[14px]">
          <div className="flex items-center gap-2">
            <a
              href="/docs/Политика_конфиденциальности_ИП_Гузановский.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Политика конфиденциальности
            </a>
            <a
              href="/docs/Политика_конфиденциальности_ИП_Гузановский.docx"
              download
              className="text-blue-300 hover:text-blue-400"
              title="Скачать DOCX"
            >
              <FaDownload />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/docs/Пользовательское_соглашение.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Пользовательское соглашение
            </a>
            <a
              href="/docs/Пользовательское_соглашение.docx"
              download
              className="text-blue-300 hover:text-blue-400"
              title="Скачать DOCX"
            >
              <FaDownload />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/docs/Согласие на публикацию фото.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Согласие на публикацию фото
            </a>
            <a
              href="/docs/Согласие на публикацию фото.docx"
              download
              className="text-blue-300 hover:text-blue-400"
              title="Скачать DOCX"
            >
              <FaDownload />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/docs/Согласие_на_обработку_ПД.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Согласие на обработку ПД
            </a>
            <a
              href="/docs/Согласие_на_обработку_ПД.docx"
              download
              className="text-blue-300 hover:text-blue-400"
              title="Скачать DOCX"
            >
              <FaDownload />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/docs/Согласие_на_обработку_ПД_для_рассылки.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Согласие на обработку ПД (рассылка)
            </a>
            <a
              href="/docs/Согласие_на_обработку_ПД_для_рассылки.docx"
              download
              className="text-blue-300 hover:text-blue-400"
              title="Скачать DOCX"
            >
              <FaDownload />
            </a>
          </div>
        </div>


        </nav>

        {/* Блок 3 — реквизиты */}
        <div
          className="
            text-[14px] lg:text-[16px] leading-6
            max-[600px]:w-full
          "
        >
          <p className="font-semibold">ИП ГУЗАНОВСКИЙ АЛЕКСЕЙ СТАНИСЛАВОВИЧ</p>
          <p>Расчётный счёт: 40802810940000416321</p>
          <p>ИНН: 772705597288</p>
          <p>ОГРНИП: 323774600074372</p>
          <p>Банк: ПАО Сбербанк</p>
          <p>БИК: 044525225</p>
          <p>Кор. счёт: 30101810400000000225</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
