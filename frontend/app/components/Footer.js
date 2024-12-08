"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";
import { useRouter } from "next/navigation"; // обновленный импорт
import Link from "next/link"; // добавляем Link

function Footer() {
  const router = useRouter();
  const iconClass =
    "w-[34px] h-[34px] mr-[7px] p-1 cursor-pointer hover:text-slate-300";

  return (
    <footer className="h-[100px] lg:h-[145px] bg-[#2f2e2e] flex content-center justify-center items-center flex-col w-full">
      <div className="container flex flex-row w-4/5 lg:w-2/3 h-full items-center justify-between font-play text-[16px] lg:text-[20px] font-normal text-white">
        <div>
          <p className="flex flex-col">
            <span className="flex">
              <span className="hidden lg:flex">
                © {new Date().getFullYear()}
              </span>
              <span className="ml-5"> PLUG-IN SOLUTIONS</span>
            </span>
          </p>
        </div>

        <ul className="text-[20px] flex">
          <li className="mr-5">
            <Link
              href="/speakers/forSpeekers"
              className="cursor-pointer hover:text-slate-300"
            >
              СПИКЕРАМ – РАЗМЕСТИТЬ АНКЕТУ
            </Link>
          </li>
          <li>
            <Link
              href="/speakers/blog"
              className="cursor-pointer hover:text-slate-300"
            >
              БЛОГ
            </Link>
          </li>
        </ul>

        {/* <div>
          <p className="hidden lg:flex">Подпишитесь на нас в соцсетях:</p>
          <nav className="flex flex-row">
            <FaInstagram className={iconClass} />
          </nav>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;
