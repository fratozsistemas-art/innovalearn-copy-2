import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { useAdaptivePath } from "@/components/hooks/useAdaptivePath";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  CheckCircle2,
  Star,
  ArrowRight,
  Brain,
  Eye,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdaptiveLearningPathPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: adaptivePath, isLoading: pathLoading } = useAdaptivePath(
    user?.email,
    selectedModuleId
  );

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [enrollmentsData, modulesData] = await Promise.all([
        base44.entities.Enrollment.filter({ student_email: user.email }),
        base44.entities.Module.list()
      ]);

      setEnrollments(enrollmentsData);
      setModules(modulesData);

      // Selecionar primeiro módulo automaticamente
      if (enrollmentsData.length > 0 && !selectedModuleId) {
        setSelectedModuleId(enrollmentsData[0].module_id);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons();
    }
  }, [selectedModuleId]);

  const loadLessons = async () => {
    try {
      const lessonsData = await base44.entities.Lesson.filter({ module_id: selectedModuleId });
      setLessons(lessonsData.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const getLesson = (lessonId) => lessons.find(l => l.id === lessonId);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Star className="w-5 h-5 text-yellow-500" />;
      case 1: return <Zap className="w-5 h-5 text-orange-500" />;
      case 2: return <Target className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  if (loading || !user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando seu caminho...</p>
        </div>
      </div>
    );
  }

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              🎯 Seu Caminho Personalizado
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sequência adaptada ao seu ritmo e estilo de aprendizado
            </p>
          </div>
        </div>

        {/* Seletor de Módulo */}
        {enrollments.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {enrollments.map((enrollment) => {
              const module = modules.find(m => m.id === enrollment.module_id);
              if (!module) return null;

              return (
                <Card
                  key={enrollment.id}
                  className={`cursor-pointer transition-all ${
                    selectedModuleId === module.id
                      ? 'ring-2 ring-teal-500'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedModuleId(module.id)}
                >
                  <CardContent className="p-4 min-w-[200px]">
                    <h3 className="font-semibold mb-2">{module.title}</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={enrollment.progress || 0} className="h-2 flex-1" />
                      <span className="text-sm font-semibold">{enrollment.progress || 0}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Informações do Caminho */}
        {adaptivePath && selectedModule && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Velocidade</p>
                    <p className="text-2xl font-bold">
                      {adaptivePath.learning_velocity?.toFixed(1) || '0'} aulas/sem
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nível</p>
                    <p className="text-xl font-bold">
                      {adaptivePath.current_difficulty_level === 'above_grade' && '⭐ Avançado'}
                      {adaptivePath.current_difficulty_level === 'at_grade' && '✅ No Ritmo'}
                      {adaptivePath.current_difficulty_level === 'below_grade' && '📚 Reforço'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Faltam</p>
                    <p className="text-2xl font-bold">
                      {adaptivePath.mandatory_lessons_remaining?.length || 0} aulas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recomendações */}
        {pathLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                style={{ borderColor: 'var(--primary-teal)' }}
              />
              <p>Calculando melhor caminho...</p>
            </CardContent>
          </Card>
        ) : adaptivePath?.recommended_next && adaptivePath.recommended_next.length > 0 ? (
          <Card className="border-2 border-teal-200">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-teal-600" />
                Próximas Aulas Recomendadas
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Sequência otimizada baseada no seu desempenho e estilo de aprendizado
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {adaptivePath.recommended_next.map((recommendation, index) => {
                  const lesson = getLesson(recommendation.lesson_id);
                  if (!lesson) return null;

                  return (
                    <Card
                      key={recommendation.lesson_id}
                      className="border-2 hover:shadow-lg transition-all cursor-pointer"
                      style={{
                        borderColor: index === 0 ? 'var(--accent-yellow)' : 'var(--neutral-medium)'
                      }}
                      onClick={() => navigate(createPageUrl("LessonView") + `?id=${lesson.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                              {lesson.order}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getRankIcon(index)}
                                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                                {index === 0 && (
                                  <Badge className="bg-yellow-500 text-white">
                                    MELHOR FIT
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {lesson.description}
                              </p>
                              
                              {/* Reasoning */}
                              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-3">
                                <Eye className="w-4 h-4 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-900">
                                  <strong>Por que esta lição:</strong> {recommendation.reasoning}
                                </p>
                              </div>

                              {/* Badges */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  Score: {recommendation.priority_score}
                                </Badge>
                                {recommendation.vark_match && (
                                  <Badge className="bg-green-100 text-green-800">
                                    ✓ Match VARK
                                  </Badge>
                                )}
                                {recommendation.addresses_gap && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    ✓ Preenche Gap
                                  </Badge>
                                )}
                                {recommendation.difficulty_adjustment === 'easier' && (
                                  <Badge className="bg-green-100 text-green-800">
                                    ⬇️ Mais Fácil
                                  </Badge>
                                )}
                                {recommendation.difficulty_adjustment === 'harder' && (
                                  <Badge className="bg-orange-100 text-orange-800">
                                    ⬆️ Mais Desafiador
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          style={{
                            backgroundColor: index === 0 ? 'var(--primary-teal)' : 'var(--primary-navy)',
                            color: 'white'
                          }}
                          onClick={() => navigate(createPageUrl("LessonView") + `?id=${lesson.id}`)}
                        >
                          {index === 0 ? 'Começar Agora' : 'Ver Lição'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Módulo Completo!</h3>
              <p className="text-gray-600">
                Parabéns! Você completou todas as lições obrigatórias deste módulo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        {adaptivePath?.path_history && adaptivePath.path_history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Seu Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adaptivePath.path_history.slice(-5).reverse().map((item, index) => {
                  const lesson = getLesson(item.lesson_id);
                  if (!lesson) return null;

                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold">{lesson.title}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(item.completed_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.score !== null && (
                          <Badge className={
                            item.score >= 80 ? 'bg-green-100 text-green-800' :
                            item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.score}%
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {item.time_spent_minutes}min
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}