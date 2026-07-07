"use client";

import Image from "next/image";
import Link from "next/link";

function Product({ speaker }) {
  if (!speaker) {
    return <p>Спикер не найден</p>;
  }

  const { Name, Slug, Profession } = speaker;

  // Имя и фамилия всегда на двух отдельных строках
  const [firstName, ...restName] = (Name || "").trim().split(/\s+/);

  const imageUrl = speaker.gallery?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru'}${speaker.gallery[0].url}`
    : "/images/default.jpg";

  return (
    <Link href={`/profile/${Slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition group">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={Name ? `Фото: ${Name}` : "Спикер"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-[#1B1B1E] leading-tight">
            <span className="block">{firstName}</span>
            {restName.length > 0 && (
              <span className="block">{restName.join(" ")}</span>
            )}
          </h3>
          {Profession && (
            <p className="text-sm text-[#42484D] mt-1">{Profession}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Product;
