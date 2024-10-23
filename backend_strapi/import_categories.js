const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const STRAPI_API_URL = "http://89.223.127.174:3010"; // URL Strapi
const STRAPI_TOKEN =
  "9dbc9d2b3a33e226cd3bea33f6ccce9608a5d7b6ccc1ed8550e88ac4e560d22a9309ac5173d87c68e754fed9a21217bb2434494e327a69d8673115e4f68781c9bc007e44f693977906bc6a73b7be0310e333c6796c67bb9179617bfc095d3c0ca4f1f096b9dd558883eb98ae1eaa0273508beb6277386ffb1270d8160cb8ca59"; // Токен доступа Strapi

async function importCategories() {
  const fileStream = fs.createReadStream("./data.ndjson");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.trim()) {
      const item = JSON.parse(line);

      // Проверяем, что это категория
      if (item._type === "category") {
        // Преобразуем данные для Strapi
        const transformedData = {
          title: item.title,
          slug: item.slug.current,
          gender: item.gender,
          index: item.index,
        };

        try {
          // Отправляем данные в Strapi
          await axios.post(
            `${STRAPI_API_URL}/api/categories`,
            {
              data: transformedData,
            },
            {
              headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
              },
            }
          );
          console.log(`Категория "${item.title}" успешно импортирована`);
        } catch (error) {
          console.error(
            `Ошибка при импорте категории "${item.title}":`,
            error.response ? error.response.data : error.message
          );
        }
      }
    }
  }

  console.log("Импорт категорий завершен");
}

importCategories();
