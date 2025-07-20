'use client';
import Image from 'next/image';
import React from 'react';
import { imageOptions } from './ImageStyle';

function Preview({ formData }) {
  const selectedImageStyle =
    formData && imageOptions.find(item => item?.name === formData?.selectImageStyle);

  if (!selectedImageStyle) return null;

  return (
    <div className="relative mt-6 w-full max-w-4xl mx-auto">
      <h2 className="mb-3 text-2xl font-semibold text-black dark:text-white">Preview</h2>
      <div className="relative w-full rounded-lg overflow-hidden">
        <Image
          src={selectedImageStyle.image}
          alt={selectedImageStyle.name}
          width={1000}
          height={500}
          className="w-full h-auto rounded-lg object-contain"
          priority
        />
      </div>
      {/* Removed the image name below the preview */}
    </div>
  );
}

export default Preview;
