import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Brain,
  Plus,
  RefreshCw
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";

export default function ContentGapAnalysisPage() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [newGap, setNewGap] = useState({
    gap_type: 'missing_prerequisite',
    description: '',
    explorer_level: user?.explorer_level || 'curiosity',
    subject: ''
  });
  const [showGenerateIdeas, setShowGenerateIdeas] = useState(false);
  const [selectedGap, setSelectedGap] = useState(null);

  // Buscar gaps existentes
  const { data: gaps = [], isLoading, error } = useQuery({
    queryKey: ['contentGaps'],
    queryFn: async () => {
      const data = await base44.entities.ContentGap.list('-priority_score');
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  // Buscar student progress para análise
  const { data: studentProgress = [] } = useQuery({
    queryKey: ['allStudentProgress'],
    queryFn: async () => {
      const data = await base44.entities.StudentProgress.list();
      return data;
    },
    staleTime: 1000 * 60 * 10
  });

  // Mutation para criar gap
  const createGapMutation = useMutation({
    mutationFn: async (gapData) => {
      return await base44.entities.ContentGap.create(gapData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGaps'] });
      setNewGap({
        gap_type: 'missing_prerequisite',
        description: '',
        explorer_level: user?.explorer_level || 'curiosity',
        subject: ''
      });
    }
  });

  // Mutation para gerar ideias com IA
  const generateIdeasMutation = useMutation({
    mutationFn: async (gap) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em educação de IA para crianças/adolescentes.

GAP IDENTIFICADO:
Tipo: ${gap.gap_type}
Descrição: ${gap.description}
Nível: ${gap.explorer_level}
Disciplina: ${gap.subject}

TAREFA: Gere 3 ideias de atividades/recursos para preencher este gap.

Para cada ideia, forneça:
1. Título criativo
2. Descrição (2-3 linhas)
3. Tipo de recurso (vídeo, tutorial, projeto prático, quiz, etc.)
4. Tempo estimado
5. Alinhamento VARK (visual, auditory, read_write, kinesthetic)`,
        response_json_schema: {
          type: "object",
          properties: {
            ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  resource_type: { type: "string" },
                  estimated_time: { type: "string" },
                  vark_alignment: { 
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      return response;
    }
  });

  // Mutation para atualizar gap
  const updateGapMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await base44.entities.ContentGap.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentGaps'] });
    }
  });

  // Análise automática de gaps baseado em performance
  const analyzeGapsFromPerformance = () => {
    const lessonScores = {};
    
    studentProgress.forEach(prog => {
      if (prog.quiz_score != null) {
        if (!lessonScores[prog.lesson_id]) {
          lessonScores[prog.lesson_id] = { total: 0, count: 0, struggles: 0 };
        }
        lessonScores[prog.lesson_id].total += prog.quiz_score;
        lessonScores[prog.lesson_id].count++;
        if (prog.quiz_score < 60) {
          lessonScores[prog.lesson_id].struggles++;
        }
      }
    });

    const potentialGaps = [];
    Object.entries(lessonScores).forEach(([lessonId, scores]) => {
      const avgScore = scores.total / scores.count;
      const struggleRate = (scores.struggles / scores.count) * 100;

      if (avgScore < 60 || struggleRate > 40) {
        potentialGaps.push({
          lesson_id: lessonId,
          avgScore: Math.round(avgScore),
          struggleRate: Math.round(struggleRate),
          studentCount: scores.count
        });
      }
    });

    return potentialGaps.sort((a, b) => b.struggleRate - a.struggleRate);
  };

  const potentialGaps = analyzeGapsFromPerformance();

  const handleCreateGap = async () => {
    if (!newGap.description.trim()) return;
    
    const gapData = {
      ...newGap,
      frequency: 1,
      priority_score: 50,
      status: 'detected'
    };

    await createGapMutation.mutateAsync(gapData);
  };

  const handleGenerateIdeas = async (gap) => {
    setSelectedGap(gap);
    setShowGenerateIdeas(true);
    await generateIdeasMutation.mutateAsync(gap);
  };

  const handleResolveGap = async (gapId) => {
    await updateGapMutation.mutateAsync({
      id: gapId,
      data: { status: 'resolved' }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-teal)' }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            🔍 Análise de Lacunas de Conteúdo
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Identificação automática e manual de gaps pedagógicos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600">{gaps.filter(g => g.status === 'detected').length}</div>
              <div className="text-sm text-gray-600">Gaps Detectados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="w-10 h-10 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">{gaps.filter(g => g.status === 'in_production').length}</div>
              <div className="text-sm text-gray-600">Em Produção</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{gaps.filter(g => g.status === 'resolved').length}</div>
              <div className="text-sm text-gray-600">Resolvidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-10 h-10 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold text-purple-600">{potentialGaps.length}</div>
              <div className="text-sm text-gray-600">Baseado em IA</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="detected" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detected">Detectados</TabsTrigger>
            <TabsTrigger value="ai-analysis">Análise IA</TabsTrigger>
            <TabsTrigger value="create">Criar Gap</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          </TabsList>

          {/* Gaps Detectados */}
          <TabsContent value="detected" className="mt-6 space-y-4">
            {gaps.filter(g => g.status === 'detected' || g.status === 'in_review').map(gap => (
              <Card key={gap.id} className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-orange-100 text-orange-800">
                          {gap.gap_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {gap.explorer_level}
                        </Badge>
                        {gap.priority_score && (
                          <Badge className={gap.priority_score > 70 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            Prioridade: {gap.priority_score}/100
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{gap.description}</h3>
                      {gap.subject && (
                        <p className="text-sm text-gray-600 mb-2">Disciplina: {gap.subject}</p>
                      )}
                      {gap.frequency && (
                        <p className="text-xs text-gray-500">Detectado {gap.frequency}x</p>
                      )}
                      {gap.suggested_solution && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-50">
                          <p className="text-sm font-semibold text-blue-900 mb-1">💡 Sugestão:</p>
                          <p className="text-sm text-blue-800">{gap.suggested_solution}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleGenerateIdeas(gap)}
                        disabled={generateIdeasMutation.isPending}
                        style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Gerar Ideias
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveGap(gap.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Resolver
                      </Button>
                    </div>
                  </div>

                  {showGenerateIdeas && selectedGap?.id === gap.id && generateIdeasMutation.data && (
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Ideias Geradas por IA
                      </h4>
                      {generateIdeasMutation.data.ideas?.map((idea, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-white border-2 border-purple-200">
                          <h5 className="font-semibold mb-2">{idea.title}</h5>
                          <p className="text-sm text-gray-700 mb-3">{idea.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{idea.resource_type}</Badge>
                            <Badge variant="outline">⏱️ {idea.estimated_time}</Badge>
                            {idea.vark_alignment?.map((vark, vidx) => (
                              <Badge key={vidx} className="bg-purple-100 text-purple-800">
                                {vark}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {gaps.filter(g => g.status === 'detected').length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-semibold">Nenhum gap detectado! 🎉</p>
                  <p className="text-sm text-gray-600 mt-2">Todos os gaps foram resolvidos ou estão em produção</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Análise IA */}
          <TabsContent value="ai-analysis" className="mt-6 space-y-4">
            <Card className="border-2 border-purple-500">
              <CardHeader style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Gaps Identificados por Performance de Alunos
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Lições com baixa performance ou alta taxa de dificuldade
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {potentialGaps.length > 0 ? (
                  potentialGaps.slice(0, 10).map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">Lição: {gap.lesson_id}</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Média:</span>
                              <span className={`font-bold ml-2 ${gap.avgScore < 60 ? 'text-red-600' : gap.avgScore < 70 ? 'text-orange-600' : 'text-green-600'}`}>
                                {gap.avgScore}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Taxa de Dificuldade:</span>
                              <span className="font-bold ml-2 text-orange-600">
                                {gap.struggleRate}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Alunos:</span>
                              <span className="font-bold ml-2">
                                {gap.studentCount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setNewGap({
                              ...newGap,
                              gap_type: 'stuck_point',
                              description: `Lição ${gap.lesson_id} - Média ${gap.avgScore}% (${gap.struggleRate}% com dificuldade)`,
                              related_lesson_id: gap.lesson_id
                            });
                          }}
                          style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Criar Gap
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Sem dados suficientes para análise preditiva</p>
                    <p className="text-xs mt-2">Aguardando mais respostas de alunos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Criar Novo Gap */}
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Reportar Nova Lacuna
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Tipo de Gap</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={newGap.gap_type}
                    onChange={(e) => setNewGap({ ...newGap, gap_type: e.target.value })}
                  >
                    <option value="search_query">Busca Sem Resultado</option>
                    <option value="stuck_point">Ponto de Travamento</option>
                    <option value="frequent_question">Pergunta Frequente</option>
                    <option value="missing_prerequisite">Pré-requisito Faltante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Descrição</label>
                  <Textarea
                    placeholder="Descreva o gap identificado..."
                    value={newGap.description}
                    onChange={(e) => setNewGap({ ...newGap, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nível</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={newGap.explorer_level}
                      onChange={(e) => setNewGap({ ...newGap, explorer_level: e.target.value })}
                    >
                      <option value="curiosity">Curiosity</option>
                      <option value="discovery">Discovery</option>
                      <option value="pioneer">Pioneer</option>
                      <option value="challenger">Challenger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Disciplina</label>
                    <Input
                      placeholder="Ex: Python, Machine Learning..."
                      value={newGap.subject}
                      onChange={(e) => setNewGap({ ...newGap, subject: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateGap}
                  disabled={createGapMutation.isPending || !newGap.description.trim()}
                  className="w-full"
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  {createGapMutation.isPending ? 'Criando...' : 'Criar Gap'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gaps Resolvidos */}
          <TabsContent value="resolved" className="mt-6 space-y-4">
            {gaps.filter(g => g.status === 'resolved').map(gap => (
              <Card key={gap.id} className="border-l-4 border-green-500 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{gap.description}</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-800">{gap.explorer_level}</Badge>
                        <Badge variant="outline">{gap.gap_type}</Badge>
                        {gap.subject && <Badge variant="outline">{gap.subject}</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {gaps.filter(g => g.status === 'resolved').length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <p>Nenhum gap resolvido ainda</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}