import AllSpeakers from "@/components/all-speakers/AllSpeakers";
import SpeakersContacts from "@/components/all-speakers/SpeakersContacts";
import AllSpeakersSpecialText from "@/components/all-speakers/AllSpeakersSpecialText";
import Footer from "@/components/main-page/Footer";

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

  return (
    <>
      <AllSpeakers
        initialSpeakers={initialSpeakers}
        initialCategories={initialCategories}
      />
      <SpeakersContacts />
      <AllSpeakersSpecialText />
      <Footer />
    </>
  );
}
