import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import Script from "next/script";

export const metadata = {
  title: "Как стать спикером! Разместить анкету спикера!",
  description:
    "Стать спикером легко! Разместить анкету спикера на сайте спикерского агентства Прямая Речь",
  alternates: { canonical: "https://pluginexpert.ru/pricing" },
  keywords: [
    "анкеты спикеров",
    "спикерское агентство",
    "разместить анкету спикера",
    "работа для спикеров",
    "стать спикером",
    "сайт со спикерами",
    "Прямая Речь",
  ],

  openGraph: {
    type: "website",
    url: "https://pluginexpert.ru/pricing",
    title: "Как стать спикером — разместить анкету спикера | Прямая Речь",
    description:
      "Разместите анкету спикера на сайте Прямая Речь и начните получать заказы напрямую. Мы поможем вам заявить о себе на рынке выступлений.",
    siteName: "Прямая Речь",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Прямая Речь — разместить анкету спикера",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Как стать спикером — разместить анкету спикера | Прямая Речь",
    description:
      "Разместите анкету спикера на сайте Прямая Речь и начните получать заказы напрямую. Мы поможем вам заявить о себе на рынке выступлений.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};

export default function PricingLayout({ children }) {
  return (
    <>
      <Script
        id="schema-org-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://pluginexpert.ru/pricing",
            "name": "Прямая Речь",
            "logo": "https://pluginexpert.ru/images/plugin.jpg",
            "description":
              "Разместите анкету спикера на сайте Прямая Речь и начните получать заказы напрямую. Агентство по подбору и продвижению спикеров, тренеров и коучей.",
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
