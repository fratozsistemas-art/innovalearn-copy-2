import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Wand2,
  Target,
  CheckCircle2,
  Copy,
  RotateCw
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AssignmentGeneratorPage() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const [config, setConfig] = useState({
    lesson_id: '',
    module_id: '',
    explorer_level: 'curiosity',
    assignment_type: 'homework',
    difficulty: 'intermediate',
    num_questions: 5,
    focus_topics: '',
    student_struggles: ''
  });

  const [generatedAssignments, setGeneratedAssignments] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const data = await base44.entities.Lesson.list();
      return data;
    }
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['difficultyPredictions'],
    queryFn: async () => {
      const data = await base44.entities.DifficultyPrediction.list('-created_date', 50);
      return data;
    }
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['studentProgress'],
    queryFn: async () => {
      const data = await base44.entities.StudentProgress.list();
      return data;
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedAssignments(null);

    try {
      const selectedLesson = lessons.find(l => l.id === config.lesson_id);
      
      if (!selectedLesson) {
        alert('Selecione uma lição primeiro');
        setIsGenerating(false);
        return;
      }

      const lessonProgress = progress.filter(p => p.lesson_id === config.lesson_id);
      const avgScore = lessonProgress.length > 0
        ? lessonProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / lessonProgress.length
        : null;
      
      const strugglingStudents = lessonProgress.filter(p => p.quiz_score < 60).length;

      const prompt = `Você é um especialista em criação de atividades educacionais de IA e programação.

CONTEXTO DA LIÇÃO:
Título: ${selectedLesson.title}
Descrição: ${selectedLesson.description}
Nível: ${config.explorer_level}
Objetivos: ${selectedLesson.learning_objectives?.join(', ') || 'Não especificados'}

PERFORMANCE DOS ALUNOS:
Média de notas: ${avgScore ? `${Math.round(avgScore)}%` : 'Sem dados'}
Alunos com dificuldade (<60%): ${strugglingStudents} de ${lessonProgress.length}
Tópicos de dificuldade: ${config.student_struggles || 'Não especificados'}

REQUISITOS DA TAREFA:
Tipo: ${config.assignment_type === 'homework' ? 'Tarefa de Casa' : config.assignment_type === 'familywork' ? 'Atividade em Família' : 'Desafio Extra Mile'}
Dificuldade: ${config.difficulty}
Número de questões/exercícios: ${config.num_questions}
Focos específicos: ${config.focus_topics || 'Geral'}

INSTRUÇÕES:
1. Crie ${config.num_questions} exercícios práticos
2. Cada item deve ter enunciado claro, objetivos, tempo estimado, critérios de avaliação
3. Adapte a linguagem para a idade do nível ${config.explorer_level}
4. Se há alunos com dificuldade, inclua 1-2 questões de reforço
5. Inclua pelo menos 1 questão criativa/desafiadora`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            assignment_title: { type: "string" },
            assignment_description: { type: "string" },
            total_points: { type: "number" },
            estimated_time_minutes: { type: "number" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question_number: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string" },
                  learning_objective: { type: "string" },
                  points: { type: "number" },
                  estimated_minutes: { type: "number" },
                  evaluation_criteria: {
                    type: "array",
                    items: { type: "string" }
                  },
                  teacher_notes: { type: "string" },
                  expected_answer: { type: "string" }
                }
              }
            },
            rubric: {
              type: "object",
              properties: {
                criteria: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      weight: { type: "number" },
                      levels: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            vark_adaptations: {
              type: "object",
              properties: {
                visual: { type: "string" },
                auditory: { type: "string" },
                read_write: { type: "string" },
                kinesthetic: { type: "string" }
              }
            }
          }
        }
      });

      setGeneratedAssignments(response);
    } catch (error) {
      console.error('Erro ao gerar tarefas:', error);
      alert('Erro ao gerar tarefas. Tente novamente.');
    }

    setIsGenerating(false);
  };

  const handleCopyToClipboard = () => {
    const text = JSON.stringify(generatedAssignments, null, 2);
    navigator.clipboard.writeText(text);
    alert('Copiado para clipboard!');
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            ✨ Gerador de Tarefas com IA
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Crie exercícios personalizados baseados no conteúdo da lição e dificuldades dos alunos
          </p>
        </div>

        <Alert className="border-2" style={{ borderColor: 'var(--info)', backgroundColor: 'var(--info-light)' }}>
          <Sparkles className="w-5 h-5" style={{ color: 'var(--info)' }} />
          <AlertDescription>
            <p className="font-semibold mb-1">Powered by GPT-4</p>
            <p className="text-sm">
              A IA analisa o conteúdo da lição, performance dos alunos e gera tarefas adaptadas ao nível ideal.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Configuração
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Lição</Label>
                <select
                  className="w-full p-3 border rounded-lg mt-2"
                  value={config.lesson_id}
                  onChange={(e) => {
                    const lesson = lessons.find(l => l.id === e.target.value);
                    setConfig({ 
                      ...config, 
                      lesson_id: e.target.value,
                      module_id: lesson?.module_id || '',
                      explorer_level: lesson?.course_id || 'curiosity'
                    });
                  }}
                >
                  <option value="">Selecione...</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title} ({lesson.course_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Tipo de Tarefa</Label>
                <select
                  className="w-full p-3 border rounded-lg mt-2"
                  value={config.assignment_type}
                  onChange={(e) => setConfig({ ...config, assignment_type: e.target.value })}
                >
                  <option value="homework">Homework</option>
                  <option value="familywork">Familywork</option>
                  <option value="extramile">Extra Mile</option>
                </select>
              </div>

              <div>
                <Label>Dificuldade</Label>
                <select
                  className="w-full p-3 border rounded-lg mt-2"
                  value={config.difficulty}
                  onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                >
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>

              <div>
                <Label>Número de Questões</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={config.num_questions}
                  onChange={(e) => setConfig({ ...config, num_questions: parseInt(e.target.value) })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Tópicos de Foco</Label>
                <Input
                  placeholder="Ex: loops, variáveis..."
                  value={config.focus_topics}
                  onChange={(e) => setConfig({ ...config, focus_topics: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Dificuldades Identificadas</Label>
                <Textarea
                  placeholder="Ex: Alunos confundem for e while..."
                  value={config.student_struggles}
                  onChange={(e) => setConfig({ ...config, student_struggles: e.target.value })}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !config.lesson_id}
                className="w-full"
                style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                    Gerando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Tarefa
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tarefa Gerada
                </span>
                {generatedAssignments && (
                  <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!generatedAssignments ? (
                <div className="text-center py-12 text-gray-500">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold mb-2">Configure e gere sua tarefa</p>
                  <p className="text-sm">
                    A IA criará exercícios personalizados
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[800px] overflow-y-auto">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    <h3 className="text-xl font-bold mb-2">{generatedAssignments.assignment_title}</h3>
                    <p className="text-sm opacity-90 mb-3">{generatedAssignments.assignment_description}</p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-white/20">
                        {generatedAssignments.total_points} pontos
                      </Badge>
                      <Badge className="bg-white/20">
                        ⏱️ {generatedAssignments.estimated_time_minutes} min
                      </Badge>
                      <Badge className="bg-white/20">
                        {generatedAssignments.items?.length} questões
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {generatedAssignments.items?.map((item, idx) => (
                      <Card key={idx} className="border-l-4" style={{ borderLeftColor: 'var(--primary-teal)' }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                              style={{ backgroundColor: 'var(--primary-teal)' }}
                            >
                              {item.question_number}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{item.title}</h4>
                              <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline">{item.type}</Badge>
                                <Badge variant="outline">{item.points} pts</Badge>
                                <Badge variant="outline">⏱️ {item.estimated_minutes} min</Badge>
                              </div>

                              <div className="p-3 rounded-lg bg-blue-50 mb-3">
                                <p className="text-xs font-semibold text-blue-900 mb-1">🎯 Objetivo:</p>
                                <p className="text-sm text-blue-800">{item.learning_objective}</p>
                              </div>

                              {item.evaluation_criteria && (
                                <details className="mb-3">
                                  <summary className="text-sm font-semibold cursor-pointer text-gray-700 mb-2">
                                    Critérios de Avaliação
                                  </summary>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {item.evaluation_criteria.map((crit, cidx) => (
                                      <li key={cidx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                        <span>{crit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              )}

                              {item.teacher_notes && (
                                <div className="p-2 rounded bg-yellow-50 border-l-2 border-yellow-500">
                                  <p className="text-xs font-semibold text-yellow-900 mb-1">👨‍🏫 Notas:</p>
                                  <p className="text-xs text-yellow-800">{item.teacher_notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerate}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Gerar Nova Versão
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}