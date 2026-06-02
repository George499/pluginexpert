import "../globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/auth/Header";

export const metadata = {
  title: "Вход или регистрация | Прямая Речь",
  description:
    "Авторизация и регистрация на сайте Прямая Речь. Войдите в личный кабинет или создайте новую учетную запись.",
};

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
