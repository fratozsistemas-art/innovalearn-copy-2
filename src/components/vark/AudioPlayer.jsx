import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';

/**
 * Text-to-Speech Audio Player Component
 * Provides audio playback controls for auditory learners
 */
const AudioPlayer = ({ text, title, onHighlight }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    // Split text into words for highlighting
    wordsRef.current = text.split(/\s+/);
  }, [text]);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported in this browser');
    }
  }, []);

  const speak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = isMuted ? 0 : volume;
    utterance.lang = 'pt-BR'; // Portuguese (Brazil)

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Track word boundaries for highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const wordIndex = Math.floor(event.charIndex / (text.length / wordsRef.current.length));
        setCurrentWordIndex(wordIndex);
        if (onHighlight) {
          onHighlight(wordIndex);
        }
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      speak();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const skipBackward = () => {
    stop();
    // In a real implementation, you would track position and resume from there
    setTimeout(() => speak(), 100);
  };

  const skipForward = () => {
    stop();
    // In a real implementation, you would skip ahead
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current && isPlaying) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };

  return (
    <div className="sticky top-20 z-10 bg-gradient-to-r from-innova-orange-50 to-innova-yellow-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-lg border-2 border-innova-orange-200 dark:border-innova-orange-700 p-4 mb-6">
      {/* Title */}
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-innova-orange-600 dark:text-innova-orange-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={skipBackward}
          disabled={!isPlaying}
          className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Skip Backward"
        >
          <SkipBack className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={togglePlayPause}
          className="p-4 rounded-full bg-innova-orange-500 hover:bg-innova-orange-600 text-white shadow-lg transition-all hover:scale-105"
          title={!isPlaying ? 'Play' : isPaused ? 'Resume' : 'Pause'}
        >
          {!isPlaying || isPaused ? (
            <Play className="w-6 h-6" fill="currentColor" />
          ) : (
            <Pause className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={skipForward}
          disabled={!isPlaying}
          className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Skip Forward"
        >
          <SkipForward className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Playback Speed</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Speed: {rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      {isPlaying && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-block w-2 h-2 bg-innova-orange-500 rounded-full animate-pulse"></span>
          <span>Playing... (Word {currentWordIndex + 1} of {wordsRef.current.length})</span>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Listen to content read aloud • Adjust speed and volume to your preference
      </p>
    </div>
  );
};

export default AudioPlayer;
