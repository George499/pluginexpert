import Link from "next/link";

// Категории со счётчиком платных спикеров. Каждая категория, где есть хотя бы
// один спикер, ведёт на свою страницу /all-speakers/[slug]. Пустые не выводятся.
export default function CategoryPills({ speakers = [] }) {
  const counts = {};
  for (const sp of speakers) {
    for (const cat of sp.categories || []) {
      if (cat?.slug) {
        counts[cat.slug] = counts[cat.slug] || { n: 0, title: cat.title };
        counts[cat.slug].n += 1;
      }
    }
  }
  const categories = Object.entries(counts).sort(
    (a, b) => b[1].n - a[1].n || a[1].title.localeCompare(b[1].title, "ru")
  );

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map(([slug, v]) => (
        <Link
          key={slug}
          href={`/all-speakers/${slug}`}
          className="border border-[#42484D] text-[#42484D] hover:bg-[#42484D] hover:text-white transition-colors rounded-full px-5 py-2 text-[15px] lg:text-[17px] font-normal tracking-normal"
        >
          {v.title}
          <span className="opacity-60 ml-2">{v.n}</span>
        </Link>
      ))}
    </div>
  );
}
