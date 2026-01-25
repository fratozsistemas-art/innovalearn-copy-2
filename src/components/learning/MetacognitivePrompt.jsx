import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Lightbulb, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/**
 * MetacognitivePrompt Component
 * 
 * Promove reflexão metacognitiva regular:
 * - "Como você aprendeu isso?"
 * - "O que funcionou/não funcionou?"
 * - "Como você se sente sobre seu progresso?"
 * - "O que você faria diferente?"
 */

const REFLECTION_PROMPTS = {
  understanding: [
    "O que você aprendeu hoje que mais te surpreendeu?",
    "Como você explicaria o que aprendeu para alguém da sua idade?",
    "Que conexões você fez entre o que aprendeu hoje e o que já sabia?",
    "O que ainda não faz sentido para você?"
  ],
  strategy: [
    "Que estratégias você usou para resolver os desafios hoje?",
    "O que funcionou bem no seu processo de aprendizado?",
    "Se você pudesse fazer novamente, o que faria diferente?",
    "Quando você ficou travado, como conseguiu destravar?"
  ],
  emotion: [
    "Como você se sentiu durante o aprendizado hoje?",
    "Em que momento você se sentiu mais confiante?",
    "Quando você sentiu frustração? Como lidou com isso?",
    "O que te deixou mais animado no que aprendeu?"
  ],
  goal_setting: [
    "O que você quer aprender ou melhorar na próxima semana?",
    "Qual é o maior desafio que você quer superar?",
    "Como você vai saber que alcançou sua meta?",
    "Que recurso ou ajuda você precisa para avançar?"
  ],
  self_assessment: [
    "Numa escala de 1 a 5, o quanto você entendeu o conteúdo hoje?",
    "O que você fez de melhor hoje?",
    "Onde você vê progresso desde a semana passada?",
    "Que habilidade você está desenvolvendo mais rápido?"
  ]
};

export default function MetacognitivePrompt({ 
  triggerType = "lesson_complete", 
  context = {}, 
  onComplete,
  studentEmail 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState("understanding");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const currentPrompt = REFLECTION_PROMPTS[category][
    Math.floor(Math.random() * REFLECTION_PROMPTS[category].length)
  ];

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Por favor, compartilhe sua reflexão antes de continuar.");
      return;
    }

    setLoading(true);
    try {
      // Gerar insights com IA
      const aiInsights = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um coach educacional analisando a reflexão metacognitiva de um aluno.

REFLEXÃO DO ALUNO:
"${response}"

CONTEXTO:
- Categoria: ${category}
- Trigger: ${triggerType}
${context.lesson_id ? `- Lição: ${context.lesson_id}` : ''}
${context.recent_score ? `- Score recente: ${context.recent_score}` : ''}

Analise a reflexão e forneça:
1. Nível metacognitivo (surface/developing/proficient/advanced)
2. 2-3 insights construtivos sobre o aprendizado do aluno
3. 1-2 ações práticas que o aluno pode tomar
4. Se necessita follow-up do professor (sim/não e por quê)

Seja encorajador e específico.`,
        response_json_schema: {
          type: "object",
          properties: {
            metacognitive_level: { type: "string" },
            insights: { type: "array", items: { type: "string" } },
            action_items: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            follow_up_needed: { type: "boolean" },
            follow_up_reason: { type: "string" },
            encouraging_message: { type: "string" }
          }
        }
      });

      setInsights(aiInsights);

      // Salvar reflexão
      await base44.entities.MetacognitiveReflection.create({
        student_email: studentEmail,
        trigger_type: triggerType,
        prompt_question: currentPrompt,
        student_response: response,
        reflection_category: category,
        context: context,
        insights_generated: aiInsights.insights,
        action_items: aiInsights.action_items,
        follow_up_needed: aiInsights.follow_up_needed,
        metacognitive_level: aiInsights.metacognitive_level
      });

      toast.success("Reflexão salva! Continue desenvolvendo sua autoconsciência.");
      
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }

    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error("Erro ao processar reflexão. Tente novamente.");
    }
    setLoading(false);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'understanding': return <Brain className="w-4 h-4" />;
      case 'strategy': return <Target className="w-4 h-4" />;
      case 'emotion': return <Lightbulb className="w-4 h-4" />;
      case 'goal_setting': return <TrendingUp className="w-4 h-4" />;
      case 'self_assessment': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'understanding': return 'var(--primary-teal)';
      case 'strategy': return 'var(--success)';
      case 'emotion': return 'var(--accent-orange)';
      case 'goal_setting': return 'var(--info)';
      case 'self_assessment': return 'var(--accent-yellow)';
      default: return 'var(--primary-teal)';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader 
            className="border-b"
            style={{ backgroundColor: getCategoryColor(category), color: 'white' }}
          >
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Momento de Reflexão
            </CardTitle>
            <p className="text-sm opacity-90 mt-2">
              A reflexão sobre seu próprio aprendizado te torna um aluno mais consciente e eficaz!
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {!insights ? (
              <>
                {/* Category Selector */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Tipo de Reflexão:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(REFLECTION_PROMPTS).map((cat) => (
                      <Button
                        key={cat}
                        variant={category === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory(cat)}
                        className="flex items-center gap-2"
                        style={category === cat ? { 
                          backgroundColor: getCategoryColor(cat), 
                          color: 'white' 
                        } : {}}
                      >
                        {getCategoryIcon(cat)}
                        {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Prompt Question */}
                <div 
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: getCategoryColor(category) + '10',
                    borderColor: getCategoryColor(category)
                  }}
                >
                  <p className="font-semibold text-lg">{currentPrompt}</p>
                </div>

                {/* Response Area */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Sua Reflexão:
                  </label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Compartilhe seus pensamentos... Não há resposta certa ou errada. O importante é refletir sobre seu processo de aprendizado."
                    rows={6}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Dica: Seja honesto e específico. Quanto mais você reflete, mais você aprende sobre si mesmo!
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsOpen(false);
                      if (onComplete) onComplete();
                    }}
                  >
                    Pular por Agora
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading || !response.trim()}
                    style={{ backgroundColor: getCategoryColor(category), color: 'white' }}
                  >
                    {loading ? 'Analisando...' : 'Enviar Reflexão'}
                  </Button>
                </div>
              </>
            ) : (
              /* Insights Display */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--success)' + '10' }}
                >
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    {insights.encouraging_message}
                  </h3>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">💡 Insights sobre seu Aprendizado:</h4>
                  <ul className="space-y-2">
                    {insights.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-3 rounded bg-gray-50">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🎯 Próximos Passos:</h4>
                  <ul className="space-y-2">
                    {insights.action_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-3 rounded bg-blue-50">
                        <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--info)' }} />
                        <div className="flex-1">
                          <span>{item.action}</span>
                          {item.priority === 'high' && (
                            <Badge className="ml-2" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                              Prioridade Alta
                            </Badge>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Nível Metacognitivo: <strong>{insights.metacognitive_level}</strong>
                  </p>
                  {insights.follow_up_needed && (
                    <div className="p-3 rounded bg-orange-50 border-l-4 border-orange-500">
                      <p className="text-sm">
                        <strong>📧 Seu professor receberá esta reflexão</strong> para te apoiar melhor.
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{insights.follow_up_reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      setIsOpen(false);
                      if (onComplete) onComplete();
                    }}
                    style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                  >
                    Continuar Aprendendo
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}