// app/layout.js
import "./globals.css";
import { Raleway, Play } from "next/font/google";
import CookieBanner from "./components/cookie_banner/CookieBanner";
import Script from "next/script";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-raleway" });
const play = Play({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-play" });

export const metadata = {
  metadataBase: new URL("https://pluginexpert.ru"),
  title: {
    default: "Plug-In Expert — база спикеров, тренеров и коучей",
    template: "%s | Plug-In Expert",
  },
  description:
    "Агентство по подбору спикеров, тренеров и коучей. Открытая база спикеров с контактными данными. Найдите спикера без посредников для корпоративных и маркетинговых мероприятий.",
  keywords: [
    "база спикеров",
    "спикерское агентство",
    "найти спикера",
    "контакты спикера",
    "агентство по спикерам",
    "сайт со спикерами",
    "найти коуча",
    "найти тренера",
    "подбор спикеров",
  ],
  authors: [{ name: "Plug-In Expert" }],
  creator: "Plug-In Expert",
  publisher: "Plug-In Expert",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://pluginexpert.ru",
    siteName: "Plug-In Expert",
    title: "Plug-In Expert — база спикеров, тренеров и коучей",
    description:
      "Агентство по подбору спикеров, тренеров и коучей. Открытая база спикеров с контактными данными. Найдите спикера без посредников.",
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
      "Агентство по подбору спикеров, тренеров и коучей. Открытая база спикеров с контактными данными.",
    images: ["https://pluginexpert.ru/images/plugin.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes if needed
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://pluginexpert.ru/#organization",
              name: "Plug-In Expert",
              alternateName: "PLUG-IN SOLUTIONS",
              url: "https://pluginexpert.ru",
              logo: "https://pluginexpert.ru/images/plugin.jpg",
              description:
                "Агентство по подбору и продвижению спикеров, тренеров и коучей. Открытая база спикеров с контактными данными.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+7-915-385-75-91",
                email: "hello@pluginexpert.ru",
                contactType: "Customer Service",
                areaServed: "RU",
                availableLanguage: ["Russian"],
              },
              sameAs: [
                // Add social media links if available
                // "https://www.facebook.com/pluginexpert",
                // "https://www.instagram.com/pluginexpert",
              ],
            }),
          }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://pluginexpert.ru/#website",
              url: "https://pluginexpert.ru",
              name: "Plug-In Expert",
              description:
                "Агентство по подбору спикеров, тренеров и коучей. Открытая база спикеров с контактными данными.",
              publisher: {
                "@id": "https://pluginexpert.ru/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://pluginexpert.ru/all-speakers?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Script
          id="schema-org-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://pluginexpert.ru/#localbusiness",
              name: "Plug-In Expert",
              image: "https://pluginexpert.ru/images/plugin.jpg",
              url: "https://pluginexpert.ru",
              telephone: "+7-915-385-75-91",
              email: "hello@pluginexpert.ru",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RU",
              },
              geo: {
                "@type": "GeoCoordinates",
                // Add coordinates if available
                // latitude: "55.7558",
                // longitude: "37.6173",
              },
            }),
          }}
        />
      </head>
      <body className={`${raleway.variable} ${play.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
