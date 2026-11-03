import AllSpeakers from "@/components/all-speakers/AllSpeakers";
import SpeakersContacts from "@/components/all-speakers/SpeakersContacts";
import AllSpeakersSpecialText from "@/components/all-speakers/AllSpeakersSpecialText";
import Footer from "@/components/main-page/Footer";

const STRAPI_API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru'}/api`;

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

// Серверный компонент: спикеры фетчатся на сервере → попадают в SSR-HTML.
// Категории — ссылки на /all-speakers/[slug] (уникальный URL на каждую).
export default async function AllSpeakersPage() {
  const initialSpeakers = await getSpeakers();

  return (
    <>
      <AllSpeakers initialSpeakers={initialSpeakers} />
      <SpeakersContacts />
      <AllSpeakersSpecialText />
      <Footer />
    </>
  );
}
