import Image from 'next/image';
import React from 'react';
import { options } from './VideoStyle';

const captionOptions = {
  "Minimal": "text-white font-medium",
  "Bold Yellow": "text-yellow-400 font-bold",
  "Mono Style": "text-white font-mono",
  "Large Subtitle": "text-white text-xl font-semibold",
  "Classic White Shadow": "text-white font-semibold shadow-md",
  "RGB Light": "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text font-bold",
  "Neon": "text-green-500 font-extrabold text-3xl tracking-wide",
};

function Preview({ formData }) {
  const selectedVideoStyle = formData && options.find(item => item?.name === formData?.selectVideoStyle);
  const selectedCaption = formData?.captionStyle;
  const captionClass = captionOptions[selectedCaption];

  if (!selectedVideoStyle) return null;

  return (
    <div className="relative mt-6 w-full max-w-4xl mx-auto">
      {/* 🔧 Fixed: Preview header works in both light & dark */}
      <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">Preview</h2>

      <div className="relative w-full">
        <Image
          src={selectedVideoStyle.image}
          alt={selectedVideoStyle.name || "Video Preview"}
          width={1000}
          height={500}
          className="rounded-lg w-full object-cover"
        />

        {selectedCaption && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4">
            <span className={`text-center block ${captionClass}`}>
              {selectedCaption.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;
