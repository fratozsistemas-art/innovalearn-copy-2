import React from 'react';
import { sanitizeHTML } from '@/components/utils/sanitize';

/**
 * Componente para renderizar HTML de forma segura
 * 
 * Uso:
 * <SafeHTML html={userContent} />
 * 
 * É preferível a usar dangerouslySetInnerHTML diretamente
 */
export default function SafeHTML({ html, className = '', ...props }) {
  // Sanitizar o HTML antes de renderizar
  const sanitized = React.useMemo(() => sanitizeHTML(html), [html]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  );
}