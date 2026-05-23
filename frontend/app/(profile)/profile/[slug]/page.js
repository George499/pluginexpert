import SpeakerContacts from "@/components/speaker-detail/SpeakerContacts";
import SpeekerFirstScreen from "@/components/speaker-detail/SpeekerFirstScreen";
import SpeekerInfoScreen from "@/components/speaker-detail/SpeekerInfoScreen";
import SpeekerSecondScreen from "@/components/speaker-detail/SpeekerSecondScreen";
import Footer from "@/components/main-page/Footer";
import SpeakerPrice from "@/components/speaker-detail/SpeakerPrice";
import Script from "next/script";
import { notFound } from "next/navigation";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru';
const STRAPI_API_URL = `${STRAPI_URL}/api/speakers`;

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const speaker = await getSpeaker(slug);

  if (!speaker) {
    // Не индексируем несуществующих спикеров — пара /profile/test, /profile/preload уже попала в индекс Яндекса как soft-404 дубли
    return {
      title: "Спикер не найден",
      description: "Страница спикера не найдена",
      robots: { index: false, follow: false },
    };
  }

  const speakerName = speaker.Name || "Спикер";
  const speakerProfession = speaker.Profession || "Спикер";
  const speakerDescription =
    speaker.Profession ? `${speaker.Profession} — профиль на Plug-In Expert` : `Профиль спикера ${speakerName} на Plug-In Expert`;
  const speakerImage =
    speaker.avatar?.url
      ? `${STRAPI_URL}${speaker.avatar.url}`
      : "https://pluginexpert.ru/images/plugin.jpg";
  const speakerUrl = `https://pluginexpert.ru/profile/${slug}`;
  const speakerTitle = `${speakerName} — ${speakerProfession}`;

  return {
    title: speakerTitle,
    description: speakerDescription,
    alternates: { canonical: speakerUrl },
    openGraph: {
      type: "profile",
      url: speakerUrl,
      title: `${speakerTitle} | Plug-In Expert`,
      description: speakerDescription,
      siteName: "Plug-In Expert",
      images: [
        {
          url: speakerImage,
          width: 1200,
          height: 630,
          alt: `${speakerName} — спикер на Plug-In Expert`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${speakerTitle} | Plug-In Expert`,
      description: speakerDescription,
      images: [speakerImage],
    },
  };
}

// ✅ Главный серверный компонент страницы спикера
export default async function SpeekerPage({ params }) {
  const { slug } = await params;

  const speaker = await getSpeaker(slug);

  if (!speaker) {
    notFound(); // real HTTP 404, не soft-404 c пустым H1
  }

  const speakerName = speaker.Name || "Спикер";
  const speakerDescription =
    speaker.Profession ? `${speaker.Profession} — профиль на Plug-In Expert` : `Профиль спикера ${speakerName}`;
  const speakerImage =
    speaker.avatar?.url
      ? `${STRAPI_URL}${speaker.avatar.url}`
      : "https://pluginexpert.ru/images/plugin.jpg";
  const speakerUrl = `https://pluginexpert.ru/profile/${slug}`;

  // Build Schema.org Person markup
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: speakerName,
    description: speakerDescription,
    image: speakerImage,
    url: speakerUrl,
    jobTitle: speaker.Profession || "Спикер",
    worksFor: {
      "@type": "Organization",
      name: "Plug-In Expert",
      url: "https://pluginexpert.ru",
    },
  };

  // Strapi 5: relations приходят как массив объектов без .data/.attributes
  if (Array.isArray(speaker.categories) && speaker.categories.length > 0) {
    personSchema.knowsAbout = speaker.categories
      .map((cat) => cat.Name)
      .filter(Boolean);
  }

  return (
    <>
      <Script
        id={`schema-org-person-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <SpeekerFirstScreen speaker={speaker} />
      <SpeekerInfoScreen speaker={speaker} />
      <SpeekerSecondScreen speaker={speaker} />
      <SpeakerPrice speaker={speaker} />
      <SpeakerContacts speaker={speaker} />
      <Footer />
    </>
  );
}

// ✅ Функция получения данных конкретного спикера (SSR)
async function getSpeaker(slug) {
  try {
    const url = `${STRAPI_API_URL}?filters[Slug][$eq]=${slug}&filters[isPaid][$eq]=true&populate[0]=categories&populate[1]=gallery&populate[2]=avatar`;

    const res = await fetch(url, {
      next: { revalidate: 60 }, // ✅ Страница обновляется каждые 60 секунд
    });

    const data = await res.json();

    // Проверяем структуру ответа
    if (!data || !data.data) {
      console.error("Неверная структура данных:", data);
      return null;
    }

    // Проверяем, является ли data.data массивом и содержит ли элементы
    if (!Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    return data.data[0]; // ✅ Вернем объект без .attributes
  } catch (error) {
    console.error("Ошибка загрузки спикера:", error);
    return null;
  }
}
