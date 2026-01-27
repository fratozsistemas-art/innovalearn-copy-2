import React, { useState } from 'react';
import { GripVertical, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

/**
 * Drag and Drop Activity Component
 * Interactive learning activity for kinesthetic learners
 */
const DragDropActivity = ({ 
  title,
  description,
  items,
  dropZones,
  onComplete,
}) => {
  const [draggingItem, setDraggingItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleDragStart = (item) => {
    setDraggingItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!draggingItem) return;

    setDroppedItems(prev => ({
      ...prev,
      [zoneId]: draggingItem,
    }));
    setDraggingItem(null);
  };

  const checkAnswers = () => {
    const results = dropZones.map(zone => {
      const droppedItem = droppedItems[zone.id];
      const isCorrect = droppedItem && zone.correctItemIds.includes(droppedItem.id);
      return {
        zoneId: zone.id,
        isCorrect,
        droppedItem,
      };
    });

    const allCorrect = results.every(r => r.isCorrect);
    setFeedback(results);
    setIsComplete(allCorrect);

    if (allCorrect && onComplete) {
      onComplete();
    }
  };

  const reset = () => {
    setDroppedItems({});
    setFeedback(null);
    setIsComplete(false);
    setDraggingItem(null);
  };

  const getAvailableItems = () => {
    const droppedItemIds = Object.values(droppedItems).map(item => item?.id);
    return items.filter(item => !droppedItemIds.includes(item.id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-innova-yellow-200 dark:border-innova-yellow-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Available Items */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Drag these items:
        </h4>
        <div className="flex flex-wrap gap-3">
          {getAvailableItems().map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item)}
              className="interactive-element px-4 py-3 bg-gradient-to-r from-innova-yellow-100 to-innova-yellow-50 dark:from-innova-yellow-900/30 dark:to-innova-yellow-800/20 border-2 border-innova-yellow-300 dark:border-innova-yellow-600 rounded-lg cursor-move hover:shadow-lg transition-all flex items-center gap-2"
            >
              <GripVertical className="w-4 h-4 text-innova-yellow-600 dark:text-innova-yellow-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Drop them here:
        </h4>
        {dropZones.map(zone => {
          const droppedItem = droppedItems[zone.id];
          const zoneFeedback = feedback?.find(f => f.zoneId === zone.id);

          return (
            <div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
              className={`
                drag-drop-zone min-h-[80px] p-4 rounded-lg transition-all
                ${draggingItem ? 'active' : ''}
                ${zoneFeedback 
                  ? zoneFeedback.isCorrect 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-innova-teal-300 dark:border-innova-teal-600'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900 dark:text-white">
                  {zone.label}
                </h5>
                {zoneFeedback && (
                  zoneFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )
                )}
              </div>
              {zone.hint && !droppedItem && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {zone.hint}
                </p>
              )}
              {droppedItem && (
                <div className="mt-2 px-4 py-2 bg-innova-yellow-100 dark:bg-innova-yellow-900/30 border border-innova-yellow-300 dark:border-innova-yellow-600 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {droppedItem.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={checkAnswers}
          disabled={Object.keys(droppedItems).length !== dropZones.length}
          className="px-6 py-2 bg-innova-teal-500 hover:bg-innova-teal-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
        >
          Check Answers
        </button>
      </div>

      {/* Success Message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">
                Excellent work!
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                You've correctly matched all items. Great job!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Drag items from the top and drop them into the correct zones below
      </p>
    </div>
  );
};

export default DragDropActivity;

// Example usage:
/*
const items = [
  { id: '1', label: 'Python' },
  { id: '2', label: 'HTML' },
  { id: '3', label: 'SQL' },
  { id: '4', label: 'JavaScript' },
];

const dropZones = [
  {
    id: 'programming',
    label: 'Programming Languages',
    hint: 'Languages used for general-purpose programming',
    correctItemIds: ['1', '4'],
  },
  {
    id: 'markup',
    label: 'Markup Languages',
    hint: 'Languages used for structuring content',
    correctItemIds: ['2'],
  },
  {
    id: 'database',
    label: 'Database Languages',
    hint: 'Languages used for database queries',
    correctItemIds: ['3'],
  },
];

<DragDropActivity
  title="Classify Programming Languages"
  description="Drag each language to its correct category"
  items={items}
  dropZones={dropZones}
  onComplete={() => console.log('Activity completed!')}
/>
*/
