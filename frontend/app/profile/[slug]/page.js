import SpeakerContacts from "@/components/speaker-detail/SpeakerContacts";
import SpeekerFirstScreen from "../../components/speaker-detail/SpeekerFirstScreen";
import SpeekerInfoScreen from "@/components/speaker-detail/SpeekerInfoScreen";
import SpeekerSecondScreen from "@/components/speaker-detail/SpeekerSecondScreen";
import Footer from "@/components/main-page/Footer";

import SpeakerPrice from "@/components/speaker-detail/SpeakerPrice";

const STRAPI_API_URL = "https://admin.pluginexpert.ru/api/speakers";

// ✅ Главный серверный компонент страницы спикера
export default async function SpeekerPage({ params }) {
  const { slug } = await params;

  const speaker = await getSpeaker(slug);

  if (!speaker) {
    return <h1>Спикер не найден</h1>;
  }

  return (
    <>
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
    const res = await fetch(
      `${STRAPI_API_URL}?filters[Slug][$eq]=${slug}&populate[0]=categories&populate[1]=Image`, // ✅ Учитываем заглавную букву "Slug"
      {
        next: { revalidate: 60 }, // ✅ Страница обновляется каждые 60 секунд
      }
    );

    const data = await res.json();

    // ✅ Проверяем, есть ли данные
    if (!data.data.length) return null;

    return data.data[0]; // ✅ Вернем объект без .attributes
  } catch (error) {
    console.error("Ошибка загрузки спикера:", error);
    return null;
  }
}

// ✅ Функция для генерации `slug`-ов спикеров (SSG)
// export async function generateStaticParams() {
//   const res = await fetch(`${STRAPI_API_URL}?populate=categories`);
//   const data = await res.json();

//   return data.data.map((speaker) => ({
//     slug: speaker.attributes.slug, // ✅ Возвращаем массив slug-ов
//   }));
// }

// export async function generateMetadata({ params }) {
//   const speaker = await getSpeaker(params.slug);

//   return {
//     title: speaker ? `${speaker.attributes.name} – Спикер` : "Спикер не найден",
//     description: speaker
//       ? speaker.attributes.description
//       : "Анкета спикера отсутствует",
//     keywords: "анкетa спикера, подбор спикера, найти коуча",
//     openGraph: {
//       title: speaker?.attributes.name,
//       description: speaker?.attributes.description,
//       images: [
//         speaker?.attributes.Image?.data?.attributes?.url ||
//           "/images/default.jpg",
//       ],
//     },
//   };
// }
