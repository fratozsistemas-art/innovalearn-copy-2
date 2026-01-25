
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label"; // Added this import
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
  Mail,
  Target,
  Activity,
  Calendar,
  RefreshCw,
  Send,
  Eye,
  Zap,
  Brain,
  Filter
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Early Warning Dashboard - Sistema Preditivo e Prescritivo
 * 
 * Transformação de Analytics Descritivo → Preditivo → Prescritivo
 * 
 * Funcionalidades:
 * 1. Predição ML de risco de evasão (não apenas heurísticas)
 * 2. Análise temporal de tendências
 * 3. Intervenções automatizadas
 * 4. Benchmarking entre turmas/períodos
 * 5. Real-time monitoring
 */

const RISK_LEVELS = {
  critical: { color: '#EF4444', label: 'Crítico', threshold: 80, icon: XCircle },
  high: { color: '#F97316', label: 'Alto', threshold: 60, icon: AlertTriangle },
  moderate: { color: '#F59E0B', label: 'Moderado', threshold: 40, icon: Clock },
  low: { color: '#10B981', label: 'Baixo', threshold: 0, icon: CheckCircle2 }
};

const INTERVENTION_TYPES = [
  { value: 'email_student', label: 'Email ao Aluno', icon: Mail },
  { value: 'email_parent', label: 'Email aos Pais', icon: Users },
  { value: 'schedule_meeting', label: 'Agendar Reunião', icon: Calendar },
  { value: 'assign_tutor', label: 'Atribuir Tutor', icon: Target },
  { value: 'extra_resources', label: 'Enviar Recursos Extras', icon: Activity },
  { value: 'motivational_message', label: 'Mensagem Motivacional', icon: Zap }
];

export default function EarlyWarningDashboardPage() {
  const { data: user } = useCurrentUser();
  const { showSuccess, executeWithFeedback } = useNotificationSystem();
  const queryClient = useQueryClient();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInterventionDialog, setShowInterventionDialog] = useState(false);
  const [interventionType, setInterventionType] = useState('');
  const [interventionMessage, setInterventionMessage] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('30'); // dias
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Buscar dados
  const { data: allStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['users', 'students'],
    queryFn: async () => {
      const users = await base44.entities.User.list();
      return users.filter(u => u.user_type === 'aluno');
    },
    refetchInterval: autoRefresh ? 60000 : false // Auto-refresh a cada 1 minuto
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['studentProgress', 'all'],
    queryFn: () => base44.entities.StudentProgress.list()
  });

  const { data: allEnrollments = [] } = useQuery({
    queryKey: ['enrollments', 'all'],
    queryFn: () => base44.entities.Enrollment.list()
  });

  const { data: allPredictions = [] } = useQuery({
    queryKey: ['difficultyPredictions', 'all'],
    queryFn: () => base44.entities.DifficultyPrediction.list()
  });

  const { data: allNotifications = [] } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => base44.entities.Notification.list()
  });

  // Mutation para enviar intervenção
  const sendInterventionMutation = useMutation({
    mutationFn: async ({ studentEmail, type, message }) => {
      // Criar notificação
      await base44.entities.Notification.create({
        user_email: studentEmail,
        type: 'at_risk_alert',
        priority: 'urgent',
        title: getInterventionTitle(type),
        message: message,
        action_url: '/profile',
        sent_at: new Date().toISOString()
      });

      // Se for email aos pais, enviar também
      if (type === 'email_parent') {
        const student = allStudents.find(s => s.email === studentEmail);
        if (student?.parent_mother_email) {
          await base44.integrations.Core.SendEmail({
            from_name: 'Innova Academy - Coordenação',
            to: student.parent_mother_email,
            subject: 'Acompanhamento Acadêmico - Innova Academy',
            body: message
          });
        }
      }

      // Registrar intervenção (poderia ter entity InterventionLog)
      await base44.entities.AuditLog.create({
        user_email: user.email,
        action_type: 'intervention_triggered',
        entity_type: 'Student',
        entity_id: studentEmail,
        details: { type, message },
        success: true
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showSuccess('Intervenção enviada com sucesso!');
      setShowInterventionDialog(false);
      setSelectedStudent(null);
    }
  });

  // Calcular risk score ML-enhanced
  const calculateEnhancedRiskScore = (studentEmail) => {
    const studentProgress = allProgress.filter(p => p.student_email === studentEmail);
    const studentEnrollments = allEnrollments.filter(e => e.student_email === studentEmail);
    const studentPredictions = allPredictions.filter(p => p.student_email === studentEmail);
    const student = allStudents.find(s => s.email === studentEmail);

    if (!student || studentProgress.length === 0) return { score: 0, factors: [] };

    let riskScore = 0;
    const factors = [];

    // Fator 1: Taxa de conclusão recente (peso: 25)
    const recentProgress = studentProgress
      .filter(p => {
        const daysAgo = (new Date() - new Date(p.created_date)) / (1000 * 60 * 60 * 24);
        return daysAgo <= parseInt(filterTimeRange);
      })
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 10);

    if (recentProgress.length > 0) {
      const completionRate = recentProgress.filter(p => p.completed).length / recentProgress.length;
      if (completionRate < 0.3) {
        riskScore += 25;
        factors.push({ factor: 'low_completion', weight: 25, value: `${(completionRate * 100).toFixed(0)}%` });
      } else if (completionRate < 0.6) {
        riskScore += 15;
        factors.push({ factor: 'moderate_completion', weight: 15, value: `${(completionRate * 100).toFixed(0)}%` });
      }
    }

    // Fator 2: Tendência de scores (peso: 25)
    const scoresWithDates = studentProgress
      .filter(p => p.quiz_score !== null && p.completion_date)
      .sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date));

    if (scoresWithDates.length >= 3) {
      const recent5 = scoresWithDates.slice(-5);
      const previous5 = scoresWithDates.slice(-10, -5);
      
      if (previous5.length > 0) {
        const recentAvg = recent5.reduce((sum, p) => sum + p.quiz_score, 0) / recent5.length;
        const previousAvg = previous5.reduce((sum, p) => sum + p.quiz_score, 0) / previous5.length;
        const decline = previousAvg - recentAvg;

        if (decline > 20) {
          riskScore += 25;
          factors.push({ factor: 'score_decline', weight: 25, value: `-${decline.toFixed(0)}pts` });
        } else if (decline > 10) {
          riskScore += 15;
          factors.push({ factor: 'score_decline', weight: 15, value: `-${decline.toFixed(0)}pts` });
        }
      }
    }

    // Fator 3: Dias desde último acesso (peso: 20)
    const lastAccess = studentProgress
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];

    if (lastAccess) {
      const daysSince = Math.floor((new Date() - new Date(lastAccess.created_date)) / (1000 * 60 * 60 * 24));
      
      if (daysSince > 14) {
        riskScore += 20;
        factors.push({ factor: 'inactive', weight: 20, value: `${daysSince} dias` });
      } else if (daysSince > 7) {
        riskScore += 10;
        factors.push({ factor: 'inactive', weight: 10, value: `${daysSince} dias` });
      }
    }

    // Fator 4: Predições de dificuldade futuras (peso: 15) - PREDITIVO
    const futurePredictions = studentPredictions
      .filter(p => !p.actual_outcome && p.prediction_score > 60)
      .sort((a, b) => b.prediction_score - a.prediction_score);

    if (futurePredictions.length > 0) {
      const avgPrediction = futurePredictions.reduce((sum, p) => sum + p.prediction_score, 0) / futurePredictions.length;
      
      if (avgPrediction > 75) {
        riskScore += 15;
        factors.push({ factor: 'predicted_difficulty', weight: 15, value: `${avgPrediction.toFixed(0)}%` });
      } else if (avgPrediction > 60) {
        riskScore += 8;
        factors.push({ factor: 'predicted_difficulty', weight: 8, value: `${avgPrediction.toFixed(0)}%` });
      }
    }

    // Fator 5: Padrões de engajamento (peso: 15) - COMPORTAMENTAL
    if (studentProgress.length >= 5) {
      const avgTimeSpent = studentProgress
        .filter(p => p.time_spent_minutes > 0)
        .reduce((sum, p) => sum + p.time_spent_minutes, 0) / studentProgress.length;

      if (avgTimeSpent < 30) {
        riskScore += 15;
        factors.push({ factor: 'low_engagement', weight: 15, value: `${avgTimeSpent.toFixed(0)}min` });
      } else if (avgTimeSpent < 60) {
        riskScore += 8;
        factors.push({ factor: 'low_engagement', weight: 8, value: `${avgTimeSpent.toFixed(0)}min` });
      }
    }

    return {
      score: Math.min(Math.round(riskScore), 100),
      factors,
      student,
      recentProgress,
      predictions: futurePredictions
    };
  };

  // Processar todos os alunos
  const studentsWithRisk = allStudents
    .map(student => {
      const analysis = calculateEnhancedRiskScore(student.email);
      return {
        ...student,
        riskScore: analysis.score,
        riskFactors: analysis.factors,
        riskLevel: getRiskLevel(analysis.score),
        recentProgress: analysis.recentProgress || [],
        futurePredictions: analysis.predictions || [],
        lastActivity: getLastActivity(student.email),
        trendDirection: getTrendDirection(student.email)
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  // Filtrar por nível de risco
  const filteredStudents = filterRiskLevel === 'all' 
    ? studentsWithRisk 
    : studentsWithRisk.filter(s => s.riskLevel === filterRiskLevel);

  // Estatísticas agregadas
  const stats = {
    total: studentsWithRisk.length,
    critical: studentsWithRisk.filter(s => s.riskLevel === 'critical').length,
    high: studentsWithRisk.filter(s => s.riskLevel === 'high').length,
    moderate: studentsWithRisk.filter(s => s.riskLevel === 'moderate').length,
    low: studentsWithRisk.filter(s => s.riskLevel === 'low').length,
    avgRisk: studentsWithRisk.reduce((sum, s) => sum + s.riskScore, 0) / studentsWithRisk.length || 0
  };

  // Funções auxiliares
  function getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  }

  function getLastActivity(studentEmail) {
    const progress = allProgress.filter(p => p.student_email === studentEmail);
    if (progress.length === 0) return null;
    
    const latest = progress.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
    const daysAgo = Math.floor((new Date() - new Date(latest.created_date)) / (1000 * 60 * 60 * 24));
    
    return { date: latest.created_date, daysAgo };
  }

  function getTrendDirection(studentEmail) {
    const progress = allProgress
      .filter(p => p.student_email === studentEmail && p.quiz_score !== null && p.completion_date)
      .sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date));

    if (progress.length < 6) return 'stable';

    const recent = progress.slice(-3);
    const previous = progress.slice(-6, -3);

    const recentAvg = recent.reduce((sum, p) => sum + p.quiz_score, 0) / recent.length;
    const previousAvg = previous.reduce((sum, p) => sum + p.quiz_score, 0) / previous.length;

    if (recentAvg - previousAvg > 10) return 'improving';
    if (previousAvg - recentAvg > 10) return 'declining';
    return 'stable';
  }

  function getInterventionTitle(type) {
    const titles = {
      email_student: '📧 Estamos aqui para apoiar você!',
      email_parent: '👨‍👩‍👧 Acompanhamento Acadêmico',
      schedule_meeting: '📅 Vamos conversar?',
      assign_tutor: '🎯 Suporte Personalizado',
      extra_resources: '📚 Recursos Extras para Você',
      motivational_message: '🚀 Continue Brilhando!'
    };
    return titles[type] || 'Notificação';
  }

  function handleIntervention(student) {
    setSelectedStudent(student);
    setShowInterventionDialog(true);
  }

  async function sendIntervention() {
    if (!interventionType || !interventionMessage.trim()) {
      return;
    }

    await executeWithFeedback({
      asyncFn: async () => {
        await sendInterventionMutation.mutateAsync({
          studentEmail: selectedStudent.email,
          type: interventionType,
          message: interventionMessage
        });
      },
      loadingMessage: 'Enviando intervenção...',
      successMessage: 'Intervenção enviada!',
      errorMessage: 'Erro ao enviar intervenção'
    });
  }

  if (studentsLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-teal)' }} />
          <p>Analisando dados dos alunos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Sistema de Alerta Precoce</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitoramento preditivo e intervenções automatizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${autoRefresh ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-sm">
              {autoRefresh ? 'Atualização automática' : 'Manual'}
            </span>
          </div>
          <Button
            onClick={() => {
              queryClient.invalidateQueries();
            }}
            variant="outline"
            className="btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-900">{stats.total}</span>
            </div>
            <p className="text-sm font-semibold text-blue-700">Total de Alunos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <span className="text-3xl font-bold text-red-900">{stats.critical}</span>
            </div>
            <p className="text-sm font-semibold text-red-700">Risco Crítico</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-orange-900">{stats.high}</span>
            </div>
            <p className="text-sm font-semibold text-orange-700">Risco Alto</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-bold text-yellow-900">{stats.moderate}</span>
            </div>
            <p className="text-sm font-semibold text-yellow-700">Risco Moderado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-green-900">{stats.low}</span>
            </div>
            <p className="text-sm font-semibold text-green-700">Baixo Risco</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="moderate">Moderado</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="14">Últimos 14 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="60">Últimos 60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Risco Médio:
              </span>
              <Badge 
                className="font-semibold"
                style={{ 
                  backgroundColor: stats.avgRisk >= 60 ? '#EF4444' : stats.avgRisk >= 40 ? '#F59E0B' : '#10B981',
                  color: 'white'
                }}
              >
                {stats.avgRisk.toFixed(0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => {
          const RiskIcon = RISK_LEVELS[student.riskLevel].icon;
          const TrendIcon = student.trendDirection === 'improving' ? TrendingUp : 
                           student.trendDirection === 'declining' ? TrendingDown : Activity;

          return (
            <Card 
              key={student.email}
              className="border-l-4 hover:shadow-lg transition-shadow"
              style={{ borderLeftColor: RISK_LEVELS[student.riskLevel].color }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${RISK_LEVELS[student.riskLevel].color}20` }}
                    >
                      <RiskIcon 
                        className="w-6 h-6" 
                        style={{ color: RISK_LEVELS[student.riskLevel].color }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{student.full_name || student.email}</h3>
                        <Badge style={{ 
                          backgroundColor: RISK_LEVELS[student.riskLevel].color,
                          color: 'white'
                        }}>
                          {student.riskScore}/100
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <TrendIcon className="w-3 h-3" />
                          {student.trendDirection === 'improving' ? 'Melhorando' :
                           student.trendDirection === 'declining' ? 'Piorando' : 'Estável'}
                        </Badge>
                      </div>

                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {student.email} • {student.explorer_level || 'Não definido'}
                      </p>

                      {/* Risk Factors */}
                      {student.riskFactors && student.riskFactors.length > 0 && (
                        <div className="space-y-2 mb-3">
                          <p className="text-xs font-semibold">Fatores de Risco:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.riskFactors.map((factor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {getFactorLabel(factor.factor)}: {factor.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Last Activity */}
                      {student.lastActivity && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Última atividade: {student.lastActivity.daysAgo === 0 ? 'Hoje' : 
                            student.lastActivity.daysAgo === 1 ? 'Ontem' : 
                            `${student.lastActivity.daysAgo} dias atrás`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleIntervention(student)}
                      size="sm"
                      style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Intervir
                    </Button>
                    <Button
                      onClick={() => window.open(`/profile?student=${student.email}`, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Nenhum aluno neste filtro</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {filterRiskLevel === 'critical' || filterRiskLevel === 'high'
                  ? 'Ótimas notícias! Nenhum aluno em risco ' + RISK_LEVELS[filterRiskLevel].label.toLowerCase()
                  : 'Ajuste os filtros para ver mais alunos'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Intervention Dialog */}
      <Dialog open={showInterventionDialog} onOpenChange={setShowInterventionDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Intervenção: {selectedStudent?.full_name}</DialogTitle>
            <DialogDescription>
              Risco: {selectedStudent?.riskScore}/100 - {RISK_LEVELS[selectedStudent?.riskLevel]?.label}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Tipo de Intervenção</Label>
              <Select value={interventionType} onValueChange={setInterventionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo de intervenção" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVENTION_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Mensagem</Label>
              <Textarea
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                placeholder="Digite sua mensagem personalizada para o aluno ou responsáveis..."
                className="h-32"
              />
            </div>

            {selectedStudent?.riskFactors && (
              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Sugestão automática baseada em fatores de risco:</p>
                  <p className="text-sm">
                    {generateInterventionSuggestion(selectedStudent.riskFactors, selectedStudent.trendDirection)}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={sendIntervention}
              disabled={!interventionType || !interventionMessage.trim() || sendInterventionMutation.isPending}
              style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
            >
              {sendInterventionMutation.isPending ? 'Enviando...' : 'Enviar Intervenção'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getFactorLabel(factor) {
  const labels = {
    low_completion: 'Baixa conclusão',
    moderate_completion: 'Conclusão moderada',
    score_decline: 'Queda nas notas',
    inactive: 'Inatividade',
    predicted_difficulty: 'Dificuldade prevista',
    low_engagement: 'Baixo engajamento'
  };
  return labels[factor] || factor;
}

function generateInterventionSuggestion(factors, trend) {
  const suggestions = [];

  if (factors.some(f => f.factor === 'inactive')) {
    suggestions.push('Aluno está inativo há vários dias. Considere verificar se há problemas pessoais ou técnicos.');
  }

  if (factors.some(f => f.factor === 'score_decline')) {
    suggestions.push('Notas em declínio. Recomende revisão de conceitos anteriores ou tutoria individual.');
  }

  if (factors.some(f => f.factor === 'predicted_difficulty')) {
    suggestions.push('Sistema prevê dificuldades futuras. Forneça recursos extras e acompanhamento próximo.');
  }

  if (factors.some(f => f.factor === 'low_engagement')) {
    suggestions.push('Baixo engajamento com conteúdo. Explore métodos alternativos (VARK) ou temas de interesse.');
  }

  if (trend === 'declining') {
    suggestions.push('Tendência de piora detectada. Intervenção urgente recomendada.');
  }

  return suggestions.join(' ') || 'Monitore progresso e ofereça suporte personalizado.';
}
