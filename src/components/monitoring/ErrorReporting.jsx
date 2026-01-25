/**
 * Sistema de Reportagem de Erros
 * 
 * Centraliza logging e reportagem de erros para monitoramento
 * Preparado para integração com Sentry, LogRocket, ou similar
 */

// Detectar ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Configuração do sistema de monitoramento
 */
const MONITORING_CONFIG = {
  enabled: true,
  logToConsole: isDevelopment,
  reportToService: !isDevelopment,
  includeStackTrace: true,
  includeUserContext: true,
  includeBrowserInfo: true
};

/**
 * Tipos de erro
 */
export const ErrorTypes = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  NETWORK: 'network',
  DATABASE: 'database',
  INTEGRATION: 'integration',
  UI: 'ui',
  UNKNOWN: 'unknown'
};

/**
 * Severidade do erro
 */
export const ErrorSeverity = {
  CRITICAL: 'critical',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Reporta um erro para o sistema de monitoramento
 */
export function reportError(error, context = {}) {
  if (!MONITORING_CONFIG.enabled) return;

  const errorData = buildErrorData(error, context);

  if (MONITORING_CONFIG.logToConsole) {
    logToConsole(errorData);
  }

  if (MONITORING_CONFIG.reportToService) {
    sendToMonitoringService(errorData);
  }

  return errorData;
}

/**
 * Constrói objeto de dados do erro
 */
function buildErrorData(error, context) {
  const errorData = {
    message: error?.message || 'Unknown error',
    name: error?.name || 'Error',
    type: context.type || ErrorTypes.UNKNOWN,
    severity: context.severity || ErrorSeverity.ERROR,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      url: window.location.href,
      userAgent: navigator.userAgent
    }
  };

  if (MONITORING_CONFIG.includeStackTrace && error?.stack) {
    errorData.stack = error.stack;
  }

  if (MONITORING_CONFIG.includeBrowserInfo) {
    errorData.browser = {
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor,
      onLine: navigator.onLine
    };
  }

  return errorData;
}

/**
 * Log no console
 */
function logToConsole(errorData) {
  const style = 'color: #EF4444; font-weight: bold; font-size: 14px;';
  
  console.group(`%c🔴 ${errorData.severity.toUpperCase()}: ${errorData.message}`, style);
  console.log('Type:', errorData.type);
  console.log('Timestamp:', errorData.timestamp);
  
  if (errorData.context) {
    console.log('Context:', errorData.context);
  }
  
  if (errorData.stack) {
    console.log('Stack:', errorData.stack);
  }
  
  console.groupEnd();
}

/**
 * Envia para serviço de monitoramento
 */
function sendToMonitoringService(errorData) {
  // TODO: Integrar com Sentry, LogRocket, ou outro serviço
  // Por enquanto, apenas simula o envio
  
  if (isDevelopment) {
    console.log('📤 Would send to monitoring service:', errorData);
  }
  
  // Exemplo de integração com Sentry:
  // if (window.Sentry) {
  //   window.Sentry.captureException(new Error(errorData.message), {
  //     level: errorData.severity,
  //     extra: errorData.context
  //   });
  // }
}

/**
 * Wrapper para capturar erros de funções assíncronas
 */
export async function withErrorReporting(fn, context = {}) {
  try {
    return await fn();
  } catch (error) {
    reportError(error, context);
    throw error;
  }
}

/**
 * Reporta warning
 */
export function reportWarning(message, context = {}) {
  reportError(
    new Error(message),
    { ...context, severity: ErrorSeverity.WARNING }
  );
}

/**
 * Reporta info
 */
export function reportInfo(message, context = {}) {
  reportError(
    new Error(message),
    { ...context, severity: ErrorSeverity.INFO }
  );
}

/**
 * Inicializa sistema de monitoramento
 */
export function initializeMonitoring(config = {}) {
  Object.assign(MONITORING_CONFIG, config);
  
  // Capturar erros globais não tratados
  window.addEventListener('error', (event) => {
    reportError(event.error || new Error(event.message), {
      type: ErrorTypes.UI,
      severity: ErrorSeverity.ERROR,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Capturar promises rejeitadas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason || new Error('Unhandled Promise Rejection'), {
      type: ErrorTypes.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      promise: event.promise
    });
  });

  if (isDevelopment) {
    console.log('✅ Error monitoring initialized');
  }
}