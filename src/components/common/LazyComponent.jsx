import React, { Suspense } from 'react';
import { Loader } from 'lucide-react';

/**
 * Wrapper para lazy loading de componentes com fallback
 * 
 * Uso:
 * const MyComponent = React.lazy(() => import('./MyComponent'));
 * 
 * <LazyComponent>
 *   <MyComponent />
 * </LazyComponent>
 */
export default function LazyComponent({ 
  children, 
  fallback = null,
  minHeight = '400px' 
}) {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo"
    >
      <div className="text-center">
        <Loader 
          className="w-8 h-8 animate-spin mx-auto mb-3" 
          style={{ color: 'var(--primary-teal)' }}
          aria-hidden="true"
        />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Carregando...
        </p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}