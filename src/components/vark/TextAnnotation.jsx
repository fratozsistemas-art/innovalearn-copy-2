import React, { useState } from 'react';
import { Highlighter, MessageSquare, Save, Trash2 } from 'lucide-react';

/**
 * Text Annotation Component
 * Allows students to highlight and annotate text for better comprehension
 */
const TextAnnotation = ({ content, title, onSave }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');

  const HIGHLIGHT_COLORS = {
    yellow: { bg: 'bg-innova-yellow-200 dark:bg-innova-yellow-900/40', label: 'Yellow' },
    green: { bg: 'bg-green-200 dark:bg-green-900/40', label: 'Green' },
    blue: { bg: 'bg-blue-200 dark:bg-blue-900/40', label: 'Blue' },
    pink: { bg: 'bg-pink-200 dark:bg-pink-900/40', label: 'Pink' },
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setShowAnnotationModal(true);
    }
  };

  const addAnnotation = () => {
    if (!selectedText) return;

    const newAnnotation = {
      id: Date.now(),
      text: selectedText,
      note: currentNote,
      color: highlightColor,
      timestamp: new Date().toISOString(),
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setShowAnnotationModal(false);
    setCurrentNote('');
    setSelectedText('');

    if (onSave) {
      onSave([...annotations, newAnnotation]);
    }
  };

  const removeAnnotation = (id) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const renderContentWithHighlights = () => {
    let highlightedContent = content;
    
    annotations.forEach(annotation => {
      const colorClass = HIGHLIGHT_COLORS[annotation.color].bg;
      const regex = new RegExp(`(${annotation.text})`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex,
        `<mark class="${colorClass} px-1 rounded cursor-pointer" data-annotation-id="${annotation.id}">$1</mark>`
      );
    });

    return { __html: highlightedContent };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select text to highlight and add notes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Highlighter className="w-5 h-5 text-innova-yellow-600 dark:text-innova-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {annotations.length} highlights
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-6 text-content"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={renderContentWithHighlights()}
      />

      {/* Annotations List */}
      {annotations.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your Annotations:
          </h4>
          <div className="space-y-3">
            {annotations.map(annotation => (
              <div
                key={annotation.id}
                className={`p-3 rounded-lg border ${HIGHLIGHT_COLORS[annotation.color].bg} border-gray-200 dark:border-gray-600`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      "{annotation.text}"
                    </p>
                    {annotation.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                        💭 {annotation.note}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(annotation.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAnnotation(annotation.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    title="Remove annotation"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Annotation Modal */}
      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-innova-teal-600 dark:text-innova-teal-400" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Annotation
              </h4>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Selected Text:
              </label>
              <p className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-900 dark:text-white">
                "{selectedText}"
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Highlight Color:
              </label>
              <div className="flex gap-2">
                {Object.entries(HIGHLIGHT_COLORS).map(([key, { bg, label }]) => (
                  <button
                    key={key}
                    onClick={() => setHighlightColor(key)}
                    className={`
                      px-4 py-2 rounded-lg border-2 transition-all
                      ${highlightColor === key 
                        ? 'border-innova-teal-500 ring-2 ring-innova-teal-300' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                      ${bg}
                    `}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Add Note (Optional):
              </label>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-innova-teal-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                rows={3}
                placeholder="Add your thoughts, questions, or insights..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAnnotationModal(false);
                  setCurrentNote('');
                  setSelectedText('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAnnotation}
                className="px-4 py-2 bg-innova-teal-500 hover:bg-innova-teal-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Select any text to highlight and add your personal notes
        </p>
      </div>
    </div>
  );
};

export default TextAnnotation;
