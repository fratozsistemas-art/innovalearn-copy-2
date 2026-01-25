import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Award, BookOpen, Target, TrendingUp, Brain, Shield } from "lucide-react";
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";

// USANDO REACT QUERY - hooks otimizados com cache
import { useCurrentUser, useUpdateMyUser } from "@/components/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedUserType, setEditedUserType] = useState("");
  
  const { showSuccess, showError, executeWithFeedback } = useNotificationSystem();

  // USANDO REACT QUERY - Com cache automático
  const { data: user, isLoading: userLoading } = useCurrentUser();
  
  // OTIMIZAÇÃO: Apenas carregar enrollments e assignments se for aluno
  const isStudent = user?.user_type === 'aluno';
  
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: async () => {
      try {
        return await base44.entities.Enrollment.filter({ student_email: user.email });
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on enrollments');
          return [];
        }
        console.error('Error fetching enrollments:', error);
        return [];
      }
    },
    enabled: !!user?.email && isStudent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    throwOnError: false
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', user?.email, 'profile'],
    queryFn: async () => {
      try {
        return await base44.entities.Assignment.filter({ 
          student_email: user.email 
        }, '-due_date', 20);
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on assignments');
          return [];
        }
        console.error('Error fetching assignments:', error);
        return [];
      }
    },
    enabled: !!user?.email && isStudent,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    throwOnError: false
  });

  const updateUserMutation = useUpdateMyUser();

  // Inicializar campos de edição quando user carregar
  React.useEffect(() => {
    if (user && !editedName) {
      setEditedName(user.full_name || "");
      setEditedUserType(user.user_type || "aluno");
    }
  }, [user, editedName]);

  const handleSave = async () => {
    await executeWithFeedback({
      asyncFn: async () => {
        await updateUserMutation.mutateAsync({ 
          full_name: editedName,
          user_type: editedUserType
        });
        setIsEditing(false);
      },
      loadingMessage: 'Salvando alterações...',
      successMessage: 'Perfil atualizado com sucesso!',
      errorMessage: 'Erro ao atualizar perfil'
    });
  };

  // Calcular estatísticas apenas se for aluno
  const stats = React.useMemo(() => {
    if (!isStudent) {
      return {
        totalCourses: 0,
        completedAssignments: 0,
        averageProgress: 0,
        totalPoints: 0
      };
    }

    const completedAssignments = assignments.filter(a => a.status === "graded").length;
    const averageProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
      : 0;
    const totalPoints = assignments
      .filter(a => a.grade)
      .reduce((sum, a) => sum + a.grade, 0);

    return {
      totalCourses: enrollments.length,
      completedAssignments,
      averageProgress,
      totalPoints
    };
  }, [enrollments, assignments, isStudent]);

  // Overall loading state
  const isLoading = userLoading || (isStudent && (enrollmentsLoading || assignmentsLoading));

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-orange-600" />
              <h3 className="text-xl font-bold mb-2">Erro ao Carregar Perfil</h3>
              <p className="text-gray-600">Não foi possível carregar suas informações.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getVARKStyleName = (style) => {
    const styles = {
      visual: "Visual",
      auditory: "Auditivo",
      read_write: "Leitura/Escrita",
      kinesthetic: "Cinestésico",
      multimodal: "Multimodal"
    };
    return styles[style] || style;
  };

  const varkData = [
    { label: "Visual", value: user.vark_visual || 0, color: "var(--info)" },
    { label: "Auditivo", value: user.vark_auditory || 0, color: "var(--success)" },
    { label: "Leitura/Escrita", value: user.vark_read_write || 0, color: "var(--warning)" },
    { label: "Cinestésico", value: user.vark_kinesthetic || 0, color: "var(--accent-orange)" }
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações e acompanhe seu desempenho</p>
        </div>

        <Card className="shadow-xl border-none overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-900 via-cyan-700 to-purple-700" />
          <CardContent className="relative pt-0 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 px-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <AvatarFallback className="text-4xl font-bold text-white">
                  {(user.explorer_name || user.full_name)?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm mb-1 block">Nome Completo</Label>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-xl font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Tipo de Usuário</Label>
                      <Select value={editedUserType} onValueChange={setEditedUserType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(userTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" disabled={updateUserMutation.isPending}>
                        {updateUserMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.explorer_name || user.full_name}
                    </h2>
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                      <Badge className="bg-gradient-to-r from-blue-900 to-cyan-700 text-white border-0 px-3 py-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {userTypeLabels[user.user_type] || "Aluno"}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                    >
                      Editar Perfil
                    </Button>
                  </>
                )}
              </div>

              <Badge className="bg-gradient-to-r from-blue-900 to-cyan-700 text-white border-0 px-4 py-2">
                {user.role === "admin" ? "Administrador" : "Explorador"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats apenas para alunos */}
        {isStudent && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="w-8 h-8 text-blue-900" />
                </div>
                <p className="text-3xl font-bold text-blue-900 mb-1">{stats.totalCourses}</p>
                <p className="text-sm text-gray-600">Cursos Ativos</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-8 h-8 text-green-900" />
                </div>
                <p className="text-3xl font-bold text-green-900 mb-1">{stats.completedAssignments}</p>
                <p className="text-sm text-gray-600">Tarefas Concluídas</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Target className="w-8 h-8 text-purple-900" />
                </div>
                <p className="text-3xl font-bold text-purple-900 mb-1">{stats.averageProgress}%</p>
                <p className="text-sm text-gray-600">Progresso Médio</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-8 h-8 text-orange-900" />
                </div>
                <p className="text-3xl font-bold text-orange-900 mb-1">{stats.totalPoints}</p>
                <p className="text-sm text-gray-600">Pontos Totais</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VARK Profile apenas para alunos com onboarding completo */}
        {isStudent && user.onboarding_completed && user.vark_primary_style && (
          <Card className="shadow-lg border-none">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-900" />
                Seu Perfil de Aprendizado VARK
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <p className="text-sm text-gray-600 mb-2">Estilo Primário</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                  {getVARKStyleName(user.vark_primary_style)}
                </p>
              </div>

              <div className="space-y-4">
                {varkData.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="h-3 rounded-full" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.value}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <p className="text-sm text-gray-600">
                  <strong>Dica:</strong> A plataforma usa seu perfil VARK para recomendar conteúdos 
                  e atividades que melhor se adequam ao seu estilo de aprendizado, 
                  enquanto também equilibra com outros formatos para um desenvolvimento completo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg border-none">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600 mb-2 block">Nome Completo</Label>
                <p className="font-semibold text-gray-900">{user.full_name}</p>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Email</Label>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Tipo de Usuário</Label>
                <p className="font-semibold text-gray-900">
                  {userTypeLabels[user.user_type] || "Aluno"}
                </p>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Membro desde</Label>
                <p className="font-semibold text-gray-900">
                  {new Date(user.created_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}