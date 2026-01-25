import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

/**
 * RubricDisplay - Exibe rubrica estruturada de avaliação
 */
export default function RubricDisplay({ rubric, scores = null }) {
  if (!rubric || !rubric.criteria) return null;

  return (
    <Card className="border-l-4 border-blue-500">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-lg">Critérios de Avaliação</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Total: {rubric.total_points || 100} pontos
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {rubric.criteria.map((criterion, idx) => {
            const score = scores?.[criterion.id];
            const hasScore = score !== undefined && score !== null;

            return (
              <div key={idx} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {hasScore ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <h4 className="font-semibold">{criterion.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-7">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    {hasScore ? (
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {score}
                        </span>
                        <span className="text-gray-600">/{criterion.max_points}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600">{criterion.max_points} pts</span>
                    )}
                  </div>
                </div>

                {/* Níveis de desempenho */}
                {criterion.levels && (
                  <div className="ml-7 mt-2 space-y-1">
                    {criterion.levels.map((level, levelIdx) => (
                      <div 
                        key={levelIdx}
                        className={`text-sm p-2 rounded ${
                          hasScore && score >= level.min_score && score <= level.max_score
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{level.name}</span>
                        <span className="text-gray-600 ml-2">
                          ({level.min_score}-{level.max_score} pts)
                        </span>
                        <p className="text-gray-600 mt-1">{level.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {scores && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Pontuação Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {Object.values(scores).reduce((sum, val) => sum + (val || 0), 0)} / {rubric.total_points || 100}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Rubrica padrão para tarefas
 */
export const DEFAULT_RUBRIC = {
  total_points: 100,
  criteria: [
    {
      id: 'understanding',
      name: 'Compreensão do Conteúdo',
      description: 'Demonstra entendimento dos conceitos principais',
      max_points: 30,
      levels: [
        {
          name: 'Excepcional',
          min_score: 25,
          max_score: 30,
          description: 'Compreensão profunda, faz conexões avançadas'
        },
        {
          name: 'Proficiente',
          min_score: 20,
          max_score: 24,
          description: 'Compreensão sólida dos conceitos principais'
        },
        {
          name: 'Básico',
          min_score: 15,
          max_score: 19,
          description: 'Compreensão superficial, alguns conceitos faltando'
        },
        {
          name: 'Insuficiente',
          min_score: 0,
          max_score: 14,
          description: 'Compreensão limitada ou incorreta'
        }
      ]
    },
    {
      id: 'application',
      name: 'Aplicação Prática',
      description: 'Aplica conceitos de forma criativa e relevante',
      max_points: 25,
      levels: [
        {
          name: 'Excepcional',
          min_score: 21,
          max_score: 25,
          description: 'Aplicação criativa e inovadora'
        },
        {
          name: 'Proficiente',
          min_score: 16,
          max_score: 20,
          description: 'Aplicação adequada e relevante'
        },
        {
          name: 'Básico',
          min_score: 11,
          max_score: 15,
          description: 'Aplicação limitada'
        },
        {
          name: 'Insuficiente',
          min_score: 0,
          max_score: 10,
          description: 'Não demonstra aplicação prática'
        }
      ]
    },
    {
      id: 'completeness',
      name: 'Completude',
      description: 'Responde a todos os requisitos da tarefa',
      max_points: 20,
      levels: [
        {
          name: 'Completo',
          min_score: 16,
          max_score: 20,
          description: 'Todos os requisitos atendidos'
        },
        {
          name: 'Quase Completo',
          min_score: 11,
          max_score: 15,
          description: 'Maioria dos requisitos atendidos'
        },
        {
          name: 'Incompleto',
          min_score: 0,
          max_score: 10,
          description: 'Requisitos importantes faltando'
        }
      ]
    },
    {
      id: 'quality',
      name: 'Qualidade de Apresentação',
      description: 'Organização, clareza, profissionalismo',
      max_points: 15,
      levels: [
        {
          name: 'Excelente',
          min_score: 12,
          max_score: 15,
          description: 'Apresentação profissional e clara'
        },
        {
          name: 'Boa',
          min_score: 8,
          max_score: 11,
          description: 'Apresentação organizada'
        },
        {
          name: 'Precisa Melhorar',
          min_score: 0,
          max_score: 7,
          description: 'Desorganizado ou confuso'
        }
      ]
    },
    {
      id: 'effort',
      name: 'Esforço e Originalidade',
      description: 'Dedicação e criatividade demonstradas',
      max_points: 10,
      levels: [
        {
          name: 'Excepcional',
          min_score: 8,
          max_score: 10,
          description: 'Grande esforço e originalidade'
        },
        {
          name: 'Adequado',
          min_score: 5,
          max_score: 7,
          description: 'Esforço satisfatório'
        },
        {
          name: 'Mínimo',
          min_score: 0,
          max_score: 4,
          description: 'Esforço mínimo visível'
        }
      ]
    }
  ]
};