
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Bug, 
  Database, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Code,
  FileText,
  Zap
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";

export default function DebugDashboard() {
  const { data: user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [entityStats, setEntityStats] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [recentErrors, setRecentErrors] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    if (user?.user_type === 'administrador') {
      loadDebugData();
    }
  }, [user]);

  const loadDebugData = async () => {
    setLoading(true);
    try {
      // Verificar entidades principais
      const [
        users,
        modules,
        lessons,
        enrollments,
        studentProgress,
        gamificationProfiles,
        externalResources
      ] = await Promise.all([
        base44.entities.User.list().catch(() => []),
        base44.entities.Module.list().catch(() => []),
        base44.entities.Lesson.list().catch(() => []),
        base44.entities.Enrollment.list().catch(() => []),
        base44.entities.StudentProgress.list().catch(() => []),
        base44.entities.GamificationProfile.list().catch(() => []),
        base44.entities.ExternalResource.list().catch(() => [])
      ]);

      setEntityStats({
        users: users.length,
        modules: modules.length,
        lessons: lessons.length,
        enrollments: enrollments.length,
        studentProgress: studentProgress.length,
        gamificationProfiles: gamificationProfiles.length,
        externalResources: externalResources.length
      });

      // Verificar saúde do sistema
      const health = {
        database: 'online',
        auth: user ? 'working' : 'error',
        integrations: 'unknown',
        cache: 'enabled'
      };
      setSystemHealth(health);

      // Métricas de performance
      const perfMetrics = {
        pageLoad: performance.now(),
        memoryUsage: performance.memory ? 
          Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
        resourceCount: performance.getEntriesByType('resource').length
      };
      setPerformanceMetrics(perfMetrics);

    } catch (error) {
      console.error('Erro ao carregar dados de debug:', error);
      setRecentErrors([{
        message: error.message,
        timestamp: new Date().toISOString(),
        type: 'system'
      }]);
    }
    setLoading(false);
  };

  const runEntityIntegrityCheck = async () => {
    const issues = [];
    
    try {
      // Verificar lições sem módulo
      const lessons = await base44.entities.Lesson.list();
      const modules = await base44.entities.Module.list();
      const moduleIds = new Set(modules.map(m => m.id));
      
      const orphanLessons = lessons.filter(l => !moduleIds.has(l.module_id));
      if (orphanLessons.length > 0) {
        issues.push({
          severity: 'high',
          entity: 'Lesson',
          issue: `${orphanLessons.length} lições sem módulo válido`,
          ids: orphanLessons.map(l => l.id)
        });
      }

      // Verificar matrículas sem aluno
      const enrollments = await base44.entities.Enrollment.list();
      const users = await base44.entities.User.list();
      const userEmails = new Set(users.map(u => u.email));
      
      const orphanEnrollments = enrollments.filter(e => !userEmails.has(e.student_email));
      if (orphanEnrollments.length > 0) {
        issues.push({
          severity: 'medium',
          entity: 'Enrollment',
          issue: `${orphanEnrollments.length} matrículas de usuários inexistentes`,
          ids: orphanEnrollments.map(e => e.id)
        });
      }

      // Verificar progresso sem lição
      const progress = await base44.entities.StudentProgress.list();
      const lessonIds = new Set(lessons.map(l => l.id));
      
      const orphanProgress = progress.filter(p => !lessonIds.has(p.lesson_id));
      if (orphanProgress.length > 0) {
        issues.push({
          severity: 'low',
          entity: 'StudentProgress',
          issue: `${orphanProgress.length} registros de progresso de lições inexistentes`,
          ids: orphanProgress.map(p => p.id)
        });
      }

      // Verificar recursos com URLs inválidas
      const resources = await base44.entities.ExternalResource.list();
      const invalidUrlResources = resources.filter(r => {
        try {
          new URL(r.url);
          return false;
        } catch {
          return true;
        }
      });
      
      if (invalidUrlResources.length > 0) {
        issues.push({
          severity: 'medium',
          entity: 'ExternalResource',
          issue: `${invalidUrlResources.length} recursos com URLs inválidas`,
          ids: invalidUrlResources.map(r => r.id)
        });
      }

      alert(`Verificação completa!\n\n${issues.length} problemas encontrados:\n\n${
        issues.map(i => `[${i.severity.toUpperCase()}] ${i.entity}: ${i.issue}`).join('\n')
      }\n\nVeja o console para detalhes.`);
      
      console.group('🔍 Relatório de Integridade');
      console.table(issues);
      issues.forEach(issue => {
        console.group(`${issue.entity} - ${issue.issue}`);
        console.log('IDs afetados:', issue.ids);
        console.groupEnd();
      });
      console.groupEnd();

    } catch (error) {
      console.error('Erro na verificação de integridade:', error);
      alert('Erro ao executar verificação: ' + error.message);
    }
  };

  const clearLocalStorage = () => {
    if (confirm('Limpar todo localStorage? Isso vai fazer logout.')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const exportSystemState = () => {
    const state = {
      timestamp: new Date().toISOString(),
      user: user,
      entityStats,
      systemHealth,
      performanceMetrics,
      recentErrors,
      localStorage: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {}),
      environment: {
        mode: 'production', // Removed process.env.NODE_ENV
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovalearn-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user || user.user_type !== 'administrador') {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p>Esta página é exclusiva para administradores.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Bug className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
              Debug Dashboard
            </h1>
            <p className="text-gray-600">
              Ferramentas de diagnóstico e debugging do sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadDebugData} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={exportSystemState} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Exportar Estado
            </Button>
          </div>
        </div>

        {/* Status Geral */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-teal)' }} />
              <div className="text-2xl font-bold">{entityStats.users || 0}</div>
              <div className="text-sm text-gray-600">Usuários</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
              <div className="text-2xl font-bold">{entityStats.lessons || 0}</div>
              <div className="text-sm text-gray-600">Lições</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--info)' }} />
              <div className="text-2xl font-bold">{entityStats.enrollments || 0}</div>
              <div className="text-sm text-gray-600">Matrículas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--warning)' }} />
              <div className="text-2xl font-bold">
                {performanceMetrics.memoryUsage !== 'N/A' 
                  ? `${performanceMetrics.memoryUsage}MB`
                  : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Memória</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health">
              <Activity className="w-4 h-4 mr-2" />
              Saúde do Sistema
            </TabsTrigger>
            <TabsTrigger value="entities">
              <Database className="w-4 h-4 mr-2" />
              Entidades
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Bug className="w-4 h-4 mr-2" />
              Ferramentas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(systemHealth).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="font-semibold capitalize">{key}</span>
                      <Badge 
                        className="flex items-center gap-1"
                        style={{ 
                          backgroundColor: value === 'online' || value === 'working' || value === 'enabled'
                            ? 'var(--success)' 
                            : value === 'error' 
                            ? 'var(--error)'
                            : 'var(--warning)',
                          color: 'white'
                        }}
                      >
                        {value === 'online' || value === 'working' || value === 'enabled' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : value === 'error' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas das Entidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(entityStats).map(([entity, count]) => (
                    <div key={entity} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="font-semibold capitalize">
                        {entity.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="font-semibold">Page Load Time</span>
                    <Badge variant="outline">
                      {Math.round(performanceMetrics.pageLoad || 0)}ms
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="font-semibold">Memory Usage</span>
                    <Badge variant="outline">
                      {performanceMetrics.memoryUsage !== 'N/A' 
                        ? `${performanceMetrics.memoryUsage}MB`
                        : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="font-semibold">Resources Loaded</span>
                    <Badge variant="outline">{performanceMetrics.resourceCount || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de Debug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={runEntityIntegrityCheck}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Verificar Integridade das Entidades
                </Button>
                
                <Button 
                  onClick={clearLocalStorage}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Limpar LocalStorage
                </Button>

                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Aplicação
                </Button>

                <Button 
                  onClick={() => {
                    console.clear();
                    console.log('✅ Console limpo!');
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Limpar Console
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Ambiente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm font-mono">
                <div><strong>Modo:</strong> production</div> {/* Changed from {process.env.NODE_ENV || 'production'} */}
                <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 80)}...</div>
                <div><strong>Screen:</strong> {window.screen.width}x{window.screen.height}</div>
                <div><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</div>
                <div><strong>Online:</strong> {navigator.onLine ? 'Sim' : 'Não'}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
