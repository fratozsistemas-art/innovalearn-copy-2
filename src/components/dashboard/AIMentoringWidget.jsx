import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Brain, Sparkles, RefreshCw, BookOpen, Dumbbell, Calendar,
  ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Lightbulb, User
} from "lucide-react";

const PLAN_TYPE_CONFIG = {
  study_plan: {
    label: "Plano de Estudo",
    icon: BookOpen,
    color: "#3498DB",
    bg: "#EBF5FB",
    border: "#AED6F1",
  },
  exercises: {
    label: "Exercícios de Reforço",
    icon: Dumbbell,
    color: "#27AE60",
    bg: "#EAFAF1",
    border: "#A9DFBF",
  },
  human_session: {
    label: "Atendimento Humano",
    icon: Calendar,
    color: "#E74C3C",
    bg: "#FDEDEC",
    border: "#F1948A",
  },
  encouragement: {
    label: "Continue Assim!",
    icon: Sparkles,
    color: "#F39C12",
    bg: "#FEF9E7",
    border: "#FAD7A0",
  },
};

function MentoringPlanCard({ plan }) {
  const [expanded, setExpanded] = useState(false);
  const config = PLAN_TYPE_CONFIG[plan.type] || PLAN_TYPE_CONFIG.study_plan;
  const Icon = config.icon;

  return (
    <div
      className="rounded-xl border-2 overflow-hidden"
      style={{ borderColor: config.border, backgroundColor: config.bg }}
    >
      <button
        className="w-full flex items-center justify-between p-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 flex-shrink-0" style={{ color: config.color }} />
          <span className="font-semibold text-sm" style={{ color: config.color }}>
            {config.label}
          </span>
          {plan.priority === 'urgent' && (
            <Badge className="text-xs border-0 bg-red-100 text-red-700">Urgente</Badge>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: config.border }}>
          <p className="text-sm text-gray-700 mt-2">{plan.description}</p>
          {plan.steps && plan.steps.length > 0 && (
            <ul className="space-y-1 mt-2">
              {plan.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                  {step}
                </li>
              ))}
            </ul>
          )}
          {plan.estimated_time && (
            <p className="text-xs text-gray-500 mt-2">⏱ Tempo estimado: {plan.estimated_time}</p>
          )}
          {plan.type === 'human_session' && (
            <Button
              size="sm"
              className="mt-2 w-full"
              style={{ backgroundColor: config.color, color: 'white' }}
              onClick={() => window.open('mailto:mentoria@innovaacademy.com?subject=Solicitação de Mentoria', '_blank')}
            >
              <User className="w-4 h-4 mr-2" />
              Solicitar Atendimento
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

async function generateMentoringPlan(user, enrollments, assignments) {
  const overdue = assignments.filter(a => a.status === 'pending' && new Date(a.due_date) < new Date());
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const completionRate = assignments.length > 0
    ? Math.round((assignments.filter(a => a.status === 'graded').length / assignments.length) * 100)
    : 100;

  const prompt = `Você é um mentor educacional especialista da Innova Academy, uma escola de IA para jovens.

Analise os dados do aluno e gere um plano de mentoria personalizado em JSON.

## Dados do Aluno
- Nome: ${user.explorer_name || user.full_name || 'Explorador'}
- Nível: ${user.explorer_level || 'curiosity'}
- Perfil VARK: ${user.vark_primary_style || 'não definido'}
- Progresso médio nos módulos: ${avgProgress}%
- Taxa de conclusão de tarefas: ${completionRate}%
- Tarefas atrasadas: ${overdue.length}
- Módulos matriculados: ${enrollments.length}
- Dias desde último acesso: ${user.last_login ? Math.floor((Date.now() - new Date(user.last_login)) / 86400000) : 'desconhecido'}

## Instruções
Retorne APENAS um JSON com esta estrutura exata:
{
  "diagnosis": "frase curta (1 linha) descrevendo o estado atual do aluno",
  "urgency": "low" | "medium" | "high",
  "plans": [
    {
      "type": "study_plan" | "exercises" | "human_session" | "encouragement",
      "priority": "normal" | "urgent",
      "description": "descrição clara e motivadora do que o aluno deve fazer",
      "steps": ["passo 1", "passo 2", "passo 3"],
      "estimated_time": "ex: 30 minutos"
    }
  ],
  "motivational_message": "mensagem curta e encorajadora personalizada para o aluno"
}

Regras:
- Inclua "human_session" APENAS se avgProgress < 20 OU overdue > 3 OU o aluno parecer muito perdido
- Sempre inclua 1-3 planos, priorizando os mais relevantes
- Se o aluno está indo bem (avgProgress > 70, overdue = 0), use "encouragement" como principal
- Adapte os passos ao perfil VARK: visual = mapas/vídeos, auditory = podcasts/discussão, read_write = leitura/resumos, kinesthetic = projetos/prática
- Seja específico, direto e motivador. Fale diretamente com o aluno (você).
- Responda em português do Brasil.`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: "object",
      properties: {
        diagnosis: { type: "string" },
        urgency: { type: "string" },
        plans: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              priority: { type: "string" },
              description: { type: "string" },
              steps: { type: "array", items: { type: "string" } },
              estimated_time: { type: "string" }
            }
          }
        },
        motivational_message: { type: "string" }
      }
    }
  });

  return result;
}

export default function AIMentoringWidget({ user, enrollments, assignments }) {
  const [mentoringData, setMentoringData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateMentoringPlan(user, enrollments, assignments);
      setMentoringData(data);
      setLoaded(true);
    } catch (e) {
      setError(e.message || "Erro ao gerar plano");
    }
    setLoading(false);
  };

  const urgencyColors = { low: "text-green-600", medium: "text-yellow-600", high: "text-red-600" };
  const urgencyLabels = { low: "✅ Bom progresso", medium: "⚠️ Atenção necessária", high: "🚨 Ação urgente" };

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Mentoria IA</h3>
              <p className="text-white/70 text-xs">Análise personalizada do seu progresso</p>
            </div>
          </div>
          {loaded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
              className="text-white/80 hover:text-white hover:bg-white/10 h-7 px-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Not loaded yet */}
        {!loaded && !loading && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Quer um plano personalizado?</p>
            <p className="text-xs text-gray-400 mb-4">
              A IA analisa seu desempenho e gera sugestões de estudo, reforço ou atendimento.
            </p>
            <Button
              onClick={handleGenerate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analisar e Gerar Plano
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500">Analisando seu progresso...</p>
            <p className="text-xs text-gray-400">Isso pode levar alguns segundos</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-4">
            <AlertTriangle className="w-10 h-10 mx-auto text-red-400 mb-2" />
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={handleGenerate}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Results */}
        {loaded && mentoringData && !loading && (
          <div className="space-y-3">
            {/* Diagnosis */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <Brain className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Diagnóstico</p>
                <p className="text-sm text-gray-700">{mentoringData.diagnosis}</p>
                {mentoringData.urgency && (
                  <p className={`text-xs font-semibold mt-1 ${urgencyColors[mentoringData.urgency]}`}>
                    {urgencyLabels[mentoringData.urgency]}
                  </p>
                )}
              </div>
            </div>

            {/* Plans */}
            <div className="space-y-2">
              {(mentoringData.plans || []).map((plan, i) => (
                <MentoringPlanCard key={i} plan={plan} />
              ))}
            </div>

            {/* Motivational message */}
            {mentoringData.motivational_message && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <p className="text-xs font-semibold text-indigo-600 mb-1">💬 Mensagem do seu Mentor</p>
                <p className="text-sm text-indigo-800 italic">"{mentoringData.motivational_message}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}