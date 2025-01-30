import Image from "next/image";
import Link from "next/link";

function ProductCard({ speaker }) {
  const imageUrl = speaker.Image?.[0]?.url
    ? `https://admin.pluginexpert.ru${speaker.Image[0].url}`
    : "/images/default.jpg"; // Фолбэк-изображение
  return (
    <div
      className="bg-[url('/images/bkground_1.png')] bg-fixed flex content-center justify-center items-center flex-col h-full"
      id="process"
    >
      <div className="w-full bg-white h-full mb-[81px] flex flex-col items-center justify-center">
        <div className="flex lg:flex-row flex-col w-4/5 container mx-auto items-center mt-[36px] lg:my-0">
          <div className="w-full lg:w-1/2 mb-[40px]">
            <div className="w-[51px] h-[12px] mb-[40px] bg-[#4e5ac3]"></div>
            <div className="flex w-full">
              <div className="flex flex-col mr-6 lg:mr-16 w-8/12">
                <Link
                  href={`/all-speakers/${speaker.slug}`}
                  className="lg:mb-5 2xl:text-[68px] xl:text-[50px] text-[40px] leading-[2.5rem] lg:leading-[4.5rem] text-[#42484D] font-bold hover:text-[#4e5ac3] cursor-pointer mb-5"
                >
                  {speaker.Name.split(" ")[1].toUpperCase()}
                  <br className="hidden lg:block" />
                  {speaker.Name.split(" ")[0].toUpperCase()}
                </Link>
                <h3 className="font-bold text-[#42484D] text-[17px] lg:text-[20px] mb-5">
                  {speaker.Profession}
                </h3>
                <div className="flex flex-col">
                  <p className="font-bold lg:mt-3">Эксперт в области:</p>
                  <div className="flex flex-col">
                    {speaker.categories?.map((cat, index) => (
                      <Link
                        href={`/${cat.slug}`}
                        key={index}
                        className="hover:underline cursor-pointer mr-1"
                      >
                        {cat.title}
                        {index < speaker.categories.length - 1 ? "," : ""}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:my-[81px] my-[57px] w-full lg:w-1/2 flex justify-center">
            <Link href={`/all-speakers/${speaker.slug}`}>
              <Image
                src={imageUrl}
                alt={speaker.Name}
                width={500}
                height={500}
                style={{ objectFit: "cover" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
