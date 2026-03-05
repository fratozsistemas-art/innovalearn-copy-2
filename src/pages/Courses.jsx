import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Leaf, Code, Rocket, Crown,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  FileText,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

// HOOKS COM REACT QUERY
import { useCurrentUser } from "@/components/hooks/useUser";
import { useModules } from "@/components/hooks/useModules";
import { useLessons } from "@/components/hooks/useLessons";
import { PageLoadingSkeleton } from "@/components/common/LoadingSkeleton";
import CourseFeedbackPanel from "@/components/feedback/CourseFeedbackPanel";

// --- Course Data (unchanged from original file) ---
const courseData = {
  curiosity: {
    name: 'Curiosity',
    icon: Leaf,
    color: '#3498DB',
    gradient: 'from-blue-400 to-cyan-500',
    age: '6-8 anos',
    description: 'Despertar a Curiosidade Digital',
    modules: [
      { id: 'curiosity-1', order: 1, title: 'Sustentabilidade e IA', semester: 1 },
      { id: 'curiosity-2', order: 2, title: 'Astrofísica para Pequenos', semester: 2 },
      { id: 'curiosity-3', order: 3, title: 'Ritmo e Algoritmos', semester: 3 },
      { id: 'curiosity-4', order: 4, title: 'Dinheirinho Digital', semester: 4 }
    ]
  },
  discovery: {
    name: 'Discovery',
    icon: Code,
    color: '#27AE60',
    gradient: 'from-green-400 to-emerald-500',
    age: '9-11 anos',
    description: 'Explorar as Ferramentas da Criação',
    modules: [
      { id: 'discovery-1', order: 1, title: 'ClimatePredict', semester: 1 },
      { id: 'discovery-2', order: 2, title: 'SkyNet', semester: 3 },
      { id: 'discovery-3', order: 3, title: 'MusicChess', semester: 3 },
      { id: 'discovery-4', order: 4, title: 'FinanceAI', semester: 4 }
    ]
  },
  pioneer: {
    name: 'Pioneer',
    icon: Rocket,
    color: '#FF6F3C',
    gradient: 'from-orange-400 to-red-500',
    age: '12-13 anos',
    description: 'Construir Soluções para o Mundo Real',
    modules: [
      { id: 'pioneer-1', order: 1, title: 'CerradoWatch', semester: 1 },
      { id: 'pioneer-2', order: 2, title: 'SETI-AI', semester: 2 },
      { id: 'pioneer-3', order: 3, title: 'ArtStrategy', semester: 3 },
      { id: 'pioneer-4', order: 4, title: 'EthicalFinAI', semester: 4 }
    ]
  },
  challenger: {
    name: 'Challenger',
    icon: Crown,
    color: '#E74C3C',
    gradient: 'from-red-400 to-pink-500',
    age: '14-16 anos',
    description: 'Inovar e Liderar na Era da IA',
    modules: [
      { id: 'challenger-1', order: 1, title: 'EarthAI', semester: 1 },
      { id: 'challenger-2', order: 2, title: 'SpaceAI', semester: 2 },
      { id: 'challenger-3', order: 3, title: 'CulturalAI', semester: 3 },
      { id: 'challenger-4', order: 4, title: 'GlobalFinAI', semester: 4 },
      { id: 'challenger-5', order: 5, title: 'Unicorn Startup', semester: 5 }
    ]
  }
};

const levelInfo = {
  curiosity: { name: 'Curiosity', color: 'var(--info)', totalModules: 4, age: '6+' },
  discovery: { name: 'Discovery', color: 'var(--success)', totalModules: 4, age: '9+' },
  pioneer: { name: 'Pioneer', color: 'var(--accent-orange)', totalModules: 4, age: '12+' },
  challenger: { name: 'Challenger', color: 'var(--error)', totalModules: 5, age: '14+' }
};

export default function CoursesPage() {
  const navigate = useNavigate();

  // USANDO REACT QUERY
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();

  // Buscar módulos usando o novo hook
  const { data: allModules = [], isLoading: modulesLoading, error: modulesError } = useModules();
  
  // CRITICAL: Buscar TODAS as lições de UMA VEZ com cache agressivo
  const { data: allLessons = [], isLoading: lessonsLoading, error: lessonsError } = useLessons();

  // Educadores têm acesso universal - não precisam de matrículas
  const isEducator = user && ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);

  // Buscar matrículas APENAS para alunos
  const { data: enrollments = [], isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: async () => {
      if (!user?.email || isEducator) {
        return [];
      }
      try {
        const data = await base44.entities.Enrollment.filter({ student_email: user.email });
        console.log('✅ Enrollments loaded:', data.length);
        return data;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on enrollments');
          return [];
        }
        console.error('❌ Error fetching enrollments:', error);
        return [];
      }
    },
    enabled: !!user?.email && !isEducator,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    throwOnError: false
  });

  // AI Ethics - query leve
  const { data: aiEthicsProgress, isLoading: aiEthicsLoading, error: aiEthicsError } = useQuery({
    queryKey: ['aiEthicsProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      try {
        const ethicsProgress = await base44.entities.AIEthicsCourse.filter({ student_email: user.email });
        return ethicsProgress.length > 0 ? ethicsProgress[0] : null;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on AI Ethics');
          return null;
        }
        return null;
      }
    },
    enabled: !!user?.email && user?.onboarding_completed && !isEducator,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    retry: false,
    throwOnError: false
  });

  // Lesson Plans - CACHED AGGRESSIVELY
  const { data: lessonPlans = {}, isLoading: lessonPlansLoading, error: lessonPlansError } = useQuery({
    queryKey: ['lessonPlans'],
    queryFn: async () => {
      try {
        const allLessonPlans = await base44.entities.LessonPlan.list();
        const plansMap = {};
        allLessonPlans.forEach(plan => {
          plansMap[plan.lesson_id] = plan;
        });
        console.log('✅ All lesson plans loaded:', Object.keys(plansMap).length);
        return plansMap;
      } catch (error) {
        if (error?.message?.includes('Rate limit')) {
          console.warn('⚠️ Rate limit on lesson plans');
          return {};
        }
        return {};
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 4,
    retry: false,
    throwOnError: false
  });

  // Local states derived from fetched data or UI specific
  const [lessons, setLessons] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);

  // CRITICAL: Process lessons from the single query result
  useEffect(() => {
    if (allLessons.length === 0 || (!isEducator && enrollments.length === 0 && user?.email)) {
      return;
    }

    const lessonsByModule = {};
    const completedByModule = {};

    // Organizar lições por módulo (já temos todas de uma vez)
    allLessons.forEach(lesson => {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push(lesson);
    });

    // Ordenar lições de cada módulo
    Object.keys(lessonsByModule).forEach(moduleId => {
      lessonsByModule[moduleId].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    if (isEducator) {
      // Educadores: acesso a tudo
      allModules.forEach(mod => {
        if (!lessonsByModule[mod.id]) {
          lessonsByModule[mod.id] = [];
        }
        completedByModule[mod.id] = [];
      });
    } else if (enrollments.length > 0) {
      // Alunos: apenas módulos matriculados
      enrollments.forEach(enrollment => {
        if (!lessonsByModule[enrollment.module_id]) {
          lessonsByModule[enrollment.module_id] = [];
        }
        completedByModule[enrollment.module_id] = enrollment.completed_lessons || [];
      });
    }
    
    setLessons(lessonsByModule);
    setCompletedLessons(completedByModule);
  }, [allLessons, allModules, enrollments, isEducator, user?.email]);

  // Effect for redirects
  useEffect(() => {
    if (!userLoading && !userError && user && !isEducator) {
      if (!user.onboarding_completed) {
        navigate(createPageUrl("Onboarding"));
        return;
      }
    }
  }, [user, userLoading, userError, navigate, isEducator]);

  // Effect for auto-expanding the current course
  useEffect(() => {
    if (!userLoading && !userError && user && user.onboarding_completed && !expandedCourse) {
      if (user.explorer_level) {
        setExpandedCourse(user.explorer_level);
      }
    }
  }, [user, userLoading, userError, expandedCourse]);

  // Overall loading state
  const isLoading = userLoading || modulesLoading || lessonsLoading || (isEducator ? false : enrollmentsLoading) || aiEthicsLoading || lessonPlansLoading;

  // Function to navigate to a lesson
  const handleStartLesson = (lessonId) => {
    navigate(createPageUrl("LessonView") + `?id=${lessonId}`);
  };

  // Helper to find enrollment for a given module
  const getEnrollmentForModule = (moduleId) => {
    if (isEducator) return { module_id: moduleId, progress: 100 };
    return enrollments.find(e => e.module_id === moduleId);
  };

  // Helper to check if user is enrolled in any module of a course
  const isEnrolledInCourse = (courseId) => {
    if (isEducator) return true;
    return enrollments.some(e => e.module_id?.startsWith(courseId));
  };

  // Helper to check if user is enrolled in a specific module
  const isEnrolledInModule = (moduleId) => {
    if (isEducator) return true;
    return enrollments.some(e => e.module_id === moduleId);
  };

  // Toggle course expansion
  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Calculate the total number of lessons for a course
  const getLessonCountForCourse = useCallback((courseId) => {
    const courseModules = courseData[courseId]?.modules || [];
    let totalLessons = 0;

    courseModules.forEach(module => {
      const moduleLessons = lessons[module.id] || [];
      totalLessons += moduleLessons.length;
    });

    return totalLessons;
  }, [lessons]);

  // MOSTRAR BANNER SE AI ETHICS NÃO COMPLETADO (apenas para alunos)
  const showAIEthicsBanner = !isEducator && user?.onboarding_completed &&
    (!aiEthicsLoading && !aiEthicsError && (!aiEthicsProgress || !aiEthicsProgress.certificate_issued));


  // --- Render Loading State ---
  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  // --- Render Error State ---
  const generalError = userError && !userError.message?.includes('not authenticated') ? userError :
    modulesError && !modulesError.message?.includes('Rate limit') ? modulesError :
    enrollmentsError && !enrollmentsError.message?.includes('Rate limit') ? enrollmentsError :
    lessonsError && !lessonsError.message?.includes('Rate limit') ? lessonsError :
    aiEthicsError && !aiEthicsError.message?.includes('Rate limit') ? aiEthicsError :
    lessonPlansError && !lessonPlansError.message?.includes('Rate limit') ? lessonPlansError :
    null;

  if (generalError) {
    console.error("An unhandled error occurred during data fetching:", generalError);
    return (
      <div className="p-8 text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Erro de Conexão</h2>
        <p className="text-gray-600 mb-4" style={{ color: 'var(--text-secondary)' }}>
          Ocorreu um problema ao carregar seus dados. Por favor, tente novamente.
        </p>
        <p className="text-sm text-gray-500 mt-2">Detalhes: {generalError.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Recarregar Página
        </Button>
      </div>
    );
  }

  // Check for rate limit specific errors
  const hasRateLimitError = (userError?.message?.includes('Rate limit') ||
    modulesError?.message?.includes('Rate limit') ||
    enrollmentsError?.message?.includes('Rate limit') ||
    lessonsError?.message?.includes('Rate limit') ||
    aiEthicsError?.message?.includes('Rate limit') ||
    lessonPlansError?.message?.includes('Rate limit'));

  // --- Main Content Render ---
  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {isEducator ? 'Todos os Cursos' : 'Meus Cursos'}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {isEducator 
              ? `Acesso universal de ${user?.user_type === 'administrador' ? 'Administrador' : user?.user_type === 'coordenador_pedagogico' ? 'Coordenador Pedagógico' : 'Instrutor'}`
              : `Você está no programa ${user?.explorer_level ? levelInfo[user.explorer_level]?.name : 'Curiosity'}`
            }
          </p>
        </div>

        {/* Banner para educadores */}
        {isEducator && (
          <Alert className="border-2" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--success-light)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
            <AlertDescription>
              <p className="font-semibold mb-1">✅ Acesso Universal Ativado</p>
              <p className="text-sm">
                Como {user?.user_type === 'administrador' ? 'administrador' : user?.user_type === 'coordenador_pedagogico' ? 'coordenador pedagógico' : 'instrutor'}, você tem acesso a:
              </p>
              <ul className="text-sm mt-2 space-y-1 ml-4 list-disc">
                <li>Todos os 17 módulos (Curiosity → Challenger)</li>
                <li>Todas as {allLessons.length} lições carregadas</li>
                <li>Todos os planos de aula e recursos</li>
                <li>Conteúdos de todos os níveis de explorador</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* AI Ethics Banner (apenas alunos) */}
        {showAIEthicsBanner && (
          <Alert className="border-2" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            <AlertDescription className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <p className="font-semibold mb-1">Curso Obrigatório: Ética em IA</p>
                <p className="text-sm">
                  Complete o mini-curso de Ética em IA (60 min) para ter acesso completo aos módulos.
                </p>
              </div>
              <Button
                onClick={() => navigate(createPageUrl("AIEthics"))}
                style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                className="flex-shrink-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                {aiEthicsProgress ? 'Continuar Curso' : 'Iniciar Curso'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Warning */}
        {hasRateLimitError && (
          <Alert className="border-2" style={{ borderColor: 'var(--accent-orange)', backgroundColor: 'var(--accent-orange-light)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
            <AlertDescription className="text-sm">
              ⏳ <strong>Sistema com cache ativado.</strong> Alguns dados podem estar temporariamente desatualizados.
              O sistema sincronizará automaticamente em breve.
            </AlertDescription>
          </Alert>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(courseData).map(([courseId, course]) => {
            const Icon = course.icon;
            const isEnrolled = isEnrolledInCourse(courseId);
            const isExpanded = expandedCourse === courseId;
            const isCurrent = user?.explorer_level === courseId;
            const lessonCount = getLessonCountForCourse(courseId);

            return (
              <motion.div
                key={courseId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                    isExpanded ? 'ring-4' : isEnrolled ? 'ring-2' : ''
                  }`}
                  style={{
                    borderColor: isEnrolled ? course.color : 'var(--neutral-medium)',
                    ringColor: isEnrolled ? course.color : 'transparent'
                  }}
                  onClick={() => toggleCourse(courseId)}
                >
                  <div className="h-3" style={{ backgroundColor: course.color }} />

                  <CardHeader className={`bg-gradient-to-r ${course.gradient} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
                          <p className="text-sm opacity-90">{course.age}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {course.description}
                    </p>

                    {isCurrent && !isEducator && (
                      <Badge className="mb-4" style={{ backgroundColor: course.color, color: 'white' }}>
                        Seu Nível Atual
                      </Badge>
                    )}
                    {isEducator && (
                      <Badge className="mb-4" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                        Acesso Universal
                      </Badge>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <div className="text-2xl font-bold" style={{ color: course.color }}>
                          {course.modules.length}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Módulos</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <div className="text-2xl font-bold" style={{ color: course.color }}>
                          {lessonCount}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Lições</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Módulos Expandidos */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4"
                    >
                      {course.modules.map((module) => {
                        const enrollment = getEnrollmentForModule(module.id);
                        const isModuleEnrolled = isEnrolledInModule(module.id);
                        const moduleLessons = lessons[module.id] || [];
                        const completed = completedLessons[module.id] || [];
                        const progress = moduleLessons.length > 0
                          ? Math.round((completed.length / moduleLessons.length) * 100)
                          : 0;

                        return (
                          <Card
                            key={module.id}
                            className={`overflow-hidden ${isModuleEnrolled ? 'ring-2' : ''}`}
                            style={{
                              borderColor: isModuleEnrolled ? course.color : 'var(--neutral-medium)',
                              ringColor: isModuleEnrolled ? course.color : 'transparent'
                            }}
                          >
                            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div
                                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                                      style={{ backgroundColor: course.color }}
                                    >
                                      {module.order}
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{module.title}</CardTitle>
                                      <Badge variant="outline" className="mt-1">
                                        Semestre {module.semester}
                                      </Badge>
                                    </div>
                                  </div>

                                  {isModuleEnrolled && !isEducator && (
                                    <div className="mt-4">
                                      <div className="flex justify-between text-sm mb-2">
                                        <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                                        <span className="font-semibold" style={{ color: course.color }}>
                                          {completed.length} / {moduleLessons.length} lições
                                        </span>
                                      </div>
                                      <Progress value={progress} className="h-2" />
                                    </div>
                                  )}
                                </div>

                                {!isModuleEnrolled && !isEducator && (
                                  <Lock className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </CardHeader>

                            {isModuleEnrolled && moduleLessons.length > 0 && (
                              <CardContent className="p-6">
                                <div className="space-y-3">
                                  {moduleLessons.slice(0, 3).map((lesson) => {
                                    const isCompleted = completed.includes(lesson.id);
                                    const hasPlan = lessonPlans[lesson.id];

                                    return (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
                                        style={{ backgroundColor: isCompleted && !isEducator ? 'var(--neutral-light)' : 'white' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartLesson(lesson.id);
                                        }}
                                      >
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                          style={{ backgroundColor: isCompleted && !isEducator ? 'var(--success)' : course.color }}
                                        >
                                          {isCompleted && !isEducator ? <CheckCircle2 className="w-4 h-4" /> : lesson.order}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                                            {lesson.title}
                                          </h5>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                              <Clock className="w-3 h-3 mr-1" />
                                              {lesson.duration_minutes} min
                                            </Badge>
                                            {isEducator && hasPlan && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                                style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                                              >
                                                <FileText className="w-3 h-3 mr-1" />
                                                Plano Disponível
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {isEducator && hasPlan && hasPlan.pdf_url && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(hasPlan.pdf_url, '_blank');
                                              }}
                                              title="Download do plano de aula"
                                            >
                                              <Download className="w-4 h-4" />
                                            </Button>
                                          )}
                                          <Button
                                            size="sm"
                                            className="text-white"
                                            style={{ backgroundColor: course.color }}
                                          >
                                            <PlayCircle className="w-4 h-4 mr-1" />
                                            {isCompleted && !isEducator ? 'Revisar' : isEducator ? 'Ver' : 'Iniciar'}
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {moduleLessons.length > 3 && (
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(createPageUrl("ModuleView") + `?id=${module.id}`);
                                      }}
                                    >
                                      Ver todas as {moduleLessons.length} lições
                                      <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}