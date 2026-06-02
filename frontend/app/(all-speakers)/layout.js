import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import Script from "next/script";

export const metadata = {
  title: "Найти спикера, тренера или коуча с контактами",
  description:
    "Найдите спикера, тренера или коуча без посредников. Открытая база спикеров с контактными данными. Широкая база спикеров на разные тематики",
  alternates: { canonical: "https://pluginexpert.ru/all-speakers" },
  keywords: [
    "база спикеров",
    "база со спикерами",
    "найти спикера",
    "нанять спикера",
    "стать спикером",
    "сайт со спикерами",
    "подбор спикеров",
  ],

  openGraph: {
    type: "website",
    url: "https://pluginexpert.ru/all-speakers",
    title: "Найти спикера, тренера или коуча с контактами | Прямая Речь",
    description:
      "Открытая база спикеров, тренеров и коучей без посредников. Поиск спикеров по тематикам и регионам.",
    siteName: "Прямая Речь",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Прямая Речь — спикеры без посредников",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Найти спикера, тренера или коуча с контактами | Прямая Речь",
    description:
      "Открытая база спикеров, тренеров и коучей без посредников. Поиск спикеров по тематикам и регионам.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};


export default function AllSpeakersLayout({ children }) {
  return (
    <>
      <Script
        id="schema-org-all-speakers"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://pluginexpert.ru/all-speakers",
            "name": "Прямая Речь",
            "logo": "https://pluginexpert.ru/images/plugin.jpg",
            "description":
              "Прямая Речь — открытая база спикеров, тренеров и коучей с прямыми контактами. Агентство по подбору и продвижению спикеров.",
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
