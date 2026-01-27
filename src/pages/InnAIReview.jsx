import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Star,
  TrendingUp,
  Code,
  Users,
  Shield,
  Zap,
  Target,
  Sparkles,
  MessageCircle,
  Database,
  Settings,
  Eye,
  Heart,
  Lightbulb,
  BookOpen,
  Award,
  BarChart3,
  Layers
} from "lucide-react";

export default function InnAIReviewPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Review Scores (0-100)
  const scores = {
    functionality: 85,
    codeQuality: 82,
    ux: 88,
    ethics: 90,
    performance: 75,
    scalability: 78,
    accessibility: 65,
    overall: 80
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-heading font-bold">Análise Completa: InnAI</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Avaliação Técnica e Estratégica do Assistente de IA
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-2" style={{ borderColor: 'var(--primary-teal)' }}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Avaliação Geral</p>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                    {scores.overall}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-6 h-6 ${i < Math.floor(scores.overall/20) ? 'fill-current' : ''}`}
                          style={{ color: 'var(--accent-yellow)' }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary-teal)' }}>
                      Muito Bom - Pronto para Produção
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--success-light)' }}>
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-1" style={{ color: 'var(--success)' }} />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-600">Pontos Fortes</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--warning-light)' }}>
                  <AlertTriangle className="w-8 h-8 mx-auto mb-1" style={{ color: 'var(--warning)' }} />
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-gray-600">Melhorias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-4 gap-4">
          <ScoreCard 
            title="Funcionalidade"
            score={scores.functionality}
            icon={Zap}
            color="var(--primary-teal)"
          />
          <ScoreCard 
            title="Qualidade Código"
            score={scores.codeQuality}
            icon={Code}
            color="var(--accent-orange)"
          />
          <ScoreCard 
            title="UX"
            score={scores.ux}
            icon={Heart}
            color="var(--success)"
          />
          <ScoreCard 
            title="Ética"
            score={scores.ethics}
            icon={Shield}
            color="var(--info)"
          />
        </div>

        {/* Main Analysis Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="functionality">
              <Zap className="w-4 h-4 mr-2" />
              Funcionalidade
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Layers className="w-4 h-4 mr-2" />
              Arquitetura
            </TabsTrigger>
            <TabsTrigger value="ux">
              <Heart className="w-4 h-4 mr-2" />
              UX
            </TabsTrigger>
            <TabsTrigger value="ethics">
              <Shield className="w-4 h-4 mr-2" />
              Ética
            </TabsTrigger>
            <TabsTrigger value="performance">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Target className="w-4 h-4 mr-2" />
              Recomendações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardHeader style={{ backgroundColor: 'var(--primary-teal)' }}>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-3">🎯 O Que é InnAI?</h3>
                  <p className="text-lg leading-relaxed mb-4">
                    <strong>InnAI</strong> é um assistente de inteligência artificial contextualizado e pedagógico, 
                    projetado para apoiar estudantes de 6-16 anos na plataforma InnovaLearn. Diferente de chatbots 
                    genéricos, InnAI adapta sua personalidade, linguagem e estratégias de ensino ao nível do aluno 
                    (Curiosity, Discovery, Pioneer, Challenger), aplicando princípios da metodologia CAIO-TSI.
                  </p>

                  <h3 className="text-xl font-bold mb-3">✨ Principais Capacidades</h3>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-600" />
                      <span><strong>Personalização Multi-Nível:</strong> 4 personas distintas adaptadas por idade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-600" />
                      <span><strong>Contextualização Profunda:</strong> Analisa progresso, notas, estilo VARK, risco de evasão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-600" />
                      <span><strong>Intervenções Proativas:</strong> Detecta 7 gatilhos críticos e age preventivamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-600" />
                      <span><strong>Gamificação Integrada:</strong> Recompensa interações produtivas com Innova Coins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-600" />
                      <span><strong>Logs Completos:</strong> Rastreabilidade total para análise pedagógica</span>
                    </li>
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      Filosofia CAIO-TSI Aplicada
                    </h4>
                    <p>
                      InnAI não apenas responde perguntas - ele transforma <strong>obstáculos em oportunidades</strong>, 
                      promove <strong>gramática da possibilidade</strong> e celebra erros como dados valiosos (RTAC). 
                      Cada resposta reforça mentalidade de crescimento adaptada ao estágio de desenvolvimento do aluno.
                    </p>
                  </div>

                  <h3 className="text-xl font-bold mb-3">📊 Status Atual</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                      <p className="text-sm text-gray-600 mb-1">Maturidade</p>
                      <p className="text-2xl font-bold text-green-700">Production-Ready</p>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                      <p className="text-sm text-gray-600 mb-1">Cobertura</p>
                      <p className="text-2xl font-bold text-blue-700">4 Níveis</p>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <p className="text-sm text-gray-600 mb-1">Integração</p>
                      <p className="text-2xl font-bold text-purple-700">8 Entidades</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Wins & Critical Issues */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Award className="w-5 h-5" />
                    Principais Forças
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>Personalização excepcional por idade e perfil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>Sistema proativo de intervenção pedagógica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>Integração profunda com dados do aluno</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>UX intuitiva e não-intrusiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>Logs completos para análise pedagógica</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-5 h-5" />
                    Áreas Críticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                      <span><strong>Performance:</strong> Carregamento de contexto pode ser lento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                      <span><strong>Acessibilidade:</strong> Falta suporte para screen readers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                      <span><strong>Escalabilidade:</strong> Contexto não é cacheado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
                      <span><strong>Resiliência:</strong> Falta fallback robusto em caso de erro LLM</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Functionality Tab */}
          <TabsContent value="functionality" className="mt-6 space-y-6">
            <FunctionalityAnalysis />
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="mt-6 space-y-6">
            <ArchitectureAnalysis />
          </TabsContent>

          {/* UX Tab */}
          <TabsContent value="ux" className="mt-6 space-y-6">
            <UXAnalysis />
          </TabsContent>

          {/* Ethics Tab */}
          <TabsContent value="ethics" className="mt-6 space-y-6">
            <EthicsAnalysis />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6 space-y-6">
            <PerformanceAnalysis />
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6 space-y-6">
            <RecommendationsSection />
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}

// ===========================
// SUB-COMPONENTS
// ===========================

function ScoreCard({ title, score, icon: Icon, color }) {
  const getLabel = (score) => {
    if (score >= 90) return { text: "Excelente", color: 'var(--success)' };
    if (score >= 80) return { text: "Muito Bom", color: 'var(--info)' };
    if (score >= 70) return { text: "Bom", color: 'var(--accent-yellow)' };
    if (score >= 60) return { text: "Aceitável", color: 'var(--warning)' };
    return { text: "Crítico", color: 'var(--error)' };
  };

  const label = getLabel(score);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color, opacity: 0.9 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{score}/100</p>
          </div>
        </div>
        <Progress value={score} className="h-2 mb-2" />
        <p className="text-xs font-semibold" style={{ color: label.color }}>
          {label.text}
        </p>
      </CardContent>
    </Card>
  );
}

function FunctionalityAnalysis() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader style={{ backgroundColor: 'var(--primary-teal)' }}>
          <CardTitle className="text-white">⚡ Análise Funcional</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Core Features */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Funcionalidades Principais
            </h3>
            
            <div className="space-y-4">
              <FeatureItem
                name="Chat Reativo"
                status="excellent"
                description="Interface de chat fluida com suporte a markdown, animações e feedback visual"
                details={[
                  "✅ Mensagens do usuário e assistente claramente diferenciadas",
                  "✅ Auto-scroll para última mensagem",
                  "✅ Loading states com animações customizadas",
                  "✅ Feedback de erro amigável"
                ]}
              />

              <FeatureItem
                name="4 Personas Personalizadas"
                status="excellent"
                description="InnAI adapta tom, linguagem e pedagogia ao nível do estudante"
                details={[
                  "✅ Curiosity (6-8 anos): Linguagem lúdica e encorajadora",
                  "✅ Discovery (9-11 anos): Exploração científica",
                  "✅ Pioneer (12-13 anos): Pensamento sistêmico",
                  "✅ Challenger (14-16 anos): Visão de líder global"
                ]}
              />

              <FeatureItem
                name="Contextualização Profunda"
                status="good"
                description="InnAI acessa 8 entidades para construir contexto do aluno"
                details={[
                  "✅ StudentProgress, Enrollment, Assignment",
                  "✅ GamificationProfile, AIEthicsCourse",
                  "✅ DifficultyPrediction, LearningPattern",
                  "⚠️ Carregamento pode ser lento (múltiplas queries)"
                ]}
              />

              <FeatureItem
                name="Sistema Proativo (7 Triggers)"
                status="excellent"
                description="InnAI detecta situações críticas e age preventivamente"
                details={[
                  "✅ Inatividade (>7 dias): Mensagem de reengajamento",
                  "✅ Performance baixa (<60%): Oferta de suporte",
                  "✅ Sobrecarga de tarefas (>5): Ajuda na priorização",
                  "✅ Risco de evasão (score >70): Intervenção urgente",
                  "✅ AI Ethics não completado: Lembretes",
                  "✅ Streak quebrado: Motivação",
                  "✅ Conquista próxima: Celebração"
                ]}
              />

              <FeatureItem
                name="Ações Sugeridas Inteligentes"
                status="good"
                description="InnAI detecta intenções na conversa e sugere ações"
                details={[
                  "✅ Detecta menções a 'próxima lição' → botão Ver Próxima Lição",
                  "✅ Detecta 'revisar' → botão Revisar Conceitos",
                  "✅ Detecta 'praticar' → botão Fazer Exercícios",
                  "⚠️ Detecção é regex-based (não semântica)"
                ]}
              />

              <FeatureItem
                name="Gamificação Integrada"
                status="excellent"
                description="Recompensa interações produtivas automaticamente"
                details={[
                  "✅ InnAI pode mencionar Innova Coins na resposta",
                  "✅ Sistema detecta menção e atualiza gamificação",
                  "✅ Histórico de moedas registrado",
                  "✅ Invalidação automática de cache do perfil"
                ]}
              />

              <FeatureItem
                name="Feedback Loop"
                status="good"
                description="Usuário pode avaliar utilidade das respostas"
                details={[
                  "✅ Botões 'Útil' e 'Não Útil' em cada resposta",
                  "✅ Feedback registrado no InnAIInteractionLog",
                  "⚠️ Feedback não afeta comportamento futuro (ainda)"
                ]}
              />
            </div>
          </div>

          {/* Missing Features */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Funcionalidades Ausentes (Sugeridas)
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">❌</span>
                <span><strong>Histórico de Conversas:</strong> Não há persistência entre sessões</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">❌</span>
                <span><strong>Sugestões Rápidas:</strong> Sem quick replies predefinidos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">❌</span>
                <span><strong>Modo Voice:</strong> Sem entrada por voz (importante para Curiosity)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">❌</span>
                <span><strong>Anexos:</strong> Não aceita upload de imagens/arquivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">❌</span>
                <span><strong>Multi-idioma:</strong> Apenas português</span>
              </li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

function ArchitectureAnalysis() {
  return (
    <Card>
      <CardHeader style={{ backgroundColor: 'var(--accent-orange)' }}>
        <CardTitle className="text-white flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Análise de Arquitetura
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div>
          <h3 className="text-xl font-bold mb-3">📐 Estrutura de Componentes</h3>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="text-xs font-mono whitespace-pre-wrap">
{`InnAIChatWidget.jsx (390 linhas)
├─ useInnAI hook → Lógica de negócio
│  ├─ buildStudentContext → Contexto do aluno
│  ├─ detectProactiveTriggers → Gatilhos proativos
│  ├─ PERSONAS → Definições de personalidade
│  └─ InnAIInteractionLog → Persistência
│
├─ Renderização condicional
│  ├─ Botão flutuante (collapsed)
│  ├─ Notificação proativa (tooltip)
│  └─ Janela de chat (expanded)
│
└─ Integração com base44.integrations.Core.InvokeLLM`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">✅ Pontos Fortes</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
              <span><strong>Separação de Concerns:</strong> Hook (lógica) + Component (UI)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
              <span><strong>Reusabilidade:</strong> contextBuilder e personas são módulos independentes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
              <span><strong>Type Safety:</strong> Uso consistente de JSDoc (implícito)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
              <span><strong>Error Handling:</strong> Try-catch em pontos críticos</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 text-orange-600">⚠️ Pontos de Melhoria</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
              <span><strong>Componente Monolítico:</strong> InnAIChatWidget tem 390 linhas (ideal: {"<"}200)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
              <span><strong>buildStudentContext:</strong> 189 linhas, deveria ser quebrado em funções menores</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
              <span><strong>Sem TypeScript:</strong> Dificulta refactoring e autocomplete</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-600" />
              <span><strong>Sem Cache:</strong> Contexto é reconstruído a cada mount</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">🔄 Fluxo de Dados</h3>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>User carrega página → Layout renderiza InnAIChatWidget</li>
              <li>useInnAI detecta user.email → chama buildStudentContext</li>
              <li>buildStudentContext faz 7 queries paralelas (Promise.all)</li>
              <li>detectProactiveTriggers analisa contexto → retorna triggers</li>
              <li>Se trigger urgente → auto-abre chat após 5s</li>
              <li>User envia mensagem → sendMessage chama InvokeLLM</li>
              <li>Resposta processada → salva em InnAIInteractionLog</li>
              <li>Se recompensa → atualiza GamificationProfile</li>
            </ol>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function UXAnalysis() {
  return (
    <Card>
      <CardHeader style={{ backgroundColor: 'var(--success)' }}>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Análise de Experiência do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div>
          <h3 className="text-xl font-bold mb-3">✅ Pontos Fortes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                Animações Polidas
              </h4>
              <p className="text-sm text-gray-700">
                Framer Motion usado para transições suaves (fade in/out, scale, slide). Botão flutuante tem pulse animation quando há triggers.
              </p>
            </div>

            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                Feedback Visual Claro
              </h4>
              <p className="text-sm text-gray-700">
                Loading states com 3 bolinhas animadas. Erros mostrados em card vermelho. Recompensas com ícone de moeda amarela.
              </p>
            </div>

            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600" />
                Não-Intrusivo
              </h4>
              <p className="text-sm text-gray-700">
                Widget fica collapsed por padrão. Apenas aparece quando há trigger urgente. Usuário tem controle total (minimizar, fechar).
              </p>
            </div>

            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                Cores Personalizadas
              </h4>
              <p className="text-sm text-gray-700">
                Cada nível tem sua cor (Curiosity=azul, Discovery=verde, Pioneer=laranja, Challenger=vermelho). Reforça identidade.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3 text-orange-600">⚠️ Problemas Identificados</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-semibold mb-2">🚨 CRÍTICO: Acessibilidade Deficiente</h4>
              <ul className="space-y-1 text-sm">
                <li>❌ Botão flutuante sem aria-label</li>
                <li>❌ Mensagens sem roles ARIA adequados</li>
                <li>❌ Sem suporte para navegação por teclado (Tab, Enter, Esc)</li>
                <li>❌ Loading state não anuncia para screen readers</li>
                <li>❌ Falta live region para novas mensagens</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold mb-2">⚠️ Mobile: Pode Melhorar</h4>
              <ul className="space-y-1 text-sm">
                <li>⚠️ Chat ocupa 100% da altura em mobile (bloqueia página)</li>
                <li>⚠️ Input pode ser coberto por teclado virtual</li>
                <li>⚠️ Sem gesture para fechar (apenas botão X)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold mb-2">💡 UX: Pequenos Ajustes</h4>
              <ul className="space-y-1 text-sm">
                <li>💡 Sem indicador visual de "InnAI está digitando"</li>
                <li>💡 Botões de ação sugerida poderiam ser mais destacados</li>
                <li>💡 Sem preview do contexto antes de enviar</li>
                <li>💡 Histórico não persiste (reseta ao fechar)</li>
              </ul>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function EthicsAnalysis() {
  return (
    <Card>
      <CardHeader style={{ backgroundColor: 'var(--info)' }}>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Análise Ética e de Conformidade
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h3 className="text-xl font-bold mb-3 text-green-700">✅ Excelente Conformidade Ética</h3>
          <p className="text-gray-700 mb-4">
            InnAI demonstra <strong>consciência ética excepcional</strong> na aplicação de IA educacional:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Proteção de Menores
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Linguagem Apropriada:</strong> 4 personas adaptadas por idade</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Conteúdo Seguro:</strong> InnAI focado apenas em IA educacional</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Rastreabilidade:</strong> Todos os logs salvos para auditoria parental</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Transparência
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Identidade Clara:</strong> Widget mostra "InnAI" explicitamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Limitações Claras:</strong> Erros exibidos honestamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Feedback Loop:</strong> Usuário pode avaliar respostas</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Privacidade (LGPD)
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Dados Contextualizados:</strong> Apenas informações pedagógicas relevantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Logs Estruturados:</strong> InnAIInteractionLog com data/hora</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Controle do Usuário:</strong> Pode fechar/minimizar a qualquer momento</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Pedagogia Responsável
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>CAIO-TSI:</strong> Reforça mentalidade de crescimento</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Não Substitui Professor:</strong> É ferramenta complementar</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span><strong>Gamificação Ética:</strong> Recompensas por esforço, não só resultado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Considerações Adicionais
          </h4>
          <ul className="space-y-1 text-sm">
            <li>⚠️ <strong>Viés do LLM:</strong> Depende de modelo externo (OpenAI/Anthropic) - risco de vieses</li>
            <li>⚠️ <strong>Hallucinations:</strong> LLM pode gerar informações incorretas - falta validação de fatos</li>
            <li>💡 <strong>Sugestão:</strong> Adicionar disclaimer sobre natureza experimental da IA</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}

function PerformanceAnalysis() {
  return (
    <Card>
      <CardHeader style={{ backgroundColor: 'var(--warning)' }}>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Análise de Performance e Escalabilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div>
          <h3 className="text-xl font-bold mb-3 text-orange-600">⚠️ Gargalos Identificados</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold mb-2 text-red-700">🔴 CRÍTICO: buildStudentContext</h4>
              <p className="text-sm mb-2">
                <strong>Problema:</strong> Faz 7 queries paralelas toda vez que o widget monta.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• StudentProgress, Enrollment, Assignment</li>
                <li>• GamificationProfile, AIEthicsCourse</li>
                <li>• DifficultyPrediction, LearningPattern</li>
              </ul>
              <p className="text-sm mt-2 font-semibold text-red-700">
                ⏱️ Latência estimada: 2-5 segundos (depende de DB)
              </p>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs font-semibold mb-1">Solução Recomendada:</p>
                <p className="text-xs">
                  Implementar cache com React Query (staleTime: 5min, cacheTime: 30min)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-semibold mb-2 text-orange-700">🟠 MÉDIO: Chamada LLM Síncrona</h4>
              <p className="text-sm mb-2">
                <strong>Problema:</strong> sendMessage bloqueia UI enquanto aguarda resposta do LLM.
              </p>
              <p className="text-sm mt-2 font-semibold text-orange-700">
                ⏱️ Latência: 3-10 segundos por mensagem
              </p>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs font-semibold mb-1">Solução Recomendada:</p>
                <p className="text-xs">
                  Implementar streaming SSE para resposta gradual (como ChatGPT)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold mb-2 text-yellow-700">🟡 BAIXO: Re-renders Desnecessários</h4>
              <p className="text-sm mb-2">
                <strong>Problema:</strong> buildContextPrompt é recalculado a cada renderização.
              </p>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-xs font-semibold mb-1">Solução Recomendada:</p>
                <p className="text-xs">
                  Memoizar com useMemo baseado em dependencies
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">📊 Benchmarks Estimados</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-600 mb-1">Tempo de Mount</p>
              <p className="text-2xl font-bold text-orange-600">3-6s</p>
              <p className="text-xs text-gray-600">buildStudentContext</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-600 mb-1">Tempo por Mensagem</p>
              <p className="text-2xl font-bold text-orange-600">4-12s</p>
              <p className="text-xs text-gray-600">LLM + logging</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-600 mb-1">Bundle Size</p>
              <p className="text-2xl font-bold text-green-600">~15KB</p>
              <p className="text-xs text-gray-600">Gzipped</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">🚀 Escalabilidade</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-semibold">Concurrent Users</p>
                <p className="text-sm text-gray-700">
                  Com 1000 alunos simultâneos, seriam <strong>7000 queries/min</strong> para contexto. 
                  Banco pode não aguentar sem cache.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-semibold">LLM Rate Limits</p>
                <p className="text-sm text-gray-700">
                  APIs de LLM têm rate limits (ex: OpenAI = 10k requests/min). Pode precisar de queue system.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Stateless Design</p>
                <p className="text-sm text-gray-700">
                  InnAI é stateless (não mantém sessão no backend). Fácil de escalar horizontalmente.
                </p>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function RecommendationsSection() {
  return (
    <div className="space-y-6">
      
      {/* Priority 1: Critical */}
      <Card className="border-2 border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-700 flex items-center gap-2">
            🔥 Prioridade 1: CRÍTICO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          
          <RecommendationItem
            priority="critical"
            title="Implementar Cache de Contexto"
            impact="🚀 Reduz latência de 5s para <500ms"
            effort="Médio (4-6h)"
            description="Usar React Query para cachear buildStudentContext com staleTime de 5min"
            implementation={`const { data: context } = useQuery({
  queryKey: ['studentContext', user.email],
  queryFn: () => buildStudentContext(user.email),
  staleTime: 5 * 60 * 1000, // 5 minutos
  enabled: !!user?.email
});`}
          />

          <RecommendationItem
            priority="critical"
            title="Adicionar Suporte a Acessibilidade"
            impact="♿ Torna InnAI utilizável para TODOS os alunos"
            effort="Alto (8-12h)"
            description="Implementar ARIA labels, keyboard navigation, screen reader support"
            implementation={`- aria-label no botão flutuante
- role="log" aria-live="polite" para mensagens
- Suporte para Tab, Enter, Esc
- Focus management ao abrir/fechar`}
          />

          <RecommendationItem
            priority="critical"
            title="Fallback Robusto para Erros LLM"
            impact="🛡️ Evita experiência quebrada"
            effort="Baixo (2-3h)"
            description="Criar respostas de fallback pré-definidas por cenário"
            implementation={`const FALLBACK_RESPONSES = {
  error: "Desculpe, tive um problema...",
  timeout: "Hmm, estou demorando muito...",
  rate_limit: "Muitas perguntas! Tenta em 1min?"
};`}
          />

        </CardContent>
      </Card>

      {/* Priority 2: High */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-700 flex items-center gap-2">
            ⚡ Prioridade 2: ALTO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          
          <RecommendationItem
            priority="high"
            title="Streaming de Respostas (SSE)"
            impact="✨ Melhora percepção de velocidade em 80%"
            effort="Alto (10-15h)"
            description="Implementar Server-Sent Events para resposta gradual do LLM"
          />

          <RecommendationItem
            priority="high"
            title="Persistência de Histórico"
            impact="💾 Continuidade entre sessões"
            effort="Médio (6-8h)"
            description="Salvar últimas 10 mensagens no localStorage ou criar Conversation entity"
          />

          <RecommendationItem
            priority="high"
            title="Detecção Semântica de Intenções"
            impact="🎯 Ações sugeridas mais precisas"
            effort="Alto (12-16h)"
            description="Substituir regex por embeddings ou prompt engineering para detectar intenções"
          />

        </CardContent>
      </Card>

      {/* Priority 3: Medium */}
      <Card className="border-2 border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="text-yellow-700 flex items-center gap-2">
            💡 Prioridade 3: MÉDIO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          
          <RecommendationItem
            priority="medium"
            title="Quick Replies Sugeridos"
            impact="🎨 Reduz fricção para iniciantes"
            effort="Baixo (3-4h)"
            description="Mostrar 3-4 perguntas comuns como botões clicáveis"
          />

          <RecommendationItem
            priority="medium"
            title="Modo Voice (Voz)"
            impact="🎤 Essencial para Curiosity (6-8 anos)"
            effort="Alto (15-20h)"
            description="Integrar Web Speech API para input/output de voz"
          />

          <RecommendationItem
            priority="medium"
            title="Upload de Anexos"
            impact="📎 Permite perguntas contextualizadas"
            effort="Médio (8-10h)"
            description="Aceitar imagens/arquivos e enviar para LLM com vision"
          />

          <RecommendationItem
            priority="medium"
            title="A/B Testing de Personas"
            impact="📊 Otimização baseada em dados"
            effort="Médio (6-8h)"
            description="Testar variações de prompts e medir engajamento"
          />

        </CardContent>
      </Card>

      {/* Priority 4: Low */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            🔮 Prioridade 4: FUTURO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 text-blue-600" />
              <span><strong>Multi-idioma:</strong> Suporte para inglês/espanhol</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 text-blue-600" />
              <span><strong>Modo Offline:</strong> Respostas cacheadas quando sem internet</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 text-blue-600" />
              <span><strong>Integração com Sofia:</strong> Conectar com metacognitive_coach agent</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 text-blue-600" />
              <span><strong>Dashboard Analytics:</strong> Métricas de uso para educadores</span>
            </li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}

// ===========================
// HELPER COMPONENTS
// ===========================

function FeatureItem({ name, status, description, details }) {
  const statusConfig = {
    excellent: { color: 'var(--success)', icon: CheckCircle2, label: 'Excelente' },
    good: { color: 'var(--info)', icon: CheckCircle2, label: 'Bom' },
    warning: { color: 'var(--warning)', icon: AlertTriangle, label: 'Precisa Melhorar' },
    critical: { color: 'var(--error)', icon: AlertTriangle, label: 'Crítico' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: config.color, backgroundColor: `${config.color}15` }}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5" style={{ color: config.color }} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-lg">{name}</h4>
            <Badge style={{ backgroundColor: config.color, color: 'white' }}>
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-2">{description}</p>
          {details && (
            <ul className="space-y-1 text-xs">
              {details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({ priority, title, impact, effort, description, implementation }) {
  const colors = {
    critical: 'var(--error)',
    high: 'var(--warning)',
    medium: 'var(--info)',
    low: 'var(--neutral-medium)'
  };

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-lg">{title}</h4>
        <Badge style={{ backgroundColor: colors[priority], color: 'white' }}>
          {effort}
        </Badge>
      </div>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      <p className="text-sm font-semibold mb-2" style={{ color: colors[priority] }}>
        {impact}
      </p>
      {implementation && (
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <p className="text-xs font-mono whitespace-pre-wrap">{implementation}</p>
        </div>
      )}
    </div>
  );
}