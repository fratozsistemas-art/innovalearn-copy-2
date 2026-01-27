import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Award,
  Brain,
  Eye,
  BookOpen,
  BarChart3,
  Shield,
  Target,
  Sparkles,
  FileText,
  Clock,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Progress } from "@/components/ui/progress";

import AIReviewPanel from "@/components/teacher/AIReviewPanel";
import ClassOverviewCard from "@/components/teacher/ClassOverviewCard";
import VARKAnalyticsSummary from "@/components/teacher/VARKAnalyticsSummary";
import EarlyWarningList from "@/components/teacher/EarlyWarningList";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [classes, setClasses] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const isAdmin = ['administrador', 'coordenador_pedagogico'].includes(user.user_type);

      // Load classes
      let userClasses = [];
      if (isAdmin) {
        userClasses = await base44.entities.Class.list();
      } else if (user.user_type === 'instrutor') {
        // Get classes from user's assigned_classes array
        const assignedClassIds = user.assigned_classes?.filter(ac => ac.active).map(ac => ac.class_id) || [];
        if (assignedClassIds.length > 0) {
          const allClasses = await base44.entities.Class.list();
          userClasses = allClasses.filter(c => assignedClassIds.includes(c.id));
        }
      }
      setClasses(userClasses);

      // Load pending AI reviews
      const reviews = await base44.entities.AIRecommendationReview.filter({
        status: 'pending_review'
      }, '-created_date', 20);
      setPendingReviews(reviews);

      // Load teacher certifications
      const certs = await base44.entities.TeacherLessonCertification.filter({
        teacher_email: user.email,
        certified: true
      });
      setCertifications(certs);

      // Load assignments for teacher's classes
      const allAssignments = await base44.entities.Assignment.list('-due_date', 100);
      const relevantAssignments = allAssignments.filter(assignment => {
        // Filter assignments for classes this teacher manages
        return userClasses.some(c => assignment.course_id === c.course_level);
      });
      setAssignments(relevantAssignments);

      // Load student progress for overview
      if (allStudentEmails.length > 0) {
        const progressData = await base44.entities.StudentProgress.list('-updated_date', 50);
        const relevantProgress = progressData.filter(p => 
          allStudentEmails.includes(p.student_email)
        );
        setStudentProgress(relevantProgress);
      }

      // Load at-risk students from all classes
      const allStudents = await base44.entities.User.filter({ user_type: 'aluno' });
      const allStudentEmails = [];
      
      // Filter students enrolled in teacher's classes
      for (const student of allStudents) {
        const enrolledClasses = student.enrolled_classes || [];
        const hasMatchingClass = enrolledClasses.some(ec => 
          ec.status === 'active' && userClasses.some(uc => uc.id === ec.class_id)
        );
        if (hasMatchingClass) {
          allStudentEmails.push(student.email);
        }
      }

      if (allStudentEmails.length > 0) {
        const churnPredictions = await base44.entities.ChurnPrediction.filter({
          risk_level: { $in: ['high', 'critical'] }
        }, '-prediction_date', 10);
        
        const atRisk = churnPredictions.filter(cp => 
          allStudentEmails.includes(cp.student_email)
        );
        setAtRiskStudents(atRisk);
      }

      // Calculate stats
      const totalStudents = allStudentEmails.length;
      const activeClasses = userClasses.filter(c => c.status === 'active').length;
      const pendingAssignments = relevantAssignments.filter(a => a.status === 'pending').length;
      const submittedAssignments = relevantAssignments.filter(a => a.status === 'submitted').length;
      const gradedAssignments = relevantAssignments.filter(a => a.status === 'graded').length;

      setStats({
        totalClasses: userClasses.length,
        activeClasses,
        totalStudents,
        atRiskCount: atRiskStudents.length,
        pendingReviewsCount: reviews.length,
        certificationsCount: certs.length,
        avgClassSize: totalStudents > 0 && activeClasses > 0 ? Math.round(totalStudents / activeClasses) : 0,
        totalAssignments: relevantAssignments.length,
        pendingAssignments,
        submittedAssignments,
        gradedAssignments
      });

    } catch (error) {
      console.error('Error loading teacher dashboard:', error);
    }
    setLoading(false);
  };

  if (!user || !['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type)) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">Esta área é exclusiva para educadores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Dashboard do Educador
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Bem-vindo, {user.full_name} • {user.user_type === 'administrador' ? 'Administrador' : 
                user.user_type === 'coordenador_pedagogico' ? 'Coordenador Pedagógico' : 'Instrutor'}
            </p>
          </div>
          <Button 
            onClick={() => navigate(createPageUrl("TeacherCertificationDashboard"))}
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            <Award className="w-4 h-4 mr-2" />
            Minhas Certificações
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-all" 
            onClick={() => navigate(createPageUrl("ClassManagement"))}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
                <Badge style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  {stats.activeClasses} ativas
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalClasses}</div>
              <div className="text-sm text-gray-600">Turmas Totais</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(createPageUrl("ClassManagement"))}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <GraduationCap className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Alunos Ativos</div>
              <div className="text-xs text-gray-500 mt-1">
                Média: {stats.avgClassSize} por turma
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(createPageUrl("EarlyWarningDashboard"))}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <AlertTriangle className="w-8 h-8" style={{ color: 'var(--warning)' }} />
                {stats.atRiskCount > 0 && (
                  <Badge style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                    URGENTE
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--warning)' }}>
                {stats.atRiskCount}
              </div>
              <div className="text-sm text-gray-600">Alunos em Risco</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Brain className="w-8 h-8" style={{ color: 'var(--accent-orange)' }} />
                {stats.pendingReviewsCount > 0 && (
                  <Badge style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                    {stats.pendingReviewsCount}
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{stats.pendingReviewsCount}</div>
              <div className="text-sm text-gray-600">Revisões de IA Pendentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="student-progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="w-4 h-4 mr-2" />
              Tarefas
              {stats.submittedAssignments > 0 && (
                <Badge className="ml-2" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                  {stats.submittedAssignments}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai-review">
              <Brain className="w-4 h-4 mr-2" />
              IA
              {stats.pendingReviewsCount > 0 && (
                <Badge className="ml-2" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                  {stats.pendingReviewsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="classes">
              <Users className="w-4 h-4 mr-2" />
              Turmas
            </TabsTrigger>
            <TabsTrigger value="vark">
              <BarChart3 className="w-4 h-4 mr-2" />
              VARK
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alertas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                    Resumo de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Lições Certificadas</span>
                      <span className="font-semibold">{stats.certificationsCount}</span>
                    </div>
                    <Progress value={Math.min((stats.certificationsCount / 272) * 100, 100)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                        {stats.activeClasses}
                      </div>
                      <div className="text-xs text-gray-600">Turmas Ativas</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <div className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                        {stats.avgClassSize}
                      </div>
                      <div className="text-xs text-gray-600">Alunos/Turma</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(createPageUrl("ClassManagement"))}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Gerenciar Turmas
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(createPageUrl("TeacherTraining"))}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Capacitação Docente
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(createPageUrl("AssignmentGenerator"))}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerador de Tarefas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                    Alunos Necessitando Atenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EarlyWarningList 
                    atRiskStudents={atRiskStudents.slice(0, 5)} 
                    showViewAll={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Progress Tab */}
          <TabsContent value="student-progress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                  Progresso dos Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.slice(0, 10).map((progress, idx) => (
                    <div key={idx} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                          >
                            {progress.student_email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{progress.student_email}</p>
                            <p className="text-xs text-gray-600">
                              {progress.course_id} - {progress.lesson_id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {progress.completed ? (
                            <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completo
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              Em Progresso
                            </Badge>
                          )}
                        </div>
                      </div>
                      {progress.quiz_score && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Quiz Score</span>
                            <span className="font-semibold">{progress.quiz_score}%</span>
                          </div>
                          <Progress value={progress.quiz_score} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {studentProgress.length === 0 && (
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-gray-600">Nenhum progresso registrado ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-8 h-8" style={{ color: 'var(--warning)' }} />
                      <div>
                        <div className="text-3xl font-bold">{stats.pendingAssignments}</div>
                        <div className="text-sm text-gray-600">Pendentes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Send className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
                      <div>
                        <div className="text-3xl font-bold">{stats.submittedAssignments}</div>
                        <div className="text-sm text-gray-600">Para Corrigir</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--success)' }} />
                      <div>
                        <div className="text-3xl font-bold">{stats.gradedAssignments}</div>
                        <div className="text-sm text-gray-600">Corrigidas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                      Gerenciar Tarefas
                    </CardTitle>
                    <Button 
                      onClick={() => navigate(createPageUrl("AssignmentGenerator"))}
                      style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Criar Nova Tarefa
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.slice(0, 10).map((assignment) => (
                      <div key={assignment.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description?.substring(0, 100)}...</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>📚 {assignment.course_id}</span>
                              <span>📅 {new Date(assignment.due_date).toLocaleDateString('pt-BR')}</span>
                              <span>⭐ {assignment.points} pontos</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Badge className={
                              assignment.status === 'graded' ? 'bg-green-600 text-white' :
                              assignment.status === 'submitted' ? 'bg-blue-600 text-white' :
                              assignment.status === 'late' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }>
                              {assignment.status === 'graded' ? 'Corrigida' :
                               assignment.status === 'submitted' ? 'Enviada' :
                               assignment.status === 'late' ? 'Atrasada' :
                               'Pendente'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {assignments.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-gray-600 mb-4">Nenhuma tarefa criada ainda</p>
                        <Button 
                          onClick={() => navigate(createPageUrl("AssignmentGenerator"))}
                          style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Criar Primeira Tarefa
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Review Tab */}
          <TabsContent value="ai-review">
            <AIReviewPanel 
              pendingReviews={pendingReviews}
              onReviewComplete={loadDashboardData}
            />
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <ClassOverviewCard 
                  key={classItem.id}
                  classData={classItem}
                  onClick={() => navigate(createPageUrl("ClassroomAnalytics") + `?classId=${classItem.id}`)}
                />
              ))}
              
              {classes.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-gray-600">Nenhuma turma atribuída</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* VARK Analytics Tab */}
          <TabsContent value="vark">
            <VARKAnalyticsSummary classes={classes} />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
                  Sistema de Alerta Precoce
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EarlyWarningList 
                  atRiskStudents={atRiskStudents} 
                  showViewAll={false}
                  detailed={true}
                />
                
                {atRiskStudents.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <h3 className="text-xl font-bold mb-2">Tudo Certo!</h3>
                    <p className="text-gray-600">
                      Nenhum aluno em risco detectado no momento.
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(createPageUrl("EarlyWarningDashboard"))}
                  >
                    Ver Dashboard Completo de Alertas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" style={{ color: 'var(--success)' }} />
                    Minhas Certificações Docentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total de Lições Certificadas</span>
                      <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                        {stats.certificationsCount} / 272
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min((stats.certificationsCount / 272) * 100, 100)} 
                      className="h-3"
                    />
                    
                    <div className="pt-4 grid grid-cols-4 gap-2">
                      {Object.entries({
                        curiosity: { name: 'Curiosity', icon: '🌱', total: 64 },
                        discovery: { name: 'Discovery', icon: '🔍', total: 64 },
                        pioneer: { name: 'Pioneer', icon: '🚀', total: 64 },
                        challenger: { name: 'Challenger', icon: '👑', total: 80 }
                      }).map(([level, data]) => {
                        const levelCerts = certifications.filter(c => c.course_level === level).length;
                        return (
                          <div key={level} className="p-3 rounded-lg text-center" 
                            style={{ backgroundColor: 'var(--neutral-light)' }}
                          >
                            <div className="text-2xl mb-1">{data.icon}</div>
                            <div className="text-xs font-semibold">{levelCerts}/{data.total}</div>
                            <div className="text-xs text-gray-600">{data.name}</div>
                          </div>
                        );
                      })}
                    </div>

                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(createPageUrl("TeacherCertificationDashboard"))}
                      style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                    >
                      Ver Todas as Certificações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-lg border-l-4" 
                    style={{ backgroundColor: 'var(--neutral-light)', borderColor: 'var(--accent-orange)' }}
                  >
                    <h4 className="font-semibold mb-2">Capacitação Recomendada</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Continue sua certificação nas lições não completadas
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(createPageUrl("TeacherTraining"))}
                    >
                      Iniciar Capacitação
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border-l-4" 
                    style={{ backgroundColor: 'var(--neutral-light)', borderColor: 'var(--primary-teal)' }}
                  >
                    <h4 className="font-semibold mb-2">Revisar Sugestões de IA</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {stats.pendingReviewsCount} recomendações aguardando sua revisão
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => document.querySelector('[value="ai-review"]').click()}
                    >
                      Revisar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}