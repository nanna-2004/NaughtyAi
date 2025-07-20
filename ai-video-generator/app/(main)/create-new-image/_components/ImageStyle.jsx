"use client";

import React from "react";
import NextImage from "next/image";

// Image style options
export const imageOptions = [
  {
    name: "Epic History Reimagined",
    image: "/Epic History Reimagined.png",
    borderColor: "border-red-500",
  },
  {
    name: "Futuristic AI Dreams",
    image: "/Futuristic AI Dreams.png",
    borderColor: "border-purple-500",
  },
  {
    name: "Terrifying Horror Scenes",
    image: "/Terrifying Horror Scenes.png",
    borderColor: "border-black",
  },
  {
    name: "Magical Tales for Kids",
    image: "/Magical Tales for Kids.png",
    borderColor: "border-yellow-400",
  },
  {
    name: "Anime Universe Builder",
    image: "/Anime Universe Builder.png",
    borderColor: "border-pink-500",
  },
  {
    name: "Cartoon Crafter",
    image: "/Cartoon Crafter.png",
    borderColor: "border-orange-400",
  },
  {
    name: "Hyper-Realistic Visuals",
    image: "/Hyper-Realistic Visuals.png",
    borderColor: "border-blue-600",
  },
  {
    name: "Cinematic Action Scenes",
    image: "/Cinematic Action Scenes.png",
    borderColor: "border-green-500",
  },
  {
    name: "Fantasy Kingdoms & Creatures",
    image: "/Fantasy Kingdoms & Creatures.png",
    borderColor: "border-indigo-500",
  },
  {
    name: "Romantic & Emotional Story Visuals",
    image: "/Romantic & Emotional Story Visuals.png",
    borderColor: "border-pink-300",
  },
  {
    name: "Ghibli-Inspired Whimsy",
    image: "/Ghibli-Inspired Whimsy.png",
    borderColor: "border-amber-400",
  },
];

function ImageStyle({ onHandleInputChange, onGenerate, loading }) {
  return (
    <div className="mt-5">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-black dark:text-white">
        🎨 Select Image Style
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Choose a theme for your image.
      </p>

      {/* Style Options */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {imageOptions.map((option, index) => (
          <div
            key={index}
            className="group cursor-pointer transition-all duration-300"
            onClick={() => onHandleInputChange("selectImageStyle", option.name)}
          >
            <div
              className={`relative w-full aspect-video overflow-hidden rounded border-2 ${option.borderColor} transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl`}
            >
              <NextImage
                src={option.image}
                alt={option.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  option.name === "Ghibli-Inspired Whimsy"
                    ? "object-[center_25%]" // Adjust this value to show the face/cropped area
                    : ""
                }`}
              />
            </div>
            <div className="mt-2 text-center font-bold text-sm transition-colors duration-300 text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {option.name}
            </div>
          </div>
        ))}
      </div>

      {/* Generate Image Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transform transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading ? "Generating..." : "🚀 Generate Image"}
        </button>
      </div>
    </div>
  );
}

export default ImageStyle;
