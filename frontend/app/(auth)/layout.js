import "../globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/auth/Header";

export const metadata = {
  title: "Вход или регистрация | Plug-In Expert",
  description:
    "Авторизация и регистрация на сайте Plug-In Expert. Войдите в личный кабинет или создайте новую учетную запись.",
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
