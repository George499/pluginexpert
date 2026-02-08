import "globals.css";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/main-page/Header";

export const metadata = {
  title: "Plug-In Expert - Главная страница",
  description:
    "Plug-In Expert – агентство по подбору спикеров в соответствии с вашими задачами. Мы поможем найти спикеров.",
};

export default function PaymentLayout({ children }) {
  return (
    <>
      <Header />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </>
  );
}
