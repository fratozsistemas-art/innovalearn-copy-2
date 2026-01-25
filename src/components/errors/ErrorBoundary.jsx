import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { createPageUrl } from '@/utils';

// Detectar se está em ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * ErrorBoundary - Componente para capturar e tratar erros de UI
 * 
 * Implementa o padrão Error Boundary do React para capturar erros
 * em qualquer parte da árvore de componentes filhos
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 ErrorBoundary capturou erro:', error);
    console.error('📍 Stack trace:', errorInfo.componentStack);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('📊 Detalhes do Erro:');
    console.log(errorData);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = createPageUrl('Dashboard');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--neutral-light)' }}>
          <Card className="max-w-2xl w-full shadow-2xl border-none">
            <CardHeader className="border-b" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Ops! Algo deu errado</CardTitle>
                  <p className="text-sm opacity-90 mt-1">
                    Ocorreu um erro inesperado na aplicação
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Não se preocupe! Aqui estão algumas opções:
                </p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }} />
                    Tente recarregar a página
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }} />
                    Volte para a página inicial
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }} />
                    Entre em contato com o suporte se o problema persistir
                  </li>
                </ul>
              </div>

              {isDevelopment && error && (
                <div className="space-y-3">
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2 hover:opacity-70">
                      <span>🐛 Detalhes do Erro (Desenvolvimento)</span>
                      <span className="text-xs opacity-50">clique para expandir</span>
                    </summary>
                    <div className="mt-3 space-y-2">
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs font-mono text-red-800 font-semibold mb-1">
                          Mensagem:
                        </p>
                        <p className="text-sm font-mono text-red-700">
                          {error.message}
                        </p>
                      </div>

                      {error.stack && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 max-h-48 overflow-auto">
                          <p className="text-xs font-mono text-gray-600 font-semibold mb-1">
                            Stack Trace:
                          </p>
                          <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {errorInfo && errorInfo.componentStack && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 max-h-48 overflow-auto">
                          <p className="text-xs font-mono text-gray-600 font-semibold mb-1">
                            Component Stack:
                          </p>
                          <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>

                  {errorCount > 1 && (
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-800">
                        ⚠️ Este erro ocorreu <strong>{errorCount}</strong> vezes. 
                        Considere investigar a causa raiz.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;