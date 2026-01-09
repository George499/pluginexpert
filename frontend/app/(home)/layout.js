import localFont from "next/font/local";
import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import { Raleway } from "next/font/google";
import { Play } from "next/font/google";
import Script from "next/script";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });
const play = Play({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "База спикеров, тренеров и коучей с контактами | Plug-In Expert",
  description:
    "Открытая база спикеров, тренеров и коучей с контактными данными. Найдите спикера без посредников. Plug-In Speakers Accelerator — ресурс для подбора спикеров для корпоративных и маркетинговых мероприятий.",
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
    title: "Plug-In Expert — база спикеров, тренеров и коучей",
    description:
      "Открытая база спикеров и тренеров с прямыми контактами. Подбор без посредников для корпоративных и маркетинговых мероприятий.",
    siteName: "Plug-In Expert",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Plug-In Expert — база спикеров без посредников",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Plug-In Expert — база спикеров, тренеров и коучей",
    description:
      "База спикеров, тренеров и коучей с прямыми контактами. Найдите подходящего эксперта без посредников.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="ru">
       <head>
        <Script
          id="schema-org-home"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://pluginexpert.ru/",
              "name": "Plug-In Expert",
              "logo": "https://pluginexpert.ru/images/plugin.jpg",
              "description":
                "Plug-In Expert — агентство по подбору и продвижению спикеров. База спикеров, тренеров и коучей с контактными данными.",
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
      </head>
      <body
        className={`${raleway.className} ${play.className} antialiased min-h-screen`}
      >
        <Header />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  );
}
