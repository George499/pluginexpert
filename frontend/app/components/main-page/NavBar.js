import Link from "next/link";

function NavBar({ handleClick }) {
  const liStyles =
    "px-2.5 leading-9 hover:text-gray-300 transition ease-in duration:400 cursor-pointer text-[13px]";
  return (
    <>
      <nav className="z-20">
        <ul className="hidden lg:flex text-white uppercase text-base ">
          <Link href="/all-speakers">
            <li onClick={(e) => handleClick(e)} className={liStyles}>
              Спикеры
            </li>
          </Link>
          <Link href="/pricing">
            <li onClick={(e) => handleClick(e)} className={liStyles}>
              Разместиться
            </li>
          </Link>
          <li className={liStyles}>
            <Link href="/blog">Блог</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
