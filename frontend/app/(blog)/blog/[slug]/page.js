import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";
import PostContent from "./PostContent";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.pluginexpert.ru";
const SITE_URL = "https://pluginexpert.ru";

// --- Data fetch (SSR) ---
async function getPost(slug) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data?.data) || data.data.length === 0) return null;
    return data.data[0];
  } catch (err) {
    console.error("Ошибка загрузки поста:", err);
    return null;
  }
}

// --- Извлечение текста для description из blocks-контента ---
function extractDescription(content, maxLen = 155) {
  if (!Array.isArray(content)) return "";
  const firstPara = content.find((b) => b.type === "paragraph");
  if (!firstPara) return "";
  const text = (firstPara.children || [])
    .map((c) => c.text || "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLen ? text.slice(0, maxLen - 1).trim() + "…" : text;
}

// --- Metadata (SSR) ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Статья не найдена",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/blog/${slug}`;
  const description =
    extractDescription(post.content) ||
    "Статья блога Plug-In Expert о спикерах, тренерах и корпоративных мероприятиях.";
  const imageUrl = post.main_image?.url
    ? `${STRAPI_URL}${post.main_image.url}`
    : `${SITE_URL}/images/plugin.jpg`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: "Plug-In Expert",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
  };
}

// --- Page (SSR) ---
export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${slug}`;
  const imageUrl = post.main_image?.url
    ? `${STRAPI_URL}${post.main_image.url}`
    : `${SITE_URL}/images/plugin.jpg`;
  const description =
    extractDescription(post.content) ||
    "Статья блога Plug-In Expert о спикерах, тренерах и корпоративных мероприятиях.";

  // BlogPosting schema — для rich-results в Яндекс/Google
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: "Plug-In Expert",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Plug-In Expert",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/plugin.jpg`,
      },
    },
  };

  return (
    <>
      <Script
        id={`schema-org-article-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-[url('/images/bkground_1.png')] bg-fixed text-white px-6 py-20">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

          {post.main_image?.url && (
            <Image
              src={imageUrl}
              alt={post.title}
              width={800}
              height={450}
              className="mb-8 rounded-lg w-full"
              priority
            />
          )}

          <div className="space-y-4">
            <PostContent content={post.content} />
          </div>
        </article>
      </main>
    </>
  );
}
