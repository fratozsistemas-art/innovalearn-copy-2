import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
const Course = base44.entities.Course;
const Enrollment = base44.entities.Enrollment;
const Assignment = base44.entities.Assignment;
const UserEntity = base44.entities.User;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Award, 
  Brain,
  Users,
  BookOpen,
  Activity,
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const analyzeRisks = useCallback((students, enrollments, assignments) => {
    const risks = [];

    students.forEach(student => {
      const studentEnrollments = enrollments.filter(e => e.student_email === student.email);
      const studentAssignments = assignments.filter(a => a.student_email === student.email);

      let riskScore = 0;
      const factors = [];

      const avgProgress = studentEnrollments.length > 0
        ? studentEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / studentEnrollments.length
        : 0;
      
      if (avgProgress < 30) {
        riskScore += 40;
        factors.push('Progresso muito baixo (<30%)');
      } else if (avgProgress < 50) {
        riskScore += 25;
        factors.push('Progresso abaixo da média (<50%)');
      }

      const lateAssignments = studentAssignments.filter(a => 
        a.status === 'pending' && new Date(a.due_date) < new Date()
      ).length;
      
      if (lateAssignments > 3) {
        riskScore += 30;
        factors.push(`${lateAssignments} tarefas atrasadas`);
      } else if (lateAssignments > 0) {
        riskScore += 15;
        factors.push(`${lateAssignments} tarefas atrasadas`);
      }

      const lastAccess = studentEnrollments
        .map(e => e.last_accessed)
        .filter(d => d)
        .sort()
        .reverse()[0];

      if (lastAccess) {
        const daysSinceAccess = Math.floor((new Date() - new Date(lastAccess)) / (1000 * 60 * 60 * 24));
        if (daysSinceAccess > 14) {
          riskScore += 30;
          factors.push(`Sem acesso há ${daysSinceAccess} dias`);
        } else if (daysSinceAccess > 7) {
          riskScore += 15;
          factors.push(`Sem acesso há ${daysSinceAccess} dias`);
        }
      }

      const completedAssignments = studentAssignments.filter(a => a.status === 'graded').length;
      const completionRate = studentAssignments.length > 0
        ? (completedAssignments / studentAssignments.length) * 100
        : 100;

      if (completionRate < 40) {
        riskScore += 20;
        factors.push(`Apenas ${Math.round(completionRate)}% de tarefas concluídas`);
      }

      if (riskScore >= 40) {
        risks.push({
          student,
          riskScore: Math.min(riskScore, 100),
          factors,
          avgProgress,
          lateAssignments,
          completionRate
        });
      }
    });

    risks.sort((a, b) => b.riskScore - a.riskScore);
    setAtRiskStudents(risks);
  }, []);

  const generateInsights = useCallback((students, enrollments, assignments, courses) => {
    const newInsights = [];

    const courseEngagement = {};
    courses.forEach(course => {
      const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
      const avgProgress = courseEnrollments.length > 0
        ? courseEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / courseEnrollments.length
        : 0;
      courseEngagement[course.id] = { course, avgProgress, enrollmentCount: courseEnrollments.length };
    });

    const lowEngagementCourses = Object.values(courseEngagement)
      .filter(c => c.avgProgress < 40 && c.enrollmentCount > 0)
      .sort((a, b) => a.avgProgress - b.avgProgress);

    if (lowEngagementCourses.length > 0) {
      newInsights.push({
        type: 'warning',
        title: 'Cursos com Baixo Engajamento',
        description: `${lowEngagementCourses.length} curso(s) com progresso médio abaixo de 40%`,
        action: 'Revisar conteúdo e metodologia',
        data: lowEngagementCourses.slice(0, 3)
      });
    }

    const varkDistribution = {
      visual: 0,
      auditory: 0,
      read_write: 0,
      kinesthetic: 0,
      multimodal: 0
    };

    students.forEach(student => {
      if (student.vark_primary_style) {
        varkDistribution[student.vark_primary_style]++;
      }
    });

    const totalStudents = Object.values(varkDistribution).reduce((a, b) => a + b, 0);
    if (totalStudents > 0) {
      const dominantStyle = Object.entries(varkDistribution)
        .sort((a, b) => b[1] - a[1])[0];
      
      const percentage = Math.round((dominantStyle[1] / totalStudents) * 100);
      
      newInsights.push({
        type: 'info',
        title: 'Perfil VARK Predominante',
        description: `${percentage}% dos alunos têm estilo ${dominantStyle[0]}`,
        action: 'Considerar produzir mais recursos para este perfil',
        data: varkDistribution
      });
    }

    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === 'graded').length;
    const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

    if (completionRate < 60) {
      newInsights.push({
        type: 'warning',
        title: 'Taxa de Conclusão Baixa',
        description: `Apenas ${Math.round(completionRate)}% das tarefas foram concluídas`,
        action: 'Revisar prazos e carga de trabalho',
        data: { completionRate, totalAssignments, completedAssignments }
      });
    } else if (completionRate > 80) {
      newInsights.push({
        type: 'success',
        title: 'Excelente Taxa de Conclusão',
        description: `${Math.round(completionRate)}% das tarefas concluídas!`,
        action: 'Manter estratégia atual',
        data: { completionRate }
      });
    }

    setInsights(newInsights);
  }, []);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    const userData = await base44.auth.me();
    setUser(userData);

    if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(userData.user_type)) {
      setLoading(false);
      return;
    }

    const [studentsData, enrollmentsData, assignmentsData, coursesData] = await Promise.all([
      UserEntity.list(),
      Enrollment.list(),
      Assignment.list(),
      Course.list()
    ]);

    const filteredStudents = studentsData.filter(s => s.user_type === 'aluno');
    setStudents(filteredStudents);
    setEnrollments(enrollmentsData);
    setAssignments(assignmentsData);
    setCourses(coursesData);

    analyzeRisks(filteredStudents, enrollmentsData, assignmentsData);
    generateInsights(filteredStudents, enrollmentsData, assignmentsData, coursesData);

    setLoading(false);
  }, [analyzeRisks, generateInsights]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const getRiskColor = (score) => {
    if (score >= 70) return { bg: 'var(--error)', text: 'var(--background)', label: 'Crítico' };
    if (score >= 50) return { bg: 'var(--warning)', text: 'var(--text-primary)', label: 'Alto' };
    return { bg: 'var(--accent-orange)', text: 'var(--background)', label: 'Moderado' };
  };

  const getInsightIcon = (type) => {
    if (type === 'warning') return <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />;
    if (type === 'success') return <Award className="w-5 h-5" style={{ color: 'var(--success)' }} />;
    return <Brain className="w-5 h-5" style={{ color: 'var(--info)' }} />;
  };

  if (loading) {
    return <div className="p-8">Carregando analytics...</div>;
  }

  if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user?.user_type)) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Esta página é acessível apenas para administradores, coordenadores pedagógicos e instrutores.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Analytics & Inteligência Decisória
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Dashboard preditivo baseado em CAIO TSI v5.0
            </p>
          </div>
          <Badge className="border-0" style={{ backgroundColor: 'var(--info)', color: 'var(--background)' }}>
            IDC + IA-CV Ativo
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {students.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total de Alunos</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8" style={{ color: 'var(--error)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--error)' }}>
                {atRiskStudents.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Em Risco de Evasão</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {courses.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cursos Ativos</p>
            </CardContent>
          </Card>

          <Card className="card-innova border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8" style={{ color: 'var(--info)' }} />
              </div>
              <p className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                {insights.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Insights Gerados</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="risks" className="w-full">
          <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: 'var(--background)' }}>
            <TabsTrigger value="risks">
              <TrendingDown className="w-4 h-4 mr-2" />
              Alunos em Risco
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="w-4 h-4 mr-2" />
              Insights Estratégicos
            </TabsTrigger>
            <TabsTrigger value="vark">
              <Target className="w-4 h-4 mr-2" />
              Análise VARK
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risks" className="mt-6">
            <Card className="card-innova border-none">
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <CardTitle className="font-heading flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
                  Alunos em Risco de Evasão (Análise Preditiva)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {atRiskStudents.length > 0 ? (
                  <div className="space-y-4">
                    {atRiskStudents.map((risk, idx) => {
                      const riskColor = getRiskColor(risk.riskScore);
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border-2"
                          style={{ 
                            borderColor: riskColor.bg,
                            backgroundColor: `${riskColor.bg}10`
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                {risk.student.full_name || risk.student.email}
                              </h4>
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {risk.student.email}
                              </p>
                            </div>
                            <Badge 
                              className="border-0"
                              style={{ 
                                backgroundColor: riskColor.bg,
                                color: riskColor.text
                              }}
                            >
                              Risco {riskColor.label}: {risk.riskScore}/100
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Progresso Médio
                              </p>
                              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {Math.round(risk.avgProgress)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Tarefas Atrasadas
                              </p>
                              <p className="text-xl font-bold" style={{ color: 'var(--error)' }}>
                                {risk.lateAssignments}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                                Taxa de Conclusão
                              </p>
                              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {Math.round(risk.completionRate)}%
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              Fatores de Risco:
                            </p>
                            <ul className="space-y-1">
                              {risk.factors.map((factor, i) => (
                                <li 
                                  key={i} 
                                  className="text-sm flex items-start gap-2"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: riskColor.bg }} />
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--neutral-medium)' }}>
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                              Ações Recomendadas (CAIO):
                            </p>
                            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                              <li>• Agendar mentoria individual urgente</li>
                              <li>• Enviar recursos personalizados por VARK</li>
                              <li>• Notificar responsáveis sobre situação</li>
                              <li>• Revisar adaptação do conteúdo ao perfil do aluno</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--success)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--success)' }}>
                      Nenhum aluno em risco detectado!
                    </p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      Todos os alunos estão com bom engajamento e progresso adequado.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <Card key={idx} className="card-innova border-none">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                          {insight.title}
                        </h3>
                        <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {insight.description}
                        </p>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                            Ação Recomendada:
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {insight.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vark" className="mt-6">
            <Card className="card-innova border-none">
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <CardTitle className="font-heading">Distribuição VARK dos Alunos</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {insights.find(i => i.title === 'Perfil VARK Predominante') ? (
                  <div className="space-y-6">
                    {Object.entries(insights.find(i => i.title === 'Perfil VARK Predominante').data).map(([style, count]) => {
                      const total = students.length;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      
                      const styleLabels = {
                        visual: { name: 'Visual', color: 'var(--info)' },
                        auditory: { name: 'Auditivo', color: 'var(--success)' },
                        read_write: { name: 'Leitura/Escrita', color: 'var(--warning)' },
                        kinesthetic: { name: 'Cinestésico', color: 'var(--accent-orange)' },
                        multimodal: { name: 'Multimodal', color: 'var(--primary-teal)' }
                      };

                      const styleInfo = styleLabels[style];
                      
                      return (
                        <div key={style}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {styleInfo.name}
                            </span>
                            <span className="font-bold" style={{ color: styleInfo.color }}>
                              {count} alunos ({percentage}%)
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-3"
                            style={{ '--progress-color': styleInfo.color }}
                          />
                        </div>
                      );
                    })}

                    <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Recomendações Baseadas em VARK (CAIO):
                      </h4>
                      <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Produzir mais recursos visuais (infográficos, vídeos) para alunos Visuais</li>
                        <li>• Criar podcasts e discussões para alunos Auditivos</li>
                        <li>• Disponibilizar textos e resumos para alunos Leitura/Escrita</li>
                        <li>• Desenvolver simulações e labs práticos para alunos Cinestésicos</li>
                        <li>• Garantir mix de formatos em cada aula para alunos Multimodais</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Dados insuficientes para análise VARK
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="card-innova border-none" style={{ borderLeft: `4px solid var(--primary-teal)` }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 mt-1" style={{ color: 'var(--primary-teal)' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Sobre este Dashboard (CAIO TSI v5.0)
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Este painel implementa os módulos <strong>IDC (Inteligência Decisória Contextual)</strong> e 
                  <strong> IA-CV (Contextual AI Validation)</strong> do framework CAIO. A análise preditiva 
                  utiliza múltiplos fatores para identificar alunos em risco antes da evasão acontecer.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Score de Risco</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Algoritmo multi-fator</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Insights</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerados por IA</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>VARK</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Personalização</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ações</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Recomendadas</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}