import React, { useState, useEffect } from "react";
import { ContentGap } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Search, 
  HelpCircle, 
  TrendingUp,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ContentGapsDashboard() {
  const [user, setUser] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingSolution, setGeneratingSolution] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    // Apenas para administradores e coordenadores
    if (!['administrador', 'coordenador_pedagogico'].includes(userData.user_type)) {
      setLoading(false);
      return;
    }

    const gapsData = await ContentGap.list('-priority_score');
    setGaps(gapsData);
    setLoading(false);
  };

  const generateSolution = async (gap) => {
    setGeneratingSolution(gap.id);
    
    const prompt = `
Você é um especialista em design instrucional para educação infantil e juvenil.

CONTEXTO:
- Nível: ${gap.explorer_level}
- Disciplina: ${gap.subject}
- Tipo de lacuna: ${gap.gap_type}
- Descrição: ${gap.description}
- Frequência: ${gap.frequency} alunos enfrentaram esta dificuldade

TAREFA:
Sugira uma solução pedagógica específica e acionável para preencher esta lacuna de conteúdo.
A solução deve incluir:
1. Tipo de recurso recomendado (vídeo, atividade interativa, jogo, etc.)
2. Conceitos a serem abordados
3. Abordagem pedagógica sugerida (lúdica, visual, prática, etc.)
4. Duração estimada
5. Pré-requisitos necessários

Seja específico e prático.
`;

    try {
      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            resource_type: { type: "string" },
            concepts: { type: "array", items: { type: "string" } },
            approach: { type: "string" },
            estimated_duration: { type: "string" },
            prerequisites: { type: "array", items: { type: "string" } },
            detailed_plan: { type: "string" }
          }
        }
      });

      await ContentGap.update(gap.id, {
        suggested_solution: JSON.stringify(response),
        status: "in_review"
      });

      await loadData();
    } catch (error) {
      console.error("Error generating solution:", error);
    }

    setGeneratingSolution(null);
  };

  const updateStatus = async (gapId, newStatus) => {
    await ContentGap.update(gapId, { status: newStatus });
    await loadData();
  };

  const getGapIcon = (type) => {
    const icons = {
      search_query: Search,
      stuck_point: AlertTriangle,
      frequent_question: HelpCircle,
      missing_prerequisite: TrendingUp
    };
    return icons[type] || AlertTriangle;
  };

  const getStatusColor = (status) => {
    const colors = {
      detected: { bg: 'var(--error)', text: 'var(--background)' },
      in_review: { bg: 'var(--warning)', text: 'var(--text-primary)' },
      in_production: { bg: 'var(--info)', text: 'var(--background)' },
      resolved: { bg: 'var(--success)', text: 'var(--background)' }
    };
    return colors[status] || colors.detected;
  };

  if (loading) {
    return <div className="p-8">Carregando lacunas de conteúdo...</div>;
  }

  if (!['administrador', 'coordenador_pedagogico'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Esta página é acessível apenas para administradores e coordenadores pedagógicos.
        </p>
      </div>
    );
  }

  const groupedGaps = {
    detected: gaps.filter(g => g.status === 'detected'),
    in_review: gaps.filter(g => g.status === 'in_review'),
    in_production: gaps.filter(g => g.status === 'in_production'),
    resolved: gaps.filter(g => g.status === 'resolved')
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Auto-Expansão Inteligente de Conteúdo
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sistema de detecção automática de lacunas no currículo baseado em comportamento dos alunos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8" style={{ color: 'var(--error)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {groupedGaps.detected.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lacunas Detectadas</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Lightbulb className="w-8 h-8" style={{ color: 'var(--warning)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {groupedGaps.in_review.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Em Revisão</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--info)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {groupedGaps.in_production.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Em Produção</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {groupedGaps.resolved.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Resolvidas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="detected" className="w-full">
          <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: 'var(--background)' }}>
            <TabsTrigger value="detected">
              Detectadas ({groupedGaps.detected.length})
            </TabsTrigger>
            <TabsTrigger value="in_review">
              Em Revisão ({groupedGaps.in_review.length})
            </TabsTrigger>
            <TabsTrigger value="in_production">
              Em Produção ({groupedGaps.in_production.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolvidas ({groupedGaps.resolved.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(groupedGaps).map(([status, statusGaps]) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="space-y-4">
                {statusGaps.map((gap) => {
                  const GapIcon = getGapIcon(gap.gap_type);
                  const statusColor = getStatusColor(gap.status);
                  const solution = gap.suggested_solution ? JSON.parse(gap.suggested_solution) : null;

                  return (
                    <Card key={gap.id} className="card-innova border-none">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <GapIcon className="w-6 h-6 mt-1" style={{ color: 'var(--primary-teal)' }} />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                                {gap.description}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}>
                                  {gap.explorer_level}
                                </Badge>
                                <Badge variant="outline" style={{ borderColor: 'var(--info)', color: 'var(--info)' }}>
                                  {gap.subject}
                                </Badge>
                                <Badge className="border-0" style={{ backgroundColor: 'var(--error)', color: 'var(--background)' }}>
                                  {gap.frequency} alunos afetados
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className="border-0"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                          >
                            {gap.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              Prioridade
                            </span>
                            <span className="text-sm font-bold" style={{ color: 'var(--primary-teal)' }}>
                              {gap.priority_score}/100
                            </span>
                          </div>
                          <Progress value={gap.priority_score} className="h-2" />
                        </div>

                        {solution && (
                          <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--neutral-light)' }}>
                            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                              <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                              Solução Sugerida por IA
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Tipo de Recurso:</p>
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{solution.resource_type}</p>
                              </div>
                              <div>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Duração Estimada:</p>
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{solution.estimated_duration}</p>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Conceitos a Abordar:</p>
                              <div className="flex flex-wrap gap-1">
                                {solution.concepts?.map((concept, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Plano Detalhado:</p>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{solution.detailed_plan}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {gap.status === 'detected' && (
                            <>
                              <Button
                                onClick={() => generateSolution(gap)}
                                disabled={generatingSolution === gap.id}
                                size="sm"
                                className="btn-primary"
                              >
                                <Lightbulb className="w-4 h-4 mr-2" />
                                {generatingSolution === gap.id ? 'Gerando...' : 'Gerar Solução com IA'}
                              </Button>
                              {solution && (
                                <Button
                                  onClick={() => updateStatus(gap.id, 'in_review')}
                                  size="sm"
                                  variant="outline"
                                >
                                  Mover para Revisão
                                </Button>
                              )}
                            </>
                          )}
                          {gap.status === 'in_review' && (
                            <>
                              <Button
                                onClick={() => updateStatus(gap.id, 'in_production')}
                                size="sm"
                                style={{ backgroundColor: 'var(--info)' }}
                              >
                                Iniciar Produção
                              </Button>
                              <Button
                                onClick={() => updateStatus(gap.id, 'detected')}
                                size="sm"
                                variant="outline"
                              >
                                Voltar para Detectadas
                              </Button>
                            </>
                          )}
                          {gap.status === 'in_production' && (
                            <>
                              <Button
                                onClick={() => updateStatus(gap.id, 'resolved')}
                                size="sm"
                                style={{ backgroundColor: 'var(--success)' }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Marcar como Resolvida
                              </Button>
                              <Button
                                onClick={() => updateStatus(gap.id, 'in_review')}
                                size="sm"
                                variant="outline"
                              >
                                Voltar para Revisão
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {statusGaps.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--success)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Nenhuma lacuna nesta categoria
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Card 
          className="card-innova border-none"
          style={{ borderLeft: `4px solid var(--primary-teal)` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 mt-1" style={{ color: 'var(--accent-yellow)' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Como funciona a Auto-Expansão Inteligente?
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Inspirado na plataforma Èsù Èmi, este sistema analisa automaticamente o comportamento dos alunos para identificar lacunas no currículo:
                </p>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• <strong>Search Queries</strong>: Buscas frequentes que não retornam resultados</li>
                  <li>• <strong>Stuck Points</strong>: Aulas onde alunos ficam travados ou abandonam</li>
                  <li>• <strong>Frequent Questions</strong>: Perguntas repetidas em fóruns/comentários</li>
                  <li>• <strong>Missing Prerequisites</strong>: Conceitos que alunos não dominam antes de avançar</li>
                </ul>
                <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                  A IA então sugere soluções pedagógicas específicas para cada lacuna, que podem ser revisadas e implementadas pela equipe pedagógica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}