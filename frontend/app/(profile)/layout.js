// app/profile/layout.js
import Header from "@/components/main-page/Header";
import { AnimatePresence } from "framer-motion";
import { Raleway } from "next/font/google";
import { Play } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });
const play = Play({ subsets: ["latin"], weight: ["400", "700"] });

export default function ProfileLayout({ children }) {
  return (
    <div className={`${raleway.className} ${play.className} antialiased min-h-screen`}>
      <Header />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </div>
  );
}
