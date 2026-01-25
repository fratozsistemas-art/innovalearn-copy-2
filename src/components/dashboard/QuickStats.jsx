import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

/**
 * QuickStats - Componente otimizado com React.memo e navegação
 * 
 * Evita re-renders desnecessários quando props não mudam
 */
const QuickStats = React.memo(({ icon: Icon, title, value, subtitle, color, onClick, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const isClickable = onClick || navigateTo;

  return (
    <Card 
      className={`border-none transition-all duration-300 ${
        isClickable ? 'hover:shadow-lg cursor-pointer hover:scale-105' : ''
      }`}
      role="article"
      aria-label={`${title}: ${value}. ${subtitle}`}
      tabIndex={isClickable ? 0 : -1}
      style={{ 
        backgroundColor: 'var(--background)',
        outline: 'none'
      }}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <p 
            className="text-sm font-medium mb-1" 
            style={{ color: 'var(--text-secondary)' }}
            id={`stat-title-${title.replace(/\s+/g, '-')}`}
          >
            {title}
          </p>
          <p 
            className="text-3xl font-bold mb-1" 
            style={{ color: 'var(--text-primary)' }}
            aria-labelledby={`stat-title-${title.replace(/\s+/g, '-')}`}
          >
            {value}
          </p>
          <p 
            className="text-xs" 
            style={{ color: 'var(--text-secondary)' }}
            role="note"
          >
            {subtitle}
          </p>
        </div>
        
        {isClickable && (
          <div className="mt-3 text-xs font-medium" style={{ color: color }}>
            Clique para ver detalhes →
          </div>
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function para evitar re-renders desnecessários
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.color === nextProps.color &&
    prevProps.icon === nextProps.icon &&
    prevProps.navigateTo === nextProps.navigateTo
  );
});

QuickStats.displayName = 'QuickStats';

export default QuickStats;