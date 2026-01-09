"use client";
import { useRouter } from "next/navigation";
import useIntersectionObserver from "../../utils/useIntersectionObserver";

function ThirdScreen() {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <div id="process" className="bg-[#42484d] bg-fixed">
  <div
    className="
      container mx-auto
      w-4/5 lg:w-2/3
      py-12 lg:py-20
      max-[600px]:px-4
      font-semibold text-[#f0f0f0]
    "
  >
    <div className="w-[51px] h-[12px] mb-4 lg:mb-6 bg-[#a786df]" />

    {/* Заголовок — ужимаем на узких, чтобы не вываливался */}
    <h2
      className="
         font-bold
          text-[32px] sm:text-[36px] lg:text-[57px] xl:text-[81px]
          leading-[2.4rem] sm:leading-[2.8rem] lg:leading-[4.5rem]
          mb-2 lg:mb-8
          break-words
          max-[450px]:text-[24px] max-[450px]:leading-[2rem]
          whitespace-normal break-keep
      "
    >
      НАЙДИТЕ СПИКЕРА САМОСТОЯТЕЛЬНО
    </h2>

    {/* Текстовый блок */}
    <div className="text-[16px] lg:text-[20px] tracking-normal pt-6 mb-6">
      <p className="mb-4">
        PLUG-IN SPEAKERS ACCELERATOR — ресурс по самостоятельному подбору спикеров.
      </p>

      <p>Ресурс на постоянной основе обновляет базу спикеров из различных сфер:</p>
      <ul className="list-disc pl-5 list-inside pt-3.5 mb-4">
        {["Продажи", "Маркетинг", "Big Data", "IT", "Digital"].map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>

      <p className="pt-3.5">Наши клиенты работают со спикерами:</p>
    </div>

    {/* Плюсы — нормальная сетка без лишних обёрток */}
    <ul
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-x-8 gap-y-8
          w-full
          text-[14px] lg:text-[16px] font-bold
        "
      >
        {["БЕЗ КОМИССИЙ", "БЕЗ ПОСРЕДНИКОВ", "ПРЯМОЙ КОНТАКТ"].map((li) => (
          <li key={li} className="flex flex-col items-start w-full">
            <div className="h-[6px] w-[40px] bg-[#a786df] mb-2" />
            <p>{li}</p>
          </li>
        ))}
    </ul>
  </div>
</div>

  );
}

export default ThirdScreen;
