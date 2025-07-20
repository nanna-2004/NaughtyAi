import React from 'react';
import { Composition } from 'remotion';
import { RemotionComposition } from '../app/_components/RemotionComposition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AI-Video" 
        component={RemotionComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
