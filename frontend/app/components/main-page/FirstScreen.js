function FirstScreen() {
  return (
   <div
  id="first screen"
  className="bg-fixed bg-cover bg-[url('/images/bkground_1.png')]"
>
  <div className="flex flex-col items-center">
    <div
      className="
        container
        w-[80%] lg:w-2/3
        mx-auto
        mt-[120px] lg:mt-[150px]
        mb-[50px]
        max-[600px]:px-4
        font-semibold
        max-[320px]:w-11/12 
        max-[320px]:px-3 
        max-[320px]:mt-[90px] 
        max-[320px]:mb-[36px]
      "
    >
      {/* Заголовки */}
      <div
        className="
          mb-6
          text-[40px] lg:text-[57px] xl:text-[81px]
          leading-[2.5rem] md:leading-[3rem] xl:leading-[4.5rem]
          max-[1500px]:max-w-[420px]
          max-[900px]:max-w-[280px]
          min-[1501px]:w-full
          max-[360px]:text-[32px] max-[360px]:leading-[2.1rem]
          max-[320px]:text-[26px] max-[320px]:leading-[2rem] max-[320px]:max-w-[240px]
        "
      >
        <p className="text-white">PLUG-IN</p>
        <p className="text-[#1B1B1E]">SPEAKERS</p>
        <p className="text-[#1B1B1E]">ACCELERATOR</p>

        {/* Нижняя строка + линия */}
        <p
          className="
            relative
            text-white
            leading-[2.5rem] md:leading-[3.5rem] xl:leading-[4.5rem]
            pt-3 max-[900px]:pt-2  /* чуть опускаем текст, чтобы линия не задевала буквы */
          "
        >
          {/* сама линия короче на мобильных */}
          <span
            className="
              absolute left-0
              w-full max-[900px]:w-3/4 max-[360px]:w-2/3
              h-[1px] bg-white
              top-0
            "
          />
          СПИКЕРЫ БЕЗ ПОСРЕДНИКОВ
        </p>
      </div>

      {/* Подзаголовок + список */}
      <div
        className="
          font-play text-white tracking-[.25em]
          pt-6 mt-0
          text-[12px] lg:text-[20px]
          max-[360px]:text-[11px] max-[360px]:tracking-[.18em]
          max-[320px]:text-[10.5px] max-[320px]:tracking-[.16em]
        "
      >
        <p className="pb-3">
          Ресурс для самостоятельного подбора спикеров по направлениям:
        </p>
        <ul className="space-y-1.5 lg:space-y-2 max-[320px]:space-y-1">
          {[
            'КОРПОРАТИВНОЕ ОБУЧЕНИЕ',
            'МАРКЕТИНГОВОЕ МЕРОПРИЯТИЕ',
            'МОТИВАЦИЯ СОТРУДНИКОВ',
            'ПАНЕЛЬНАЯ ДИСКУССИЯ',
            'КОРПОРАТИВНАЯ КОНФЕРЕНЦИЯ',
          ].map((li) => (
            <li key={li} className="list-disc list-inside">
              {li}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

  );
}

export default FirstScreen;
