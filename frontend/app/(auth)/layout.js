import "../globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/auth/Header";

export const metadata = {
  title: "Plug-In Expert - Главная страница",
  description:
    "Plug-In Expert – агентство по подбору спикеров в соответствии с вашими задачами. Мы поможем найти спикеров.",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
