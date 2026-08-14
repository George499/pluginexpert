"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

// Клиентская обёртка: BlocksRenderer помечен 'use client' и не принимает
// функции-рендереры через server boundary (тот же паттерн, что в блоге).
const blocks = {
  heading: ({ level, children }) => {
    const Tag = `h${level === 1 ? 2 : level}`; // H1 на странице только один — заголовок категории
    const classes =
      level <= 2
        ? "text-[24px] lg:text-[30px] font-bold text-[#42484D] mt-8 mb-3"
        : "text-[19px] lg:text-[22px] font-bold text-[#42484D] mt-6 mb-2";
    return <Tag className={classes}>{children}</Tag>;
  },
  paragraph: ({ children }) => (
    <p className="text-[16px] lg:text-[18px] leading-relaxed mb-4">{children}</p>
  ),
  list: ({ children, format }) =>
    format === "ordered" ? (
      <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>
    ) : (
      <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
    ),
  "list-item": ({ children }) => <li className="leading-relaxed">{children}</li>,
  link: ({ href, children }) => (
    <a href={href} className="text-[#4e5ac3] hover:underline">
      {children}
    </a>
  ),
  quote: ({ children }) => (
    <blockquote className="border-l-4 border-[#4e5ac3] pl-4 italic my-4">
      {children}
    </blockquote>
  ),
};

export default function CategorySeoText({ content }) {
  if (!content) return null;
  return <BlocksRenderer content={content} blocks={blocks} />;
}
