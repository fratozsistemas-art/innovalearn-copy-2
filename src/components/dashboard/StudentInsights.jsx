import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, TrendingDown, Star, Zap, Target } from "lucide-react";

const VARK_INFO = {
  visual: {
    label: "Visual",
    color: "#3498DB",
    bg: "#EBF5FB",
    tips: [
      "Use mapas mentais e diagramas para estudar",
      "Assista vídeos antes de ler os textos",
      "Crie infográficos com os conceitos principais",
    ],
    resources: "vídeos, infográficos, apresentações"
  },
  auditory: {
    label: "Auditivo",
    color: "#27AE60",
    bg: "#EAFAF1",
    tips: [
      "Ouça podcasts e audiobooks sobre os temas",
      "Explique os conceitos em voz alta para fixar",
      "Grave resumos de voz para revisar",
    ],
    resources: "podcasts, discussões em grupo, audiobooks"
  },
  read_write: {
    label: "Leitura/Escrita",
    color: "#8E44AD",
    bg: "#F5EEF8",
    tips: [
      "Escreva resumos e anotações detalhadas",
      "Leia a documentação oficial e artigos",
      "Faça listas de pontos importantes",
    ],
    resources: "artigos, tutoriais escritos, documentação"
  },
  kinesthetic: {
    label: "Cinestésico",
    color: "#FF6F3C",
    bg: "#FFF2ED",
    tips: [
      "Pratique com projetos hands-on",
      "Faça experimentos e simule cenários reais",
      "Aprenda codificando, não só lendo",
    ],
    resources: "projetos práticos, simuladores, labs"
  },
  multimodal: {
    label: "Multimodal",
    color: "#00A99D",
    bg: "#E6F7F6",
    tips: [
      "Combine diferentes formatos de estudo",
      "Alterne entre vídeos, leitura e prática",
      "Use flashcards visuais e textuais",
    ],
    resources: "mix de vídeos, textos, projetos e podcasts"
  },
};

function VARKCard({ varkStyle }) {
  const info = VARK_INFO[varkStyle] || VARK_INFO.multimodal;
  return (
    <div className="p-4 rounded-xl border-2" style={{ borderColor: info.color, backgroundColor: info.bg }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5" style={{ color: info.color }} />
        <span className="font-bold text-sm" style={{ color: info.color }}>
          Perfil VARK: {info.label}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Seu estilo de aprendizado predominante é <strong>{info.label}</strong>. Priorize: <em>{info.resources}</em>.
      </p>
      <ul className="space-y-1">
        {info.tips.map((tip, i) => (
          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#555' }}>
            <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: info.color }} />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerformanceInsights({ enrollments, assignments }) {
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const overdue = assignments.filter(a => a.status === 'pending' && new Date(a.due_date) < new Date()).length;
  const pending = assignments.filter(a => a.status === 'pending' && new Date(a.due_date) >= new Date()).length;
  const graded = assignments.filter(a => a.status === 'graded').length;
  const total = assignments.length;
  const completionRate = total > 0 ? Math.round((graded / total) * 100) : 0;

  const bestModule = enrollments.length > 0
    ? enrollments.reduce((best, e) => (e.progress || 0) > (best.progress || 0) ? e : best, enrollments[0])
    : null;

  const insights = [];

  if (avgProgress >= 70) {
    insights.push({ type: 'success', icon: TrendingUp, text: `Ótimo ritmo! Progresso médio de ${avgProgress}% nos módulos.` });
  } else if (avgProgress >= 40) {
    insights.push({ type: 'warning', icon: Target, text: `Progresso médio de ${avgProgress}%. Tente avançar uma aula por semana.` });
  } else if (avgProgress > 0) {
    insights.push({ type: 'danger', icon: TrendingDown, text: `Progresso baixo (${avgProgress}%). Que tal dedicar 30 minutos hoje?` });
  }

  if (overdue > 0) {
    insights.push({ type: 'danger', icon: TrendingDown, text: `Você tem ${overdue} tarefa${overdue > 1 ? 's' : ''} atrasada${overdue > 1 ? 's' : ''}. Priorize agora!` });
  }

  if (completionRate >= 80) {
    insights.push({ type: 'success', icon: Star, text: `Excelente! ${completionRate}% de taxa de conclusão de tarefas.` });
  }

  if (pending === 0 && overdue === 0) {
    insights.push({ type: 'success', icon: Star, text: `Nenhuma tarefa pendente. Continue assim!` });
  }

  const colorMap = { success: '#27AE60', warning: '#F39C12', danger: '#E74C3C' };
  const bgMap = { success: '#EAFAF1', warning: '#FFF3E0', danger: '#FFEBEE' };

  return (
    <div className="space-y-3">
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{avgProgress}%</div>
          <div className="text-xs text-blue-500 mt-1">Progresso Médio</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50 border border-green-100">
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-xs text-green-500 mt-1">Tarefas Concluídas</div>
        </div>
        <div className={`text-center p-3 rounded-xl border ${overdue > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className={`text-2xl font-bold ${overdue > 0 ? 'text-red-600' : 'text-gray-500'}`}>{overdue}</div>
          <div className={`text-xs mt-1 ${overdue > 0 ? 'text-red-500' : 'text-gray-400'}`}>Atrasadas</div>
        </div>
      </div>

      {/* Module progress bars */}
      {enrollments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progresso por Módulo</p>
          {enrollments.slice(0, 4).map((e, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="truncate max-w-[160px]">{e.module_id}</span>
                <span className="font-semibold">{e.progress || 0}%</span>
              </div>
              <Progress value={e.progress || 0} className="h-1.5" />
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Seus Insights</p>
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg text-sm" style={{ backgroundColor: bgMap[insight.type] }}>
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colorMap[insight.type] }} />
                <span style={{ color: colorMap[insight.type] }}>{insight.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StudentInsights({ user, enrollments, assignments }) {
  const varkStyle = user?.vark_primary_style;

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <CardTitle className="font-heading flex items-center gap-2">
          <Brain className="w-5 h-5 text-innova-teal-500" />
          Meus Insights Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <PerformanceInsights enrollments={enrollments} assignments={assignments} />
        {varkStyle && <VARKCard varkStyle={varkStyle} />}
        {!varkStyle && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-700">
            💡 Complete o onboarding para ver recomendações personalizadas baseadas no seu perfil VARK.
          </div>
        )}
      </CardContent>
    </Card>
  );
}