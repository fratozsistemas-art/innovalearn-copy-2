import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Server
} from "lucide-react";

export default function NetworkDiagnosticPage() {
  const [tests, setTests] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTest = (name, status, message, details = null) => {
    setTests(prev => [...prev, { name, status, message, details, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setTests([]);
    setIsRunning(true);

    // Test 1: Conectividade básica
    try {
      addTest('Conectividade Internet', 'running', 'Verificando...');
      const online = navigator.onLine;
      if (online) {
        addTest('Conectividade Internet', 'success', 'Dispositivo está online');
      } else {
        addTest('Conectividade Internet', 'error', 'Dispositivo está offline');
        setIsRunning(false);
        return;
      }
    } catch (error) {
      addTest('Conectividade Internet', 'error', `Erro: ${error.message}`);
    }

    // Test 2: Ping Base44 API
    try {
      addTest('Base44 API', 'running', 'Tentando conectar...');
      const startTime = Date.now();
      const response = await fetch('https://base44.app/api/health', { 
        method: 'GET',
        mode: 'cors'
      });
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        addTest('Base44 API', 'success', `API respondendo (${responseTime}ms)`, {
          status: response.status,
          responseTime
        });
      } else {
        addTest('Base44 API', 'warning', `Status: ${response.status}`, {
          status: response.status
        });
      }
    } catch (error) {
      addTest('Base44 API', 'error', `Não foi possível conectar: ${error.message}`, {
        error: error.message,
        type: error.name
      });
    }

    // Test 3: Import base44Client
    try {
      addTest('Import base44Client', 'running', 'Importando...');
      const { base44 } = await import("@/api/base44Client");
      
      if (!base44) {
        addTest('Import base44Client', 'error', 'base44 object é null');
        setIsRunning(false);
        return;
      }
      
      addTest('Import base44Client', 'success', 'Base44 client importado');

      // Test 4: Verificar estrutura do base44
      const hasAuth = !!base44.auth;
      const hasEntities = !!base44.entities;
      const hasIntegrations = !!base44.integrations;

      if (hasAuth && hasEntities) {
        addTest('Estrutura base44', 'success', 'auth e entities disponíveis', {
          auth: hasAuth,
          entities: hasEntities,
          integrations: hasIntegrations
        });
      } else {
        addTest('Estrutura base44', 'error', 'Estrutura incompleta', {
          auth: hasAuth,
          entities: hasEntities,
          integrations: hasIntegrations
        });
      }

      // Test 5: Tentar autenticação
      try {
        addTest('Autenticação', 'running', 'Verificando usuário...');
        const user = await base44.auth.me();
        
        if (user) {
          addTest('Autenticação', 'success', `Autenticado como: ${user.email}`, {
            email: user.email,
            role: user.role,
            user_type: user.user_type
          });
        } else {
          addTest('Autenticação', 'warning', 'Usuário não autenticado');
        }
      } catch (authError) {
        if (authError.message?.includes('not authenticated')) {
          addTest('Autenticação', 'warning', 'Usuário não autenticado (esperado se não fez login)');
        } else {
          addTest('Autenticação', 'error', `Erro: ${authError.message}`, {
            error: authError.message,
            status: authError.status
          });
        }
      }

      // Test 6: Tentar listar módulos
      try {
        addTest('List Modules', 'running', 'Buscando módulos...');
        const startTime = Date.now();
        const modules = await base44.entities.Module.list();
        const responseTime = Date.now() - startTime;
        
        addTest('List Modules', 'success', `${modules.length} módulos encontrados (${responseTime}ms)`, {
          count: modules.length,
          responseTime,
          firstModule: modules[0]?.id
        });
      } catch (moduleError) {
        addTest('List Modules', 'error', `Erro: ${moduleError.message}`, {
          error: moduleError.message,
          stack: moduleError.stack?.substring(0, 200)
        });
      }

      // Test 7: Verificar CORS
      try {
        addTest('CORS Configuration', 'running', 'Verificando...');
        const testCors = await fetch('https://base44.app/api/health', {
          method: 'OPTIONS',
          headers: {
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'content-type'
          }
        });
        
        const corsHeaders = {
          'access-control-allow-origin': testCors.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': testCors.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': testCors.headers.get('access-control-allow-headers')
        };
        
        addTest('CORS Configuration', 'success', 'CORS configurado corretamente', corsHeaders);
      } catch (corsError) {
        addTest('CORS Configuration', 'warning', 'Não foi possível verificar CORS', {
          error: corsError.message
        });
      }

    } catch (error) {
      addTest('Critical Error', 'error', `Erro crítico: ${error.message}`, {
        error: error.message,
        stack: error.stack
      });
    }

    // Test 8: DNS Resolution
    try {
      addTest('DNS Resolution', 'running', 'Verificando...');
      const dnsStart = Date.now();
      await fetch('https://base44.app/', { method: 'HEAD', mode: 'no-cors' });
      const dnsTime = Date.now() - dnsStart;
      addTest('DNS Resolution', 'success', `DNS funcionando (${dnsTime}ms)`);
    } catch (error) {
      addTest('DNS Resolution', 'error', 'Problema com resolução DNS');
    }

    // Test 9: LocalStorage
    try {
      addTest('LocalStorage', 'running', 'Verificando...');
      const testKey = '_diagnostic_test';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === 'test') {
        addTest('LocalStorage', 'success', 'Funcionando corretamente');
      } else {
        addTest('LocalStorage', 'error', 'Não está salvando dados');
      }
    } catch (error) {
      addTest('LocalStorage', 'error', 'Bloqueado ou desabilitado');
    }

    // Test 10: Environment info
    addTest('Environment', 'success', 'Info coletada', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substring(0, 100),
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language
    });

    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {navigator.onLine ? (
              <Wifi className="w-12 h-12 text-green-600" />
            ) : (
              <WifiOff className="w-12 h-12 text-red-600" />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Diagnóstico de Rede
          </h1>
          <p className="text-gray-600">
            Verificando conectividade e acesso à API Base44
          </p>
        </div>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Iniciar Diagnóstico</span>
              <Badge className={navigator.onLine ? 'bg-green-500' : 'bg-red-500'}>
                {navigator.onLine ? 'Online' : 'Offline'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Executando Testes...
                </>
              ) : (
                <>
                  <Server className="w-5 h-5 mr-2" />
                  Executar Diagnóstico Completo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {tests.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {successCount}
                  </div>
                  <div className="text-sm text-gray-600">Testes com Sucesso</div>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-yellow-600" />
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {warningCount}
                  </div>
                  <div className="text-sm text-gray-600">Avisos</div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-10 h-10 mx-auto mb-2 text-red-600" />
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {errorCount}
                  </div>
                  <div className="text-sm text-gray-600">Erros</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resultados dos Testes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests.map((test, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(test.status)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{test.name}</h4>
                            <span className="text-xs opacity-60">
                              {test.timestamp.toLocaleTimeString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm">{test.message}</p>
                          
                          {test.details && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer hover:underline">
                                Ver Detalhes
                              </summary>
                              <pre className="mt-2 p-3 bg-black bg-opacity-10 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {errorCount > 0 && (
              <Card className="border-2 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Ações Recomendadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-red-900">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Verifique se você está conectado à internet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Tente fazer logout e login novamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Limpe o cache do navegador (Ctrl+Shift+Delete)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Desative extensões de bloqueio de anúncios temporariamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Verifique se seu firewall não está bloqueando base44.app</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Entre em contato com o suporte técnico se o problema persistir</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}

      </div>
    </div>
  );
}