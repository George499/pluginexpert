import Image from "next/legacy/image";
import Link from "next/link";

function Product({ speaker, href }) {
  const imageUrl = `https://admin.pluginexpert.ru${speaker.Image[0].url}`;
  return (
    <>
      {speaker ? (
        <div className="group relative">
          <Link
            href={`${href}/[${speaker}]`}
            as={`${href}/${speaker.slug?.current}`}
          >
            <Image
              src={imageUrl}
              alt={`Image of ${speaker.Name}`}
              layout="responsive"
              width={500}
              height={750}
              objectFit="cover"
              priority
            />
          </Link>
          {
            <div className="hidden absolute w-full h-full top-0 left-0 lg:flex">
              {/* Прозрачный фон */}
              <div
                className={`absolute w-full h-full bg-[#4e5ac3] lg:opacity-0 lg:group-hover:opacity-50 opacity-60 transition-opacity-60 duration-700`}
              ></div>

              {/* Контент (name и description) */}
              <div className="cursor-pointer relative z-10 w-full h-full flex flex-col items-center justify-center text-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity-60 duration-700">
                <h3 className="text-[30px] text-[#000000]">{speaker.Name}</h3>
                <p className="hidden lg:block lg:text-[15px] text-[#fffffe]">
                  {speaker.description}
                </p>
              </div>
            </div>
          }
        </div>
      ) : (
        <p>{speaker.Name}</p>
      )}
    </>
  );
}

export default Product;
