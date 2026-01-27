import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Process Diagram Component
 * Visualizes step-by-step processes with arrows and status indicators
 */
const ProcessDiagram = ({ steps, title, orientation = 'horizontal' }) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
      )}

      <div className={`flex ${isHorizontal ? 'flex-row overflow-x-auto' : 'flex-col'} gap-4`}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id || index}>
            {/* Step Card */}
            <div className={`
              flex-shrink-0 ${isHorizontal ? 'w-64' : 'w-full'}
              bg-gradient-to-br from-innova-teal-50 to-white dark:from-gray-900 dark:to-gray-800
              rounded-lg border-2 border-innova-teal-200 dark:border-innova-teal-700 p-4
              transition-all hover:shadow-lg hover:scale-105
            `}>
              {/* Step Number */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-innova-teal-500 text-white flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                {step.completed && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>

              {/* Step Content */}
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {step.description}
              </p>

              {/* Step Details */}
              {step.details && step.details.length > 0 && (
                <ul className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-innova-teal-500 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Duration/Time */}
              {step.duration && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-innova-teal-600 dark:text-innova-teal-400">
                    ⏱️ {step.duration}
                  </span>
                </div>
              )}
            </div>

            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <div className={`
                flex items-center justify-center flex-shrink-0
                ${isHorizontal ? 'w-12' : 'h-12 w-full'}
              `}>
                <ArrowRight 
                  className={`
                    w-8 h-8 text-innova-teal-400
                    ${!isHorizontal ? 'rotate-90' : ''}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
        Follow the steps in order to complete the process
      </p>
    </div>
  );
};

export default ProcessDiagram;

// Example usage:
/*
const sampleSteps = [
  {
    id: 'step1',
    title: 'Understand the Problem',
    description: 'Read and analyze the requirements carefully',
    details: [
      'Identify inputs and outputs',
      'Note any constraints',
      'Consider edge cases'
    ],
    duration: '10 minutes',
    completed: true,
  },
  {
    id: 'step2',
    title: 'Design the Solution',
    description: 'Plan your approach before coding',
    details: [
      'Choose appropriate data structures',
      'Outline the algorithm',
      'Consider time complexity'
    ],
    duration: '15 minutes',
  },
  {
    id: 'step3',
    title: 'Implement the Code',
    description: 'Write clean, readable code',
    details: [
      'Follow coding standards',
      'Add comments',
      'Handle errors'
    ],
    duration: '30 minutes',
  },
];

<ProcessDiagram steps={sampleSteps} title="Problem Solving Process" orientation="horizontal" />
*/
