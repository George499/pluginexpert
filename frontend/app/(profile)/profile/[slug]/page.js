import SpeakerContacts from "@/components/speaker-detail/SpeakerContacts";
import SpeekerFirstScreen from "@/components/speaker-detail/SpeekerFirstScreen";
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
    const url = `${STRAPI_API_URL}?filters[Slug][$eq]=${slug}&populate[0]=categories&populate[1]=avatar`;
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
