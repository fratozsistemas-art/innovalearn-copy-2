import React from 'react';
import { useVARK, VARK_MODES } from '../contexts/VARKContext';
import { Eye, Headphones, BookOpen, Hand } from 'lucide-react';

const VARKModeSwitcher = () => {
  const { mode, setMode, activeMode, userProfile } = useVARK();

  const modes = [
    {
      id: VARK_MODES.AUTO,
      label: 'Auto',
      icon: '🎯',
      description: 'Adapt based on your profile',
    },
    {
      id: VARK_MODES.VISUAL,
      label: 'Visual',
      icon: Eye,
      description: 'Diagrams, charts, and graphics',
      score: userProfile.visual,
    },
    {
      id: VARK_MODES.AUDITORY,
      label: 'Auditory',
      icon: Headphones,
      description: 'Audio content and spoken explanations',
      score: userProfile.auditory,
    },
    {
      id: VARK_MODES.READING,
      label: 'Read/Write',
      icon: BookOpen,
      description: 'Text-based content and notes',
      score: userProfile.reading,
    },
    {
      id: VARK_MODES.KINESTHETIC,
      label: 'Kinesthetic',
      icon: Hand,
      description: 'Interactive simulations and practice',
      score: userProfile.kinesthetic,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Learning Mode
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Active: {modes.find(m => m.id === activeMode)?.label}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {modes.map((modeOption) => {
          const Icon = typeof modeOption.icon === 'string' ? null : modeOption.icon;
          const isActive = mode === modeOption.id;
          const isCurrentlyActive = activeMode === modeOption.id;

          return (
            <button
              key={modeOption.id}
              onClick={() => setMode(modeOption.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                ${isActive
                  ? 'border-innova-teal-500 bg-innova-teal-50 dark:bg-innova-teal-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-innova-teal-300'
                }
                ${isCurrentlyActive && !isActive ? 'ring-2 ring-innova-teal-300 ring-offset-2' : ''}
              `}
              title={modeOption.description}
            >
              <div className="flex flex-col items-center gap-2">
                {Icon ? (
                  <Icon className={`w-6 h-6 ${isActive ? 'text-innova-teal-600' : 'text-gray-600 dark:text-gray-400'}`} />
                ) : (
                  <span className="text-2xl">{modeOption.icon}</span>
                )}
                <span className={`text-xs font-medium ${isActive ? 'text-innova-teal-700 dark:text-innova-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {modeOption.label}
                </span>
                {modeOption.score !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {modeOption.score}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Switch between learning modes to find what works best for you
      </p>
    </div>
  );
};

export default VARKModeSwitcher;
