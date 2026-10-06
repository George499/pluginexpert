import Link from "next/link";
import AllSpeakers from "@/components/all-speakers/AllSpeakers";
import SpeakersContacts from "@/components/all-speakers/SpeakersContacts";
import AllSpeakersSpecialText from "@/components/all-speakers/AllSpeakersSpecialText";
import Footer from "@/components/main-page/Footer";

// Порог открытия категорийной страницы (совпадает с [category]/page.js и sitemap)
const MIN_SPEAKERS = 2;

const STRAPI_API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru'}/api`;

async function getCategories() {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/categories?pagination[pageSize]=100`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getSpeakers() {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/speakers?populate[0]=categories&populate[1]=gallery&filters[isPaid][$eq]=true&pagination[pageSize]=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Серверный компонент: спикеры и категории фетчатся на сервере → попадают в SSR-HTML.
// Фильтрация по категории остаётся клиентской (внутри AllSpeakers).
export default async function AllSpeakersPage() {
  const [initialSpeakers, initialCategories] = await Promise.all([
    getSpeakers(),
    getCategories(),
  ]);

  // Категории с достаточным наполнением — на них есть отдельные страницы.
  // Ссылки нужны, чтобы поисковик обошёл их не только через sitemap.
  const counts = {};
  for (const sp of initialSpeakers) {
    for (const cat of sp.categories || []) {
      if (cat?.slug) {
        counts[cat.slug] = counts[cat.slug] || { n: 0, title: cat.title };
        counts[cat.slug].n += 1;
      }
    }
  }
  const openCategories = Object.entries(counts)
    .filter(([, v]) => v.n >= MIN_SPEAKERS)
    .sort((a, b) => b[1].n - a[1].n);

  return (
    <>
      <AllSpeakers
        initialSpeakers={initialSpeakers}
        initialCategories={initialCategories}
        categoryPageSlugs={openCategories.map(([slug]) => slug)}
      />

      {openCategories.length > 0 && (
        <section className="bg-white pb-16">
          <div className="container w-4/5 lg:w-2/3 mx-auto">
            <h2 className="text-[26px] lg:text-[34px] font-bold text-[#42484D] mb-6">
              Спикеры по направлениям
            </h2>
            <div className="flex flex-wrap gap-3">
              {openCategories.map(([slug, v]) => (
                <Link
                  key={slug}
                  href={`/all-speakers/${slug}`}
                  className="border border-[#42484D] text-[#42484D] hover:bg-[#42484D] hover:text-white transition-colors rounded-full px-5 py-2 text-[15px] lg:text-[17px]"
                >
                  {v.title}
                  <span className="opacity-60 ml-2">{v.n}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SpeakersContacts />
      <AllSpeakersSpecialText />
      <Footer />
    </>
  );
}
