"use client";

function popularSpeekers() {
  return (
    <div
      className="bg-[url('/images/bkground_1.png')] bg-fixed h-full flex flex-col"
      id="speekers"
    >
      <div className="bg-[#42484d] h-3/4 flex content-center justify-center items-center flex-col">
        <div className="container my-[81px] max-[1000px]:my-[60px] flex flex-col w-4/5 lg:w-2/3 h-full items-start justify-center">
          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <h2 className="heading-line text-[40px] lg:text-[57px] xl:text-[81px] leading-[3.5rem] lg:leading-[4.5rem] text-white font-bold mb-[81px]">
            ПОПУЛЯРНЫЕ СПИКЕРЫ
          </h2>
          <div className="text-white text-[16px] lg:text-[20px] tracking-normal font-semibold">
            <p>
              Мы наладили контакты с уникальными представителями своих профессий
              – это знаменитые личности как на территории России, так и ее за
              пределами. <br /> <br /> ​Данная категория персон открыта не
              только к предложениям по проведению мастер-классов и обучающих
              лекций, но и к участию в различных мероприятиях как с
              коммерческими компаниями, так и госсектором. <br /> <br /> К
              сожалению, мы не можем разместить всех популярных спикеров на
              нашем ресурсе в связи с определенными договоренностями.
              <br /> <br />
              Оставить
              <span className="cursor-pointer text-[#4e5ac3] hover:text-white">
                {" "}
                запрос на популярных спикеров
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default popularSpeekers;
