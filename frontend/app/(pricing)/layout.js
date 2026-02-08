import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import Script from "next/script";

export const metadata = {
  title: "Как стать спикером — разместить анкету спикера | Plug-In Expert",
  description:
    "Стать спикером легко! Разместите анкету спикера на сайте спикерского агентства Plug-In Speakers Acceleration и получайте заказы напрямую. Продвижение, контакты и возможности для экспертов.",
  keywords: [
    "анкеты спикеров",
    "спикерское агентство",
    "разместить анкету спикера",
    "работа для спикеров",
    "стать спикером",
    "сайт со спикерами",
    "Plug-In Speakers Acceleration",
  ],

  openGraph: {
    type: "website",
    url: "https://pluginexpert.ru/pricing",
    title: "Как стать спикером — разместить анкету спикера | Plug-In Expert",
    description:
      "Разместите анкету спикера на сайте Plug-In Expert и начните получать заказы напрямую. Мы поможем вам заявить о себе на рынке выступлений.",
    siteName: "Plug-In Expert",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Plug-In Expert — разместить анкету спикера",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Как стать спикером — разместить анкету спикера | Plug-In Expert",
    description:
      "Разместите анкету спикера на сайте Plug-In Expert и начните получать заказы напрямую. Мы поможем вам заявить о себе на рынке выступлений.",
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
            "name": "Plug-In Expert",
            "logo": "https://pluginexpert.ru/images/plugin.jpg",
            "description":
              "Разместите анкету спикера на сайте Plug-In Expert и начните получать заказы напрямую. Агентство по подбору и продвижению спикеров, тренеров и коучей.",
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
