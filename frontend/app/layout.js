import localFont from "next/font/local";
import "./globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import { Raleway } from "next/font/google";
import { Play } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });
const play = Play({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Plug-In Expert - Главная страница",
  description:
    "Plug-In Expert – агентство по подбору спикеров в соответствии с вашими задачами. Мы поможем найти спикеров.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${raleway.className} ${play.className} antialiased min-h-screen`}
      >
        <Header />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  );
}
