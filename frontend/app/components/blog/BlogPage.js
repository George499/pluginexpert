// components/blog/BlogPage.js
import Link from "next/link";

const STRAPI_API_URL = "https://admin.pluginexpert.ru/api";

async function fetchPosts() {
  const res = await fetch(
  `${STRAPI_API_URL}/posts?populate=main_image`,
  { cache: "no-store" }
);
    if (!res.ok) throw new Error("Ошибка загрузки постов");
    const data = await res.json();

    console.log(data);
  
  return data.data.map((post) => ({
    slug: post.slug, 
    title: post.title,
    image: post.main_image?.url 
  ? `https://admin.pluginexpert.ru${post.main_image.url}`
  : "/images/placeholder.jpg",
    date: new Date(post.createdAt).toLocaleDateString("ru-RU"),
  }));
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  if (!posts || posts.length === 0) {
    return <p className="text-center text-white">Нет постов</p>;
  }

  const [firstPost, ...otherPosts] = posts;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 -mt-20">
      
      {/* Главная карточка */}
      <div className="mb-10 mt-40">
        <Link
          href={`/blog/${firstPost.slug}`}
          className="block md:grid md:grid-cols-2 gap-20 "
        >
          <img
            src={firstPost.image}
            alt={firstPost.title}
            className="w-full aspect-square object-cover rounded-lg shadow-l"
          />
          <div className="flex flex-col justify-center max-w-xl space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-[600px]:text-[25px]
            max-[600px]:mt-10">
              {firstPost.title}
            </h1>
           
            <h2 className="text-gray-200 text-base md:text-lg">
              {firstPost.date}
            </h2>
          </div>
        </Link>
      </div>

        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white text-white/80">
                Главная
              </Link>
            </li>
            <li className="text-white/50">/</li>
            <li className="text-white">Блог</li>
          </ol>
        </nav>

      {/* Остальные карточки */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-lg overflow-hidden bg-[#2f2e2e]/80 shadow hover:shadow-lg transition"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 min-h-[120px] flex flex-col justify-between">
              <h3 className="text-lg font-bold text-white line-clamp-3">{post.title}</h3>
              <p className="text-xs text-gray-300 mt-2">
                {post.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
