import React from 'react';
import { Toaster } from '@/components/ui/toaster';

/**
 * ToastProvider - Wrapper para o sistema de notificações toast
 * 
 * Fornece configuração centralizada para todos os toasts da aplicação
 */
export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}