import React from 'react';
import { useVARK } from '../contexts/VARKContext';

/**
 * VARK-aware content wrapper that applies mode-specific styling
 * and behavior to child content
 */
const VARKContent = ({ children, className = '' }) => {
  const { activeMode, isVisualMode, isAuditoryMode, isReadingMode, isKinestheticMode } = useVARK();

  const modeClasses = {
    visual: 'vark-visual-mode',
    auditory: 'vark-auditory-mode',
    reading: 'vark-reading-mode',
    kinesthetic: 'vark-kinesthetic-mode',
  };

  return (
    <div 
      className={`vark-content ${modeClasses[activeMode] || ''} ${className}`}
      data-vark-mode={activeMode}
    >
      {children}
    </div>
  );
};

/**
 * Conditional rendering component for mode-specific content
 */
export const VARKConditional = ({ mode, children }) => {
  const { activeMode } = useVARK();
  
  if (Array.isArray(mode)) {
    return mode.includes(activeMode) ? <>{children}</> : null;
  }
  
  return activeMode === mode ? <>{children}</> : null;
};

/**
 * Visual mode specific content
 */
export const VisualContent = ({ children }) => (
  <VARKConditional mode="visual">{children}</VARKConditional>
);

/**
 * Auditory mode specific content
 */
export const AuditoryContent = ({ children }) => (
  <VARKConditional mode="auditory">{children}</VARKConditional>
);

/**
 * Reading mode specific content
 */
export const ReadingContent = ({ children }) => (
  <VARKConditional mode="reading">{children}</VARKConditional>
);

/**
 * Kinesthetic mode specific content
 */
export const KinestheticContent = ({ children }) => (
  <VARKConditional mode="kinesthetic">{children}</VARKConditional>
);

export default VARKContent;
