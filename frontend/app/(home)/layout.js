import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import Script from "next/script";

export const metadata = {
  title: "База спикеров, тренеров и коучей с контактами",
  description:
    "Открытая база спикеров, тренеров и коучей с контактными данными. Найти спикера без посредников. Спикерское агентство Прямая Речь",
  alternates: { canonical: "https://pluginexpert.ru/" },
  keywords: [
    "база спикеров",
    "спикерское агентство",
    "найти спикера",
    "контакты спикера",
    "агентство по спикерам",
    "сайт со спикерами",
    "найти коуча",
    "найти тренера",
  ],

  openGraph: {
    type: "website",
    url: "https://pluginexpert.ru/",
    title: "Прямая Речь — база спикеров, тренеров и коучей",
    description:
      "Открытая база спикеров и тренеров с прямыми контактами. Подбор без посредников для корпоративных и маркетинговых мероприятий.",
    siteName: "Прямая Речь",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Прямая Речь — база спикеров без посредников",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Прямая Речь — база спикеров, тренеров и коучей",
    description:
      "База спикеров, тренеров и коучей с прямыми контактами. Найдите подходящего эксперта без посредников.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};


export default function HomeLayout({ children }) {
  return (
    <>
      <Script
        id="schema-org-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://pluginexpert.ru/",
            "name": "Прямая Речь",
            "logo": "https://pluginexpert.ru/images/plugin.jpg",
            "description":
              "Прямая Речь — агентство по подбору и продвижению спикеров. База спикеров, тренеров и коучей с контактными данными.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+7 (915) 385-75-91",
              "email": "hello@pluginexpert.ru",
              "contactType": "Customer Service",
              "areaServed": "RU",
              "availableLanguage": ["Russian"]
            }
          }),
        }}
      />
      <Header />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </>
  );
}
