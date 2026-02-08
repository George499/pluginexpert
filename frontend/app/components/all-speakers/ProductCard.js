import Image from "next/image";
import Link from "next/link";

function ProductCard({ speaker, setSelectedCategory }) {
  if (!speaker) return null;
  const imageUrl = speaker?.gallery?.[0]?.url
    ? `https://admin.pluginexpert.ru${speaker.gallery[0].url}`
    : "/images/default.jpg";
  const nameParts = (speaker?.Name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0]?.toUpperCase() ?? "";
  const lastName = nameParts[1]?.toUpperCase() ?? "";
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
                  href={`/profile/${speaker?.Slug ?? "#"}`}
                  className="lg:mb-5 2xl:text-[68px] xl:text-[50px] text-[40px] 
                  max-[550px]:text-[25px] max-[350px]:text-[20px]
                  leading-[2.5rem] lg:leading-[4.5rem] text-[#42484D] font-bold hover:text-[#4e5ac3] cursor-pointer mb-2"
                >
                  {lastName}
                  <span className="hidden lg:inline">
                    <br />
                  </span>
                  <span className="inline lg:hidden">&nbsp;</span>
                  {firstName}
                </Link>
                <h3 className="font-bold text-[#42484D] text-[17px] lg:text-[20px] mb-2">
                  {speaker?.Profession ?? ""}
                </h3>
                <div className="flex flex-col text-[#42484D]">
                  <p className="font-bold lg:mt-3">Эксперт в области:</p>
                  <div className="flex flex-col">
                  {speaker.categories?.map((cat, index) => (
                    <span
                      key={cat.id || index}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className="hover:underline cursor-pointer mr-1"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:my-[81px] max-[450px]:my-[40px] my-[57px] w-full lg:w-1/2 flex justify-center">
            <Link href={`/profile/${speaker.Slug}`}>
                <div className="w-full h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}                                
                    alt={speaker?.Name || "Спикер"}
                    width={500}                                 
                    height={750}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
