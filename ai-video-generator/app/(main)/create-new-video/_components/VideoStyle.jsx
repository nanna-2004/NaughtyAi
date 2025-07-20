import React from 'react';
import NextImage from 'next/image';

// Video style options
export const options = [
  {
    name: 'Epic History Reimagined',
    image: '/Epic History Reimagined.png',
    borderColor: 'border-red-500',
  },
  {
    name: 'Futuristic AI Dreams',
    image: '/Futuristic AI Dreams.png',
    borderColor: 'border-cyan-400',
  },
  {
    name: 'Terrifying Horror Scenes',
    image: '/Terrifying Horror Scenes.png',
    borderColor: 'border-purple-600',
  },
  {
    name: 'Magical Tales for Kids',
    image: '/Magical Tales for Kids.png',
    borderColor: 'border-pink-400',
  },
  {
    name: 'Anime Universe Builder',
    image: '/Anime Universe Builder.png',
    borderColor: 'border-fuchsia-500',
  },
  {
    name: 'Cartoon Crafter',
    image: '/Cartoon Crafter.png',
    borderColor: 'border-yellow-400',
  },
  {
    name: 'Hyper-Realistic Visuals',
    image: '/Hyper-Realistic Visuals.png',
    borderColor: 'border-lime-400',
  },
  {
    name: 'Cinematic Action Scenes',
    image: '/Cinematic Action Scenes.png',
    borderColor: 'border-orange-400',
  },
  {
    name: 'Fantasy Kingdoms & Creatures',
    image: '/Fantasy Kingdoms & Creatures.png',
    borderColor: 'border-emerald-400',
  },
  {
    name: 'Romantic & Emotional Story Visuals',
    image: '/Romantic & Emotional Story Visuals.png',
    borderColor: 'border-rose-400',
  },
  {
    name: 'Ghibli-Inspired Whimsy',
    image: '/Ghibli-Inspired Whimsy.png',
    borderColor: 'border-green-400',
  },
];

function VideoStyle({ onHandleInputChange }) {
  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold text-black dark:text-white">
        🎨 Select Video Style
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Choose a theme to build your video.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="group cursor-pointer transition-all duration-300"
            onClick={() => onHandleInputChange("selectVideoStyle", option.name)}
          >
            <div
              className={`relative w-full aspect-video overflow-hidden rounded border-2 ${option.borderColor} transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl`}
            >
              <NextImage
                src={option.image}
                alt={option.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  option.name === 'Ghibli-Inspired Whimsy'
                    ? 'object-[center_25%]'
                    : ''
                }`}
              />
            </div>

            <div
              className="mt-2 text-center font-bold text-sm transition-colors duration-300 text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300"
            >
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoStyle;
