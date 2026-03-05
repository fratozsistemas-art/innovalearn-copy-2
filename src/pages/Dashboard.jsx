import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, ClipboardCheck, Target, Award, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";

// HOOKS COM REACT QUERY
import { useCurrentUser } from "@/components/hooks/useUser";
import { useModules } from "@/components/hooks/useModules";

import QuickStats from "../components/dashboard/QuickStats";
import UpcomingAssignments from "../components/dashboard/UpcomingAssignments";
import SmartRecommendations from "../components/recommendations/SmartRecommendations";
import AICoachWidget from "../components/dashboard/AICoachWidget";
import StudentInsights from "../components/dashboard/StudentInsights";
import OverdueAssignments from "../components/dashboard/OverdueAssignments";

const levelInfo = {
  curiosity: { name: 'Curiosity', color: 'var(--info)', totalModules: 4, age: '6+' },
  discovery: { name: 'Discovery', color: 'var(--success)', totalModules: 4, age: '9+' },
  pioneer: { name: 'Pioneer', color: 'var(--accent-orange)', totalModules: 4, age: '12+' },
  challenger: { name: 'Challenger', color: 'var(--error)', totalModules: 5, age: '14+' }
};

// Component for course progress display
const CourseProgress = ({ enrollments, modules, hasActiveEnrollment, currentLevel }) => {
  return (
    hasActiveEnrollment ? (
      <Card className="card-innova border-none shadow-lg">
        <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
          <CardTitle className="font-heading flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: currentLevel.color }} />
            Progresso nos Módulos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {enrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.slice(0, 5).map((enrollment) => {
                const module = modules.find(m => m.id === enrollment.module_id);
                if (!module) return null;

                return (
                  <div key={enrollment.id} className="p-4 rounded-xl hover:shadow-md transition-all" 
                    style={{ backgroundColor: 'var(--neutral-light)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                          Módulo {module.order}: {module.title}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Semestre {module.semester}
                        </p>
                      </div>
                      <Badge style={{ backgroundColor: currentLevel.color, color: 'white' }}>
                        {enrollment.progress}%
                      </Badge>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--text-secondary)' }}>
                Você ainda não está matriculado em nenhum módulo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    ) : (
      <Card className="card-innova border-none shadow-lg border-2" style={{ borderColor: 'var(--warning)' }}>
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--warning)' }} />
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Matrícula Pendente
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Seu cadastro foi criado, mas você ainda não possui matrícula ativa.
          </p>
        </CardContent>
      </Card>
    )
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: allModules = [], isLoading: modulesLoading } = useModules();

  const isEducator = user && ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: async () => {
      if (!user?.email || isEducator) return [];
      
      const data = await base44.entities.Enrollment.filter({ student_email: user.email });
      return data;
    },
    enabled: !!user?.email && !isEducator,
    staleTime: 1000 * 60 * 60 * 2,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
        return false;
      }
      return failureCount < 1;
    }
  });

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', user?.email, 'all'],
    queryFn: async () => {
      if (!user?.email) return [];
      const data = await base44.entities.Assignment.filter({ student_email: user.email }, '-due_date', 50);
      return data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
        return false;
      }
      return failureCount < 1;
    }
  });

  useEffect(() => {
    if (user && !isEducator && !user.onboarding_completed) {
      navigate(createPageUrl("Onboarding"));
    }
  }, [user, isEducator, navigate]);

  const enrolledModuleIds = enrollments.map(e => e.module_id);
  const modules = allModules.filter(m => enrolledModuleIds.includes(m.id));
  const completedAssignments = assignments.filter(a => a.status === "graded").length;
  const averageProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const currentLevel = levelInfo[user?.explorer_level || 'curiosity'];
  const isLoading = userLoading || enrollmentsLoading || modulesLoading || assignmentsLoading;
  const hasActiveEnrollment = user?.enrollment_status === 'active' && enrollments.length > 0;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  if (userError && !userError.message?.includes('not authenticated')) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Erro de Conexão</h2>
        <p className="text-gray-600 mb-4">Não foi possível conectar ao servidor.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${currentLevel.color} 0%, var(--primary-navy) 100%)` }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="border-0 text-lg px-4 py-2" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                {currentLevel.name} • {currentLevel.age}
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Bem-vindo, {user?.explorer_name || user?.full_name?.split(' ')[0] || "Explorador"} 👋
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Continue sua jornada no programa {currentLevel.name}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{modules.length}</div>
                <div className="text-sm opacity-90">Módulos Matriculados</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{enrollments.length}</div>
                <div className="text-sm opacity-90">Matrículas Ativas</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{averageProgress}%</div>
                <div className="text-sm opacity-90">Progresso Médio</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">{assignments.length}</div>
                <div className="text-sm opacity-90">Tarefas Pendentes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStats icon={BookOpen} title="Módulos Ativos" value={enrollments.length} subtitle={`de ${currentLevel.totalModules} disponíveis`} color={currentLevel.color} navigateTo={createPageUrl("Courses")} />
          <QuickStats icon={ClipboardCheck} title="Tarefas Pendentes" value={assignments.length} subtitle="Para entregar" color="var(--warning)" navigateTo={createPageUrl("Assignments")} />
          <QuickStats icon={Target} title="Progresso Médio" value={`${averageProgress}%`} subtitle="Nos módulos" color="var(--primary-teal)" navigateTo={createPageUrl("Courses")} />
          <QuickStats icon={Award} title="Conquistas" value={completedAssignments} subtitle="Tarefas completas" color="var(--accent-yellow)" navigateTo={createPageUrl("Gamification")} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {user?.onboarding_completed && (
            <div className="lg:col-span-1">
              <AICoachWidget userEmail={user?.email} />
            </div>
          )}
          <div className={user?.onboarding_completed ? "lg:col-span-2" : "lg:col-span-3"}>
            <CourseProgress enrollments={enrollments} modules={modules} hasActiveEnrollment={hasActiveEnrollment} currentLevel={currentLevel} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UpcomingAssignments assignments={assignments} />
          </div>
          <div>
            <SmartRecommendations userId={user?.id} limit={3} />
          </div>
        </div>

      </div>
    </div>
  );
}