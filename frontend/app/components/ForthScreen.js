function ForthScreen() {
  return (
    <div className="bg-hero-image bg-fixed flex content-center justify-center items-center flex-col h-full w-full">
      <div className="container flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center font-semibold mt-[120px] mb-10 lg:mt-[200px] lg:mb-[87px] relative">
        <p className="text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-white  ">
          ПОДБОР СПИКЕРОВ
        </p>

        <div className="relative mb-[34px] w-full">
          <div className="w-full h-[1px] ml-[5px] bg-white absolute top-1"></div>
          <span className=" text-[40px] lg:text-[57px] xl:text-[81px] leading-[2.5rem] lg:leading-[4.5rem] text-black tracking-tighter ">
            ПО КАТЕГОРИЯМ
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForthScreen;
