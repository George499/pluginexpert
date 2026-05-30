"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Презентационный клиентский компонент: получает спикеров пропсами (SSR-данные),
// добавляет fade-in анимацию. Данные фетчатся на сервере в PopularSpeakers.js.
export default function PopularSpeakersList({ speakers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {speakers.map((speaker) => (
        <motion.div
          key={speaker.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Link href={`/profile/${speaker.Slug}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={
                    speaker.gallery?.[0]?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.pluginexpert.ru"}${speaker.gallery[0].url}`
                      : "/images/default.jpg"
                  }
                  alt={speaker.Name || "Спикер"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1B1B1E]">
                  {speaker.Name}
                </h3>
                <p className="text-sm text-[#42484D] mt-1">
                  {speaker.Profession}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
