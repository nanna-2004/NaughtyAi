import { ScrollArea } from '@radix-ui/react-scroll-area';
import React, { useState } from 'react';

const voiceOptions = [
  { value: 'am_michael', name: 'US Michael (Male)' },
  { value: 'af_jessica', name: 'US Jessica (Female)' },
  { value: 'am_adam', name: 'US Adam (Male)' },
  { value: 'af_aoede', name: 'US Aoede (Female)' },
  { value: 'aura-helios-en', name: 'GB Helios (Male)' },
  { value: 'aura-athena-en', name: 'GB Athena (Female)' },
];

function Voice({ onHandleInputChange }) {
  const [selectedVoice, setSelectedVoice] = useState(null);

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-1">
        🎙️ Video Voice
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Select a voice for your video
      </p>

      <ScrollArea className="h-auto w-full p-1">
        <div className="grid grid-cols-2 gap-3">
          {voiceOptions.map((voice, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedVoice(voice.name);
                onHandleInputChange('voice', voice.value);
              }}
              className={`cursor-pointer p-3 rounded-lg border transition duration-200
                bg-gray-100 dark:bg-slate-900
                text-black dark:text-white
                hover:border-blue-500
                ${
                  voice.name === selectedVoice
                    ? 'font-bold border-black dark:border-white'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
            >
              {voice.name}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Voice;
