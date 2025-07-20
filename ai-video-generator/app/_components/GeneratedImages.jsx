// app/_components/GeneratedImages.jsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios'; // For fetching data from your new API route
import { Image as ImageIcon } from 'lucide-react'; // For the icon

function GeneratedImages() {
  const [publicImages, setPublicImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/public-images'); // Call your new API route
        setPublicImages(response.data);
      } catch (err) {
        console.error("Error fetching public images:", err);
        setError("Failed to load public images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicImages();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading public images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (publicImages.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center mt-10 gap-5 p-5 border border-dashed rounded-xl py-16'>
        <ImageIcon size={60} className="text-gray-400" />
        <h2 className='text-gray-400 text-lg font-bold'>
          No public images available yet.
        </h2>
      </div>
    );
  }

  return (
    // --- FIX IS HERE: Added id="generated-images" ---
    <div id="generated-images" className="p-8 bg-gray-900 text-white"> 
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">GENERATED IMAGES</h1>
        <p className="text-gray-400">Discover what others have created with Naughty AI.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {publicImages.map((image) => (
          <Link href={`/play-image/${image.id}`} key={image.id}>
            <div className="border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800 cursor-pointer">
              <div className="w-full rounded-t-xl overflow-hidden bg-slate-900" style={{ aspectRatio: '16 / 9' }}>
                <Image 
                  src={image.imageUrl || '/logo.svg'} // Fallback to logo if image URL is missing
                  alt={image.topic || "Generated Image"} 
                  width={1920} // Expecting 16:9 landscape
                  height={1080} // Expecting 16:9 landscape
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate mb-1">{image.topic || 'Untitled Image'}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{image.prompt || 'No script available.'}</p>
                {image.createdAt && (
                  <p className="text-gray-500 text-xs mt-2">
                    Created: {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GeneratedImages;
