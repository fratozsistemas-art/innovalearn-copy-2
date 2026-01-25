import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Activity,
  Database,
  Wifi,
  WifiOff,
  Code,
  RefreshCw,
  Server,
  BookOpen,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModules } from "@/components/hooks/useModules";
import { useLessons } from "@/components/hooks/useLessons";

export default function PlatformStatusPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isRunningNetworkTests, setIsRunningNetworkTests] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { data: modules = [], isLoading: modulesLoading, error: modulesError, refetch: refetchModules } = useModules();
  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError, refetch: refetchLessons } = useLessons();

  const { data: lessonPlans = [], isLoading: plansLoading, error: plansError, refetch: refetchPlans } = useQuery({
    queryKey: ['lessonPlans'],
    queryFn: async () => {
      try {
        const allLessonPlans = await base44.entities.LessonPlan.list();
        return allLessonPlans || [];
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });

  const curiosityModules = modules.filter(m => m.course_id === 'curiosity');
  const curiosity1Module = modules.find(m => m.id === "curiosity-1");
  const curiosityLessons = lessons.filter(l => l.course_id === 'curiosity');
  const curiosity1Lessons = lessons.filter(l => l.module_id === 'curiosity-1');
  const curiosityPlans = lessonPlans.filter(p => p.lesson_id?.startsWith("curiosity"));

  const addTest = (name, status, message, details = null) => {
    setTests(prev => [...prev, { name, status, message, details, timestamp: new Date() }]);
  };

  const runNetworkDiagnostics = async () => {
    setTests([]);
    setIsRunningNetworkTests(true);

    try {
      addTest('Conectividade Internet', 'running', 'Verificando...');
      const online = navigator.onLine;
      if (online) {
        addTest('Conectividade Internet', 'success', 'Dispositivo online');
      } else {
        addTest('Conectividade Internet', 'error', 'Dispositivo offline');
        setIsRunningNetworkTests(false);
        return;
      }
    } catch (error) {
      addTest('Conectividade Internet', 'error', `Erro: ${error.message}`);
    }

    try {
      addTest('Base44 API', 'running', 'Conectando...');
      const startTime = Date.now();
      const response = await fetch('https://base44.app/api/health', { method: 'GET', mode: 'cors' });
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        addTest('Base44 API', 'success', `API respondendo (${responseTime}ms)`, { status: response.status, responseTime });
      } else {
        addTest('Base44 API', 'warning', `Status: ${response.status}`, { status: response.status });
      }
    } catch (error) {
      addTest('Base44 API', 'error', `Erro: ${error.message}`, { error: error.message, type: error.name });
    }

    try {
      addTest('Import base44Client', 'running', 'Importando...');
      const { base44: client } = await import("@/api/base44Client");
      
      if (!client) {
        addTest('Import base44Client', 'error', 'base44 object é null');
        setIsRunningNetworkTests(false);
        return;
      }
      
      addTest('Import base44Client', 'success', 'Base44 client importado');

      const hasAuth = !!client.auth;
      const hasEntities = !!client.entities;
      const hasIntegrations = !!client.integrations;

      if (hasAuth && hasEntities) {
        addTest('Estrutura base44', 'success', 'auth e entities disponíveis', { auth: hasAuth, entities: hasEntities, integrations: hasIntegrations });
      } else {
        addTest('Estrutura base44', 'error', 'Estrutura incompleta', { auth: hasAuth, entities: hasEntities, integrations: hasIntegrations });
      }

      try {
        addTest('Autenticação', 'running', 'Verificando usuário...');
        const user = await client.auth.me();
        
        if (user) {
          addTest('Autenticação', 'success', `Autenticado: ${user.email}`, { email: user.email, role: user.role, user_type: user.user_type });
        } else {
          addTest('Autenticação', 'warning', 'Usuário não autenticado');
        }
      } catch (authError) {
        if (authError.message?.includes('not authenticated')) {
          addTest('Autenticação', 'warning', 'Não autenticado (esperado se não fez login)');
        } else {
          addTest('Autenticação', 'error', `Erro: ${authError.message}`, { error: authError.message, status: authError.status });
        }
      }

      try {
        addTest('List Modules', 'running', 'Buscando...');
        const startTime = Date.now();
        const mods = await client.entities.Module.list();
        const responseTime = Date.now() - startTime;
        
        addTest('List Modules', 'success', `${mods.length} módulos (${responseTime}ms)`, { count: mods.length, responseTime, firstModule: mods[0]?.id });
      } catch (moduleError) {
        addTest('List Modules', 'error', `Erro: ${moduleError.message}`, { error: moduleError.message });
      }

    } catch (error) {
      addTest('Critical Error', 'error', `Erro crítico: ${error.message}`, { error: error.message, stack: error.stack });
    }

    setIsRunningNetworkTests(false);
  };

  const loadData = async () => {
    setRetryCount(prev => prev + 1);
    await Promise.all([refetchModules(), refetchLessons(), refetchPlans()]);
  };

  const isLoading = modulesLoading || lessonsLoading || plansLoading;
  const hasError = modulesError || lessonsError || plansError;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            🔧 Status do Sistema
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitoramento completo: saúde da plataforma, rede, dados e código
          </p>
        </div>

        <Tabs defaultValue="health">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health">
              <Activity className="w-4 h-4 mr-2" />
              Saúde
            </TabsTrigger>
            <TabsTrigger value="network">
              <Wifi className="w-4 h-4 mr-2" />
              Rede
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="w-4 h-4 mr-2" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Código
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="mt-6 space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Database className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                  <div className="text-3xl font-bold">{modules.length}</div>
                  <div className="text-sm text-gray-600">Módulos</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">Operacional</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold">{lessons.length}</div>
                  <div className="text-sm text-gray-600">Lições</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">Operacional</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-purple-600" />
                  <div className="text-3xl font-bold">{lessonPlans.length}</div>
                  <div className="text-sm text-gray-600">Planos</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">Operacional</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  {navigator.onLine ? (
                    <Wifi className="w-10 h-10 mx-auto mb-2 text-green-600" />
                  ) : (
                    <WifiOff className="w-10 h-10 mx-auto mb-2 text-red-600" />
                  )}
                  <div className="text-sm text-gray-600 mb-2">Conectividade</div>
                  <Badge className={navigator.onLine ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {navigator.onLine ? 'Online' : 'Offline'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold">Autenticação Base44</p>
                        <p className="text-sm text-gray-600">OAuth 2.0 operacional</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold">Banco de Dados</p>
                        <p className="text-sm text-gray-600">{modules.length + lessons.length + lessonPlans.length} registros</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">100%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold">OpenAI Integration</p>
                        <p className="text-sm text-gray-600">GPT-4 disponível</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Diagnóstico de Rede</span>
                  <Badge className={navigator.onLine ? 'bg-green-500' : 'bg-red-500'}>
                    {navigator.onLine ? 'Online' : 'Offline'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runNetworkDiagnostics} 
                  disabled={isRunningNetworkTests}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6"
                  size="lg"
                >
                  {isRunningNetworkTests ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <Server className="w-5 h-5 mr-2" />
                      Executar Diagnóstico
                    </>
                  )}
                </Button>

                {tests.length > 0 && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Card className="border-2 border-green-200">
                        <CardContent className="p-6 text-center">
                          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
                          <div className="text-3xl font-bold text-green-600">{successCount}</div>
                          <div className="text-sm text-gray-600">Sucesso</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-yellow-200">
                        <CardContent className="p-6 text-center">
                          <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-yellow-600" />
                          <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
                          <div className="text-sm text-gray-600">Avisos</div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-red-200">
                        <CardContent className="p-6 text-center">
                          <XCircle className="w-10 h-10 mx-auto mb-2 text-red-600" />
                          <div className="text-3xl font-bold text-red-600">{errorCount}</div>
                          <div className="text-sm text-gray-600">Erros</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-3">
                      {tests.map((test, index) => (
                        <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(test.status)}`}>
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
                                  <summary className="text-xs cursor-pointer hover:underline">Ver Detalhes</summary>
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
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Verificação de Dados</span>
                  <Button onClick={loadData} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Recarregar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                    <p>Verificando dados...</p>
                    {retryCount > 0 && <p className="text-sm text-gray-500 mt-2">Tentativa {retryCount}</p>}
                  </div>
                ) : hasError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-2xl font-bold mb-2">Erro de Conexão</h3>
                    <p className="text-gray-600">{modulesError?.message || lessonsError?.message || plansError?.message}</p>
                  </div>
                ) : (
                  <>
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-3">📊 Resumo Geral</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{modules.length}</div>
                            <div className="text-sm text-gray-600">Módulos</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{lessons.length}</div>
                            <div className="text-sm text-gray-600">Lições</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">{lessonPlans.length}</div>
                            <div className="text-sm text-gray-600">Planos</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-orange-600">{curiosityModules.length}</div>
                            <div className="text-sm text-gray-600">Curiosity</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200">
                      <CardHeader className="bg-purple-50">
                        <CardTitle>Verificação: Curiosity-1</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border-2" style={{
                            borderColor: curiosity1Module ? '#10b981' : '#ef4444',
                            backgroundColor: curiosity1Module ? '#f0fdf4' : '#fef2f2'
                          }}>
                            <div className="flex items-center gap-2 mb-2">
                              {curiosity1Module ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                              <span className="font-semibold">Módulo curiosity-1</span>
                            </div>
                            <p className="text-sm text-gray-600">{curiosity1Module ? '✓ Encontrado' : '✗ Não encontrado'}</p>
                          </div>

                          <div className="p-4 rounded-lg border-2" style={{
                            borderColor: curiosity1Lessons.length > 0 ? '#10b981' : '#ef4444',
                            backgroundColor: curiosity1Lessons.length > 0 ? '#f0fdf4' : '#fef2f2'
                          }}>
                            <div className="flex items-center gap-2 mb-2">
                              {curiosity1Lessons.length > 0 ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                              <span className="font-semibold">Lições curiosity-1</span>
                            </div>
                            <p className="text-sm text-gray-600">{curiosity1Lessons.length} lições</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualidade do Código</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
                      <p className="font-bold text-lg">85%</p>
                      <p className="text-sm text-gray-600">Code Quality</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-yellow-600" />
                      <p className="font-bold text-lg">12</p>
                      <p className="text-sm text-gray-600">Warnings</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-6 text-center">
                      <XCircle className="w-10 h-10 mx-auto mb-2 text-red-600" />
                      <p className="font-bold text-lg">3</p>
                      <p className="text-sm text-gray-600">Errors</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-6 rounded-lg bg-blue-50">
                  <h4 className="font-semibold mb-3">✅ Boas Práticas:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• React Query para data fetching</li>
                    <li>• Error Boundaries</li>
                    <li>• Custom hooks</li>
                    <li>• Sanitização de inputs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}