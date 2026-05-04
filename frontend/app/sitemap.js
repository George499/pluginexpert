const BASE_URL = 'https://pluginexpert.ru';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru';

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/all-speakers`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.7, changeFrequency: 'weekly' },
  ];

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/speakers?filters[isPaid][$eq]=true&fields[0]=Slug&fields[1]=updatedAt&pagination[pageSize]=1000`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const speakerPages = (data.data || []).map((speaker) => ({
      url: `${BASE_URL}/profile/${speaker.Slug}`,
      lastModified: speaker.updatedAt ? new Date(speaker.updatedAt) : new Date(),
      priority: 0.6,
      changeFrequency: 'monthly',
    }));
    return [...staticPages, ...speakerPages];
  } catch {
    return staticPages;
  }
}
