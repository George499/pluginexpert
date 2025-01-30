"use client";

import { useState, useEffect } from "react";
import AllSpeakers from "@/components/all-speakers/AllSpeakers";

const STRAPI_API_URL = "https://admin.pluginexpert.ru/api";

function Category() {
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all-categories");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${STRAPI_API_URL}/categories`);
        if (!res.ok) throw new Error("Ошибка загрузки категорий");
        const data = await res.json();
        setAllCategories(data.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        let url = `${STRAPI_API_URL}/speakers?populate[0]=categories&populate[1]=Image`;
        if (selectedCategory !== "all-categories") {
          url += `&filters[categories][slug][$eq]=${selectedCategory}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ошибка загрузки спикеров");
        const data = await res.json();
        setAllSpeakers(data.data);
      } catch (error) {
        console.error("Ошибка загрузки спикеров:", error);
      }
    };

    fetchSpeakers();
  }, [selectedCategory]);

  return (
    <AllSpeakers allSpeakers={allSpeakers} allCategories={allCategories} />
  );
}

export default Category;
