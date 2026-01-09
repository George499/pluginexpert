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
  title: "Найти спикера, тренера или коуча с контактами",
  description:
    "Найдите спикера, тренера или коуча без посредников. Открытая база спикеров с контактными данными. Широкая база спикеров для корпоративных и маркетинговых мероприятий.",
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
    title: "Найти спикера, тренера или коуча с контактами | Plugin Expert",
    description:
      "Открытая база спикеров, тренеров и коучей без посредников. Поиск спикеров по тематикам и регионам.",
    siteName: "Plugin Expert",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Plugin Expert — спикеры без посредников",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Найти спикера, тренера или коуча с контактами | Plugin Expert",
    description:
      "Открытая база спикеров, тренеров и коучей без посредников. Поиск спикеров по тематикам и регионам.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <Script
          id="schema-org-all-speakers"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://pluginexpert.ru/all-speakers",
              "name": "Plug-In Expert",
              "logo": "https://pluginexpert.ru/images/plugin.jpg",
              "description":
                "Plug-In Expert — открытая база спикеров, тренеров и коучей с прямыми контактами. Агентство по подбору и продвижению спикеров.",
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
