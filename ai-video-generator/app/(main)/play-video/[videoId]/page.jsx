'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import RemotionPlayer from '../_components/RemotionPlayer';
import VideoInfo from '../_components/VideoInfo';
import { useAuthContext } from '@/app/_components/AuthContext';

function PlayVideo() {
  const { videoId } = useParams();
  const { user, rawUser } = useAuthContext(); // Destructure rawUser from context
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(0);

  useEffect(() => {
    // Check rawUser for login status before attempting to get token
    if (videoId && rawUser) { 
      const fetchVideoData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await rawUser.getIdToken(); // Use rawUser here
            const response = await axios.post('/api/get-video-data', 
                { videoId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideoData(response.data);
        } catch (err) {
            console.error('Error fetching video:', err);
            setError('Failed to load video data. You may not have permission to view this video.');
        } finally {
            setLoading(false);
        }
      };
      fetchVideoData();
    }
  }, [videoId, rawUser]); // Add rawUser to dependency array

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-10 p-5'>
      <div className='md:col-span-3'>
        <RemotionPlayer 
          videoData={videoData} 
          setDurationInFrames={setDurationInFrames}
        />
      </div>
      <div className='md:col-span-2'>
        <VideoInfo 
          videoData={videoData} 
          videoId={videoId}
          durationInFrames={durationInFrames}
        />
      </div>
    </div>
  );
}
export default PlayVideo;
