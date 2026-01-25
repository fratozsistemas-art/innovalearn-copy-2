import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target,
  TrendingUp,
  AlertTriangle,
  Rocket,
  Brain,
  Zap
} from "lucide-react";

export default function RoadmapQ1Page() {
  const [activeTab, setActiveTab] = useState("overview");

  const sprints = [
    {
      id: "sprint1",
      name: "Sprint 1: Fundação Técnica",
      weeks: "Semana 1-2",
      status: "completed",
      progress: 100,
      objective: "Garantir que infraestrutura aguenta escala e não quebra em produção",
      tasks: [
        { id: 1, text: "Resolver Rate Limits (429 errors)", status: "done" },
        { id: 2, text: "Cache ultra-agressivo com React Query", status: "done" },
        { id: 3, text: "Error Boundaries implementados", status: "done" },
        { id: 4, text: "Skeleton screens em todas páginas", status: "done" },
        { id: 5, text: "InnAI Widget funcional", status: "done" },
        { id: 6, text: "Context Builder robusto", status: "done" }
      ],
      success_criteria: [
        "✅ Zero 429 errors em produção",
        "✅ Todas páginas carregam em <2s",
        "✅ Error rate < 0.5%",
        "✅ InnAI responde corretamente"
      ]
    },
    {
      id: "sprint2",
      name: "Sprint 2: Curadoria Automática MVP",
      weeks: "Semana 3-4",
      status: "in_progress",
      progress: 65,
      objective: "Pipeline de descoberta e curadoria de recursos funcionando end-to-end",
      tasks: [
        { id: 1, text: "Finalizar AutoCurationPipeline.js", status: "done" },
        { id: 2, text: "YouTube API integration", status: "in_progress" },
        { id: 3, text: "LLM Quality Scorer", status: "in_progress" },
        { id: 4, text: "Sistema de aprovação semi-automático", status: "pending" },
        { id: 5, text: "Dashboard de curadoria", status: "pending" },
        { id: 6, text: "Teste com dados reais + iteração", status: "pending" }
      ],
      success_criteria: [
        "🟡 Pipeline descobre 100+ recursos em 7 dias",
        "🟡 Score médio de qualidade >= 80/100",
        "⚪ False positive rate < 5%",
        "⚪ Coordenador revisa 50 recursos em <15min"
      ]
    },
    {
      id: "sprint3",
      name: "Sprint 3: Analytics & Early Warning",
      weeks: "Semana 5-6",
      status: "pending",
      progress: 0,
      objective: "Dashboard de analytics para professores + Early Warning acionável",
      tasks: [
        { id: 1, text: "Redesign Analytics.jsx", status: "pending" },
        { id: 2, text: "Email automático Early Warning", status: "pending" },
        { id: 3, text: "Professor Action Center", status: "pending" },
        { id: 4, text: "VARK Analytics Dashboard", status: "pending" },
        { id: 5, text: "Teacher training videos (3 vídeos)", status: "pending" }
      ],
      success_criteria: [
        "⚪ Professor identifica risco em <30s",
        "⚪ 90% dos alerts → ação em <48h",
        "⚪ NPS de professores >= 70"
      ]
    },
    {
      id: "sprint4",
      name: "Sprint 4: RTIE MVP (Adaptive Engine)",
      weeks: "Semana 7-8",
      status: "pending",
      progress: 0,
      objective: "Motor de adaptação real-time funcionando (rule-based v1)",
      tasks: [
        { id: 1, text: "AdaptivePathGenerator.js robusto", status: "pending" },
        { id: 2, text: "Difficulty predictor", status: "pending" },
        { id: 3, text: "Auto-grader for code submissions", status: "pending" },
        { id: 4, text: "Beta test com 50 alunos", status: "pending" }
      ],
      success_criteria: [
        "⚪ Adaptive path válido para 100% students",
        "⚪ Beta: +20% completion rate vs control",
        "⚪ Auto-grader accuracy >= 85%"
      ]
    },
    {
      id: "sprint5",
      name: "Sprint 5: Polish & Launch Prep",
      weeks: "Semana 9-10",
      status: "pending",
      progress: 0,
      objective: "Plataforma pronta para primeiros 500 alunos pagantes",
      tasks: [
        { id: 1, text: "Bug bash completo", status: "pending" },
        { id: 2, text: "UX polish (micro-animations, empty states)", status: "pending" },
        { id: 3, text: "Docs finais (Professor, Aluno, Admin)", status: "pending" },
        { id: 4, text: "Video demo 5min", status: "pending" },
        { id: 5, text: "Landing page atualizada", status: "pending" }
      ],
      success_criteria: [
        "⚪ Zero bugs P0 ou P1",
        "⚪ Docs completos e revisados",
        "⚪ Video demo aprovado"
      ]
    },
    {
      id: "sprint6",
      name: "Sprint 6: Iterate & Scale",
      weeks: "Semana 11-12",
      status: "pending",
      progress: 0,
      objective: "Onboard primeiros clientes B2B, coletar feedback, iterar",
      tasks: [
        { id: 1, text: "Onboard 3 escolas piloto", status: "pending" },
        { id: 2, text: "Daily check-ins com escolas", status: "pending" },
        { id: 3, text: "Implementar top 5 requests", status: "pending" },
        { id: 4, text: "B2B pitch deck", status: "pending" },
        { id: 5, text: "Roadmap Q2 2025", status: "pending" }
      ],
      success_criteria: [
        "⚪ 3 escolas renovam após trial",
        "⚪ NPS >= 70",
        "⚪ Pipeline de 10+ prospects para Q2"
      ]
    }
  ];

  const okrs = [
    {
      objective: "Plataforma Tecnicamente Robusta",
      icon: Zap,
      color: "var(--primary-teal)",
      key_results: [
        { text: "Zero 429 errors por 30 dias consecutivos", progress: 100, target: "0 erros/dia" },
        { text: "99.5% uptime", progress: 98, target: "99.5%" },
        { text: "<2s load time em 95% das páginas", progress: 85, target: "1.8s média" }
      ]
    },
    {
      objective: "Curadoria Automática Eficaz",
      icon: Brain,
      color: "var(--primary-purple)",
      key_results: [
        { text: "500+ recursos descobertos e curados", progress: 20, target: "500 recursos" },
        { text: "Score médio de qualidade >= 80/100", progress: 0, target: "80/100" },
        { text: "80% auto-aprovados (sem review humano)", progress: 0, target: "80%" }
      ]
    },
    {
      objective: "Prevenir Evasão",
      icon: AlertTriangle,
      color: "var(--warning)",
      key_results: [
        { text: "Taxa de evasão < 10%", progress: 0, target: "<10%" },
        { text: "90% alunos em risco recebem intervenção <48h", progress: 0, target: "90%" },
        { text: "70% dos alunos em risco recuperam", progress: 0, target: "70%" }
      ]
    },
    {
      objective: "Crescimento B2B",
      icon: TrendingUp,
      color: "var(--success)",
      key_results: [
        { text: "3 escolas piloto onboarded", progress: 0, target: "3 escolas" },
        { text: "300 alunos ativos na plataforma", progress: 0, target: "300 alunos" },
        { text: "$50k ARR commitments", progress: 0, target: "$50k" }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'var(--success)';
      case 'in_progress':
        return 'var(--primary-teal)';
      default:
        return 'var(--text-tertiary)';
    }
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              🗺️ Roadmap Q1 2025
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Planejamento estratégico usando CAIO TSI Framework
            </p>
          </div>
          <Badge className="text-lg px-4 py-2" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
            Jan - Mar 2025
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
            <TabsTrigger value="okrs">OKRs</TabsTrigger>
            <TabsTrigger value="principles">Princípios CAIO</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="card-innova border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Missão Q1 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Entregar MVP robusto e escalável da primeira plataforma brasileira de ensino de IA adaptativo para crianças e jovens.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success)' }}>6</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sprints</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-teal)' }}>12</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Semanas</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-purple)' }}>300</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Alunos Meta</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Visual */}
            <Card className="card-innova border-none">
              <CardHeader>
                <CardTitle>Timeline Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sprints.map((sprint, idx) => (
                    <div key={sprint.id} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {sprint.weeks}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {sprint.name}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {sprint.progress}%
                          </span>
                        </div>
                        <Progress value={sprint.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Definition of Done */}
            <Card className="card-innova border-none">
              <CardHeader>
                <CardTitle>✅ Definition of Done (MVP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Must-Have (Bloqueia Launch)
                    </h3>
                    <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        272 lições carregam sem erro
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Onboarding VARK funciona
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        InnAI responde perguntas sobre IA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Zero 429 errors em produção
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Curadoria automática descobre 20+ recursos/dia
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-gray-400" />
                        Professor vê dashboard + alunos em risco
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-gray-400" />
                        Early Warning detecta e alerta
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Should-Have (Importante mas não bloqueia)
                    </h3>
                    <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-gray-400" />
                        Auto-grading para quizzes
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-gray-400" />
                        VARK enforcer (70% match)
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-gray-400" />
                        Teacher training courses
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprints Tab */}
          <TabsContent value="sprints" className="space-y-4">
            {sprints.map((sprint) => (
              <Card key={sprint.id} className="card-innova border-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{sprint.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        style={{ 
                          backgroundColor: getStatusColor(sprint.status),
                          color: 'white'
                        }}
                      >
                        {sprint.weeks}
                      </Badge>
                      <span className="text-sm font-semibold" style={{ color: getStatusColor(sprint.status) }}>
                        {sprint.progress}%
                      </span>
                    </div>
                  </div>
                  <Progress value={sprint.progress} className="h-2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      🎯 Objetivo
                    </h4>
                    <p style={{ color: 'var(--text-secondary)' }}>{sprint.objective}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      📋 Tarefas
                    </h4>
                    <ul className="space-y-2">
                      {sprint.tasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-2">
                          {getStatusBadge(task.status)}
                          <span style={{ color: 'var(--text-secondary)' }}>{task.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      ✅ Critérios de Sucesso
                    </h4>
                    <ul className="space-y-1">
                      {sprint.success_criteria.map((criteria, idx) => (
                        <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* OKRs Tab */}
          <TabsContent value="okrs" className="space-y-4">
            {okrs.map((okr, idx) => {
              const Icon = okr.icon;
              return (
                <Card key={idx} className="card-innova border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" style={{ color: okr.color }} />
                      {okr.objective}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {okr.key_results.map((kr, krIdx) => (
                      <div key={krIdx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {kr.text}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold" style={{ color: okr.color }}>
                              {kr.progress}%
                            </span>
                            <Badge variant="outline" style={{ borderColor: okr.color }}>
                              {kr.target}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={kr.progress} className="h-2" style={{ backgroundColor: okr.color + '20' }} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Princípios CAIO Tab */}
          <TabsContent value="principles" className="space-y-4">
            <Card className="card-innova border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Princípios CAIO TSI Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--primary-teal)' }}>
                    1️⃣ First Principles Thinking
                  </h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Decomposição fundamental: A plataforma existe para <strong>conectar alunos brasileiros ao melhor conteúdo de IA disponível globalmente, adaptado ao seu perfil individual</strong>.
                  </p>
                  <div className="pl-4 border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Aplicado:</strong> Cada lição responde "O que?", "Por que?" e "Como?" antes de começar conteúdo técnico.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--primary-purple)' }}>
                    2️⃣ Inversion (Anti-Goals)
                  </h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Ao invés de apenas perguntar "Como ter sucesso?", perguntamos <strong>"O que causaria fracasso catastrófico?"</strong>
                  </p>
                  <div className="pl-4 border-l-4" style={{ borderColor: 'var(--primary-purple)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Cenários de Falha Identificados:</strong>
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Taxa de evasão {'>'} 30% (prevenido por Early Warning System)</li>
                      <li>• Professores não adotam (prevenido por UX simplificado)</li>
                      <li>• Conteúdo de baixa qualidade (prevenido por scoring rigoroso)</li>
                      <li>• Rate limits travam plataforma (JÁ RESOLVIDO)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--success)' }}>
                    3️⃣ Systems Thinking
                  </h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Feedback loops identificados: Engajamento → Gamificação → Motivação → Mais Engajamento (loop positivo).
                  </p>
                  <div className="pl-4 border-l-4" style={{ borderColor: 'var(--success)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Circuit Breakers:</strong> Early Warning + InnAI quebram loops negativos de evasão.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--warning)' }}>
                    4️⃣ Occam's Razor (Simplicidade)
                  </h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Preferência por soluções mais simples que funcionam.
                  </p>
                  <div className="pl-4 border-l-4 space-y-2" style={{ borderColor: 'var(--warning)' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>✅ Decisões Corretas:</p>
                      <ul className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li>• InnAI com 4 personas (não 20)</li>
                        <li>• Dashboard com 4 cards (não 50 métricas)</li>
                        <li>• PDF certificates (não blockchain NFTs)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>❌ Evitados:</p>
                      <ul className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Mobile app nativo (PWA resolve 80%)</li>
                        <li>• Integração complexa Blockchain</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--danger)' }}>
                    5️⃣ Mitigação de Vieses
                  </h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Consciência das armadilhas cognitivas:
                  </p>
                  <div className="pl-4 border-l-4" style={{ borderColor: 'var(--danger)' }}>
                    <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>
                        <strong>Analysis Paralysis:</strong> Regra: Ship MVP em 2 semanas {'>'} Perfeição em 3 meses
                      </li>
                      <li>
                        <strong>Confirmation Bias:</strong> Buscar ativamente evidências CONTRA nossas hipóteses
                      </li>
                      <li>
                        <strong>Empathy Gap:</strong> UX para professor de 55 anos, não dev de 25
                      </li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="card-innova border-none" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Rocket className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Próxima Ação Concreta</h3>
                    <p>
                      <strong>Segunda-feira:</strong> Completar Sprint 2 (Curadoria Automática MVP) → YouTube API integration + LLM Quality Scorer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}