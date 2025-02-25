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
    <footer className="min-h-[100px] lg:min-h-[145px] bg-[#2f2e2e] flex content-center justify-center items-center flex-col w-full pt-4">
      <div className="container flex flex-row w-4/5 lg:w-2/3 h-full  justify-between font-play text-[16px] lg:text-[20px] font-normal text-white items-start">
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
              className="cursor-pointer hover:text-slate-300 "
            >
              СПИКЕРАМ – РАЗМЕСТИТЬ АНКЕТУ
            </Link>
            <div className="text-justify flex flex-col text-[14px] mt-6">
     <p>ИП ГУЗАНОВСКИЙ АЛЕКСЕЙ СТАНИСЛАВОВИЧ </p> 
	<p>Расчётный счёт: 40802810940000416321</p>
	<p>ИНН: 772705597288</p>
	<p>ОГРНИП: 323774600074372</p>
	<p>Банк: ПАО Сбербанк</p>
	<p>БИК: 044525225</p>
	<p>Кор. счёт: 30101810400000000225</p>
	
  </div>
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
