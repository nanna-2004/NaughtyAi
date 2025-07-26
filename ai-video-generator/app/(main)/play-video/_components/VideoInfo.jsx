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

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

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
      
      if (response.data.success && response.data.videoData) {
        const { videoData: vData } = response.data;
        const projectName = vData.topic?.replace(/\s+/g, '_') || 'video_project';
        
        // Download audio if available
        if (vData.audioUrl) {
          await downloadFile(vData.audioUrl, `${projectName}_audio.mp3`);
        }
        
        // Download images
        if (vData.images && vData.images.length > 0) {
          for (let i = 0; i < vData.images.length; i++) {
            await downloadFile(vData.images[i], `${projectName}_image_${i + 1}.png`);
          }
        }
        
        // Create and download project info as JSON
        const projectInfo = {
          topic: vData.topic,
          script: vData.script,
          captions: vData.captions,
          durationInFrames: vData.durationInFrames,
          aspectRatio: vData.aspectRatio,
          audioUrl: vData.audioUrl,
          images: vData.images,
          downloadedAt: new Date().toISOString()
        };
        
        const infoBlob = new Blob([JSON.stringify(projectInfo, null, 2)], { type: 'application/json' });
        const infoUrl = window.URL.createObjectURL(infoBlob);
        const infoLink = document.createElement('a');
        infoLink.href = infoUrl;
        infoLink.download = `${projectName}_project_info.json`;
        document.body.appendChild(infoLink);
        infoLink.click();
        document.body.removeChild(infoLink);
        window.URL.revokeObjectURL(infoUrl);
        
        alert(`Video components downloaded successfully! Audio, images, and project info have been saved to your downloads folder.`);
      } else {
        alert("Failed to prepare video for download. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading video:", error);
      if (error.response?.status === 403) {
        alert("No credits remaining. Please buy more credits to download videos.");
      } else if (error.response?.status === 400) {
        alert("Video is not ready for download. Please wait for generation to complete.");
      } else {
        alert("Failed to download video. Please try again.");
      }
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
        
        <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md'>
          <p className='text-sm text-blue-700 dark:text-blue-300'>
            <strong>Download includes:</strong> Audio file, all scene images, and project information (JSON format) that can be used with video editing software.
          </p>
        </div>
      </div>
      <Button onClick={handleExportAndDownload} disabled={isRendering || durationInFrames === 0} className="w-full mt-4">
        {isRendering ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
        {isRendering ? 'Preparing Download...' : 'Download Video Assets'}
      </Button>
    </div>
  );
}
export default VideoInfo;
