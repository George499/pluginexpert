"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { User, MapPin, Globe, Github, Twitter, Mail } from "lucide-react";

const MOCK_PROFILE = {
  id: "1",
  fullName: "John Doe",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  bio: "Full-stack developer passionate about creating beautiful and functional web applications.",
  website: "https://johndoe.dev",
  email: "john@example.com",
  location: "San Francisco, CA",
  github: "johndoe",
  twitter: "johndoe",
};

export function ProfileForm() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      ...profile,
      fullName: formData.get("fullName"),
      website: formData.get("website"),
      bio: formData.get("bio"),
      avatarUrl: formData.get("avatarUrl"),
      location: formData.get("location"),
      github: formData.get("github"),
      twitter: formData.get("twitter"),
      email: formData.get("email"),
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProfile(updates);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-black">
              {profile.fullName}
            </h2>
            <div className="mt-1 flex items-center space-x-4 text-gray-900">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {profile.email}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium bg-[#42484D] hover:bg-[#3742a3] text-[#fffffe] rounded-m focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? "Отменить" : "Редактировать"}
        </button>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">{profile.bio}</p>
          </div>
          <div className="mt-6 flex items-center space-x-6 text-gray-500">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-indigo-600"
            >
              <Globe className="h-5 w-5 mr-2" />
              Website
            </a>
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-indigo-600"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </a>
            <a
              href={`https://twitter.com/${profile.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-indigo-600"
            >
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </a>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-black"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                defaultValue={profile.fullName}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={profile.email}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={profile.location}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                defaultValue={profile.website}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700"
              >
                GitHub Username
              </label>
              <input
                type="text"
                id="github"
                name="github"
                defaultValue={profile.github}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-700"
              >
                Twitter Username
              </label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                defaultValue={profile.twitter}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={profile.avatarUrl}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={profile.bio}
                className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Сохранить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
