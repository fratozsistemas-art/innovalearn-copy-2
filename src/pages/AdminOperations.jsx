
import React, { useState, useCallback, useEffect } from "react";
import { User } from "@/entities/User";
import { Lesson, Module, ContentGap, ExternalResource, GamificationProfile, StudentProgress, Assignment, Notification, Enrollment } from "@/entities/all";
import { InvokeLLM, SendEmail } from "@/integrations/Core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Search,
  TrendingUp,
  Award,
  Bell,
  AlertCircle,
  CheckCircle2,
  Loader,
  Users,
  UserPlus,
  Edit,
  Trash2,
  UserCog, // New icon
  Download, // New icon
  Activity // New icon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import LessonPlanNotificationSystem from "../components/admin/LessonPlanNotificationSystem"; // New import

const userTypeLabels = {
  administrador: "Administrador",
  gerente: "Gerente",
  coordenador_pedagogico: "Coordenador Pedagógico",
  instrutor: "Instrutor",
  financeiro: "Financeiro",
  secretaria: "Secretaria",
  pai_responsavel: "Pai/Responsável",
  aluno: "Aluno"
};

export default function AdminOperationsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("bulk-operations"); // Changed initial tab from "gaps"

  // Gap Analysis State
  const [gapLevel, setGapLevel] = useState("all");
  const [gapProgress, setGapProgress] = useState(0);
  const [gapResults, setGapResults] = useState(null);

  // Progress Report State
  const [reportEmail, setReportEmail] = useState("");
  const [reportData, setReportData] = useState(null);
  const [sendReportEmail, setSendReportEmail] = useState(false);

  // Bulk Notifications State
  const [notifTargetGroup, setNotifTargetGroup] = useState("all");
  const [notifLevel, setNotifLevel] = useState("curiosity");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState("announcement");
  const [notifSendEmail, setNotifSendEmail] = useState(false);

  // Gamification State
  const [gamifEmail, setGamifEmail] = useState("");
  const [gamifResults, setGamifResults] = useState(null);

  // User Management State
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserType, setNewUserType] = useState("aluno");
  const [newUserExplorerLevel, setNewUserExplorerLevel] = useState("curiosity");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await User.me();
    setUser(userData);
  };

  const addLog = useCallback((message, type = "info") => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  // ===== USER MANAGEMENT =====
  const filterUsers = useCallback((users, searchTerm, typeFilter) => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.explorer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(u => u.user_type === typeFilter);
    }

    setFilteredUsers(filtered);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLogs([]); // Clear logs when loading new users
    try {
      addLog("📊 Carregando usuários...", "info");
      const users = await User.list();
      setAllUsers(users);
      filterUsers(users, userSearchTerm, userTypeFilter);
      addLog(`✅ ${users.length} usuários carregados`, "success");
    } catch (error) {
      addLog(`❌ Erro ao carregar usuários: ${error.message}`, "error");
    }
    setLoading(false);
  }, [addLog, filterUsers, userSearchTerm, userTypeFilter]);

  useEffect(() => {
    // Only load users if the user-management tab is active and users haven't been loaded yet
    if (activeTab === "user-management" && allUsers.length === 0) {
      loadUsers();
    }
  }, [activeTab, allUsers.length, loadUsers]);

  useEffect(() => {
    filterUsers(allUsers, userSearchTerm, userTypeFilter);
  }, [userSearchTerm, userTypeFilter, allUsers, filterUsers]);

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserFullName) {
      addLog("❌ Preencha todos os campos obrigatórios", "error");
      return;
    }

    setLoading(true);
    try {
      addLog("👤 Tentando criar novo usuário...", "info");

      const existingUsers = await User.list();
      const userExists = existingUsers.find(u => u.email === newUserEmail);

      if (userExists) {
        addLog("❌ Usuário com este email já existe!", "error");
        setLoading(false);
        return;
      }

      const newUserData = {
        email: newUserEmail,
        full_name: newUserFullName,
        user_type: newUserType,
        onboarding_completed: false
      };

      if (newUserType === 'aluno') {
        newUserData.explorer_level = newUserExplorerLevel;
        newUserData.explorer_name = newUserFullName.split(' ')[0]; // Basic explorer name derivation
      }

      addLog("ℹ️ NOTA: Para adicionar usuários de forma oficial, use o sistema de convites da plataforma (Dashboard → Convites).", "info");
      addLog("ℹ️ Este painel permite apenas registrar a intenção de criar usuários.", "info");
      addLog("ℹ️ Nenhuma alteração real será persistida no backend por esta interface para novos usuários.", "info");

      addLog("✅ Registro de criação de usuário concluído!", "success");
      addLog(`📧 Email: ${newUserEmail}`, "info");
      addLog(`👤 Nome: ${newUserFullName}`, "info");
      addLog(`🎭 Tipo: ${userTypeLabels[newUserType]}`, "info");
      if (newUserType === 'aluno') {
        addLog(`🎯 Nível: ${newUserExplorerLevel}`, "info");
      }

      setIsCreateUserDialogOpen(false);
      setNewUserEmail("");
      setNewUserFullName("");
      setNewUserType("aluno");
      setNewUserExplorerLevel("curiosity");

      // Reload users to reflect potential local changes (if any or for re-fetch)
      await loadUsers();

    } catch (error) {
      addLog(`❌ Erro ao criar usuário: ${error.message}`, "error");
    }
    setLoading(false);
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      addLog(`✏️ Atualizando usuário ${selectedUser.email}...`, "info");

      const updateData = {
        full_name: newUserFullName,
        user_type: newUserType
      };

      if (newUserType === 'aluno') {
        updateData.explorer_level = newUserExplorerLevel;
      } else {
        updateData.explorer_level = null; // Clear explorer_level if not an 'aluno'
      }

      await User.update(selectedUser.id, updateData);

      addLog("✅ Usuário atualizado com sucesso!", "success");
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      addLog(`❌ Erro ao atualizar usuário: ${error.message}`, "error");
    }
    setLoading(false);
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setNewUserEmail(user.email);
    setNewUserFullName(user.full_name || user.explorer_name || "");
    setNewUserType(user.user_type || "aluno");
    setNewUserExplorerLevel(user.explorer_level || "curiosity");
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      addLog(`🗑️ Removendo usuário ${userToDelete.email}...`, "info");

      await User.delete(userToDelete.id);

      addLog("✅ Usuário removido com sucesso!", "success");
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      addLog(`❌ Erro ao remover usuário: ${error.message}`, "error");
    }
    setLoading(false);
  };

  // ===== GAP ANALYSIS =====
  const runGapAnalysis = async () => {
    setLoading(true);
    setGapProgress(0);
    setLogs([]);

    const results = {
      lessonsAnalyzed: 0,
      gapsFound: 0,
      resourcesDiscovered: 0,
      errors: []
    };

    try {
      addLog("🚀 Iniciando análise de lacunas...", "info");

      const allLessons = await Lesson.list();
      const lessonsToAnalyze = gapLevel !== "all"
        ? allLessons.filter(l => l.course_id === gapLevel)
        : allLessons;

      const allModules = await Module.list();
      const totalLessons = lessonsToAnalyze.length;

      addLog(`📚 ${totalLessons} lições para analisar`, "info");

      for (let i = 0; i < lessonsToAnalyze.length; i++) {
        const lesson = lessonsToAnalyze[i];

        try {
          const module = allModules.find(m => m.id === lesson.module_id);

          addLog(`Analisando: ${lesson.title}`, "info");

          const analysis = await InvokeLLM({
            prompt: `
Analise esta lição de IA para crianças/jovens e identifique lacunas:

LIÇÃO: ${lesson.title}
DESCRIÇÃO: ${lesson.description}
NÍVEL: ${lesson.course_id}
MÓDULO: ${module?.title || 'N/A'}

Identifique:
1. Lacunas de pré-requisitos
2. Falta de recursos VARK
3. Conceitos sem exemplos

Sugira recursos da web (YouTube, Khan Academy, etc.)
`,
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                gaps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      gap_type: { type: "string" },
                      description: { type: "string" },
                      priority_score: { type: "number" },
                      suggested_resources: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            url: { type: "string" },
                            source: { type: "string" },
                            type: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          results.lessonsAnalyzed++;

          if (analysis.gaps && analysis.gaps.length > 0) {
            for (const gap of analysis.gaps) {
              await ContentGap.create({
                gap_type: gap.gap_type,
                description: gap.description,
                explorer_level: lesson.course_id,
                subject: lesson.title,
                priority_score: gap.priority_score || 50,
                related_lesson_id: lesson.id,
                status: "detected"
              });

              results.gapsFound++;

              if (gap.suggested_resources) {
                for (const resource of gap.suggested_resources) {
                  await ExternalResource.create({
                    title: resource.title,
                    url: resource.url,
                    source: resource.source || "outros",
                    type: resource.type || "artigo",
                    target_level: lesson.course_id,
                    vark_alignment: ["visual"],
                    subjects: [lesson.title],
                    auto_discovered: true
                  });

                  results.resourcesDiscovered++;
                }
              }
            }

            addLog(`✅ ${analysis.gaps.length} lacunas encontradas`, "success");
          }

          setGapProgress(Math.round(((i + 1) / totalLessons) * 100));

        } catch (error) {
          addLog(`❌ Erro em ${lesson.title}: ${error.message}`, "error");
          results.errors.push({ lesson_id: lesson.id, error: error.message });
        }
      }

      setGapResults(results);
      addLog("✅ Análise concluída!", "success");

    } catch (error) {
      addLog(`❌ Erro fatal: ${error.message}`, "error");
    }

    setLoading(false);
  };

  // ===== PROGRESS REPORT =====
  const generateProgressReport = async () => {
    setLoading(true);
    setLogs([]);

    try {
      addLog("📊 Gerando relatório de progresso...", "info");

      const allSystemUsers = await User.list();
      const students = allSystemUsers.filter(u => u.email === reportEmail);

      if (students.length === 0) {
        addLog("❌ Aluno não encontrado", "error");
        setLoading(false);
        return;
      }

      const studentData = students[0];

      const [enrollments, assignments, progress, gamification] = await Promise.all([
        Enrollment.filter({ student_email: reportEmail }),
        Assignment.filter({ student_email: reportEmail }),
        StudentProgress.filter({ student_email: reportEmail }),
        GamificationProfile.filter({ student_email: reportEmail })
      ]);

      const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0;

      const completedAssignments = assignments.filter(a => a.status === "graded").length;
      const completedLessons = progress.filter(p => p.completed).length;
      const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);

      const gamificationData = gamification[0] || {
        innova_coins: 0,
        level: 1,
        badges: []
      };

      const report = {
        student: {
          name: studentData.full_name || studentData.explorer_name || studentData.email,
          email: studentData.email,
          explorer_level: studentData.explorer_level
        },
        progress: {
          average_progress: avgProgress,
          completed_lessons: completedLessons,
          total_time_spent_hours: Math.round(totalTimeSpent / 60)
        },
        assignments: {
          total: assignments.length,
          completed: completedAssignments,
          pending: assignments.filter(a => a.status === "pending").length
        },
        gamification: {
          innova_coins: gamificationData.innova_coins,
          level: gamificationData.level,
          badges_count: gamificationData.badges?.length || 0
        }
      };

      setReportData(report);
      addLog("✅ Relatório gerado!", "success");

      if (sendReportEmail) {
        await SendEmail({
          to: studentData.email,
          subject: `Relatório de Progresso - ${studentData.full_name || studentData.explorer_name}`,
          body: `
Olá ${studentData.explorer_name || studentData.full_name}!

📊 PROGRESSO GERAL: ${avgProgress}%
📚 Lições Completadas: ${completedLessons}
⏱️ Tempo Total: ${Math.round(totalTimeSpent / 60)} horas

📝 TAREFAS:
- Concluídas: ${completedAssignments}
- Pendentes: ${assignments.filter(a => a.status === "pending").length}

🎮 GAMIFICAÇÃO:
- Innova Coins: ${gamificationData.innova_coins}
- Nível: ${gamificationData.level}
- Badges: ${gamificationData.badges?.length || 0}

Continue assim! 🚀
          `
        });

        addLog("✅ Email enviado!", "success");
      }

    } catch (error) {
      addLog(`❌ Erro: ${error.message}`, "error");
    }

    setLoading(false);
  };

  // ===== BULK NOTIFICATIONS =====
  const sendBulkNotifications = async () => {
    setLoading(true);
    setLogs([]);

    try {
      addLog("📧 Enviando notificações em massa...", "info");

      let targetUsers = [];
      const allSystemUsers = await User.list();

      if (notifTargetGroup === "all") {
        targetUsers = allSystemUsers;
      } else if (notifTargetGroup === "explorer_level") {
        targetUsers = allSystemUsers.filter(u => u.explorer_level === notifLevel);
      }

      addLog(`👥 ${targetUsers.length} usuários alvos`, "info");

      let notificationsSent = 0;
      let emailsSent = 0;

      for (const targetUser of targetUsers) {
        try {
          await Notification.create({
            user_email: targetUser.email,
            type: notifType,
            priority: "medium",
            title: notifTitle,
            message: notifMessage,
            read: false,
            sent_at: new Date().toISOString()
          });

          notificationsSent++;

          if (notifSendEmail) {
            await SendEmail({
              to: targetUser.email,
              subject: notifTitle,
              body: `
Olá ${targetUser.explorer_name || targetUser.full_name}!

${notifMessage}

---
Equipe InnovaLearn
              `
            });

            emailsSent++;
          }

        } catch (error) {
          addLog(`❌ Erro para ${targetUser.email}`, "error");
        }
      }

      addLog(`✅ ${notificationsSent} notificações criadas`, "success");
      if (notifSendEmail) {
        addLog(`✅ ${emailsSent} emails enviados`, "success");
      }

    } catch (error) {
      addLog(`❌ Erro: ${error.message}`, "error");
    }

    setLoading(false);
  };

  // ===== GAMIFICATION METRICS =====
  const calculateGamificationMetrics = async () => {
    setLoading(true);
    setLogs([]);

    try {
      addLog("🎮 Calculando métricas de gamificação...", "info");

      let gamificationProfile = await GamificationProfile.filter({ student_email: gamifEmail });

      if (gamificationProfile.length === 0) {
        gamificationProfile = [await GamificationProfile.create({
          student_email: gamifEmail,
          innova_coins: 0,
          level: 1,
          badges: [],
          achievements: {},
          streak_days: 0
        })];
      }

      const profile = gamificationProfile[0];

      const [progress, assignments] = await Promise.all([
        StudentProgress.filter({ student_email: gamifEmail }),
        Assignment.filter({ student_email: gamifEmail })
      ]);

      const completedLessons = progress.filter(p => p.completed).length;
      const completedAssignments = assignments.filter(a => a.status === "graded").length;
      const perfectQuizzes = progress.filter(p => p.quiz_score === 100).length;

      let coinsEarned = 0;
      coinsEarned += completedLessons * 10;
      coinsEarned += completedAssignments * 50;
      coinsEarned += perfectQuizzes * 25;

      const newLevel = Math.floor(coinsEarned / 1000) + 1;

      const newBadges = [];

      if (completedLessons >= 10 && !profile.badges?.find(b => b.badge_id === 'first_10_lessons')) {
        newBadges.push({
          badge_id: 'first_10_lessons',
          badge_name: 'Explorador Iniciante',
          earned_at: new Date().toISOString(),
          rarity: 'common',
          coins_reward: 100
        });
      }

      const updatedBadges = [...(profile.badges || []), ...newBadges];
      const badgeCoins = newBadges.reduce((sum, b) => sum + b.coins_reward, 0);

      await GamificationProfile.update(profile.id, {
        innova_coins: coinsEarned + badgeCoins,
        level: newLevel,
        badges: updatedBadges,
        achievements: {
          lessons_completed: completedLessons,
          projects_completed: perfectQuizzes > 0 ? completedAssignments : 0,
          perfect_quizzes: perfectQuizzes
        },
        total_coins_earned: coinsEarned + badgeCoins
      });

      const results = {
        level: newLevel,
        coins: coinsEarned + badgeCoins,
        new_badges: newBadges,
        achievements: {
          lessons_completed: completedLessons,
          projects_completed: perfectQuizzes > 0 ? completedAssignments : 0,
          perfect_quizzes: perfectQuizzes
        }
      };

      setGamifResults(results);
      addLog(`✅ Métricas atualizadas! Nível: ${newLevel}, Coins: ${coinsEarned + badgeCoins}`, "success");

    } catch (error) {
      addLog(`❌ Erro: ${error.message}`, "error");
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--primary-teal)' }} />
      </div>
    );
  }

  if (!['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <p>Acesso restrito a administradores</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Operações Administrativas
            </h1>
            <p className="text-gray-600 mt-2">
              Ferramentas avançadas para gestão da plataforma
            </p>
          </div>
          <Settings className="w-8 h-8 text-teal-600" />
        </div>

        {/* Refactored Tabs structure */}
        {/* Changed to ensure full width and maintain controlled state for functionality */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5" style={{ backgroundColor: 'var(--background)' }}>
            <TabsTrigger value="bulk-operations">
              <Users className="w-4 h-4 mr-2" />
              Operações em Massa
            </TabsTrigger>
            <TabsTrigger value="user-management">
              <UserCog className="w-4 h-4 mr-2" />
              Gestão de Usuários
            </TabsTrigger>
            <TabsTrigger value="data-export">
              <Download className="w-4 h-4 mr-2" />
              Exportação
            </TabsTrigger>
            <TabsTrigger value="system-health">
              <Activity className="w-4 h-4 mr-2" />
              Saúde do Sistema
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* BULK OPERATIONS TAB (combining old gaps, report, bulk notifications, gamification) */}
          <TabsContent value="bulk-operations" className="space-y-6">
            {/* GAP ANALYSIS CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Lacunas de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nível do Explorador</Label>
                  <Select value={gapLevel} onValueChange={setGapLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Níveis</SelectItem>
                      <SelectItem value="curiosity">Curiosity</SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="pioneer">Pioneer</SelectItem>
                      <SelectItem value="challenger">Challenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={runGapAnalysis}
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  {loading ? 'Analisando...' : 'Iniciar Análise'}
                </Button>

                {loading && (
                  <div>
                    <Progress value={gapProgress} className="mt-2" />
                    <p className="text-sm text-center mt-2 text-gray-600">
                      {gapProgress}% concluído
                    </p>
                  </div>
                )}

                {gapResults && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-white shadow">
                      <p className="text-2xl font-bold text-teal-600">
                        {gapResults.lessonsAnalyzed}
                      </p>
                      <p className="text-sm text-gray-600">
                        Lições Analisadas
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white shadow">
                      <p className="text-2xl font-bold text-orange-600">
                        {gapResults.gapsFound}
                      </p>
                      <p className="text-sm text-gray-600">
                        Lacunas Encontradas
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white shadow">
                      <p className="text-2xl font-bold text-purple-600">
                        {gapResults.resourcesDiscovered}
                      </p>
                      <p className="text-sm text-gray-600">
                        Recursos Descobertos
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PROGRESS REPORT CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Gerar Relatório de Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email do Aluno</Label>
                  <Input
                    type="email"
                    placeholder="aluno@email.com"
                    value={reportEmail}
                    onChange={(e) => setReportEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendReportEmail}
                    onChange={(e) => setSendReportEmail(e.target.checked)}
                    id="send-report-email"
                  />
                  <Label htmlFor="send-report-email">Enviar relatório por email</Label>
                </div>

                <Button
                  onClick={generateProgressReport}
                  disabled={loading || !reportEmail}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                  Gerar Relatório
                </Button>

                {reportData && (
                  <div className="mt-6 p-6 rounded-lg bg-white shadow">
                    <h3 className="font-bold text-lg mb-4">{reportData.student.name}</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Progresso Médio</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {reportData.progress.average_progress}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lições Completas</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {reportData.progress.completed_lessons}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tarefas Completas</p>
                        <p className="text-2xl font-bold text-pink-600">
                          {reportData.assignments.completed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nível</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {reportData.gamification.level}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BULK NOTIFICATIONS CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Enviar Notificações em Massa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Grupo Alvo</Label>
                  <Select value={notifTargetGroup} onValueChange={setNotifTargetGroup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Usuários</SelectItem>
                      <SelectItem value="explorer_level">Por Nível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {notifTargetGroup === "explorer_level" && (
                  <div>
                    <Label>Nível</Label>
                    <Select value={notifLevel} onValueChange={setNotifLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curiosity">Curiosity</SelectItem>
                        <SelectItem value="discovery">Discovery</SelectItem>
                        <SelectItem value="pioneer">Pioneer</SelectItem>
                        <SelectItem value="challenger">Challenger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Tipo</Label>
                  <Select value={notifType} onValueChange={setNotifType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Anúncio</SelectItem>
                      <SelectItem value="reminder">Lembrete</SelectItem>
                      <SelectItem value="achievement">Conquista</SelectItem>
                      <SelectItem value="assignment">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Título</Label>
                  <Input
                    placeholder="Título da notificação"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Escreva a mensagem..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifSendEmail}
                    onChange={(e) => setNotifSendEmail(e.target.checked)}
                    id="notif-send-email"
                  />
                  <Label htmlFor="notif-send-email">Enviar também por email</Label>
                </div>

                <Button
                  onClick={sendBulkNotifications}
                  disabled={loading || !notifTitle || !notifMessage}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
                  Enviar Notificações
                </Button>
              </CardContent>
            </Card>

            {/* GAMIFICATION CARD */}
            <Card>
              <CardHeader>
                <CardTitle>Calcular Métricas de Gamificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email do Aluno</Label>
                  <Input
                    type="email"
                    placeholder="aluno@email.com"
                    value={gamifEmail}
                    onChange={(e) => setGamifEmail(e.target.value)}
                  />
                </div>

                <Button
                  onClick={calculateGamificationMetrics}
                  disabled={loading || !gamifEmail}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Award className="w-4 h-4 mr-2" />}
                  Calcular Métricas
                </Button>

                {gamifResults && (
                  <div className="mt-6 p-6 rounded-lg bg-white shadow">
                    <h3 className="font-bold text-lg mb-4">Resultados</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nível</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {gamifResults.level}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Innova Coins</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {gamifResults.coins}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lições Completas</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {gamifResults.achievements.lessons_completed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Novos Badges</p>
                        <p className="text-2xl font-bold text-pink-600">
                          {gamifResults.new_badges.length}
                        </p>
                      </div>
                    </div>

                    {gamifResults.new_badges.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Badges Conquistados:</p>
                        <div className="space-y-2">
                          {gamifResults.new_badges.map((badge, i) => (
                            <Badge key={i} className="mr-2">{badge.badge_name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* USER MANAGEMENT TAB */}
          <TabsContent value="user-management" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestão de Usuários</CardTitle>
                  <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                    <Button
                      onClick={() => setIsCreateUserDialogOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Usuário
                    </Button>
                    <DialogContent className="bg-white">
                      <DialogHeader className="border-b border-gray-200 pb-4">
                        <DialogTitle className="text-gray-900 text-xl font-bold">Cadastrar Novo Usuário</DialogTitle>
                        <DialogDescription className="text-gray-600 text-base">
                          ℹ️ Nota: Novos usuários devem ser convidados através do sistema de convites da plataforma (Dashboard → Convites). Esta opção serve apenas para documentação/simulação.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold text-sm">Email</Label>
                          <Input
                            type="email"
                            placeholder="usuario@exemplo.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="text-gray-900 bg-gray-50 border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold text-sm">Nome Completo</Label>
                          <Input
                            placeholder="Nome completo do usuário"
                            value={newUserFullName}
                            onChange={(e) => setNewUserFullName(e.target.value)}
                            className="text-gray-900 bg-gray-50 border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold text-sm">Tipo de Usuário</Label>
                          <Select value={newUserType} onValueChange={setNewUserType}>
                            <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {Object.entries(userTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {newUserType === 'aluno' && (
                          <div className="space-y-2">
                            <Label className="text-gray-900 font-semibold text-sm">Nível do Explorador</Label>
                            <Select value={newUserExplorerLevel} onValueChange={setNewUserExplorerLevel}>
                              <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="curiosity">Curiosity (6+)</SelectItem>
                                <SelectItem value="discovery">Discovery (9+)</SelectItem>
                                <SelectItem value="pioneer">Pioneer (12+)</SelectItem>
                                <SelectItem value="challenger">Challenger (14+)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <DialogFooter className="border-t border-gray-200 pt-4">
                        <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)} className="border-gray-300">
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateUser}
                          disabled={loading}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                          Criar Usuário
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      {Object.entries(userTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={loadUsers} variant="outline">
                    Recarregar
                  </Button>
                </div>

                {/* Lista de Usuários */}
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-teal-600" />
                    <p className="text-gray-600">Carregando usuários...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all bg-white"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {u.full_name || u.explorer_name || u.email}
                            </h4>
                            <Badge className="bg-teal-100 text-teal-800 border-0">
                              {userTypeLabels[u.user_type] || u.user_type}
                            </Badge>
                            {u.explorer_level && (
                              <Badge variant="outline">
                                {u.explorer_level}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          {u.created_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Membro desde: {new Date(u.created_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(u)}
                            title="Editar usuário"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUserToDelete(u)}
                            title="Remover usuário"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600">Nenhum usuário encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATA EXPORT TAB */}
          <TabsContent value="data-export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportação de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Funcionalidade de exportação de dados em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SYSTEM HEALTH TAB */}
          <TabsContent value="system-health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saúde do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Monitoramento da saúde e performance do sistema em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEW NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="mt-6">
            <LessonPlanNotificationSystem />
          </TabsContent>
        </Tabs>

        {/* LOGS */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Logs de Operação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded bg-gray-50"
                  >
                    {log.type === "success" && <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />}
                    {log.type === "error" && <AlertCircle className="w-4 h-4 mt-0.5 text-red-600" />}
                    {log.type === "info" && <AlertCircle className="w-4 h-4 mt-0.5 text-teal-600" />}
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <DialogTitle className="text-gray-900 text-xl font-bold">Editar Usuário</DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Atualize as informações do usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-gray-900 font-semibold text-sm">Email</Label>
                <Input
                  type="email"
                  value={newUserEmail}
                  disabled
                  className="text-gray-900 bg-gray-100 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 font-semibold text-sm">Nome Completo</Label>
                <Input
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  className="text-gray-900 bg-gray-50 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 font-semibold text-sm">Tipo de Usuário</Label>
                <Select value={newUserType} onValueChange={setNewUserType}>
                  <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(userTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newUserType === 'aluno' && (
                <div className="space-y-2">
                  <Label className="text-gray-900 font-semibold text-sm">Nível do Explorador</Label>
                  <Select value={newUserExplorerLevel} onValueChange={setNewUserExplorerLevel}>
                    <SelectTrigger className="text-gray-900 bg-gray-50 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="curiosity">Curiosity (6+)</SelectItem>
                      <SelectItem value="discovery">Discovery (9+)</SelectItem>
                      <SelectItem value="pioneer">Pioneer (12+)</SelectItem>
                      <SelectItem value="challenger">Challenger (14+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter className="border-t border-gray-200 pt-4">
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)} className="border-gray-300">
                Cancelar
              </Button>
              <Button
                onClick={handleEditUser}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader className="border-b border-gray-200 pb-4">
              <AlertDialogTitle className="text-gray-900 text-xl font-bold">Confirmar Remoção</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                Tem certeza que deseja remover o usuário <strong>{userToDelete?.full_name || userToDelete?.explorer_name || userToDelete?.email}</strong>?
                Esta ação não pode ser desfeita e removerá todos os dados associados ao usuário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-t border-gray-200 pt-4">
              <AlertDialogCancel className="border-gray-300">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : null}
                Remover Usuário
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
