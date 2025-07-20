// app/_components/Hero.jsx
'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

function Hero() {
  const handleScroll = () => {
    const element = document.getElementById('generated-images');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className='relative flex flex-col items-center overflow-hidden'
      style={{ 
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        src="/video/bg.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.2) saturate(1.3)',
          zIndex: 0,
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div className='relative z-10 mt-[80px] px-4 max-w-4xl text-center'>
        <h2 className='font-bold text-3xl text-white'>AI VIDEO & IMAGE GENERATOR</h2>
        <p className='mt-4 font-bold whitespace-pre-wrap text-white'>
          {`🚀 Transform Your topic into Wonders! With our cutting-edge AI Generator, turn  well-written scripts into 
  stunning videos 🎬, captivating images 🖼️, and powerful visual stories all in just a few clicks! Whether
 you're crafting content for marketing, education, or entertainment, our AI brings your ideas to life
  with unmatched creativity and speed.✨Say goodbye to long hours of editing—
  create, generate, and share instantly! 🌟`}
        </p>
        <div className='mt-6'>
          <Button
            size="lg" variant="destructive"
            onClick={handleScroll}
          >
            View All Templates
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero