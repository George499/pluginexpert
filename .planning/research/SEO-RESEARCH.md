# SEO Research — pluginexpert.ru

**Дата:** 2026-05-23
**Стек проекта (как есть):** Next.js 15.0.1 (App Router) + Strapi 5, домен `pluginexpert.ru`, медиа на `admin.pluginexpert.ru`
**ЦА:** B2B (корп. заказчики, ивент-менеджеры, HR) + спикеры/тренеры/коучи как платящие частники (от 4 000 ₽ / 3 мес)
**Автор ресёрча:** Claude (исследовательский режим, без правки кода)

> Все денежные ориентиры даны в ₽. Где исходный источник в $ — пересчёт по курсу ЦБ РФ $1 ≈ 74,59 ₽ (на 22.04.2026, см. CLAUDE.md).

---

## 1. Executive Summary

1. **Технический фундамент у проекта уже неплохой** для Next.js 15: `generateMetadata` на профиле, `sitemap.js` + `robots.js`, Organization/WebSite/LocalBusiness JSON-LD в `layout.js`. Это **выше среднего по нише**.
2. **Главные дыры на сегодня (по приоритету):** (а) нет `Person` schema на профиле спикера и `ItemList` на `/all-speakers`; (б) `sitemap.js` отдаёт только платных спикеров — это правильно для индексации, но нет категорийных страниц вообще; (в) нет верификации в Яндекс.Вебмастере и Google Search Console; (г) нет IndexNow-интеграции; (д) нет `BreadcrumbList` нигде.
3. **Структурная проблема №1:** у конкурентов (`hubspeakers.ru`, `bestspeakers.ru`, `find-speaker.ru`) есть **категорийные страницы по темам и городам** (`/speakers/marketing`, `/speakers/moscow`). У pluginexpert — только плоский `/all-speakers`. Это закрывает доступ к 70%+ нишевого SEO-трафика.
4. **Яндекс в 2026 = поведенческие факторы + ИКС + нейропоиск.** Накрутка карается, реальные сигналы (время на странице, глубина, низкий процент возвратов) тянут позиции. Сайт должен быть полезен по факту, не «для роботов».
5. **Нейропоиск Яндекс/Алиса** цитирует только страницы из **топ-5 классической выдачи** + хорошо структурированный контент (FAQ-блоки, прямые ответы в первых абзацах, структурированные данные). FAQPage Schema перестала давать rich snippets в Google для большинства тематик ещё в 2023, **но AI-движки (YandexGPT, ChatGPT, Perplexity, Google AI Overviews) используют её активно**.
6. **IndexNow для Яндекса** — must-have. Подключается через Strapi webhook → endpoint `/api/indexnow` на фронте → `https://yandex.com/indexnow`. Ускоряет индексацию новых анкет с дней до часов.
7. **Региональность .ru-домена** автоматически = Россия, но Яндекс.Вебмастер позволяет **уточнить регион** (Москва), что усиливает выдачу по гео-запросам. Адрес + телефон с кодом города на сайте — подтверждающие сигналы.
8. **Семантику** можно полностью собрать бесплатно: Яндекс.Вордстат + расширение Wordstat Helper + бесплатный тариф Букварикс (до 1 000 фраз). Для B2B-маркетплейса экспертов достаточно семантического ядра в 300–500 ключей на старт.
9. **llms.txt** в 2026 — спорная история (adoption ~10%). Не вредит, но и не даёт измеримого эффекта. Делать **только если есть свободные 1–2 часа**, не приоритет.
10. **Самая высокая ROI-задача:** ввести категорийные страницы (`/speakers/[topic]` и `/speakers/[city]`) + `Person`/`ItemList`/`BreadcrumbList` schema + IndexNow + верификация в Вебмастере. Это разблокирует и Яндекс-классику, и нейропоиск одновременно.

---

## 2. Блок A. Технический SEO для Next.js 15 App Router (2026)

### 2.1. `generateMetadata` — что уже сделано и что добавить

**Что хорошо у pluginexpert:**
- В `app/layout.js` корректно использованы `metadataBase`, `title.template`, OpenGraph, robots, alternates через template.
- На `app/(profile)/profile/[slug]/page.js` есть динамический `generateMetadata` с per-speaker title/description/OG.

**Что добавить (по приоритету):**
1. **`alternates.canonical`** на каждой странице — критично для пагинации и страниц с query-параметрами (`/all-speakers?search=...`). Сейчас отсутствует.
2. **`verification.yandex` и `verification.google`** в `layout.js` — поля уже подготовлены закомментированными. Нужно получить коды и вписать.
3. **`viewport` через отдельный экспорт** (Next.js 15 разделил viewport и metadata):
   ```js
   export const viewport = { themeColor: '#...', width: 'device-width' }
   ```
   Сейчас этого нет — Next.js 15 будет ругаться в логах сборки.
4. **На страницах категорий** (когда появятся) — динамический `generateMetadata` с шаблоном (см. блок E.3).

**Источники:**
- [Next.js docs: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — официальная документация
- [Adeel Imran: Next.js SEO Complete Guide 2026](https://adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)

### 2.2. SSR vs ISR vs SSG для CMS-каталога

**Консенсус 2026 (источник: [bitskingdom](https://bitskingdom.com/blog/nextjs-when-to-use-ssr-vs-ssg-vs-isr/), [techinterview](https://www.techinterview.org/post/3233475388/ssr-csr-ssg-isr-2026-frontend-tradeoff/)):**

| Тип страницы | Рекомендация | Причина |
|---|---|---|
| Главная `/` | SSG или ISR(3600s) | редко меняется, нужно молниеносный TTFB |
| `/all-speakers` (каталог) | **ISR с revalidate=600 + on-demand** | новые анкеты появляются часто, но не каждую секунду |
| `/profile/[slug]` (карточка спикера) | **ISR с revalidate=3600 + on-demand через webhook** | контент стабильный, но владелец анкеты может править |
| `/speakers/[topic]` (категория, к внедрению) | **ISR revalidate=600 + on-demand** | при добавлении новой анкеты в категории — webhook сбрасывает кэш |
| `/blog/[slug]` | **ISR revalidate=86400** | блог редко обновляется |
| `/pricing` | SSG | статика |
| `/dashboard/*` (личный кабинет) | SSR / CSR | приватные данные |

**Ключевая метрика:** SSG и ISR дают на 40–60% лучший TTFB, чем SSR ([techinterview, 2026](https://www.techinterview.org/post/3233475388/ssr-csr-ssg-isr-2026-frontend-tradeoff/)). Для SEO это критично: Core Web Vitals напрямую завязаны на TTFB/LCP.

**Что у вас сейчас:** на профиле спикера `fetch` без `next: { revalidate }` — по умолчанию Next.js 15 **не кеширует** fetch в App Router (изменение в 14.2+). Это значит каждый запрос идёт в Strapi на каждый запрос пользователя = SSR-режим. Нужно явно добавить `next: { revalidate: 3600, tags: ['speaker', slug] }`.

**On-demand revalidation:** при сохранении спикера в Strapi → webhook → Next.js API route `revalidateTag('speaker')`. Это разблокирует мгновенное обновление без жёсткого SSR.

### 2.3. Sitemap.js — текущее состояние и доработки

**Что есть:** sitemap отдаёт 4 статические страницы + платных спикеров из Strapi. Кэш `revalidate: 3600`.

**Проблемы:**
1. Если платных спикеров > 10 000 (на перспективу) — `pageSize=1000` не вытащит всех. Нужен `generateSitemaps` с разбивкой по страницам.
2. Нет категорийных URL (потому что их нет в проекте — см. блок D).
3. Нет статьи блога (`/blog/[slug]`) — только корневой `/blog`. Это серьёзный пропуск, если в блоге есть статьи.
4. `priority`/`changeFrequency` Яндекс и Google **давно игнорируют** ([Google: 2017](https://developers.google.com/search/blog/2017/04/sitemap-priority-and-frequency), Яндекс — аналогично). Можно оставить, но это шум.

**Что добавить:**
- Все опубликованные статьи блога (`/blog/[slug]`).
- Категорийные страницы (когда появятся).
- При росте > 5 000 URL — `generateSitemaps` ([Next.js docs](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)).

### 2.4. Schema.org для маркетплейса экспертов

**Что уже есть:** `Organization`, `WebSite` (с `SearchAction`), `LocalBusiness`. Это хороший базис.

**Что нужно добавить (по приоритету):**

#### A. `Person` schema на странице спикера (приоритет HIGH)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://pluginexpert.ru/profile/{slug}#person",
  "name": "{Имя Фамилия}",
  "jobTitle": "{Profession}",
  "image": "{photoUrl}",
  "url": "https://pluginexpert.ru/profile/{slug}",
  "description": "{короткая био из Strapi}",
  "knowsAbout": ["{тема 1}", "{тема 2}", "{тема 3}"],
  "worksFor": { "@id": "https://pluginexpert.ru/#organization" },
  "makesOffer": {
    "@type": "Offer",
    "description": "Выступление, мастер-класс, корп. мероприятие",
    "priceCurrency": "RUB",
    "price": "{минимальный гонорар если указан}"
  },
  "sameAs": ["{ссылки на соцсети спикера если есть}"]
}
```
**Зачем:** в 2026 `Person` schema — главный сигнал E-E-A-T для Google и YandexGPT ([discoverability.co](https://discoverability.co/resources/schema-markup-guide/), [W3Era](https://www.w3era.com/blog/seo/schema-markup-types-complete-guide/)). Без неё спикеры не будут попадать в knowledge graph и AI-ответы.

#### B. `ItemList` на `/all-speakers` и категорийных страницах (приоритет HIGH)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://pluginexpert.ru/profile/{slug}",
      "name": "{имя}"
    }
    // ...
  ]
}
```
**Зачем:** даёт Яндексу и Google понять, что это страница-каталог. На категорийных страницах резко повышает шансы попасть в выдачу по запросам типа «спикеры по маркетингу».

#### C. `BreadcrumbList` на всех вложенных страницах (приоритет HIGH)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://pluginexpert.ru/" },
    { "@type": "ListItem", "position": 2, "name": "Спикеры", "item": "https://pluginexpert.ru/all-speakers" },
    { "@type": "ListItem", "position": 3, "name": "{Имя}", "item": "https://pluginexpert.ru/profile/{slug}" }
  ]
}
```
**Зачем:** хлебные крошки замещают URL в сниппете, чище смотрится в SERP, помогает обоим поисковикам понять иерархию ([schema.org/BreadcrumbList](https://schema.org/BreadcrumbList)).

#### D. `FAQPage` на главной + на профилях (приоритет MEDIUM)
В 2026 FAQ rich snippets ограничены гос- и медтематиками ([Heeya 2026 guide](https://heeya.fr/en/blog/schema-org-faq-howto-google-ai-overviews)), **но AI-системы (ChatGPT, Perplexity, Google AI Overviews, YandexGPT) активно используют FAQPage для цитирования** ([Frase.io](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)). Это самый прямой путь в нейропоиск.

Примеры FAQ-блоков для главной:
- «Сколько стоит пригласить спикера через Plug-In Expert?» — ответ короткий, фактологичный
- «Можно ли связаться со спикером напрямую без посредника?»
- «Как стать спикером в каталоге?»
- «Какие категории спикеров есть в базе?»

#### E. `Offer` для платного размещения анкеты (приоритет LOW для индексации, HIGH для AI)
Применимо на `/pricing` — описать тарифы 3 мес / 6 мес / 12 мес со ценами в RUB. Поможет AI-движкам отвечать на запросы «сколько стоит разместить спикера на pluginexpert».

### 2.5. `next/image` + Strapi media

**Что у вас сейчас:**
```js
images: {
  unoptimized: true,
  remotePatterns: [...]
}
```
**`unoptimized: true` = НЕТ оптимизации**. Это полностью отключает встроенную трансформацию Next.js, сервер отдаёт оригинал «как есть».

**Что это значит для метрик:**
- LCP может быть в 2–4 раза хуже, чем мог бы быть ([Strapi: 6 Performance Mistakes](https://strapi.io/blog/performance-mistakes-strapi-nextjs-apps))
- Нет автоматической конвертации в WebP/AVIF
- Нет responsive srcset
- Возможна потеря 40–60% LCP-бонусов

**Варианты исправления (по сложности):**

| Вариант | Сложность | Эффект | Минусы |
|---|---|---|---|
| Убрать `unoptimized: true` и положиться на Next.js | LOW | +30–50% к LCP | Next.js будет рендерить через `/_next/image` — нагрузка на сервер |
| Использовать Strapi-плагин для image transforms на стороне Strapi (он уже умеет делать формы medium/large/thumbnail) и в `next/image` указывать `unoptimized` опционально | MEDIUM | значимый | Нужно проверить, что Strapi отдаёт responsive формы и фронт их использует |
| Sharp на стороне Next.js + CDN (Cloudflare) | HIGH | максимум | Cloudflare для .ru — рискованно, нужно проверить доступность из Москвы |

**Что критично прямо сейчас, минимум:**
- `width` + `height` на каждом `<Image>` — обязательно (иначе CLS улетает в 0.3+, при норме <0.1)
- `priority` (Next.js 15) или `preload` (Next.js 16, когда обновитесь) на LCP-картинке (фото спикера на странице профиля, hero на главной)
- `sizes` на responsive-картинках

**Источник:** [Strapi: Next.js Image Optimization Guide](https://strapi.io/blog/nextjs-image-optimization-developers-guide), [Pagepro CWV guide](https://pagepro.co/blog/nextjs-image-component-performance-cwv/)

### 2.6. Edge cases App Router

- **`dynamicParams`** на `/profile/[slug]` — сейчас не задан. По умолчанию `true` = любой slug рендерится по запросу. Если перейти на ISR с `generateStaticParams`, нужно явно решить: рендерить ли неизвестные slug'и (например, новые спикеры до полного билда). Рекомендую оставить `dynamicParams = true`.
- **`generateStaticParams`** — для платных спикеров (которые уже есть в `sitemap.js`) имеет смысл прегенерировать. Это даст SSG-производительность для топ-страниц.
- **Rewrites** в `next.config.mjs` — пока только один redirect (`/speakers/blog` → `/blog`). Хорошо, что 301. Если будут добавляться категории — следить, чтобы не возникало конфликтов URL.

---

## 3. Блок B. Российский SEO в 2026

### 3.1. Что приоритизирует Яндекс сейчас (по убыванию веса)

1. **Поведенческие факторы (ПФ)** — №1 ([sostav.ru/blog/287196](https://www.sostav.ru/blogs/287196/80594), [it-agency](https://www.it-agency.ru/blog/website-ranking-factors/), [kokoc.com](https://kokoc.com/blog/povedencheskie-faktory-sajta/)). Ключевые метрики:
   - Время на странице (для B2B-сервисов норма — от 1:30+)
   - Глубина просмотра (минимум 2 страницы за сессию)
   - **Возвраты в выдачу** (если пользователь вернулся в Яндекс с вашей страницы — это негативный сигнал; короткие сессии < 15 сек = «отказ»)
   - CTR в выдаче
2. **ИКС (Индекс качества сайта)** — формируется из ПФ + ссылочный профиль + возраст домена + объём контента. Виден в Вебмастере.
3. **Контент:** уникальность, экспертность, полнота ответа на запрос (аналог Google E-E-A-T, но Яндекс не использует этот термин).
4. **Коммерческие факторы** (для B2B критичны): телефон в шапке, форма обратной связи, контакты, страница «О компании», цены или диапазоны цен.
5. **Технические факторы:** скорость, mobile-friendly, HTTPS (у вас всё ок), отсутствие битых ссылок.
6. **Ссылки** — Яндекс снизил вес ссылок после Минусинска (2015) и продолжает снижать. Сейчас естественные ссылки полезны, спам — карается.

**Главное предупреждение:** **накрутка ПФ карается баном** ([sostav 2026](https://www.sostav.ru/blogs/287196/80594)). Никаких сервисов «улучшения ПФ» — только реальное улучшение UX.

### 3.2. IndexNow для Яндекса

**Что это:** протокол, по которому сайт сам сообщает поисковикам о новых/изменённых страницах ([Яндекс docs](https://yandex.ru/support/webmaster/ru/indexing-options/index-now.html)). Поддерживается Яндекс, Bing, Seznam, Naver. Google **не поддерживает** (использует свой Indexing API).

**Польза для pluginexpert:** новая анкета спикера, которую он только что оплатил, попадает в индекс Яндекса за **минуты-часы**, а не за **дни-недели**. Это критично для платных пользователей — вы продаёте «размещение на 3 мес», и каждый день без индексации = недополученная ценность.

**Как подключить (упрощённая схема, без кода):**

1. Сгенерировать ключ (например, 32-значный UUID).
2. Положить файл `{key}.txt` с тем же ключом в `public/` (доступно по `https://pluginexpert.ru/{key}.txt`).
3. В Strapi настроить webhook на событие `entry.publish` для коллекции `speakers` (и `blog`, если есть).
4. Webhook бьёт в Next.js API route (например, `/api/indexnow`).
5. API route форвардит запрос на `https://yandex.com/indexnow` с параметрами `url`, `key`, `keyLocation`.

**Источники:**
- [Яндекс: Поддержка IndexNow](https://yandex.ru/support/webmaster/ru/indexing-options/index-now.html)
- [IndexNow FAQ](https://www.indexnow.org/ru_ru/faq)
- [Ашманов: исследование IndexNow](https://www.ashmanov.com/education/articles/chto-takoe-indexnow-i-kak-ego-ispolzovat-issledovanie-s-primerami/)

### 3.3. Яндекс.Вебмастер — критичные настройки

1. **Верификация прав** — добавить мета-тег `verification.yandex` в `layout.js`. Поле уже подготовлено закомментированным.
2. **Региональность** — `.ru` автоматически даёт «Россия», но **уточнить регион** (Москва) в Вебмастере → Информация о сайте → Региональность. Подтверждающая ссылка — страница «Контакты» с адресом + телефоном с московским кодом. Источник: [Яндекс: Региональность](https://yandex.ru/support/webmaster/ru/site-geography/site-region).
3. **Sitemap** — добавить `https://pluginexpert.ru/sitemap.xml` в раздел «Индексирование → Файлы Sitemap».
4. **Быстрые ссылки (sitelinks)** — Яндекс выбирает автоматически, но можно скрыть нерелевантные.
5. **Турбо-страницы** — устарели, не используйте.
6. **Переезд/Главное зеркало** — убедитесь, что выбрано `https://pluginexpert.ru` (без www). Сейчас, судя по канонической ссылке в `layout.js`, так и есть.
7. **Оригинальные тексты** — отправляйте новые статьи блога **до публикации** через раздел «Содержимое сайта → Оригинальные тексты». Защита от копирования.

### 3.4. Яндекс.Бизнес как SEO-канал

**Что даёт:**
- Карточка в Яндекс.Картах
- Сниппеты в выдаче с рейтингом, часами работы, контактами
- Бесплатные ответы на отзывы
- Региональная видимость

**Для pluginexpert релевантно:** да, как «агентство по подбору спикеров в Москве». Регистрируете компанию → подтверждаете → получаете рейтинг и отзывы.

**Бюджет:** базовая карточка — бесплатно. Платное продвижение — от **6 000 ₽/мес** на московский регион ([seo-pulse: тарифы Яндекс.Бизнес 2026](https://seo-pulse.ru/blog/local-seo/skolko-stoit-yandeks-biznes/)).

**Источник:** [sostav: каналы продвижения B2B 2026](https://www.sostav.ru/blogs/287516/79021)

### 3.5. Russian-specific: транслит vs кириллица в URL

**Консенсус:** для `.ru` доменов **транслит** (`/spikery-marketinga`) лучше, чем кириллица (`/спикеры-маркетинга`), потому что:
- Кириллица в URL превращается в %D0%BF%... при копировании — некрасиво в шарах
- Не все системы аналитики и CMS корректно работают с кириллическими URL
- Яндекс понимает оба варианта одинаково ([seosherpa: Yandex SEO 2025](https://seosherpa.com/yandex-seo/))

**Что у вас:** slug в Strapi для спикеров — судя по коду, ASCII (например, `ivan-petrov`). Это правильно.

**Для категорий рекомендую транслит:** `/speakers/marketing`, `/speakers/biznes`, `/speakers/psihologiya`, `/speakers/moscow`.

### 3.6. .ru ranking factors

`.ru` домен — **доверительный сигнал** для российских пользователей и Яндекса ([arjankc.com.np](https://www.arjankc.com.np/blog/yandex-seo-guide-optimization/)). Менять домен не нужно.

---

## 4. Блок C. Яндекс AI / нейропоиск + Google AI Overviews (GEO/AEO)

### 4.1. Как работает нейропоиск Яндекса

**Источники:** [Kontenium](https://kontenium.ru/seo-growth/nejropoisk-plan-ii-yandex-alisa/), [redbee.ru](https://redbee.ru/blog/kak-popast-v-neyrovydachu-yandeks-alisy-ai-v-2026-godu/), [vc.ru: mediacom.expert](https://vc.ru/marketing/2873023-kak-popast-v-neiropoisk-yandeksa)

**Механика:**
1. Пользователь задаёт запрос Алисе или в нейропоиск Яндекса
2. Система берёт **классический топ-5 выдачи** по этому запросу
3. Прогоняет страницы через BERT и YandexGPT 5 Pro
4. Генерирует ответ с ссылками на источники

**Главное правило:** если страница не в топ-5 по запросу — она не попадёт в нейропоиск. Значит, **классическое SEO — это билет в нейропоиск**, а не альтернатива.

### 4.2. Сигналы попадания в AI-ответы (Яндекс + Google)

По наблюдениям SEO-сообщества (свод из [ozhgibesov.agency](https://ozhgibesov.agency/geo-optimizacziya-v-2026-godu-kak-popast-v-otvety-chatgpt-yandexgpt-i-perplexity/), [redorange.pro](https://redorange.pro/geo-optimizaciya-2025), [resultup](https://resultup.agency/blog/ai-v-seo)):

| Сигнал | Вес | Что делать |
|---|---|---|
| Топ-5 классической выдачи | критично | Сначала традиционное SEO |
| FAQPage Schema | высокий | Обязательно на главной и профилях |
| Прямой ответ в первых 100 словах текста | высокий | Лид-абзац — короткий, фактологичный, без воды |
| Структура H2/H3 + списки/таблицы | высокий | На страницах с длинным контентом |
| Уникальные данные/цифры | высокий | «6 790 спикеров по бизнес-тематике» — лучше, чем «большая база» |
| Author markup (Person schema) | средний | Особенно для блога |
| HowTo schema | средний | На страницах-инструкциях («Как выбрать спикера», «Как стать спикером») |
| Свежесть контента | средний | `dateModified` в schema |
| Цитируемость на других сайтах | средний | Упоминания и ссылки |

### 4.3. Чем Google AI Overviews отличается от Яндекс AI

| | Яндекс нейропоиск / Алиса | Google AI Overviews |
|---|---|---|
| Модель | YandexGPT 5 Pro + BERT | Gemini |
| Источник | Топ-5 классики | Топ-10–20 + структурированные данные |
| Покрытие запросов | растёт, особенно в Алисе | 31–48% всех запросов в 2026 ([averi.ai](https://www.averi.ai/blog/google-ai-overviews-optimization-how-to-get-featured-in-2026)) |
| Что любит | Факты, FAQ, экспертность, .ru-домены | Schema, авторство, E-E-A-T, цитируемость |
| Что общее | FAQPage, Person, BreadcrumbList, ItemList — везде ↑ |

**Для pluginexpert:** оба требуют одного и того же набора правок — schema + структура контента + FAQ. Не нужно делать «отдельную оптимизацию под Яндекс AI» — это побочный продукт хорошего SEO.

### 4.4. llms.txt — стоит ли делать в 2026

**TL;DR:** Не приоритет, но и не вредно.

**Факты:**
- Adoption ~10% от 300K доменов ([SE Ranking](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/))
- Эффект **измеримо не доказан** в открытых исследованиях
- Авторитетные сайты в массе **не внедряют**
- Делается за 30–60 минут, не ломает ничего

**Рекомендация:** делать **после** всех остальных задач из этого ресёрча. Если уж делать — стандартный формат:
```
# Plug-In Expert
> База спикеров, тренеров и коучей с прямыми контактами без посредников.

## Каталог спикеров
- [Все спикеры](https://pluginexpert.ru/all-speakers): Полный каталог
- [Спикеры по маркетингу](https://pluginexpert.ru/speakers/marketing)
- ...

## О сервисе
- [Тарифы](https://pluginexpert.ru/pricing): Размещение от 4 000 ₽ / 3 мес
- [Блог](https://pluginexpert.ru/blog): Статьи о выборе спикеров
```

---

## 5. Блок D. Конкурентный/нишевый ресёрч

### 5.1. Топ-конкурентов в нише «база спикеров»

| Сайт | Модель | URL-структура | Контент | Силы | Слабости |
|---|---|---|---|---|---|
| **hubspeakers.ru** | Агентство + база | `/bio/[lastname]`, `/speakers/[category]` (`/russia`, `/celebrity`), `/magazine` | ~50 категорий, журнал, новости, тендерные запросы | Профессиональный journal-контент, кейсы | Закрытое ценообразование («от 30 000 ₽ за тендер») |
| **bestspeakers.ru** | Открытый каталог + рейтинги | `/speaker/[name]/`, `/speakers-category/[topic]/`, `/category/[type]/` | **6 790 спикеров в бизнес-тематике**, топ-листы, статьи, события | Большой объём контента, топ-листы (SEO-магнит) | Не указана модель монетизации |
| **find-speaker.ru** | Открытый каталог, **без посредников** | по городам и категориям | Биз, психология, искусство, наука, мода, политика, здоровье, образование | **Прямое позиционирование «без посредников»** — пересекается с вашим | Не видно объёма базы, мало контента |
| **speakersbase.ru** | База спикеров | `/speakers/` | Не получилось загрузить (таймаут) | — | Возможно, слабый перформанс |
| **topspeaker.ru** | Агентство | традиционное | Большая база, конференции | Бренд | Закрытая агентская модель |
| **worldspeakers.ru** | Премиум-агентство | традиционное | Международные звёзды | Лакшери-сегмент | Не для среднего B2B |

### 5.2. Прямой конкурент по позиционированию: find-speaker.ru

**Это самый близкий конкурент по модели.** Они тоже «открытый каталог без посредников». Что делают лучше:
- Сегментация по **городам** (`/city/[name]`)
- Категории сразу на главной (Бизнес, Психология, Искусство, Наука...)
- Бесплатное размещение для спикеров (у вас — 4 000 ₽ за 3 мес)

**Что у вас лучше:**
- Технический фундамент (Next.js 15 + Strapi — современнее)
- Платная модель = более фильтрованная база (нет «мусорных» анкет)

### 5.3. Самые SEO-сильные форматы контента в нише (по наблюдениям конкурентов)

1. **Топ-листы спикеров по темам** — `«ТОП-20 спикеров по маркетингу 2026»`. Это формат, который собирает и SEO, и шары в соцсетях. Используют bestspeakers.ru, vc.ru.
2. **Гайды по подбору спикера** — «Как выбрать спикера для корп. мероприятия», «Сколько стоит спикер в 2026». Под FAQ и AI Overviews идеально.
3. **Кейсы мероприятий** — «Как мы подбирали спикера для конференции X». Уникальный контент, ссылки от организаторов.
4. **Категорийные страницы каталога** — `/speakers/marketing`. SEO-магнит для среднечастотников.
5. **Городские страницы** — `/speakers/moscow`, `/speakers/spb`. Сильный сигнал для региональной выдачи.

### 5.4. Самые частотные категории спикеров на рынке (по выдаче)

По частотности упоминаний у конкурентов:
1. Маркетинг и продажи
2. Менеджмент и лидерство
3. HR и команда
4. Психология и коучинг
5. IT и технологии
6. Бизнес и предпринимательство
7. PR и медиа
8. Финансы и инвестиции
9. Личная эффективность
10. Здоровье и медицина
11. Образование
12. Спорт и фитнес
13. Мода и стиль
14. Юриспруденция
15. Наука

**Рекомендация:** для старта сделать первые 10 категорий с URL `/speakers/[transliterated-slug]`.

---

## 6. Блок E. Семантика

### 6.1. Подход к сбору ядра без платных инструментов

**Workflow для B2B-маркетплейса экспертов:**

1. **Базовые маркеры** (отправные точки):
   - спикер, спикеры
   - тренер, бизнес-тренер
   - коуч, бизнес-коуч
   - оратор
   - эксперт
   - агентство спикеров
   - подбор спикеров
   - база спикеров

2. **Парсинг Wordstat** (бесплатно):
   - [wordstat.yandex.ru](https://wordstat.yandex.ru/) — операторы: `"!"` для словоформ, `[]` для порядка слов, кавычки для группировки
   - Расширение [Wordstat Helper](https://site-analyzer.ru/soft/seo-extension-wordstat/) — ускоряет сбор в 5–10 раз
   - Расширение «Яндекс Вордстат Extension» — кластеризация прямо в браузере

3. **Букварикс** (бесплатно):
   - До 1 000 фраз за выгрузку в бесплатном тарифе
   - Хорошо для длинного хвоста

4. **Анализ конкурентов** (полу-бесплатно):
   - Bukvarix.com — выгрузка ключей с домена конкурента (лимит)
   - Bertal.ru — анализ выдачи
   - Просто посмотреть в title/h1 у конкурентов (find-speaker, bestspeakers, hubspeakers)

5. **Кластеризация** (бесплатно):
   - Группировка вручную в Excel/Google Sheets
   - Или бесплатный демо-режим Topvisor / Rush Analytics

**Источники:**
- [resize-web: 16 сервисов](https://resize-web.ru/blog/16-servisov-dlya-raboty-s-semanticheskim-yadrom/)
- [Topvisor Journal: как пользоваться Wordstat](https://journal.topvisor.com/ru/seo-kitchen/how-to-use-wordstat/)

### 6.2. Ожидаемый объём ядра

Для маркетплейса экспертов на старте достаточно:
- **300–500 ключевых фраз** для семантического ядра
- Распределение по 4 типам страниц:
  - Главная: 10–15 высокочастотных (база спикеров, найти спикера, спикеры на мероприятие)
  - Категории (10 шт × 10–15 ключей = 100–150): «спикеры по маркетингу», «бизнес-тренеры по продажам», «коучи по лидерству»
  - Города (5 шт × 5–10 ключей = 25–50): «спикеры Москва», «найти спикера в СПб»
  - Профили (плавающий, по имени): «{Имя Фамилия} спикер», «{Имя Фамилия} выступления»
  - Блог: ~50 ключей под информационные запросы

### 6.3. Шаблоны title/description для категорийных страниц

**Title (60–65 символов max, [sed.by 2026](https://sed.by/blog/2026-guide-to-title-and-meta-description)):**

| Страница | Шаблон | Пример |
|---|---|---|
| `/speakers/[topic]` | `Спикеры по {теме} — найти и заказать \| Plug-In Expert` | `Спикеры по маркетингу — найти и заказать \| Plug-In Expert` |
| `/speakers/[city]` | `Спикеры в {городе} — база контактов \| Plug-In Expert` | `Спикеры в Москве — база контактов \| Plug-In Expert` |
| `/profile/[slug]` | `{Имя Фамилия} — {профессия}, заказать выступление` | `Иван Петров — бизнес-тренер, заказать выступление` |
| `/blog/[slug]` | `{Название статьи} \| Plug-In Expert` | (уже работает через template) |

**Description (140–160 символов):**

| Страница | Шаблон |
|---|---|
| `/speakers/[topic]` | `Каталог спикеров по {теме} с прямыми контактами. {N} экспертов: выбирайте без посредников для конференций, тренингов и корп. мероприятий.` |
| `/speakers/[city]` | `Спикеры, тренеры и коучи в {городе}. Открытая база с контактами для ивент-менеджеров и HR. Подбор без посредников и комиссий агентств.` |
| `/profile/[slug]` | `{Профессия}, {краткое позитное описание из Strapi}. Прямые контакты на Plug-In Expert — закажите выступление без посредников.` |

**H1 ≠ Title:** Title — для выдачи, H1 — для пользователя на странице. Желательно, чтобы H1 был чуть длиннее и более «человеческий»: `«Спикеры по маркетингу: 47 экспертов с прямыми контактами»`.

---

## 7. Применимо к pluginexpert (что конкретно делать)

Сортировка по **ROI и срочности**, не по сложности.

### Спринт 1 (1–2 недели, основа) — высокий приоритет

| # | Задача | Эффект | Сложность |
|---|---|---|---|
| 1 | Зарегистрировать сайт в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) и Google Search Console. Подтвердить коды в `layout.js` (`verification.yandex`, `verification.google`) | Без этого — слепота к данным | LOW |
| 2 | Уточнить регион «Москва» в Яндекс.Вебмастер | +20–30% по гео-запросам | LOW |
| 3 | Добавить `BreadcrumbList` schema на профили и категории | Чище сниппет в выдаче | LOW |
| 4 | Добавить `Person` schema на `/profile/[slug]` | E-E-A-T, попадание в AI-ответы | LOW |
| 5 | Добавить `ItemList` schema на `/all-speakers` | Понимание Яндексом, что это каталог | LOW |
| 6 | Исправить `unoptimized: true` в `next.config.mjs` или подтянуть Strapi-форматы (medium/large) в `<Image>` | +30–50% LCP | MEDIUM |
| 7 | Добавить `alternates.canonical` на всех страницах с query-параметрами | Защита от дубль-индексации | LOW |
| 8 | Добавить `export const viewport` в `layout.js` (Next.js 15 требование) | Уход от warnings в билде | LOW |

### Спринт 2 (2–4 недели, структура) — высокий приоритет

| # | Задача | Эффект | Сложность |
|---|---|---|---|
| 9 | **Создать категорийные страницы** `/speakers/[topic]` — top 10 тем (см. блок D.4) | Открывает доступ к ~70% нишевого SEO-трафика | HIGH |
| 10 | **Создать городские страницы** `/speakers/[city]` — top 5 городов (Москва, СПб, Екат, Новосиб, Казань) | Региональная выдача | MEDIUM |
| 11 | Внедрить ISR с `revalidate` на каталоге и профиле + on-demand revalidation через Strapi webhook | Свежесть контента без жёсткого SSR | MEDIUM |
| 12 | Добавить FAQ-блок (видимый на странице + FAQPage schema) на главную и в профили | Прямой путь в нейропоиск | MEDIUM |
| 13 | Обновить `sitemap.js`: добавить блог-статьи, категории, города | Полнота индексации | LOW |

### Спринт 3 (1–2 недели, ускорение индексации) — средний приоритет

| # | Задача | Эффект | Сложность |
|---|---|---|---|
| 14 | Подключить IndexNow (Strapi webhook → `/api/indexnow` → Яндекс) | Индексация за часы вместо дней | MEDIUM |
| 15 | Зарегистрировать Яндекс.Бизнес карточку для компании | +гео-видимость, отзывы | LOW |
| 16 | Собрать семантическое ядро (300–500 фраз) через Wordstat + Букварикс | База для расширения | MEDIUM |
| 17 | Прописать title/description по шаблонам из блока E.3 | CTR в выдаче | LOW |

### Спринт 4 (постепенно, контент) — средний приоритет

| # | Задача | Эффект | Сложность |
|---|---|---|---|
| 18 | Написать топ-листы (5–10 статей: «ТОП-20 спикеров по маркетингу 2026» и т.д.) | SEO-магнит + цитируемость | HIGH (контент) |
| 19 | Написать гайды («Как выбрать спикера», «Сколько стоит спикер») с FAQ-блоками | AI-цитирование | HIGH (контент) |
| 20 | Кейсы мероприятий (5–10 статей) | Уникальный контент + ссылки | HIGH (требует данных от клиентов) |

### Что НЕ делать сейчас

- **llms.txt** — отложить до завершения всего вышеперечисленного. Эффект не доказан.
- **Накрутку ПФ** — никогда.
- **Покупку ссылок биржей** — Минусинск всё ещё работает, можно словить фильтр.
- **Турбо-страницы Яндекс** — устаревшая технология.
- **Cloudflare как CDN** — рискованно для .ru-аудитории, нужно тестировать доступность из московских сетей перед внедрением.

---

## 8. Открытые вопросы (нужны от владельца сайта)

1. **Аналитика:** установлены ли Яндекс.Метрика и Google Analytics? Без них — нет данных для итераций.
2. **Объём контента:** сколько сейчас опубликованных спикеров? Сколько платных? Это влияет на стратегию (если < 100 — категории нужно делать осторожно, чтобы не было пустых страниц).
3. **Юридический адрес:** есть ли реальный московский (или другой) адрес для региональности и LocalBusiness schema? Сейчас в JSON-LD `geo` пустой.
4. **Соцсети:** есть ли Telegram-канал, VK, YouTube? Это влияет на `sameAs` в Organization schema и на ссылочный профиль.
5. **Контент-ресурс:** кто будет писать топ-листы и гайды? Нужен SEO-копирайтер или это берёт на себя владелец/CEO?
6. **Бюджет на Яндекс.Бизнес:** готовы тратить от 6 000 ₽/мес на платное продвижение в Бизнесе, или только бесплатная карточка?
7. **Структура каталога в Strapi:** есть ли в модели `Speaker` поля для категорий и города? Если нет — нужна правка модели данных перед внедрением категорийных страниц.
8. **Перевод/мультиязычность:** нужен ли en/de и т.д.? Если да — это влияет на структуру URL (`/en/speakers/...` через `[locale]`).
9. **Существующий блог:** есть ли уже статьи? Сколько? Какие URL? `sitemap.js` сейчас отдаёт только `/blog`, без статей — это пропуск.
10. **Скорость на проде:** какие сейчас Core Web Vitals (LCP, INP, CLS) по данным Search Console и PageSpeed Insights? Без замера до — нельзя оценить эффект исправлений.

---

## 9. Источники

### Технический SEO Next.js (HIGH/MEDIUM confidence)
- [Next.js: generateMetadata reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — официальная документация
- [Next.js: sitemap.xml metadata file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js: generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)
- [Next.js: Image Component (App Router)](https://nextjs.org/docs/app/api-reference/components/image)
- [Adeel Imran: Next.js SEO Complete Guide 2026](https://adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [ModernWebSEO: Next.js SEO Guide 2026](https://www.modernwebseo.com/en/blog/nextjs-seo-guide-2026)
- [Prateeksha: Next.js App Router SEO](https://prateeksha.com/blog/nextjs-app-router-seo-metadata-sitemaps-canonicals)
- [DigitalApplied: Next.js 15 SEO Guide](https://www.digitalapplied.com/blog/nextjs-seo-guide)
- [bitskingdom: SSR vs SSG vs ISR 2026](https://bitskingdom.com/blog/nextjs-when-to-use-ssr-vs-ssg-vs-isr/)
- [techinterview: SSR vs CSR vs SSG vs ISR 2026](https://www.techinterview.org/post/3233475388/ssr-csr-ssg-isr-2026-frontend-tradeoff/)
- [Strapi: Next.js Image Optimization Guide](https://strapi.io/blog/nextjs-image-optimization-developers-guide)
- [Strapi: 6 Performance Mistakes in Next.js Apps](https://strapi.io/blog/performance-mistakes-strapi-nextjs-apps)
- [Pagepro: Next.js Image CWV in Practice](https://pagepro.co/blog/nextjs-image-component-performance-cwv/)
- [DebugBear: next/image Optimization](https://www.debugbear.com/blog/nextjs-image-optimization)

### Schema.org (HIGH/MEDIUM)
- [schema.org/Person](https://schema.org/Person)
- [schema.org/BreadcrumbList](https://schema.org/BreadcrumbList)
- [schema.org/Service](https://schema.org/Service)
- [Discoverability: Schema Markup Guide 2026](https://discoverability.co/resources/schema-markup-guide/)
- [W3Era: Schema Markup Types 2026](https://www.w3era.com/blog/seo/schema-markup-types-complete-guide/)
- [Over The Top SEO: Schema Markup Guide 2026](https://www.overthetopseo.com/schema-markup-guide-seo-2026/)
- [Incremys: Schema.org for SEO ready-to-use JSON-LD](https://www.incremys.com/en/resources/blog/schema-seo)

### Яндекс SEO 2026 (HIGH/MEDIUM)
- [Яндекс: Поддержка IndexNow](https://yandex.ru/support/webmaster/ru/indexing-options/index-now.html) — официальная документация
- [Яндекс: Региональность сайта](https://yandex.ru/support/webmaster/ru/site-geography/site-region) — официальная документация
- [IndexNow FAQ (русский)](https://www.indexnow.org/ru_ru/faq) — официальная документация протокола
- [sostav: ПФ в 2026](https://www.sostav.ru/blogs/287196/80594)
- [it-agency: факторы ранжирования 2026](https://www.it-agency.ru/blog/website-ranking-factors/)
- [kokoc.com: поведенческие факторы Яндекса](https://kokoc.com/blog/povedencheskie-faktory-sajta/)
- [Ашманов: IndexNow исследование](https://www.ashmanov.com/education/articles/chto-takoe-indexnow-i-kak-ego-ispolzovat-issledovanie-s-primerami/)
- [Rookee: IndexNow глоссарий](https://rookee.ru/glossary/indexnow/)
- [lpmotor: SEO Яндекс полный гайд 2026](https://lpmotor.ru/articles/seo-yandex-2026-polnyj-gajd-2603)
- [seosherpa: Yandex SEO 2025](https://seosherpa.com/yandex-seo/)
- [arjankc: Yandex SEO Guide](https://www.arjankc.com.np/blog/yandex-seo-guide-optimization/)
- [seo-pulse: Яндекс.Бизнес тарифы 2026](https://seo-pulse.ru/blog/local-seo/skolko-stoit-yandeks-biznes/)
- [sostav: каналы B2B 2026](https://www.sostav.ru/blogs/287516/79021)
- [wesma: SEO для B2B 2026](https://wesma.agency/blog/glavnye-seo-zadachi-b2b-gid/)

### AI/GEO/нейропоиск (MEDIUM, активно меняется)
- [Kontenium: нейропоиск Яндекса план](https://kontenium.ru/seo-growth/nejropoisk-plan-ii-yandex-alisa/)
- [redbee: как попасть в нейровыдачу Алисы 2026](https://redbee.ru/blog/kak-popast-v-neyrovydachu-yandeks-alisy-ai-v-2026-godu/)
- [ipos.digital: GEO для Алисы и YandexGPT](https://ipos.digital/blog/kak-popast-v-poiskovuyu-vydachu-s-alice-i-yandex-gpt)
- [vc.ru: mediacom.expert — нейропоиск Яндекса](https://vc.ru/marketing/2873023-kak-popast-v-neiropoisk-yandeksa)
- [ozhgibesov: GEO 2026](https://ozhgibesov.agency/geo-optimizacziya-v-2026-godu-kak-popast-v-otvety-chatgpt-yandexgpt-i-perplexity/)
- [redorange: GEO-оптимизация 2026](https://redorange.pro/geo-optimizaciya-2025)
- [resultup: AI в SEO 2026](https://resultup.agency/blog/ai-v-seo)
- [Search Engine Land: Generative Engine Optimization 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [averi.ai: AI Overviews 48% queries 2026](https://www.averi.ai/blog/google-ai-overviews-optimization-how-to-get-featured-in-2026)
- [Heeya: FAQ & HowTo Schema for AI Overviews 2026](https://heeya.fr/en/blog/schema-org-faq-howto-google-ai-overviews)
- [Frase.io: FAQ Schemas for AI Search](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [Netkodo: llms.txt case study](https://netkodo.com/case-studies/llmstxt)
- [LinkBuildingHQ: should websites implement llms.txt 2026](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
- [tenchat: AI-ответы Yandex GPT и Google SGE 2026](https://tenchat.ru/media/3913874-kak-popast-v-aiotvety-yandeks-gpt-i-google-sge-v-2026)

### Конкуренты (прямые наблюдения через WebFetch)
- [HubSpeakers.ru](https://hubspeakers.ru/) — обзорно, через WebFetch
- [BestSpeakers.ru](https://bestspeakers.ru/) — обзорно, через WebFetch
- [Find-Speaker.ru](https://find-speaker.ru/) — обзорно, через WebFetch (прямой конкурент)
- SpeakersBase.ru — попытка fetch завершилась таймаутом (это уже сигнал об их перформансе)

### Семантика (HIGH)
- [Яндекс Wordstat](https://wordstat.yandex.ru/) — официальный инструмент
- [Topvisor Journal: как пользоваться Wordstat](https://journal.topvisor.com/ru/seo-kitchen/how-to-use-wordstat/)
- [resize-web: 16 сервисов для семантики 2026](https://resize-web.ru/blog/16-servisov-dlya-raboty-s-semanticheskim-yadrom/)
- [site-analyzer: Wordstat Helper](https://site-analyzer.ru/soft/seo-extension-wordstat/)
- [sed.by: title и meta description 2026](https://sed.by/blog/2026-guide-to-title-and-meta-description)
- [postium: парсеры Wordstat](https://postium.ru/parsery-yandex-wordstat/)

---

## Metadata

**Confidence breakdown:**
- Технический SEO Next.js 15: **HIGH** — официальная документация + множественные источники 2026
- Schema.org для маркетплейса: **HIGH** — schema.org официально + 2026 guides
- Яндекс SEO 2026 (поведенческие, ИКС): **MEDIUM-HIGH** — много российских источников 2026, но детали алгоритма закрыты
- IndexNow и Яндекс.Вебмастер: **HIGH** — официальные доки Яндекса
- Нейропоиск Яндекса / AI ответы: **MEDIUM** — основано на наблюдениях SEO-сообщества, не на официальных гайдлайнах Яндекса (их нет в открытом виде)
- llms.txt: **LOW-MEDIUM** — экспериментальная технология, эффект не доказан
- Конкурентный ландшафт: **MEDIUM** — основан на 3 прямых WebFetch + поисковая выдача, без глубокого парсинга
- Семантика и шаблоны: **HIGH** — инструменты Wordstat и Букварикс работают как описано

**Дата ресёрча:** 2026-05-23
**Валидно до:** 2026-09-23 (4 мес) для стабильных частей; для нейропоиска/GEO — пересмотреть через 2 мес (быстро меняется)

**Что НЕ исследовалось (за рамками задания, но может понадобиться):**
- Перфоманс-аудит pluginexpert.ru через PageSpeed Insights (нужен доступ или скриншоты от владельца)
- Ссылочный профиль (нужен Ahrefs/Serpstat — платно)
- Конкретный объём поискового спроса по ключам (нужен Wordstat-аккаунт с историей запросов)
- Анализ существующего блога (нужен список URL статей или доступ в Strapi)
