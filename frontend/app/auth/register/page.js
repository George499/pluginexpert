"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [speechTopics, setSpeechTopics] = useState("");
  const [education, setEducation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [album, setAlbum] = useState([]);
  const [error, setError] = useState("");

  // Состояния для управления видимостью пароля
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);
  const handleAlbumChange = (e) => setAlbum([...e.target.files]);

  // Валидация пароля
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Пароль должен быть минимум 6 символов, с одной заглавной буквой и одной цифрой."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }
    setError("");
    return true;
  };

  // Логирование данных FormData
  const logFormData = (formData) => {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  };

  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация пароля
    if (!validatePassword()) return;

    // Формируем данные для отправки
    const formData = new FormData();

    // Создаем объект data для отправки
    formData.append("data[username]", username);
    formData.append("data[password]", password);
    formData.append("data[firstName]", firstName);
    formData.append("data[lastName]", lastName);
    formData.append("data[specialization]", specialization);
    formData.append("data[bio]", bio);
    formData.append("data[speechTopics]", speechTopics);
    formData.append("data[education]", education);

    // Добавление аватара
    if (avatar) {
      formData.append("data[avatar]", avatar);
    } else {
      setError("Пожалуйста, загрузите аватар.");
      return;
    }

    // Добавление альбома (до 5 фото)
    if (album.length > 0) {
      album.forEach((file, index) => {
        formData.append(`data[album][${index}]`, file);
      });
    } else {
      setError("Пожалуйста, загрузите фотографии.");
      return;
    }

    // Логируем данные перед отправкой
    logFormData(formData);

    try {
      // Отправка данных на сервер
      const response = await fetch(
        "https://admin.pluginexpert.ru/api/speakers",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json(); // Получаем результат из ответа

      if (response.ok) {
        alert("Регистрация успешна!");
      } else {
        // Логируем ошибку и отображаем сообщение
        console.log(result);
        setError(result.message || "Произошла ошибка при регистрации");
      }
    } catch (error) {
      // Логируем ошибку, если что-то пошло не так при запросе
      console.error("Ошибка при отправке данных:", error);
      setError("Ошибка при отправке данных. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/images/bkground_1.png')] bg-cover bg-center flex justify-center items-center">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-4 justify-self-center">
          Форма регистрации
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* Логин и Пароль */}
          <div>
            <label htmlFor="username" className="block">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block">
              Пароль
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {confirmPasswordVisible ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          {/* Личные данные */}
          <div>
            <label htmlFor="firstName" className="block">
              Имя
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block">
              Фамилия
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block">
              Зона специализации
            </label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Выберите специализацию</option>
              {/* Добавьте реальные данные */}
              <option value="Маркетинг">Маркетинг</option>
              <option value="Разработка">Разработка</option>
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block">
              Биография
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="speechTopics" className="block">
              Темы выступлений
            </label>
            <textarea
              id="speechTopics"
              value={speechTopics}
              onChange={(e) => setSpeechTopics(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="education" className="block">
              Образование
            </label>
            <textarea
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Загрузка фото */}
          <div>
            <label htmlFor="avatar" className="block">
              Аватар
            </label>
            <input
              type="file"
              id="avatar"
              onChange={handleAvatarChange}
              className="w-full p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="album" className="block">
              Альбом (до 5 фото)
            </label>
            <input
              type="file"
              id="album"
              onChange={handleAlbumChange}
              multiple
              className="w-full p-2"
              accept="image/*"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded"
            >
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
