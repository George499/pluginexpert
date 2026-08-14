import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import CategorySpeakerCard from "@/components/all-speakers/CategorySpeakerCard";
import CategorySeoText from "./CategorySeoText";
import Footer from "@/components/main-page/Footer";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.pluginexpert.ru";
const STRAPI_API_URL = `${STRAPI_URL}/api`;
const SITE_URL = "https://pluginexpert.ru";

// Порог открытия категории. Категории с меньшим числом платных спикеров
// НЕ получают отдельную страницу (иначе thin content — Яндекс метит
// «малоценная страница»). Фильтр в общем каталоге для них продолжает работать.
const MIN_SPEAKERS = 2;

async function getCategory(slug) {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/categories?filters[slug][$eq]=${slug}&pagination[pageSize]=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.data) && data.data.length ? data.data[0] : null;
  } catch {
    return null;
  }
}

async function getSpeakers(slug) {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/speakers?filters[isPaid][$eq]=true&filters[categories][slug][$eq]=${slug}&populate[0]=categories&populate[1]=gallery&pagination[pageSize]=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Пререндерим только «зрелые» категории. Новые (доросшие до порога позже)
// отрендерятся по первому запросу — dynamicParams включён по умолчанию.
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${STRAPI_API_URL}/speakers?filters[isPaid][$eq]=true&populate[0]=categories&pagination[pageSize]=100`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const counts = {};
    for (const sp of data.data || []) {
      for (const cat of sp.categories || []) {
        if (cat?.slug) counts[cat.slug] = (counts[cat.slug] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .filter(([, n]) => n >= MIN_SPEAKERS)
      .map(([category]) => ({ category }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const [category, speakers] = await Promise.all([
    getCategory(slug),
    getSpeakers(slug),
  ]);

  if (!category || speakers.length < MIN_SPEAKERS) {
    return { title: "Категория не найдена", robots: { index: false, follow: false } };
  }

  const title = category.metaTitle || `${category.title} — спикеры и эксперты`;
  const description =
    category.metaDescription ||
    `Спикеры и эксперты в категории «${category.title}» с прямыми контактами. ${speakers.length} проверенных экспертов для корпоративных мероприятий и обучения — без посредников.`;
  const url = `${SITE_URL}/all-speakers/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | Прямая Речь`,
      description,
      siteName: "Прямая Речь",
      images: [
        {
          url: `${SITE_URL}/images/plugin.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.title} — спикеры на Прямая Речь`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Прямая Речь`,
      description,
      images: [`${SITE_URL}/images/plugin.jpg`],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category: slug } = await params;
  const [category, speakers] = await Promise.all([
    getCategory(slug),
    getSpeakers(slug),
  ]);

  // Категории без наполнения не должны существовать как страницы
  if (!category || speakers.length < MIN_SPEAKERS) {
    notFound();
  }

  const url = `${SITE_URL}/all-speakers/${slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Все спикеры",
        item: `${SITE_URL}/all-speakers`,
      },
      { "@type": "ListItem", position: 3, name: category.title, item: url },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.title} — спикеры и эксперты`,
    numberOfItems: speakers.length,
    itemListElement: speakers.map((sp, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/profile/${sp.Slug}`,
      name: sp.Name,
    })),
  };

  return (
    <>
      <Script
        id={`schema-breadcrumb-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`schema-itemlist-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <main className="bg-[url('/images/bkground_1.png')] bg-fixed bg-cover min-h-screen">
        <div className="container w-4/5 lg:w-2/3 mx-auto pt-[120px] lg:pt-[150px] pb-16">
          {/* Хлебные крошки */}
          <nav aria-label="Хлебные крошки" className="text-white text-[14px] mb-6">
            <Link href="/" className="hover:underline opacity-80">
              Главная
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link href="/all-speakers" className="hover:underline opacity-80">
              Все спикеры
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="opacity-100">{category.title}</span>
          </nav>

          <div className="w-[51px] h-[12px] mb-[21px] bg-white"></div>
          <h1 className="text-[36px] lg:text-[57px] leading-tight text-white font-bold mb-4">
            {category.title} — спикеры и эксперты
          </h1>
          <p className="text-white text-[16px] lg:text-[20px] opacity-90 mb-10">
            {speakers.length}{" "}
            {speakers.length === 1
              ? "проверенный эксперт"
              : speakers.length < 5
                ? "проверенных эксперта"
                : "проверенных экспертов"}{" "}
            с прямыми контактами — свяжитесь напрямую, без посредников.
          </p>
        </div>

        {/* Карточки спикеров */}
        <div className="bg-white py-14">
          <div className="container w-4/5 lg:w-2/3 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((sp) => (
                <CategorySpeakerCard
                  key={sp.id}
                  speaker={sp}
                  currentCategorySlug={slug}
                />
              ))}
            </div>

            {/* SEO-текст категории (из Strapi) */}
            {category.seoText && (
              <section className="mt-16 max-w-3xl text-[#1B1B1E]">
                <CategorySeoText content={category.seoText} />
              </section>
            )}

            <div className="mt-12">
              <Link
                href="/all-speakers"
                className="inline-block bg-[#42484D] hover:bg-[#3742a3] text-white text-[18px] font-semibold uppercase duration-300 px-8 py-4 rounded"
              >
                Все категории спикеров
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
