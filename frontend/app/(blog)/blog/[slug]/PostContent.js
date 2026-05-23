"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

// Кастомные стили блоков статьи. Нужно лежать в client component, потому что
// сам BlocksRenderer помечен 'use client' и не принимает функции через server boundary.
const customBlocks = {
  heading: ({ level, children }) => {
    const Tag = `h${level}`;
    const classes =
      level === 1
        ? "text-3xl font-bold leading-tight mb-6"
        : level === 2
          ? "text-2xl font-semibold leading-snug mb-4"
          : level === 3
            ? "text-xl font-medium leading-normal mb-3"
            : "text-lg font-bold mb-2";
    return <Tag className={classes}>{children}</Tag>;
  },
  paragraph: ({ children }) => (
    <p className="text-lg leading-relaxed mb-4">{children}</p>
  ),
  list: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
  "list-item": ({ children }) => <li className="ml-4">{children}</li>,
  link: ({ href, children }) => (
    <a href={href} className="text-blue-400 hover:underline">
      {children}
    </a>
  ),
  bold: ({ children }) => <strong>{children}</strong>,
  italic: ({ children }) => <em>{children}</em>,
  underline: ({ children }) => <u>{children}</u>,
};

export default function PostContent({ content }) {
  if (!content) {
    return <p>Содержимое статьи будет добавлено в ближайшее время.</p>;
  }
  return <BlocksRenderer content={content} blocks={customBlocks} />;
}
