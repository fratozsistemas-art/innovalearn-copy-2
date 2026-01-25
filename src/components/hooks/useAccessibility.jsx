import { useEffect, useCallback } from 'react';

/**
 * Hook para melhorar acessibilidade da aplicação
 * 
 * Fornece funcionalidades como:
 * - Anúncios para screen readers
 * - Gerenciamento de foco
 * - Navegação por teclado
 * - Detecção de preferências de acessibilidade
 */
export function useAccessibility() {
  /**
   * Anuncia mensagem para screen readers
   */
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remover após 1 segundo
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  /**
   * Move o foco para um elemento
   */
  const moveFocusTo = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
    }
  }, []);

  /**
   * Move o foco para o primeiro elemento focável dentro de um container
   */
  const moveFocusToFirst = useCallback((containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  /**
   * Cria trap de foco (útil para modals)
   */
  const createFocusTrap = useCallback((containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return () => {};

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focar no primeiro elemento
    firstFocusable?.focus();

    // Retornar função de cleanup
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  /**
   * Detectar se o usuário prefere movimento reduzido
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Detectar se o usuário prefere contraste alto
   */
  const prefersHighContrast = () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  };

  /**
   * Detectar se o usuário prefere modo escuro
   */
  const prefersDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  /**
   * Adiciona classe para navegação por teclado (remove quando usando mouse)
   */
  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.remove('using-keyboard');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Hook para anúncios automáticos de mudanças de rota
   */
  const announcePageChange = useCallback((pageName) => {
    announce(`Navegou para ${pageName}`, 'assertive');
  }, [announce]);

  /**
   * Configurar título da página para screen readers
   */
  const setPageTitle = useCallback((title) => {
    document.title = `${title} - Innova Academy`;
  }, []);

  return {
    announce,
    moveFocusTo,
    moveFocusToFirst,
    createFocusTrap,
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    announcePageChange,
    setPageTitle,
  };
}