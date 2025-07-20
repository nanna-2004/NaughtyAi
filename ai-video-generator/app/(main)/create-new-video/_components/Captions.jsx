import React, { useState } from 'react';

const options = [
  { name: 'Minimal', style: 'text-base font-light' },
  { name: 'Bold Yellow', style: 'text-base font-bold text-yellow-500' },
  { name: 'Mono Style', style: 'text-base font-mono text-green-500' },
  { name: 'Large Subtitle', style: 'text-xl font-semibold text-blue-500' },
  { name: 'Classic White Shadow', style: 'text-base font-semibold text-white drop-shadow' },
  { name: 'RGB Light', style: 'text-base font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse' },
];

function Captions({ onHandleInputChange }) {
  const [selectedCaption, setSelectedCaption] = useState(null);

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-1">
        📝 Caption Style
      </h2>
      <p className="text-sm text-gray-400 mb-3">Select Caption Style</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedCaption(option.name);
              onHandleInputChange && onHandleInputChange('captionStyle', option.name);
            }}
            // --- START: UI FIX ---
            // Added flexbox utilities to center the text within each box.
            // Added a minimum height to ensure all boxes are the same size.
            className={`
              flex items-center justify-center 
              min-h-[60px] cursor-pointer p-3 rounded-md
              ${selectedCaption === option.name ? 'border-2 border-blue-500 font-bold' : 'border border-transparent'}
              bg-gray-100 dark:bg-slate-900 hover:border-blue-400 transition
            `}
            // --- END: UI FIX ---
          >
            <h2 className={option.style}>{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Captions;
