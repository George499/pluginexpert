import PopularSpeakersList from "./PopularSpeakersList";

const STRAPI_API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru'}/api`;

async function getPopularSpeakers() {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/speakers?filters[isPaid][$eq]=true&populate[0]=gallery&pagination[pageSize]=6`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Ошибка загрузки популярных спикеров:", error);
    return [];
  }
}

// Серверный компонент: фетчит спикеров на сервере → попадают в SSR-HTML (видны поисковику).
export default async function PopularSpeakers() {
  const popularSpeakers = await getPopularSpeakers();

  // Если нет спикеров — не отображаем блок
  if (popularSpeakers.length === 0) return null;

  return (
    <section className="bg-[url('/images/bkground_1.png')] bg-fixed bg-cover py-20">
      <div className="container w-4/5 lg:w-2/3 mx-auto">
        <h2 className="text-white text-[40px] lg:text-[57px] font-bold mb-12 text-center">
          ПОПУЛЯРНЫЕ СПИКЕРЫ
        </h2>
        <PopularSpeakersList speakers={popularSpeakers} />
      </div>
    </section>
  );
}
