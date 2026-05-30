# SEO-аудит фронтенда pluginexpert.ru

**Дата:** 2026-05-23
**Скоуп:** `C:\dev\pluginexpert\frontend` (Next.js 15 App Router, JS, бэкенд Strapi 5 на `admin.pluginexpert.ru`)
**Тип:** Read-only анализ. Код не правится.

---

## Резюме (TL;DR)

Сайт частично готов к SEO: есть базовая Open Graph/Twitter разметка, JSON-LD `Organization`/`WebSite`/`LocalBusiness`/`Blog`/`Person`, динамический `app/sitemap.js` и `app/robots.js`. Но критических проблем достаточно, чтобы Яндекс/Google и нейропоиск получали с большинства страниц «пустую» HTML-оболочку:

1. **Каталог `/all-speakers` и страницы детали блога `/blog/[slug]` рендерятся client-only** (`"use client"` + `useEffect` + `fetch`). Поисковикам приходит каркас без спикеров и без текста статьи.
2. **Конфликт двух источников sitemap и robots**: динамический `app/sitemap.js`/`app/robots.js` и статические `public/sitemap.xml`/`public/robots.txt`. Next.js в App Router отдаёт `app/*` — статические файлы становятся «мертвым кодом» с расхождением (например, в `public/robots.txt` запрет `*?page=` и `Host:`, чего нет в динамическом, а в `app/robots.js` запрет `/dashboard/`, чего нет в статическом).
3. **На главной два H1** (`FirstScreen.js:23` и блок-картинка спикера в `BlogPage.js:52` тоже использует H1 на странице списка). На `/blog` (списочной) — два H1 и `h2` для даты. На детальной странице блога два H1 (в `BlogDetail.js:77` и внутри Strapi-блоков, если автор поставил `heading level=1`).
4. **Нет ни одного `alternates.canonical`** ни в одной странице/лэйауте.
5. **Нет Schema.org для ключевых сущностей**: `BreadcrumbList`, `ItemList` (каталог спикеров), `BlogPosting`/`Article` (статьи), `FAQPage`, `Service`/`Offer` (тарифы). `Person`-схема на странице спикера почти пустая (нет `sameAs`, `contactPoint`, `address`, `image` берётся из неверного пути `speaker.Photo.url`, который в новых данных Strapi 5 не существует).
6. **Verification-коды Яндекс.Вебмастера и Google Search Console пустые** (`layout.js:72-76` — закомментировано).
7. **Категорийных публичных URL нет**. Категории — только клиентский фильтр в state. Это потерянный SEO-трафик по NLP-запросам типа «спикеры по маркетингу», «коучи по продажам».
8. **Контактные блоки сайта генерируют дубли разметки** (`Organization` в `layout.js`, `Organization` в `(home)/layout.js`, `Organization` в `(all-speakers)/layout.js`, `Organization` в `(pricing)/layout.js`) — у Google JSON-LD validator это вызовет конфликты `@id` или повторяющиеся сущности без `@id`.

---

## Таблица «Находки»

| # | Severity | Проблема | Файл:строка | Рекомендация |
|---|----------|----------|-------------|--------------|
| 1 | CRITICAL | Каталог спикеров client-only — поисковик видит пустую страницу | `app/(all-speakers)/all-speakers/page.js:1` (`"use client"`) | Перенести fetch в серверный компонент. Использовать `fetch(..., { next: { revalidate: 600 } })` |
| 2 | CRITICAL | Детальная страница блога client-only | `app/components/blog-detail/BlogDetail.js:1-27` | Переделать на серверный компонент по аналогии с `(profile)/profile/[slug]/page.js` |
| 3 | CRITICAL | Список «Популярные спикеры» на главной — client-only | `app/components/main-page/PopularSpeakers.js:1-27` | Сделать серверный fetch в page.js или отдельный server-компонент |
| 4 | CRITICAL | Блок ForthScreen (каталог категорий + сетка спикеров на главной) — client-only | `app/components/main-page/ForthScreen.js:1-64` | Перенести получение categories+speakers на сервер, оставить только переключение через href, а не state |
| 5 | CRITICAL | SpecialText (длинный текстовый блок с ключевыми словами) — client-only | `app/components/main-page/SpecialText.js:1-23` | Server fetch в layout/page |
| 6 | CRITICAL | AllSpeakersSpecialText — client-only | `app/components/all-speakers/AllSpeakersSpecialText.js:1-23` | Server fetch |
| 7 | HIGH | Конфликт `public/sitemap.xml` и `app/sitemap.js`: разный набор URL и стилей | `frontend/public/sitemap.xml:1` vs `frontend/app/sitemap.js:1` | Удалить `public/sitemap.xml`. App Router отдаёт динамический. Текущий статический файл не содержит профилей спикеров и быстро устаревает (lastmod `2025-11-15`) |
| 8 | HIGH | Конфликт `public/robots.txt` и `app/robots.js`: разные правила | `frontend/public/robots.txt:1-16` vs `frontend/app/robots.js:1-10` | Удалить `public/robots.txt`. Перенести нужные правила (`Disallow: *?s=`, `*?page=`, `Host:`) в `app/robots.js` |
| 9 | HIGH | Нет `alternates.canonical` ни на одной странице | весь `app/**/layout.js` и `page.js` | Добавить `alternates: { canonical: 'https://pluginexpert.ru/<path>' }` во все `metadata`/`generateMetadata` |
| 10 | HIGH | Verification-коды Yandex/Google не заполнены | `app/layout.js:72-76` | Получить коды в Яндекс.Вебмастере и GSC, заполнить `verification: { yandex: '...', google: '...' }` |
| 11 | HIGH | Нет `BreadcrumbList` ни на одной странице | весь сайт | Добавить хлебные крошки + JSON-LD на `/blog/[slug]` и `/profile/[slug]` |
| 12 | HIGH | Нет `BlogPosting`/`Article` schema на странице статьи | `app/(blog)/blog/[slug]/page.js`, `BlogDetail.js` | Сгенерировать `BlogPosting` с `headline`, `datePublished`, `author`, `image`, `mainEntityOfPage` |
| 13 | HIGH | На странице блога (list) — главный пост обёрнут в `<h1>`, а это страница списка с серверным `<h1>`-заголовком отсутствует (есть только `<h1>` внутри карточки) | `app/components/blog/BlogPage.js:52` | Сделать корневой `<h1>` страницы блога «Блог о спикерах…», карточки перевести на `<h2>` |
| 14 | HIGH | Нет ни одной публичной URL-страницы категории (`/all-speakers/marketing`, `/all-speakers/sales` и т. д.) | `app/(all-speakers)/all-speakers/page.js:31-59` (фильтр только в state) | Добавить динамический сегмент `app/(all-speakers)/all-speakers/[category]/page.js` + сгенерировать sitemap |
| 15 | HIGH | На главной заголовок `<h1>` всего один, но он `sr-only` (скрыт), а визуальный главный — это `<p>` | `app/components/main-page/FirstScreen.js:23,37-60` | Сделать `<h1>` визуальным (не sr-only). `sr-only`-приём ослабляет ранжирование по фразам, выделенным визуально, но не семантически |
| 16 | MEDIUM | Schema.org `Person` на странице спикера: ссылка на `speaker.Photo.url`, но fetch берёт `speaker.avatar?.url` и далее `speaker.gallery` — несогласованность, schema будет валидной только если случайно совпадут поля | `app/(profile)/profile/[slug]/page.js:27-30,73-77` | Поправить путь до фото: `speaker.gallery?.[0]?.url`. Добавить `sameAs` (соцсети), `contactPoint`, `address`, `email`, `telephone` |
| 17 | MEDIUM | Дублирующиеся Organization-схемы без `@id` в `(home)/layout.js:54`, `(all-speakers)/layout.js:54`, `(pricing)/layout.js:52` | три файла | Удалить дубли. Глобальный `Organization` уже есть в `app/layout.js:84-112`. На дочерних страницах оставить только специфические типы (`ItemList`, `WebPage`, `Service`) |
| 18 | MEDIUM | На главной целая секция «ПОПУЛЯРНЫЕ СПИКЕРЫ» — это `<h2>`, но спикеры внутри — `<h3>` с цветом текста чёрным на чёрном фоне (`text-[#000000]` на hover-overlay) и видны только при hover. Боты их видят, но человек — только наведя | `app/components/main-page/PopularSpeakers.js:60` | Сделать список доступным без hover. Сейчас контент существует, но UX слабый — может работать против поведенческих факторов |
| 19 | MEDIUM | Footer ссылается на `/speakers/blog`, который редиректит 301 → `/blog` (есть в `next.config.mjs:14-22`) — лишний редирект на каждой странице | `app/components/main-page/Footer.js:60` | Поменять на `/blog` напрямую |
| 20 | MEDIUM | Footer хардкодит абсолютный URL `https://pluginexpert.ru/pricing` вместо относительного | `app/components/main-page/Footer.js:55` | Заменить на `/pricing` (внутренние ссылки должны быть относительными) |
| 21 | MEDIUM | На детальной спикера используется `<h1>КОНТАКТЫ СПИКЕРА</h1>` (`SpeakerContacts.js:67`) — это второй H1 на странице (первый — имя в `SpeekerFirstScreen.js`? нет, там `<p>`, имя оборачивается в `<p>`, а не в `<h1>`) | `app/components/speaker-detail/SpeakerContacts.js:67` и отсутствие H1 в `SpeekerFirstScreen.js:67-69` | На странице спикера должен быть один `<h1>` с именем спикера. «КОНТАКТЫ СПИКЕРА» сделать `<h2>` |
| 22 | MEDIUM | Pricing-страница — нет `Service`/`Offer` schema с ценами тарифов (3/6/10 мес) | `app/(pricing)/pricing/page.js`, `PricingSecondScreen.js:60-74` | Добавить `Service` с `offers` массивом — даст rich-snippet с ценой |
| 23 | MEDIUM | `next/image` с `unoptimized: true` в `next.config.mjs:5` — отключена оптимизация на проде | `frontend/next.config.mjs:4-10` | Если используется внешний CDN/loader — OK. Если нет — включить оптимизацию для скорости (Core Web Vitals → ранжирование) |
| 24 | LOW | `alt` у `ProductCard` берётся как имя без подписи: `alt={speaker?.Name \|\| "Спикер"}` | `app/components/all-speakers/ProductCard.js:62` | Сделать `alt="Фото: {Name} — {Profession}"` для большей семантики |
| 25 | LOW | На главной первый блок имеет `id="first screen"` с пробелом — невалидный HTML id | `app/components/main-page/FirstScreen.js:4` | Заменить на `first-screen` или удалить |
| 26 | LOW | `mailto:mailto:hello@pluginexpert.ru` (двойной префикс) на двух страницах | `app/components/speaker-detail/SpeekerSecondScreen.js:72`, `SpeakerContacts.js:124` | Убрать дубль `mailto:` |
| 27 | LOW | `description` пустой во многих layout, но в `(home)/layout.js:8` и `(all-speakers)/layout.js:8` есть. На странице регистрации/входа `metadata` есть в `(auth)/layout.js:5-9`, но они открыты для индексации в `app/robots.js:6` только частично (`/auth/` запрещён в robots, что ок) | OK | — |
| 28 | LOW | OG-картинка единая на весь сайт (`/images/plugin.jpg`). На детальных спикерах должна быть фото спикера, генерация работает, но fallback тоже = `plugin.jpg` | `app/(profile)/profile/[slug]/page.js:27-30` | После фикса пути — будет ок |
| 29 | LOW | `Footer.js:1` `"use client"` — не нужен, в футере нет ни одного клиентского хука | `app/components/main-page/Footer.js:1` | Убрать `"use client"`. Незначительно увеличит SSR-payload (поисковикам не критично, но bundle меньше) |
| 30 | LOW | Twitter card не верифицирован (`site` и `creator` не указаны) | `app/layout.js:54-60` | Добавить `site: '@pluginexpert'`, `creator: '@pluginexpert'` если есть аккаунт |

---

## 1. SSR vs CSR — где поисковик видит пустоту

**Вердикт: CRITICAL**

| Путь | Тип page.js | Что видит бот в HTML |
|------|-------------|----------------------|
| `/` (home) | Server | Видит статический текст FirstScreen, SecondScreen, ThirdScreen, FifthScreen. НЕ видит: ForthScreen (категории + спикеры), PopularSpeakers, SpecialText (длинный SEO-текст из Strapi) |
| `/all-speakers` | **Client (`"use client"`)** | Видит layout с h1.sr-only «ПОДБОР СПИКЕРОВ», но НЕ видит список спикеров и категорий |
| `/blog` | Server (BlogPage — async) | Видит карточки постов и заголовки. ОК |
| `/blog/[slug]` | **Client (через BlogDetail "use client")** | Видит только `<p>Загрузка...</p>`. **Контент статьи отсутствует в SSR.** Это огромная потеря SEO — статьи блога не индексируются по тексту |
| `/profile/[slug]` | Server (generateMetadata + getSpeaker) | Видит данные спикера, но внутренние компоненты `SpeekerFirstScreen`, `SpeekerInfoScreen`, `SpeekerSecondScreen`, `SpeakerPrice`, `SpeakerContacts` все `"use client"` — данные передаются как props и рендерятся, поэтому в HTML контент ЕСТЬ. Двусмысленно: компоненты с `"use client"` всё равно рендерят server-shell, если их props заданы на сервере. **Контент видим.** ОК |
| `/pricing` | Server | Layout + три тарифа — статичны. ОК |
| `/auth/signin`, `/auth/register` | Client | OK — закрыто `Disallow: /auth/` в robots |
| `/dashboard/*` | Client | OK — закрыто `Disallow: /dashboard/` |

**Конкретные цитаты:**

```
frontend/app/(all-speakers)/all-speakers/page.js:1  "use client";
frontend/app/(all-speakers)/all-speakers/page.js:16 useEffect(() => { ... fetchCategories() }, []);
frontend/app/(all-speakers)/all-speakers/page.js:31 useEffect(() => { ... fetchSpeakers() }, [selectedCategory]);
```

```
frontend/app/components/blog-detail/BlogDetail.js:1   "use client";
frontend/app/components/blog-detail/BlogDetail.js:13  useEffect(() => { async function fetchPost() {...} }, [slug]);
frontend/app/components/blog-detail/BlogDetail.js:29  if (!post) return <p className="text-white p-10">Загрузка...</p>;
```

```
frontend/app/components/main-page/ForthScreen.js:1   "use client";
frontend/app/components/main-page/PopularSpeakers.js:1  "use client";
frontend/app/components/main-page/SpecialText.js:1   "use client";
```

**Рекомендация:** перевести как минимум `BlogDetail`, `all-speakers/page.js`, `PopularSpeakers`, `ForthScreen`, `SpecialText` на серверный рендеринг (как сделано в `profile/[slug]/page.js`). State (фильтр категорий) можно держать в URL через `searchParams`, а fetch — на сервере.

---

## 2. Sitemap / Robots — конфликт двух источников

**Вердикт: HIGH**

В проекте одновременно живут:

**Динамические (App Router):**

- `frontend/app/robots.js:1-10` — `Disallow: /api/, /dashboard/, /auth/, /payment-complete`
- `frontend/app/sitemap.js:1-28` — статические страницы + динамические URL спикеров из Strapi с `revalidate: 3600`

**Статические (public/):**

- `frontend/public/robots.txt:1-16` — `Disallow: *?s=, *&s=, *utm_*, *openstat=, *?page=, /author/, */embed$, /xmlrpc.php, /auth/signin, /auth/register, /auth/`, `Host: pluginexpert.ru`, `Sitemap: ...`
- `frontend/public/sitemap.xml:1-87` — статический список со старым `lastmod 2025-11-15` и без профилей спикеров

**Поведение Next.js App Router:** при наличии `app/sitemap.js` и `app/robots.js` они **переопределяют** статические файлы из `public/`. То есть отдаются динамические. Но:

1. Это неочевидно — кто-то может зайти прямой ссылкой на `/sitemap.xml` и получить динамику, а на `/sitemap-static.xml`... нет, отдаётся `/sitemap.xml` всегда из `app/sitemap.js`. **Тем не менее, наличие физического `public/sitemap.xml` создаёт путаницу — Next.js пытается обслужить файл из public и динамику одновременно, и поведение зависит от версии.**
2. В `public/robots.txt` есть полезное `Disallow: *?s=` (от поисковых страниц с UTM), `Disallow: *?page=`, `Host: pluginexpert.ru`, которых нет в `app/robots.js`.
3. В sitemap.xml статичном нет фактических ссылок на профили спикеров — он устарел, но если он будет отдан — ничего страшного, потому что динамика всё равно перебивает. Но если её не отдают (например, fetch к Strapi упал — return staticPages в `sitemap.js:25-27`), бот получит огрызок.

**Рекомендация:**

- **Удалить** `frontend/public/sitemap.xml` и `frontend/public/robots.txt`.
- Перенести в `app/robots.js` правила: `Disallow: *?s=`, `*&s=`, `*utm_*`, `*?page=`. Удалить `Host:` (он deprecated, Яндекс уже несколько лет рекомендует `<link rel="canonical">` и редиректы 301).
- В `app/sitemap.js` добавить URL блог-постов (сейчас их нет), категорийных страниц (когда появятся) и pricing.

---

## 3. Метатеги — где есть, где пусто, где дубли

**Вердикт: MEDIUM**

| URL | metadata источник | title | description | OG | Twitter |
|-----|-------------------|-------|-------------|-----|---------|
| `/` | `(home)/layout.js:6-45` | Есть | Есть | Есть | Есть |
| `/all-speakers` | `(all-speakers)/layout.js:6-44` | Есть | Есть | Есть | Есть |
| `/blog` | `(blog)/layout.js:13-50` | Есть | Есть | Есть | Есть |
| `/blog/[slug]` | **Нет `generateMetadata`** | template из root | дефолт | дефолт | дефолт |
| `/profile/[slug]` | `(profile)/profile/[slug]/page.js:13-58` | `${Name} | Спикер | Plug-In Expert` | по Profession | по фото (битый путь) | OK |
| `/pricing` | `(pricing)/layout.js:6-43` | Есть | Есть | Есть | Есть |
| `/auth/*` | `(auth)/layout.js:5-9` | один на всю группу | дефолт | — | — |
| `/dashboard/*` | `(dashboard)/layout.js:5-9` | один | дефолт | — | — |

**Проблемы:**

1. **Детальная страница блога** (`/blog/[slug]`) — нет `generateMetadata`. Каждый пост получает дефолтный title `"%s | Plug-In Expert"` без `%s` (то есть просто `"Plug-In Expert"`). Это потеря десятков title по уникальным запросам.
2. **OG-картинка** — везде одна и та же `/images/plugin.jpg`. На спикерах она генерируется по `speaker.Photo.url`, но фактически в Strapi поле называется `gallery` (см. `getSpeaker` в `profile/[slug]/page.js:121-147` — fetch использует `populate=avatar`, но обращается дальше к `speaker.Photo.url`). **Этот путь не существует** — fallback на дефолт.
3. **Title-template** в root: `template: "%s | Plug-In Expert"` (`layout.js:14`). Это работает только если в дочерней `metadata.title` указана строка. На `(profile)/profile/[slug]/page.js:34` title уже включает «| Plug-In Expert» в самой строке — получится `"Иван Иванов | Спикер | Plug-In Expert | Plug-In Expert"` (двойной хвост). Поверь: проверить можно через view-source.

**Рекомендация:** добавить `generateMetadata` в `(blog)/blog/[slug]/page.js`, исправить путь к фото в `Person`-schema и OG, убрать двойной «| Plug-In Expert» в title.

---

## 4. Schema.org JSON-LD — пробелы

**Вердикт: HIGH**

| Тип | Где есть | Где должен быть, но нет |
|-----|----------|--------------------------|
| `Organization` | `app/layout.js:84-112`, `(home)/layout.js:54-73`, `(all-speakers)/layout.js:54-73`, `(pricing)/layout.js:52-71` | — (есть дубли, лучше оставить только один глобальный) |
| `WebSite` + `SearchAction` | `app/layout.js:113-139` | OK |
| `LocalBusiness` | `app/layout.js:140-166` | OK, но `address` и `geo` пустые |
| `Blog` | `(blog)/layout.js:58-83` | OK |
| `Person` | `(profile)/profile/[slug]/page.js:80-99` | Есть, но минимальная: нет `sameAs` (соцсети), `email`, `telephone`, `address`, `birthDate`, неправильный `image` |
| `BreadcrumbList` | **Нигде** | На всех вложенных страницах (`/blog/[slug]`, `/profile/[slug]`, `/all-speakers`, `/pricing`) |
| `ItemList` | **Нигде** | На каталоге `/all-speakers` (список спикеров) и `/blog` (список постов). Без этого Google не показывает rich results для каталога |
| `BlogPosting` / `Article` | **Нигде** | На каждой странице `/blog/[slug]`. Это блокирует попадание в Google Discover, в Яндекс.Дзен/Турбо |
| `FAQPage` | **Нигде** | На `/pricing` (вопросы про оплату), на главной (часто задаваемые вопросы про спикеров) |
| `Service` / `Offer` | **Нигде** | На `/pricing` для трёх тарифов с ценами 4000/6000/12000 руб |
| `ContactPage` | **Нигде** | Можно добавить отдельную страницу контактов |

**Цитаты с проблемами:**

```
app/(profile)/profile/[slug]/page.js:27-30
const speakerImage = speaker.avatar?.url
  ? `${STRAPI_URL}${speaker.Photo.url}`     // <-- проверяется avatar, а используется Photo. Несогласовано.
  : "https://pluginexpert.ru/images/plugin.jpg";
```

```
app/(profile)/profile/[slug]/page.js:80-99 — Person без contactPoint, email, sameAs
```

**Рекомендация:**

- Добавить `BreadcrumbList` (например, через хелпер `buildBreadcrumbs(path)`) во все вложенные страницы.
- На `/blog/[slug]` добавить `BlogPosting` с `headline`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`.
- На `/all-speakers` добавить `ItemList` с массивом `Person`-объектов.
- На `/pricing` добавить `Service` с `offers` (priceCurrency: "RUB", price, validFrom).
- Расширить `Person` на профиле: `sameAs`, `email` (если разрешено публиковать), `worksFor`, `knowsAbout` (категории).

---

## 5. Canonical

**Вердикт: HIGH**

`grep -rn "alternates\|canonical" app/` дал **0 совпадений**.

Не указан `alternates.canonical` ни в одном файле. Это значит:

- При параметрах в URL (`?utm_source=...`, `?ref=...`) поисковик может проиндексировать дубль.
- При случайном префиксе `www.` или другом домене (если кто-то поставит ссылку) — дубль.
- При наличии `/all-speakers/` и `/all-speakers` — дубль.

**Рекомендация:**

```js
// в каждом layout.js / page.js
export const metadata = {
  ...,
  alternates: {
    canonical: 'https://pluginexpert.ru/<path>',
  },
};
```

На динамических страницах — в `generateMetadata`.

---

## 6. Заголовки H1/H2

**Вердикт: HIGH**

| Страница | H1 | Проблема |
|----------|-----|----------|
| `/` (home) | 1 шт., `sr-only` в `FirstScreen.js:23` | H1 скрыт от пользователя — слабый сигнал; визуальный заголовок — `<p>` |
| `/all-speakers` | 1 шт., `sr-only` в `AllSpeakers.js:76` | Тоже скрыт, основной — `<h2>` |
| `/blog` | 1 шт. в `BlogPage.js:52` — это заголовок первого поста | Нет общего H1 страницы блога. Карточка поста — это не H1 страницы блога, это название статьи. На странице списка надо: общий `<h1>Блог о спикерах…</h1>`, каждая карточка — `<h2>` или `<h3>` |
| `/blog/[slug]` | 1 шт. в `BlogDetail.js:77` | OK, но Strapi-контент может содержать `level: 1` headings — тогда получится 2+ H1 |
| `/profile/[slug]` | 1 шт. в `SpeakerContacts.js:67` — «КОНТАКТЫ СПИКЕРА» | **Это неправильный H1.** H1 на странице спикера должен быть именем спикера. Имя сейчас обёрнуто в `<p>` (`SpeekerFirstScreen.js:67-69`) |
| `/pricing` | 1 шт., `sr-only` в `PricingFirstScreen.js:19` | Скрытый H1, визуально — `<h2>` |

**Рекомендация:**

1. Убрать `sr-only` с H1 — делать их визуальными заголовками.
2. На `/blog` добавить общий `<h1>`, карточки сделать `<h2>`.
3. На `/profile/[slug]` обернуть имя спикера в `<h1>`, «КОНТАКТЫ СПИКЕРА» сделать `<h2>`.

---

## 7. Категорийные / фасетные страницы

**Вердикт: CRITICAL (упущенная возможность)**

Текущая модель:

```
app/(all-speakers)/all-speakers/page.js:31-59
useEffect(() => { ...filters[categories][slug][$eq]=${selectedCategory} }, [selectedCategory]);
```

Фильтр живёт в React-state. URL не меняется. Поисковик никогда не увидит «спикеры по маркетингу», «коучи по продажам» как отдельные страницы.

Между тем категории уже имеют `slug` в Strapi (`backend_strapi/src/api/category/content-types/category/schema.json:17-20`), и API уже поддерживает фильтрацию по слагу (`filters[categories][slug][$eq]=...`).

**Рекомендация:** создать `app/(all-speakers)/all-speakers/[category]/page.js` с серверным fetch, отдельным `<h1>{categoryTitle}</h1>`, `generateMetadata({ params })` и `generateStaticParams` для всех слагов. Добавить URL в sitemap. Это удвоит количество индексируемых страниц и сильно ударит по NLP-запросам в Яндекс (а также по нейропоиску — он любит чёткие тематические страницы).

---

## 8. Дубли URL

**Вердикт: MEDIUM**

1. **`/blog` редирект**: footer ссылается на `/speakers/blog` (`Footer.js:60`), который 301-редиректит на `/blog` (`next.config.mjs:14-22`). Лишний хоп — лучше использовать `/blog` напрямую.
2. **Старый sitemap содержит `/blog/kak-stat-spikerom` и `/blog/kak-stat-spikerom-vash-put-k-sczene-i-uspehu`** — это, скорее всего, две версии одной статьи. Если оба URL живы и отдают похожий контент — нужен canonical на одну из них или 301.
3. **`/blog/aktualnaya-baza-spikerov-s-ih-pryamymi-kontaktami-2025g`** и **`/blog/aktualnaya-baza-spikerov-s-ih-pryamymi-kontaktami-2025-godu`** — два URL с одинаковым смыслом. Дубль.
4. `app/sitemap.js` использует `BASE_URL` без `/` в конце, а `public/sitemap.xml` — с `/` (`https://pluginexpert.ru/`). Поисковик может проиндексировать оба варианта.

---

## 9. Картинки

**Вердикт: MEDIUM**

- `next/image` используется в `ProductCard.js`, `Product.js`, `PopularSpeakers.js`, `SpeekerFirstScreen.js`, `BlogPage.js`, `BlogDetail.js`. ОК.
- `unoptimized: true` в `next.config.mjs:5` — оптимизация next/image отключена. Картинки отдаются как есть (большие). Это плохо для Core Web Vitals (LCP). Поисковики используют LCP как сигнал ранжирования.
- `alt` атрибуты есть, но шаблонные: `alt="Спикер"`, `alt="Фото: {Name}"`. Можно улучшить (см. находку #24).
- `priority` нигде не используется (`PopularSpeakers.js:49` явно `priority={false}`). Hero-картинка на главной — это фон через CSS (`bg-[url('/images/bkground_1.png')]`), не `<Image>`, поэтому `priority` не релевантен.

**Рекомендация:** убрать `unoptimized: true` или подключить кастомный loader для Strapi-картинок.

---

## 10. Внутренняя перелинковка

**Вердикт: MEDIUM**

- **Из спикера в категории**: на странице спикера категории показываются (`SpeekerFirstScreen.js:18-37`), но не кликабельны. На `ProductCard.js:43-49` категории кликабельны, но они меняют локальный state, не ведут на отдельный URL.
- **Из статьи в статьи**: нет блока «Похожие статьи» на `/blog/[slug]`. Это критично для UX и для глубины обхода ботом.
- **Из статьи в спикеров**: блог не ссылается на конкретных спикеров и на их категории.
- **Из главной в блог**: ссылок нет, кроме шапки.
- **Из футера**: ссылки на ключевые страницы есть, но `Политика конфиденциальности` идёт PDF-документом (`Footer.js:67-82`) — PDF индексируется, но это не страница на сайте, теряется внутренний вес.

**Рекомендация:**

- На `/blog/[slug]` — блок «Похожие статьи» (по тегам/категориям).
- На `/profile/[slug]` — блок «Другие спикеры в этой категории».
- На `/all-speakers/[category]` (когда появится) — ссылки на смежные категории.
- HTML-версия «Политики конфиденциальности» (а не только PDF).

---

## 11. Verification-коды

**Вердикт: HIGH**

```
app/layout.js:72-76
verification: {
  // Add verification codes if needed
  // google: "your-google-verification-code",
  // yandex: "your-yandex-verification-code",
},
```

Закомментировано. Сайт не подтверждён ни в Яндекс.Вебмастере, ни в Google Search Console. Без подтверждения:

- Не получаете данные о позициях/CTR/ошибках индексации.
- Не получаете уведомления о санкциях.
- Не можете отправлять sitemap вручную.

**Рекомендация:** получить коды и заполнить:

```js
verification: {
  yandex: "abc123def456...",
  google: "g7H9...",
},
```

---

## 12. OG / Twitter

**Вердикт: MEDIUM**

- OG/Twitter заполнены в `app/layout.js:37-60`, `(home)/layout.js:21-44`, `(all-speakers)/layout.js:20-43`, `(blog)/layout.js:26-49`, `(pricing)/layout.js:20-43`, `(profile)/profile/[slug]/page.js:36-56`.
- **Все используют одну картинку** `https://pluginexpert.ru/images/plugin.jpg`. Для соцшеринга это нормально как fallback, но плохо для разнообразия превью.
- **На спикерах** картинка генерируется, но через битый путь `speaker.Photo.url` (см. находку #16) — фактически отдаётся fallback.
- **На блоге** нет per-post OG-картинки. Нужна `generateMetadata` со ссылкой на `post.main_image.url`.
- `twitter.site` и `twitter.creator` не указаны — у твит-карточки не будет привязки к аккаунту.

---

## 13. Структурные проблемы (на будущее)

**Вердикт: MEDIUM**

1. **i18n / hreflang**: `<html lang="ru">` захардкожен в `app/layout.js:81`. Никакой подготовки к многоязычности — нет `app/[locale]/`, нет `next-intl`/`next-international`. При желании добавить английскую версию придётся переписывать роутинг.
2. **Категорийные страницы** (см. п.7) — структурно отсутствует папка `app/(all-speakers)/all-speakers/[category]/`.
3. **Pagination**: на `/all-speakers` пагинации нет, всё подгружается одним fetch с `pagination[pageSize]=1000` (см. `sitemap.js:14`). Если спикеров станет 5000+ — упадёт по таймауту.
4. **RSS-feed для блога**: отсутствует. Это упрощает попадание в агрегаторы и Яндекс.Дзен.
5. **`metadataBase`** задан в `app/layout.js:11` — это хорошо, относительные пути в OG будут корректно резолвиться.
6. **`favicon`** в корне `app/` — OK. Но нет `apple-touch-icon`, `manifest.json`, нет иконок для PWA.
7. **404-страница** (`not-found.js`) — есть. ОК. Но она `"use client"`, что необязательно (можно сделать сервером, оставив только форму поиска в Client-компоненте).

---

## ТОП-5 действий по приоритету

1. **[CRITICAL] Перевести `/blog/[slug]` и `/all-speakers` на серверный рендеринг.** Сейчас Яндекс и Google индексируют пустые HTML-каркасы. Это блокирует рост в обоих поисковиках и делает невозможным попадание в нейропоиск.
   - Файлы: `app/components/blog-detail/BlogDetail.js:1-27`, `app/(all-speakers)/all-speakers/page.js:1`.
   - Эталон: `app/(profile)/profile/[slug]/page.js:121-147` (серверный fetch + ISR).

2. **[CRITICAL] Создать категорийные страницы `/all-speakers/[category]`.** В Strapi уже есть `slug` у каждой категории. Добавление таких страниц с серверным рендерингом и `generateStaticParams` удвоит число индексируемых URL и закроет десятки кластеров запросов («спикеры по маркетингу», «коучи по продажам» и т. д.).
   - Создать: `app/(all-speakers)/all-speakers/[category]/page.js`.
   - Обновить: `app/sitemap.js` (добавить URL категорий).

3. **[HIGH] Удалить статические `public/sitemap.xml` и `public/robots.txt`. Заполнить verification-коды Яндекс и Google.** Перенести нужные правила (`Disallow: *?s=`, `*?page=`) в `app/robots.js`. Получить и вставить коды подтверждения сайта (`app/layout.js:72-76`). Без этого вы вслепую — нет данных о позициях, ошибках, индексации.

4. **[HIGH] Добавить `alternates.canonical` во все страницы и расширить Schema.org**: `BreadcrumbList` (везде), `BlogPosting` (на `/blog/[slug]`), `ItemList` (на `/all-speakers` и категориях), `Service`+`Offer` (на `/pricing` с ценами в рублях), исправить `Person` на профиле (правильный путь к фото, `sameAs`, `contactPoint`).
   - Файлы: все `layout.js` + `page.js`, особенно `app/(profile)/profile/[slug]/page.js:27-30,80-99` и `app/(blog)/blog/[slug]/page.js`.

5. **[HIGH] Исправить структуру заголовков H1/H2.** Сделать визуальные H1 на главной, `/all-speakers`, `/pricing` (убрать `sr-only`). На `/profile/[slug]` обернуть имя спикера в `<h1>` вместо `<p>` (`SpeekerFirstScreen.js:67-69`), а «КОНТАКТЫ СПИКЕРА» сделать `<h2>` (`SpeakerContacts.js:67`). На `/blog` добавить общий `<h1>` страницы блога, карточки перевести на `<h2>`.

---

*Аудит выполнен read-only. Код не изменялся.*
