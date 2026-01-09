"use client";

import useIntersectionObserver from "../../utils/useIntersectionObserver";
import Link from "next/link";

function PricingFirstScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  return (
    <div
  className="flex flex-col items-center justify-center bg-[url('/images/bkground_1.png')] bg-fixed bg-cover relative"
  id="first-screen"
>
  <div className="container flex flex-col w-4/5 lg:w-2/3 my-20 items-start justify-center font-semibold mt-[120px]">
  {/* Хлебные крошки */}
      <nav className="text-sm text-gray-200 mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-white text-white/80">
              Главная
            </Link>
          </li>
          <li className="text-white/50">/</li>
          <li className="text-white">Разместить анкету</li>
        </ol>
      </nav>
    {/* Маленький белый штрих перед заголовком */}
    <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>

    {/* Заголовок */}
    <div className="text-white mb-6 text-[32px] lg:text-[57px] xl:text-[81px] uppercase">
  {/* для экранов до 500px — всё в одну строку */}
  <h1 className="block min-[631px]:leading-[4.5rem] max-[630px]:leading-[1.8rem] max-[450px]:hidden">
    Преимущества размещения
  </h1>

  {/* для экранов от 501px — две строки */}
  <div className="hidden max-[450px]:text-[24px] max-[450px]:flex flex-col leading-[1.8rem]">
    <p>Преимущества</p>
    <p>размещения</p>
  </div>
</div>

    {/* Список преимуществ */}
    <div
        className="
          grid grid-cols-1 sm:grid-cols-2
          gap-x-8 gap-y-8
          w-full
          text-white text-[14px] lg:text-[16px] font-bold
        "
      >
        {[
          "Быстрое создание анкеты",
          "Увеличение заказов",
          "Без агентств",
          "Прямой контакт с клиентом",
        ].map((li, id) => (
          <div key={id} className="flex flex-col items-start">
            <div className="h-[6px] w-[40px] bg-[#a786df] mb-2" />
            <p className="uppercase">{li}</p>
          </div>
        ))}
    </div>
  </div>
</div>

  );
}

export default PricingFirstScreen;
