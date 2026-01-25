import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2,
  AlertTriangle,
  Loader,
  RefreshCw,
  Shield,
  Globe,
  Play,
  Pause
} from "lucide-react";
import { validateLessonBatch } from "../components/content/ResourceValidator";
import { useCurrentUser } from "@/components/hooks/useUser";

export default function ResourceValidationPage() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentProgress, setCurrentProgress] = useState({
    current: 0,
    total: 0,
    currentLesson: null,
    status: 'idle'
  });
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);

  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const data = await base44.entities.Module.list();
      return data;
    },
    staleTime: 1000 * 60 * 10
  });

  const { data: allLessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const data = await base44.entities.Lesson.list();
      return data;
    },
    staleTime: 1000 * 60 * 10
  });

  // Módulos piloto
  const pilotModules = modules.filter(m => 
    m.data && ['curiosity-1', 'discovery-1', 'pioneer-1', 'challenger-1'].includes(m.data.id)
  );

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runValidation = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setLogs([]);
    setResults(null);

    const modulesToProcess = selectedModules.length > 0 
      ? pilotModules.filter(m => selectedModules.includes(m.data.id))
      : pilotModules;

    addLog(`🚀 Iniciando validação de ${modulesToProcess.length} módulos...`, 'info');

    const allResults = {
      total: 0,
      validated: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    for (const module of modulesToProcess) {
      if (isPaused) {
        addLog('⏸️ Validação pausada pelo usuário', 'warning');
        break;
      }

      const moduleLessons = allLessons.filter(l => 
        l.data && l.data.module_id === module.data.id
      );

      addLog(`\n📚 Módulo: ${module.data.title} (${moduleLessons.length} lições)`, 'info');

      const batchResults = await validateLessonBatch(
        moduleLessons.map(l => ({ ...l.data, id: l.id })),
        module.data,
        (progress) => {
          setCurrentProgress(progress);
          
          if (progress.status === 'validating') {
            addLog(`   🔍 [${progress.current}/${progress.total}] Validando: ${progress.currentLesson}`, 'info');
          } else if (progress.status === 'updated') {
            addLog(`   ✅ Atualizado com ${progress.updates} recursos verificados`, 'success');
          }
        }
      );

      // Agregar resultados
      allResults.total += batchResults.total;
      allResults.validated += batchResults.validated;
      allResults.updated += batchResults.updated;
      allResults.failed += batchResults.failed;
      allResults.errors.push(...batchResults.errors);

      addLog(`\n📊 Módulo ${module.data.title} concluído:`, 'success');
      addLog(`   • ${batchResults.validated} lições validadas`, 'success');
      addLog(`   • ${batchResults.updated} lições atualizadas`, 'success');
      addLog(`   • ${batchResults.failed} falhas`, batchResults.failed > 0 ? 'error' : 'info');
    }

    setResults(allResults);
    addLog(`\n🎉 Validação completa!`, 'success');
    addLog(`   • Total: ${allResults.total} lições`, 'info');
    addLog(`   • Validadas: ${allResults.validated} (${Math.round(allResults.validated/allResults.total*100)}%)`, 'success');
    addLog(`   • Atualizadas: ${allResults.updated}`, 'success');
    addLog(`   • Falhas: ${allResults.failed}`, allResults.failed > 0 ? 'error' : 'success');

    // Invalidar queries para recarregar dados atualizados
    queryClient.invalidateQueries({ queryKey: ['lessons'] });
    
    setIsRunning(false);
  };

  const toggleModule = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (modulesLoading || lessonsLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'var(--primary-teal)' }} />
          <p>Carregando módulos e lições...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--primary-teal)' }} />
      </div>
    );
  }

  if (!['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <p>Acesso restrito a administradores</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            🔍 Validação Inteligente de Recursos
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sistema automatizado que substitui URLs fictícias por recursos reais da internet
          </p>
        </div>

        {/* Info Card */}
        <Alert className="border-2" style={{ borderColor: 'var(--info)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
          <Globe className="w-5 h-5" style={{ color: 'var(--info)' }} />
          <AlertDescription>
            <strong>Como funciona:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• IA busca na web recursos reais para cada lição</li>
              <li>• Valida URLs (não retorna 404, apropriado para idade)</li>
              <li>• Substitui placeholders por links verificados</li>
              <li>• Garante balance VARK (Visual, Auditory, Read/Write, Kinesthetic)</li>
              <li>• Tempo estimado: ~3-5 minutos por lição (~3-5 horas para 64 lições)</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Module Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Módulos para Validar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pilotModules.map(module => {
                const moduleLessons = allLessons.filter(l => l.data && l.data.module_id === module.data.id);
                const isSelected = selectedModules.includes(module.data.id);

                return (
                  <Card
                    key={module.id}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:shadow-lg'
                    }`}
                    onClick={() => toggleModule(module.data.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{module.data.title}</h3>
                          <Badge variant="outline">{module.data.course_id}</Badge>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {moduleLessons.length} lições • Nível {module.data.explorer_level}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedModules(pilotModules.map(m => m.data.id))}
                variant="outline"
                disabled={isRunning}
              >
                Selecionar Todos
              </Button>
              <Button
                onClick={() => setSelectedModules([])}
                variant="outline"
                disabled={isRunning}
              >
                Desmarcar Todos
              </Button>
            </div>

            <Button
              onClick={runValidation}
              disabled={isRunning || selectedModules.length === 0}
              className="w-full"
              style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
            >
              {isRunning ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Validando... {currentProgress.total > 0 ? Math.round((currentProgress.current / currentProgress.total) * 100) : 0}%
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Iniciar Validação ({selectedModules.length} {selectedModules.length === 1 ? 'módulo' : 'módulos'})
                </>
              )}
            </Button>

            {isRunning && (
              <Button
                onClick={() => setIsPaused(!isPaused)}
                variant="outline"
                className="w-full"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Retomar
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Progress Card */}
        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" style={{ color: 'var(--primary-teal)' }} />
                Progresso da Validação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{currentProgress.currentLesson || 'Preparando...'}</span>
                  <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                    {currentProgress.total > 0 
                      ? `${Math.round((currentProgress.current / currentProgress.total) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <Progress 
                  value={currentProgress.total > 0 ? (currentProgress.current / currentProgress.total) * 100 : 0} 
                  className="h-2" 
                />
                <p className="text-xs mt-2 text-gray-600">
                  {currentProgress.current} de {currentProgress.total} lições processadas
                </p>
              </div>

              {isPaused && (
                <Alert className="border-2" style={{ borderColor: 'var(--warning)' }}>
                  <Pause className="w-4 h-4" />
                  <AlertDescription>
                    Validação pausada. Clique em "Retomar" para continuar.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Card */}
        {results && (
          <Card className="border-2" style={{ borderColor: 'var(--success)' }}>
            <CardHeader style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--success)' }} />
                Validação Concluída
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-white shadow-sm text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                    {results.total}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Processadas</p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-sm text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>
                    {results.validated}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Validadas</p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-sm text-center">
                  <p className="text-3xl font-bold" style={{ color: 'var(--info)' }}>
                    {results.updated}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Atualizadas</p>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-sm text-center">
                  <p className="text-3xl font-bold" style={{ color: results.failed > 0 ? 'var(--error)' : 'var(--success)' }}>
                    {results.failed}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Falhas</p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Lições com Problemas ({results.errors.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {results.errors.map((error, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="font-semibold text-sm text-red-900">{error.lesson_title}</p>
                        <p className="text-xs text-red-700 mt-1">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setResults(null);
                  setLogs([]);
                  setCurrentProgress({ current: 0, total: 0, currentLesson: null, status: 'idle' });
                }}
                variant="outline"
                className="w-full mt-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nova Validação
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logs Card */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Logs de Validação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-1 font-mono text-xs">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      log.type === 'error' ? 'bg-red-50 text-red-900' :
                      log.type === 'warning' ? 'bg-yellow-50 text-yellow-900' :
                      log.type === 'success' ? 'bg-green-50 text-green-900' :
                      'bg-gray-50 text-gray-900'
                    }`}
                  >
                    [{log.timestamp}] {log.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}