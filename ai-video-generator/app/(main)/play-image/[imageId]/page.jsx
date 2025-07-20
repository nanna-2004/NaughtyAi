'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthContext } from '@/app/_components/AuthContext';
import Link from 'next/link';
import { ArrowLeft, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function PlayImagePage() {
  const { imageId } = useParams();
  const { user, rawUser } = useAuthContext(); // Destructure rawUser from context
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check rawUser for login status before attempting to get token
    if (imageId && rawUser) { 
      const fetchImageData = async () => {
        try {
          const token = await rawUser.getIdToken(); // Use rawUser here
          
          const response = await axios.post('/api/generate-image-data', 
            { imageId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setImageData(response.data);
        } catch (error) {
          console.error("Error fetching image data:", error);
          setImageData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchImageData();
    }
  }, [imageId, rawUser]); // Add rawUser to dependency array

  const handleDownload = () => {
    if (imageData?.imageUrl) {
      const link = document.createElement('a');
      link.href = imageData.imageUrl;
      link.download = `${imageData.topic?.replace(/\s+/g, '_') || 'generated_image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading Image...</div>;
  }
  
  if (!imageData) {
    return <div className="p-10 text-center">Image not found or you do not have permission to view it.</div>;
  }

  const imageDisplayWidth = 1920;
  const imageDisplayHeight = 1080;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-5">
      <div className="md:col-span-2 flex items-center justify-center bg-black rounded-lg">
        {imageData.imageUrl ? (
          <div style={{ width: '100%', aspectRatio: '16 / 9' }} className="flex justify-center items-center">
            <Image 
              src={imageData.imageUrl} 
              alt={imageData.topic || "Generated Image"} 
              width={imageDisplayWidth} 
              height={imageDisplayHeight} 
              className="max-w-full max-h-[80vh] object-contain"
              priority 
            />
          </div>
        ) : (
          <div className="text-white">Image is still processing or failed to generate.</div>
        )}
      </div>
      <div className="p-5 border rounded-2xl h-full flex flex-col">
        <Link href={'/dashboard'}>
          <h2 className='flex gap-2 items-center cursor-pointer mb-4'>
            <ArrowLeft/> Back To Dashboard
          </h2>
        </Link>
        <div className='flex-grow'>
          <h2 className='text-2xl font-bold'>{imageData.topic}</h2>
          <p className='text-gray-500 text-sm mb-4'>Image Topic</p>
          <h3 className='font-semibold mt-4'>Style</h3>
          <p className='text-gray-600'>{imageData.style}</p>
        </div>
        <Button onClick={handleDownload} disabled={!imageData.imageUrl} className="w-full mt-4">
          <DownloadIcon className="mr-2" /> Export & Download
        </Button>
      </div>
    </div>
  );
}
export default PlayImagePage;
