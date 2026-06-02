import "../globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";
import Footer from "@/components/main-page/Footer";
import { Raleway } from "next/font/google";
import { Play } from "next/font/google";
import Script from "next/script";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });
const play = Play({ subsets: ["latin"], weight: ["400", "700"] });


export const metadata = {
  // template '%s | Прямая Речь' из root layout добавит хвост — не дублируем здесь
  title: "Блог о спикерах, тренерах и мероприятиях",
  description:
    "Читайте статьи о спикерах, тренерах, ивент-индустрии и корпоративных мероприятиях. Советы по подбору спикеров, продвижению и организации событий без посредников.",
  alternates: { canonical: "https://pluginexpert.ru/blog" },
  keywords: [
    "блог о спикерах",
    "организация мероприятий",
    "приглашение спикеров",
    "ивент-индустрия",
    "подбор спикеров",
    "Прямая Речь блог",
  ],

  openGraph: {
    type: "website",
    url: "https://pluginexpert.ru/blog",
    title: "Блог о спикерах и мероприятиях | Прямая Речь",
    description:
      "Советы, аналитика и опыт команды Прямая Речь. Всё о публичных выступлениях, тренингах и корпоративных событиях.",
    siteName: "Прямая Речь",
    images: [
      {
        url: "https://pluginexpert.ru/images/plugin.jpg",
        width: 1200,
        height: 630,
        alt: "Прямая Речь — блог о спикерах и мероприятиях",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Блог о спикерах и мероприятиях | Прямая Речь",
    description:
      "Полезные статьи для организаторов, тренеров и спикеров. Как проводить ивенты без посредников.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
};


export default function BlogLayout({ children }) {
  return (
   
      <div className={`${raleway.className} ${play.className} antialiased min-h-screen bg-[url('/images/bkground_1.png')] bg-cover bg-center bg-no-repeat`}>
        <Script
        id="schema-org-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "url": "https://pluginexpert.ru/blog",
            "name": "Блог Прямая Речь",
            "description":
              "Статьи и советы для спикеров, тренеров и организаторов мероприятий. Материалы агентства Прямая Речь.",
            "publisher": {
              "@type": "Organization",
              "name": "Прямая Речь",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pluginexpert.ru/images/plugin.jpg"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7 (915) 385-75-91",
                "email": "hello@pluginexpert.ru",
                "contactType": "Customer Service"
              }
            }
          }),
        }}
      />
        <Header />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
        <Footer />
      </div>
    
  );
}