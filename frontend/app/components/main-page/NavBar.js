import Link from "next/link";

function NavBar({ handleClick }) {
  const liStyles =
    "px-2.5 leading-9 hover:text-gray-300 transition ease-in duration:400 cursor-pointer text-[13px]";
  return (
    <>
      <nav className="z-20">
        <ul className="hidden lg:flex text-white uppercase text-base ">
          <li
            data-to="process"
            onClick={(e) => handleClick(e)}
            className={liStyles}
          >
            Процесс
          </li>
          <li className="relative px-2.5 leading-9 text-[13px] group">
            <p
              onClick={(e) => handleClick(e)}
              data-to="speekers"
              className="cursor-pointer hover:text-gray-300 transition ease-in duration:400 text-[13px]"
            >
              Спикеры
            </p>

            <Link
              href="/all-categories/all-categories"
              className="absolute w-[120px] -right-[15px] cursor-pointer hover:text-gray-300 hidden group-hover:block "
            >
              Все спикеры
            </Link>
          </li>

          <li
            onClick={(e) => handleClick(e)}
            data-to="production"
            className={liStyles}
          >
            Продакшн
          </li>
          <li className={liStyles}>
            <Link href="/forSpeekers">Спикерам</Link>
          </li>

          <li
            onClick={(e) => handleClick(e)}
            data-to="contacts"
            className={liStyles}
          >
            Контакты
          </li>

          <li className={liStyles}>
            <Link href="/blog">Блог</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
