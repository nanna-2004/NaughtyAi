'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DownloadIcon, Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthContext } from '@/app/_components/AuthContext';

function VideoInfo({ videoData, videoId, durationInFrames }) {
  const [isRendering, setIsRendering] = useState(false);
  const { user, rawUser } = useAuthContext(); // Destructure rawUser from context

  const handleExportAndDownload = async () => {
    // Check rawUser for login status
    if (!rawUser) return alert("You must be logged in.");
    
    if (!durationInFrames || durationInFrames === 0) {
      alert("Video duration is still being calculated. Please wait a moment.");
      return;
    }
    setIsRendering(true);
    try {
      const token = await rawUser.getIdToken(); // Use rawUser here
      const response = await axios.post(
        '/api/render-video', 
        { 
          videoId,
          durationInFrames
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error("Error starting video render:", error);
      alert("Failed to start the video rendering process.");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className='p-5 border rounded-2xl h-full flex flex-col'>
      <Link href={'/dashboard'}>
        <h2 className='flex gap-2 items-center cursor-pointer mb-4'>
          <ArrowLeft/> Back To Dashboard
        </h2>
      </Link>
      <div className='flex-grow overflow-y-auto'>
        <h2 className='text-2xl font-bold'>{videoData?.topic || 'Untitled Project'}</h2>
        <p className='text-gray-500 text-sm mb-4'>Video Topic</p>
        
        <h3 className='font-semibold mt-4'>Voiceover Script</h3>
        <p className='text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-1 whitespace-pre-wrap'>
          {videoData?.script?.voiceover || 'No script available.'}
        </p>
      </div>
      <Button onClick={handleExportAndDownload} disabled={isRendering || durationInFrames === 0} className="w-full mt-4">
        {isRendering ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
        {isRendering ? 'Rendering...' : 'Export & Download'}
      </Button>
    </div>
  );
}
export default VideoInfo;
