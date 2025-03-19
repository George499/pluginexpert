"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const API_URL = "https://admin.pluginexpert.ru";

export function ProfileForm() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      try {
        const userRes = await fetch(`${API_URL}/api/users/me?populate=speaker.Image`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await userRes.json();
        console.log("Текущий пользователь:", userData);

        if (!userData?.speaker) {
          toast.error("Ошибка: У пользователя нет связанного профиля спикера");
          return;
        }

        setProfile(userData.speaker);
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        toast.error("Ошибка загрузки профиля. Попробуйте позже.");
      }
    };

    fetchProfile();
  }, [router]);

  if (!profile) return <div className="text-center text-gray-600">Загрузка...</div>;

  // Выбираем лучшее доступное изображение
  const imageUrl =
    profile.Image?.[0]?.formats?.medium?.url ||
    profile.Image?.[0]?.formats?.large?.url ||
    profile.Image?.[0]?.url ||
    "/default-avatar.png";

  // 📌 Функция для отправки изменений в Strapi
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!(e.currentTarget instanceof HTMLFormElement)) {
      console.error("Ошибка: e.currentTarget не является формой!", e.currentTarget);
      toast.error("Ошибка формы. Попробуйте ещё раз.");
      return;
    }
  
    const formData = new FormData(e.currentTarget);
    console.log("Данные формы:", Object.fromEntries(formData)); // Для отладки
  
    const updates = {
      Name: formData.get("fullName"),
      Profession: formData.get("profession"),
      Bio: [
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [{ text: formData.get("bio"), type: "text" }],
            },
          ],
        },
      ],
      Price: [
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [{ text: formData.get("price"), type: "text" }],
            },
          ],
        },
      ],
    };
  
    console.log("Данные для обновления:", updates);
  
    const token = localStorage.getItem("authToken");
    const userRes = await fetch(`${API_URL}/api/users/me?populate=speaker`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const userData = await userRes.json();
    const speakerId = userData?.speaker?.id;
  
    if (!speakerId) {
      toast.error("Ошибка: У пользователя нет привязанного профиля спикера");
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/api/speakers/${speakerId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ data: updates }),
      });
  
      const response = await res.json();
      console.log("Ответ от Strapi:", response);
  
      if (res.ok) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success("Профиль обновлён!");
      } else {
        toast.error(`Ошибка обновления: ${response.error?.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      toast.error("Ошибка обновления профиля. Попробуйте позже.");
    }
  };
  
  

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Блок с аватаром и основной инфой */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-x-6">
        {/* Фото спикера */}
        <img
          src={API_URL + imageUrl}
          alt={profile.Name}
          className="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover border-4 border-gray-300"
        />

        {/* Информация о спикере */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-black">{profile.Name}</h2>
          <p className="text-gray-600 text-lg mt-2">{profile.Profession}</p>
          <button onClick={() => setIsEditing(!isEditing)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
            {isEditing ? "Отменить" : "Редактировать"}
          </button>
        </div>
      </div>

      {/* Основной контент */}
      {!isEditing ? (
        <div className="mt-6">
          {/* О себе */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black">О себе</h3>
            <ul className="list-disc pl-6 text-gray-800">
              {profile.Bio?.[0]?.children?.map((item, index) => (
                <li key={index}>{item.children[0].text}</li>
              ))}
            </ul>
          </div>

          {/* Темы выступлений */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black">Темы выступлений</h3>
            <ul className="list-disc pl-6 text-gray-800">
              {profile.speech_topics?.[0]?.children?.map((item, index) => (
                <li key={index}>{item.children[0].text}</li>
              ))}
            </ul>
          </div>

          {/* Стоимость услуг */}
          <div>
            <h3 className="text-xl font-semibold text-black">Стоимость</h3>
            <ul className="list-disc pl-6 text-gray-800">
              {profile.Price?.[0]?.children?.map((item, index) => (
                <li key={index}>{item.children[0].text}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя</label>
            <input
              name="fullName"
              defaultValue={profile.Name}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Профессия</label>
            <input
              name="profession"
              defaultValue={profile.Profession}
              className="w-full border p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">О себе</label>
            <textarea
              name="bio"
              className="w-full border p-2 rounded text-black"
              defaultValue={profile.Bio?.[0]?.children?.map(item => item.children[0].text).join("\n")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Стоимость</label>
            <textarea
              name="price"
              className="w-full border p-2 rounded text-black"
              defaultValue={profile.Price?.[0]?.children?.map(item => item.children[0].text).join("\n")}
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Сохранить
          </button>
        </form>
      )}
    </div>
  );
}
