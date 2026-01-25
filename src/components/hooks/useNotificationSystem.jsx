import { useToast } from '@/components/ui/use-toast';

// Detectar se está em ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Hook personalizado para sistema unificado de notificações
 * 
 * Fornece interface consistente para exibir notificações em toda a aplicação
 * e registrar erros de forma estruturada
 */
export function useNotificationSystem() {
  const { toast } = useToast();

  /**
   * Exibir notificação de sucesso
   */
  const showSuccess = (title, description = null) => {
    toast({
      title: title,
      description: description,
      variant: 'default',
      className: 'border-green-500 bg-green-50',
    });

    // Log em desenvolvimento
    if (isDevelopment) {
      console.log('✅ Success:', title, description);
    }
  };

  /**
   * Exibir notificação de erro
   */
  const showError = (title, description = null, error = null) => {
    toast({
      title: title,
      description: description || 'Ocorreu um erro inesperado. Tente novamente.',
      variant: 'destructive',
    });

    // Log estruturado do erro
    logError(error, { title, description });
  };

  /**
   * Exibir notificação de aviso
   */
  const showWarning = (title, description = null) => {
    toast({
      title: title,
      description: description,
      variant: 'default',
      className: 'border-orange-500 bg-orange-50',
    });

    if (isDevelopment) {
      console.warn('⚠️ Warning:', title, description);
    }
  };

  /**
   * Exibir notificação informativa
   */
  const showInfo = (title, description = null) => {
    toast({
      title: title,
      description: description,
      variant: 'default',
      className: 'border-blue-500 bg-blue-50',
    });

    if (isDevelopment) {
      console.info('ℹ️ Info:', title, description);
    }
  };

  /**
   * Exibir notificação de loading/progresso
   */
  const showLoading = (title, description = null) => {
    return toast({
      title: title,
      description: description,
      duration: Infinity, // Não fecha automaticamente
      className: 'border-blue-500 bg-blue-50',
    });
  };

  /**
   * Registrar erro de forma estruturada
   */
  const logError = (error, context = {}) => {
    const errorData = {
      message: error?.message || 'Unknown error',
      name: error?.name,
      stack: error?.stack,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log no console em desenvolvimento
    if (isDevelopment) {
      console.group('🔴 Error Log');
      console.error('Error:', error);
      console.table(errorData);
      console.groupEnd();
    } else {
      // Em produção, apenas log simples
      console.error('Error:', errorData.message, errorData.context);
    }

    // TODO: Enviar para serviço de monitoramento (Sentry, LogRocket, etc.)
    // sendToMonitoringService(errorData);
    
    return errorData;
  };

  /**
   * Wrapper para chamadas assíncronas com tratamento de erro automático
   */
  const withErrorHandling = async (asyncFn, errorTitle = 'Erro na operação') => {
    try {
      const result = await asyncFn();
      return { success: true, data: result };
    } catch (error) {
      showError(errorTitle, error.message, error);
      return { success: false, error };
    }
  };

  /**
   * Executar operação com feedback visual completo
   */
  const executeWithFeedback = async ({
    asyncFn,
    loadingMessage = 'Processando...',
    successMessage = 'Operação concluída!',
    errorMessage = 'Erro na operação',
  }) => {
    const loadingToast = showLoading(loadingMessage);

    try {
      const result = await asyncFn();
      
      // Fechar loading toast
      if (loadingToast && loadingToast.dismiss) {
        loadingToast.dismiss();
      }
      
      showSuccess(successMessage);
      return { success: true, data: result };
      
    } catch (error) {
      // Fechar loading toast
      if (loadingToast && loadingToast.dismiss) {
        loadingToast.dismiss();
      }
      
      showError(errorMessage, error.message, error);
      return { success: false, error };
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    logError,
    withErrorHandling,
    executeWithFeedback,
  };
}