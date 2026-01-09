"use client";

import Image from "next/legacy/image";
import Link from "next/link";

function Product({ speaker }) {
  if (!speaker) {
    return <p>Спикер не найден</p>;
  }
  console.log(speaker);

  const { Name, Slug, Bio, Profession } = speaker;

  const imageUrl = speaker.gallery?.[0]?.url
    ? `https://admin.pluginexpert.ru${speaker.gallery[0].url}`
    : "/images/default.jpg";

  return (
    <Link href={`/profile/${Slug}`} className="block">
      <div className="group relative">
        <div className="relative w-full aspect-[2/3]"> 
            <Image
              src={imageUrl || "/images/placeholder.jpg"}
              alt={speaker?.Name || "Спикер"}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>


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
