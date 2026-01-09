"use client"; 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";

export default function PostDetail() {
  const { slug } = useParams();  // 👈 достаём slug из URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `https://admin.pluginexpert.ru/api/posts?filters[slug][$eq]=${slug}&populate=*`
        );
        if (!res.ok) throw new Error("Ошибка загрузки поста");
        const data = await res.json();
        setPost(data.data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (!post) return <p className="text-white p-10">Загрузка...</p>;

  const customBlocks = {
  heading: ({ level, children }) => {
    const Tag = `h${level}`;
    let classes = "";

    switch (level) {
      case 1:
        classes = "text-3xl font-bold leading-tight mb-6";
        break;
      case 2:
        classes = "text-2xl font-semibold leading-snug mb-4";
        break;
      case 3:
        classes = "text-xl font-medium leading-normal mb-3";
        break;
      default:
        classes = "text-lg font-bold mb-2";
    }

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

  return (
    <>
      <main className="min-h-screen bg-[url('/images/bkground_1.png')] bg-fixed text-white px-6 py-20">
        <div className="max-w-3xl mx-auto">
            {/* Хлебные крошки */}
        <nav
          className="text-sm text-gray-300 mb-6 mt-4"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 flex-wrap">
            {/* Главная */}
            <li>
              <Link href="/" className="hover:text-white text-white/80 transition-colors">
                Главная
              </Link>
            </li>

            <li className="text-white/50">/</li>

            {/* Страница блога */}
            <li>
              <Link href="/blog" className="hover:text-white text-white/80 transition-colors">
                Блог
              </Link>
            </li>

            <li className="text-white/50">/</li>

            {/* Текущая статья */}
            <li className="text-white truncate max-w-[250px] sm:max-w-[400px] md:max-w-[600px]" title={post.title}>
              {post.title}
            </li>
          </ol>
        </nav>

          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

          {post.main_image?.url && (
            <img
              src={`https://admin.pluginexpert.ru${post.main_image.url}`}
              alt={post.title}
              className="mb-8 rounded-lg"
            />
          )}

          <div className="space-y-4">
            <BlocksRenderer content={post.content} blocks={customBlocks} />
          </div>
        </div>
      </main>
    </>
  );
}