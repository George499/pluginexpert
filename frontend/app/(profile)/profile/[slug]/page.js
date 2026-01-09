import SpeakerContacts from "@/components/speaker-detail/SpeakerContacts";
import SpeekerFirstScreen from "@/components/speaker-detail/SpeekerFirstScreen";
import SpeekerInfoScreen from "@/components/speaker-detail/SpeekerInfoScreen";
import SpeekerSecondScreen from "@/components/speaker-detail/SpeekerSecondScreen";
import Footer from "@/components/main-page/Footer";
import SpeakerPrice from "@/components/speaker-detail/SpeakerPrice";
import Script from "next/script";

const STRAPI_API_URL = "https://admin.pluginexpert.ru/api/speakers";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const speaker = await getSpeaker(slug);

  if (!speaker) {
    return {
      title: "Спикер не найден | Plug-In Expert",
      description: "Страница спикера не найдена",
    };
  }

  const speakerName = speaker.Name || "Спикер";
  const speakerDescription =
    speaker.Description || `Профиль спикера ${speakerName} на Plug-In Expert`;
  const speakerImage =
    speaker.Photo?.url
      ? `https://admin.pluginexpert.ru${speaker.Photo.url}`
      : "https://pluginexpert.ru/images/plugin.jpg";
  const speakerUrl = `https://pluginexpert.ru/profile/${slug}`;

  return {
    title: `${speakerName} | Спикер | Plug-In Expert`,
    description: speakerDescription,
    openGraph: {
      type: "profile",
      url: speakerUrl,
      title: `${speakerName} | Спикер | Plug-In Expert`,
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
      title: `${speakerName} | Спикер | Plug-In Expert`,
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
    return <h1>Спикер не найден</h1>;
  }

  const speakerName = speaker.Name || "Спикер";
  const speakerDescription =
    speaker.Description || `Профиль спикера ${speakerName}`;
  const speakerImage =
    speaker.Photo?.url
      ? `https://admin.pluginexpert.ru${speaker.Photo.url}`
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
    jobTitle: speaker.Position || "Спикер",
    worksFor: {
      "@type": "Organization",
      name: "Plug-In Expert",
      url: "https://pluginexpert.ru",
    },
  };

  if (speaker.Email) {
    personSchema.email = speaker.Email;
  }

  if (speaker.Phone) {
    personSchema.telephone = speaker.Phone;
  }

  if (speaker.categories && speaker.categories.data) {
    personSchema.knowsAbout = speaker.categories.data.map(
      (cat) => cat.attributes?.Name || cat.Name
    );
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
    const url = `${STRAPI_API_URL}?filters[Slug][$eq]=${slug}&populate[0]=categories&populate[1]=gallery`;
    console.log("Fetching URL:", url);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // ✅ Страница обновляется каждые 60 секунд
    });

    const data = await res.json();
    console.log("API response data:", data);

    // Проверяем структуру ответа
    if (!data || !data.data) {
      console.error("Неверная структура данных:", data);
      return null;
    }

    // Проверяем, является ли data.data массивом и содержит ли элементы
    if (!Array.isArray(data.data) || data.data.length === 0) {
      console.log("Спикер не найден с slug:", slug);
      return null;
    }

    return data.data[0]; // ✅ Вернем объект без .attributes
  } catch (error) {
    console.error("Ошибка загрузки спикера:", error);
    return null;
  }
}
