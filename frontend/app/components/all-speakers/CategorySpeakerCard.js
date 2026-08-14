import Image from "next/image";
import Link from "next/link";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.pluginexpert.ru";

// Серверная карточка спикера для категорийных страниц.
// Отличие от ProductCard: категории — ссылки (перелинковка + без onClick,
// который ломает пререндер серверного компонента).
export default function CategorySpeakerCard({ speaker, currentCategorySlug }) {
  if (!speaker) return null;

  const imageUrl = speaker?.gallery?.[0]?.url
    ? `${STRAPI_URL}${speaker.gallery[0].url}`
    : "/images/default.jpg";
  const nameParts = (speaker?.Name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts[1] ?? "";

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      <Link href={`/profile/${speaker?.Slug ?? "#"}`} className="block">
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src={imageUrl}
            alt={speaker?.Name || "Спикер"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link
          href={`/profile/${speaker?.Slug ?? "#"}`}
          className="text-[22px] lg:text-[26px] leading-tight text-[#42484D] font-bold hover:text-[#4e5ac3] transition-colors mb-2"
        >
          {lastName} {firstName}
        </Link>

        {speaker?.Profession && (
          <p className="text-[#42484D] text-[15px] lg:text-[17px] mb-3">
            {speaker.Profession}
          </p>
        )}

        {speaker.categories?.length > 0 && (
          <div className="mt-auto pt-3 border-t border-gray-200">
            <p className="text-[#42484D] text-[13px] font-bold mb-1">
              Эксперт в области:
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {speaker.categories.map((cat, index) =>
                cat.slug && cat.slug !== currentCategorySlug ? (
                  <Link
                    key={cat.id || index}
                    href={`/all-speakers/${cat.slug}`}
                    className="text-[13px] text-[#4e5ac3] hover:underline"
                  >
                    {cat.title}
                  </Link>
                ) : (
                  <span
                    key={cat.id || index}
                    className="text-[13px] text-[#42484D]"
                  >
                    {cat.title}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
