import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

/**
 * Audio Highlighted Text Component
 * Displays text with synchronized highlighting as it's read aloud
 */
const AudioHighlightedText = ({ content, title }) => {
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);

  const words = content.split(/\s+/);

  const handleHighlight = (wordIndex) => {
    setHighlightedWordIndex(wordIndex);
  };

  return (
    <div className="space-y-4">
      <AudioPlayer 
        text={content} 
        title={title}
        onHighlight={handleHighlight}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-content text-lg leading-loose">
          {words.map((word, index) => (
            <span
              key={index}
              className={`
                inline-block transition-all duration-200 px-1 rounded
                ${index === highlightedWordIndex 
                  ? 'audio-highlight bg-innova-teal-200 dark:bg-innova-teal-800 font-semibold scale-110' 
                  : ''
                }
              `}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioHighlightedText;
