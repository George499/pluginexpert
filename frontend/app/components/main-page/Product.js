"use client";

import Image from "next/legacy/image";
import Link from "next/link";

function Product({ speaker }) {
  if (!speaker) {
    return <p>Спикер не найден</p>;
  }

  const { Name, Slug, Bio, Profession } = speaker;
  const imageUrl = speaker.Image?.[0]?.url
    ? `https://admin.pluginexpert.ru${speaker.Image[0].url}`
    : "/images/default.jpg"; // Фолбэк-изображение

  return (
    <Link href={`/profile/${Slug}`} className="block">
      <div className="group relative">
        <Image
          src={imageUrl}
          alt={`Image of ${Name}`}
          layout="responsive"
          width={500}
          height={750}
          objectFit="cover"
          priority
        />

        {/* Hover-эффект */}
        <div className="absolute w-full h-full top-0 left-0 lg:flex pointer-events-none">
          {/* Прозрачный фон */}
          <div className="absolute w-full h-full bg-[#4e5ac3] lg:opacity-0 lg:group-hover:opacity-50 opacity-60 transition-opacity duration-700"></div>

          {/* Контент */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700">
            <h3 className="text-[30px] text-[#000000]">{Name}</h3>
            <p className="hidden lg:block lg:text-[15px] text-[#fffffe]">
              {Profession ? Profession : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Product;
