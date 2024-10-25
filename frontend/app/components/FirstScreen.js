function FirstScreen() {
  return (
    <div
      className="bg-fixed h-full relative bg-cover bg-[url('/images/bkground_1.png')]"
      id="first screen"
    >
      <div className="h-full flex justify-center items-center flex-col">
        <div className="container mt-[120px] lg:mt-[150px] flex flex-col w-[80%] lg:w-2/3 h-full items-start justify-center font-semibold mb-[50px]">
          <div className="mb-6 w-full text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] md:leading-[3rem] xl:leading-[4.5rem]">
            <p className="text-white">PLUG-IN</p>
            <p className="text-[#1B1B1E]">EDUCATION</p>
            <p className="text-[#1B1B1E]">SOLUTIONS</p>
            <p className="relative leading-[2.5rem] md:leading-[3.5rem] xl:leading-[4.5rem] text-white">
              <span className="w-full h-[1px] bg-white absolute top-[5px]"></span>
              ПОМОЩЬ В ОБРАЗОВАНИИ
            </p>
          </div>
          <div className="font-play tracking-[.25em] text-white pt-6 text-[12px] lg:text-[20px] ">
            <p className="pb-4">МЫ ПРЕДОСТАВИМ СПИКЕРОВ ПО НАПРАВЛЕНИЯМ:</p>
            <ul>
              {[
                "КОРПОРАТИВНОЕ ОБУЧЕНИЕ",
                "МАРКЕТИНГОВОЕ МЕРОПРИЯТИЕ",
                "МОТИВАЦИЯ СОТРУДНИКОВ",
                "ПАНЕЛЬНАЯ ДИСКУССИЯ",
                "КОРПОРАТИВНАЯ КОНФЕРЕНЦИЯ",
              ].map((li, index) => (
                <li className="list-disc list-inside" key={index}>
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
