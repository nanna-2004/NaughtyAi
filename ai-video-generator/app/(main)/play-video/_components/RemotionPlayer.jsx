'use client'
import React, { useEffect, useState } from 'react'
import { Player } from "@remotion/player";
import RemotionComposition from '@/app/_components/RemotionComposition';
import { getAudioDurationInSeconds } from '@remotion/media-utils';

function RemotionPlayer({ videoData }) {
  const [internalDuration, setInternalDuration] = useState(300); 
  
  useEffect(() => {
    if (videoData?.audioUrl) {
      getAudioDurationInSeconds(videoData.audioUrl)
        .then((duration) => {
          if (!isNaN(duration) && duration > 0) {
            const frames = Math.ceil(duration * 30);
            setInternalDuration(frames);
          }
        })
        .catch((err) => {
          console.error("Could not get audio duration:", err);
          setInternalDuration(300);
        });
    }
  }, [videoData?.audioUrl]);

  if (!videoData) return <div>Loading Player...</div>;

  // For 16:9 landscape, the dimensions should be 1920 wide by 1080 high.
  // The player's display style should also match.
  const compositionWidth = 1920;  // Landscape width
  const compositionHeight = 1080; // Landscape height
  const playerAspectRatio = '16 / 9'; // CSS aspect ratio for landscape display

  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={internalDuration}
        compositionWidth={compositionWidth}   // Use landscape dimensions
        compositionHeight={compositionHeight} // Use landscape dimensions
        fps={30}
        controls
        style={{ width: '100%', aspectRatio: playerAspectRatio, borderRadius: '12px' }} // Display as landscape
        inputProps={{ videoData: videoData }}
      />
    </div>
  )
}
export default RemotionPlayer;