import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { generatePersonalizedPath, createPersonalizedAssignment } from "@/components/ai/PersonalizedLearningEngine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Eye,
  Lightbulb,
  Clock,
  Star,
  ArrowRight,
  RefreshCw,
  Plus,
  ExternalLink
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";
import { motion } from "framer-motion";

export default function AILearningCoachPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { executeWithFeedback } = useNotificationSystem();
  
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [creatingAssignment, setCreatingAssignment] = useState(false);

  useEffect(() => {
    if (user && user.onboarding_completed) {
      loadPersonalizedPath();
    }
  }, [user]);

  const loadPersonalizedPath = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const path = await generatePersonalizedPath(user.email);
      setLearningPath(path);
      console.log('✅ Personalized learning path loaded:', path);
    } catch (error) {
      console.error('❌ Error loading personalized path:', error);
    }
    setLoading(false);
  };

  const handleCreateAssignment = async (assignmentData) => {
    await executeWithFeedback({
      asyncFn: async () => {
        setCreatingAssignment(true);
        await createPersonalizedAssignment(user.email, {
          ...assignmentData,
          course_id: user.explorer_level
        });
        setCreatingAssignment(false);
      },
      loadingMessage: 'Criando tarefa personalizada...',
      successMessage: 'Tarefa criada! Veja em "Minhas Tarefas".',
      errorMessage: 'Erro ao criar tarefa'
    });
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--primary-teal)' }} />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user.onboarding_completed) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Alert className="border-2" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
          <AlertDescription>
            <p className="font-semibold mb-2">Complete o Onboarding</p>
            <p className="text-sm mb-3">
              Para receber recomendações personalizadas, você precisa completar o processo de onboarding.
            </p>
            <Button onClick={() => navigate(createPageUrl("Onboarding"))}>
              Iniciar Onboarding
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: 'var(--primary-teal)' }} />
          <p className="text-lg font-semibold mb-2">🤖 IA analisando seu perfil...</p>
          <p className="text-sm text-gray-600">Isso pode levar alguns segundos</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-600" />
            <h3 className="text-xl font-bold mb-2">Erro ao Carregar Análise</h3>
            <p className="text-gray-600 mb-4">Não foi possível gerar seu caminho personalizado.</p>
            <Button onClick={loadPersonalizedPath}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { studentProfile, currentStatus, recommendations, customAssignments, recommendedResources, nextSteps, motivationalMessage } = learningPath;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
              <Brain className="w-10 h-10" style={{ color: 'var(--primary-teal)' }} />
              Meu Coach de IA
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Caminho de aprendizado personalizado por inteligência artificial
            </p>
          </div>
          <Button onClick={loadPersonalizedPath} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Análise
          </Button>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="border-2" style={{ borderColor: 'var(--primary-teal)', backgroundColor: 'var(--primary-teal-light)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            <AlertDescription>
              <p className="font-semibold text-lg">{motivationalMessage}</p>
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Lições Completadas</p>
                  <p className="text-2xl font-bold">
                    {currentStatus.totalLessonsCompleted}/{currentStatus.totalLessonsAvailable}
                  </p>
                </div>
              </div>
              <Progress 
                value={(currentStatus.totalLessonsCompleted / currentStatus.totalLessonsAvailable) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentStatus.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Pontos Fortes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {currentStatus.strengthTopics.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Para Melhorar</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {currentStatus.weaknessTopics.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="priorities">
              <Target className="w-4 h-4 mr-2" />
              Prioridades
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <Zap className="w-4 h-4 mr-2" />
              Tarefas IA
            </TabsTrigger>
            <TabsTrigger value="resources">
              <BookOpen className="w-4 h-4 mr-2" />
              Recursos
            </TabsTrigger>
            <TabsTrigger value="next-steps">
              <ArrowRight className="w-4 h-4 mr-2" />
              Próximos Passos
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Análise do Seu Perfil de Aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">
                    {recommendations.profile_analysis}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <p className="text-sm text-gray-600 mb-1">Estilo VARK</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                      {studentProfile.vark_primary}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <p className="text-sm text-gray-600 mb-1">Tipo Motivacional</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--accent-orange)' }}>
                      {studentProfile.motivational_type || 'Achiever'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <p className="text-sm text-gray-600 mb-1">Nível Explorer</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                      {studentProfile.explorer_level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VARK Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                  Estratégias por Estilo VARK
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(recommendations.vark_strategies || {}).map(([style, strategies]) => (
                    <div key={style} className="p-4 rounded-lg border-2" style={{
                      borderColor: style === studentProfile.vark_primary ? 'var(--primary-teal)' : 'var(--neutral-medium)',
                      backgroundColor: style === studentProfile.vark_primary ? 'var(--primary-teal-light)' : 'white'
                    }}>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        {style === studentProfile.vark_primary && <Star className="w-4 h-4" style={{ color: 'var(--primary-teal)' }} />}
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                        {style === studentProfile.vark_primary && <Badge className="ml-2">Seu Estilo</Badge>}
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {strategies.map((strategy, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Priorities Tab */}
          <TabsContent value="priorities" className="mt-6 space-y-4">
            {recommendations.top_priorities?.map((priority, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-l-4" style={{
                  borderLeftColor: priority.impact === 'high' ? 'var(--error)' :
                    priority.impact === 'medium' ? 'var(--warning)' : 'var(--info)'
                }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style={{
                        backgroundColor: priority.impact === 'high' ? 'var(--error)' :
                          priority.impact === 'medium' ? 'var(--warning)' : 'var(--info)'
                      }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{priority.priority}</h3>
                        <p className="text-gray-700 mb-3">{priority.reason}</p>
                        <Badge style={{
                          backgroundColor: priority.impact === 'high' ? 'var(--error)' :
                            priority.impact === 'medium' ? 'var(--warning)' : 'var(--info)',
                          color: 'white'
                        }}>
                          Impacto: {priority.impact === 'high' ? 'Alto' : priority.impact === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Custom Assignments Tab */}
          <TabsContent value="assignments" className="mt-6 space-y-4">
            <Alert>
              <Sparkles className="w-5 h-5" />
              <AlertDescription>
                Estas tarefas foram geradas especialmente para você pela IA, baseadas em suas necessidades de aprendizado.
              </AlertDescription>
            </Alert>

            {customAssignments && customAssignments.length > 0 ? (
              customAssignments.map((assignment, idx) => (
                <Card key={idx} className="border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{assignment.title}</CardTitle>
                        <p className="text-sm text-gray-600">{assignment.description}</p>
                      </div>
                      <Badge className="bg-purple-500 text-white">
                        {assignment.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{assignment.estimated_time_minutes} min</span>
                      </div>
                      <Badge variant="outline">{assignment.type}</Badge>
                      <Badge variant="outline">VARK: {assignment.vark_alignment}</Badge>
                    </div>

                    {assignment.instructions && (
                      <div>
                        <h4 className="font-semibold mb-2">📋 Instruções:</h4>
                        <ol className="space-y-1 text-sm ml-5 list-decimal">
                          {assignment.instructions.map((instruction, i) => (
                            <li key={i}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {assignment.evaluation_criteria && (
                      <div>
                        <h4 className="font-semibold mb-2">✅ Critérios de Avaliação:</h4>
                        <ul className="space-y-1 text-sm">
                          {assignment.evaluation_criteria.map((criteria, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                              <span>{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => handleCreateAssignment(assignment)}
                      disabled={creatingAssignment}
                      style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {creatingAssignment ? 'Criando...' : 'Adicionar às Minhas Tarefas'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Zap className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma tarefa personalizada disponível no momento.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6 space-y-4">
            <Alert>
              <BookOpen className="w-5 h-5" />
              <AlertDescription>
                Recursos selecionados especialmente para seu estilo de aprendizado <strong>{studentProfile.vark_primary}</strong>.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              {recommendedResources && recommendedResources.length > 0 ? (
                recommendedResources.map((resource, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg flex-1">{resource.title}</h3>
                        <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                          {resource.quality_score}/100
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline">{resource.type}</Badge>
                          <Badge variant="outline">VARK: {resource.vark_style}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Abrir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Nenhum recurso recomendado disponível no momento.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Next Steps Tab */}
          <TabsContent value="next-steps" className="mt-6 space-y-4">
            {nextSteps && nextSteps.length > 0 ? (
              nextSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-l-4" style={{ borderLeftColor: 'var(--primary-teal)' }}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-teal)' }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{step.step}</h3>
                          <p className="text-gray-700 mb-3">{step.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Tempo estimado: {step.estimated_time}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <ArrowRight className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Nenhum próximo passo definido.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}