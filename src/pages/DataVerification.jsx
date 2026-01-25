import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Database,
  AlertTriangle,
  BookOpen,
  FileText,
  Wifi
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Usar React Query hooks
import { useModules } from "@/components/hooks/useModules";
import { useLessons } from "@/components/hooks/useLessons";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function DataVerificationPage() {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  // Buscar dados usando React Query
  const { 
    data: modules = [], 
    isLoading: modulesLoading, 
    error: modulesError,
    refetch: refetchModules 
  } = useModules();

  const { 
    data: lessons = [], 
    isLoading: lessonsLoading, 
    error: lessonsError,
    refetch: refetchLessons 
  } = useLessons();

  const {
    data: lessonPlans = [],
    isLoading: plansLoading,
    error: plansError,
    refetch: refetchPlans
  } = useQuery({
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

  const loadData = async () => {
    setRetryCount(prev => prev + 1);
    await Promise.all([
      refetchModules(),
      refetchLessons(),
      refetchPlans()
    ]);
  };

  const isLoading = modulesLoading || lessonsLoading || plansLoading;
  const hasError = modulesError || lessonsError || plansError;

  // Filtrar dados do Curiosity
  const curiosityModules = modules.filter(m => m.course_id === 'curiosity');
  const curiosity1Module = modules.find(m => m.id === "curiosity-1");
  const curiosityLessons = lessons.filter(l => l.course_id === 'curiosity');
  const curiosity1Lessons = lessons.filter(l => l.module_id === 'curiosity-1');
  const curiosityPlans = lessonPlans.filter(p => 
    p.lesson_id && p.lesson_id.startsWith("curiosity")
  );

  // Lições específicas
  const lesson1 = lessons.find(l => l.id === "curiosity-1-lesson-1");
  const lesson2 = lessons.find(l => l.id === "curiosity-1-lesson-2");

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Verificando dados...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Tentativa {retryCount}</p>
          )}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Erro de Conexão</h2>
        <p className="text-gray-600 mb-4">
          {modulesError?.message || lessonsError?.message || plansError?.message || 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button 
            onClick={() => navigate(createPageUrl("NetworkDiagnostic"))}
            variant="outline"
            className="px-4 py-2"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Diagnóstico de Rede
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Verificação de Dados</h1>
          <p className="text-gray-600">
            Status dos dados inseridos no sistema
          </p>
        </div>
        <Button onClick={loadData} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Recarregar
        </Button>
      </div>

      {/* Resumo Geral */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-3">📊 Resumo Geral</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{modules.length}</div>
              <div className="text-sm text-gray-600">Total Módulos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-green-600">{lessons.length}</div>
              <div className="text-sm text-gray-600">Total Lições</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{lessonPlans.length}</div>
              <div className="text-sm text-gray-600">Total Planos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{curiosityModules.length}</div>
              <div className="text-sm text-gray-600">Módulos Curiosity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Módulos Cadastrados ({modules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum módulo encontrado no sistema
            </div>
          ) : (
            <div className="space-y-3">
              {modules.slice(0, 10).map(module => (
                <div key={module.id} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{module.id}</span>
                      <Badge className="bg-green-100 text-green-800">Encontrado</Badge>
                      <Badge variant="outline">{module.course_id}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Título:</strong> {module.title}</p>
                      <p><strong>Ordem:</strong> {module.order} | <strong>Semestre:</strong> {module.semester}</p>
                      <p><strong>Lições:</strong> {module.total_lessons || 16}</p>
                    </div>
                  </div>
                </div>
              ))}
              {modules.length > 10 && (
                <p className="text-center text-sm text-gray-500">
                  ... e mais {modules.length - 10} módulos
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lições do Curiosity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lições do Curiosity ({curiosityLessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {curiosityLessons.length === 0 ? (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <p className="text-gray-600">Nenhuma lição do Curiosity encontrada</p>
              <p className="text-sm text-gray-500 mt-2">
                Execute a inserção de dados para popular o banco
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {curiosityLessons.slice(0, 10).map(lesson => (
                <div key={lesson.id} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold">{lesson.title}</span>
                      <Badge className="bg-green-100 text-green-800">Ordem: {lesson.order}</Badge>
                      <Badge variant="outline">{lesson.module_id}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>ID:</strong> {lesson.id}</p>
                      <p><strong>Duração:</strong> {lesson.duration_minutes} minutos</p>
                      {lesson.content_url && (
                        <p><strong>Conteúdo:</strong> ✓ URL configurada</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {curiosityLessons.length > 10 && (
                <p className="text-center text-sm text-gray-500">
                  ... e mais {curiosityLessons.length - 10} lições
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planos de Aula */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Planos de Aula Curiosity ({curiosityPlans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {curiosityPlans.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <p className="text-gray-600">Nenhum plano de aula encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {curiosityPlans.map(plan => (
                <div key={plan.id} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{plan.title}</span>
                      <Badge className="bg-green-100 text-green-800">Encontrado</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Lesson ID:</strong> {plan.lesson_id}</p>
                      <p><strong>Estrutura:</strong> {plan.lesson_structure?.length || 0} seções</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verificação Específica: Curiosity-1 */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle>🔍 Verificação Específica: Módulo Curiosity-1</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Módulo */}
            <div className="p-4 rounded-lg border-2" style={{
              borderColor: curiosity1Module ? '#10b981' : '#ef4444',
              backgroundColor: curiosity1Module ? '#f0fdf4' : '#fef2f2'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {curiosity1Module ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">Módulo curiosity-1</span>
              </div>
              <p className="text-sm text-gray-600">
                {curiosity1Module ? '✓ Encontrado' : '✗ Não encontrado'}
              </p>
            </div>

            {/* Lições */}
            <div className="p-4 rounded-lg border-2" style={{
              borderColor: curiosity1Lessons.length > 0 ? '#10b981' : '#ef4444',
              backgroundColor: curiosity1Lessons.length > 0 ? '#f0fdf4' : '#fef2f2'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {curiosity1Lessons.length > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">Lições curiosity-1</span>
              </div>
              <p className="text-sm text-gray-600">
                {curiosity1Lessons.length} lições encontradas
              </p>
            </div>

            {/* Lição 1 */}
            <div className="p-4 rounded-lg border-2" style={{
              borderColor: lesson1 ? '#10b981' : '#ef4444',
              backgroundColor: lesson1 ? '#f0fdf4' : '#fef2f2'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {lesson1 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">Lição 1</span>
              </div>
              <p className="text-sm text-gray-600">
                {lesson1 ? lesson1.title : 'Não encontrada'}
              </p>
            </div>

            {/* Lição 2 */}
            <div className="p-4 rounded-lg border-2" style={{
              borderColor: lesson2 ? '#10b981' : '#ef4444',
              backgroundColor: lesson2 ? '#f0fdf4' : '#fef2f2'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {lesson2 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">Lição 2</span>
              </div>
              <p className="text-sm text-gray-600">
                {lesson2 ? lesson2.title : 'Não encontrada'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}