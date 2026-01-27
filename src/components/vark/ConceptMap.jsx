import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';

/**
 * Interactive Concept Map Component
 * Visualizes relationships between concepts with expandable nodes
 */
const ConceptMap = ({ concepts, title }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([concepts.id]));

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indent = level * 24;

    return (
      <div key={node.id} className="concept-node">
        <div
          className={`
            flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
            ${level === 0 
              ? 'bg-innova-teal-100 dark:bg-innova-teal-900/30 border-2 border-innova-teal-500' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-innova-teal-300'
            }
          `}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="text-innova-teal-600 dark:text-innova-teal-400">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </span>
          )}
          {!hasChildren && (
            <Circle className="w-3 h-3 fill-innova-teal-500 text-innova-teal-500" />
          )}
          <div className="flex-1">
            <h4 className={`font-semibold ${level === 0 ? 'text-lg text-innova-teal-900 dark:text-innova-teal-100' : 'text-gray-900 dark:text-white'}`}>
              {node.label}
            </h4>
            {node.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {node.description}
              </p>
            )}
          </div>
          {node.badge && (
            <span className="px-2 py-1 text-xs font-medium bg-innova-orange-100 text-innova-orange-800 dark:bg-innova-orange-900/30 dark:text-innova-orange-200 rounded-full">
              {node.badge}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-innova-teal-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-sm border border-innova-teal-200 dark:border-gray-700 p-6">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Circle className="w-6 h-6 fill-innova-teal-500 text-innova-teal-500" />
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        {renderNode(concepts)}
      </div>

      <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
        Click on nodes to expand and explore relationships between concepts
      </p>
    </div>
  );
};

export default ConceptMap;

// Example usage:
/*
const sampleConcepts = {
  id: 'root',
  label: 'Artificial Intelligence',
  description: 'The simulation of human intelligence by machines',
  children: [
    {
      id: 'ml',
      label: 'Machine Learning',
      description: 'Systems that learn from data',
      badge: 'Core',
      children: [
        {
          id: 'supervised',
          label: 'Supervised Learning',
          description: 'Learning from labeled data',
        },
        {
          id: 'unsupervised',
          label: 'Unsupervised Learning',
          description: 'Finding patterns in unlabeled data',
        },
      ],
    },
    {
      id: 'nlp',
      label: 'Natural Language Processing',
      description: 'Understanding and generating human language',
      badge: 'Advanced',
    },
  ],
};

<ConceptMap concepts={sampleConcepts} title="AI Fundamentals" />
*/
