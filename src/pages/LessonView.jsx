
import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Target,
  Award,
  ArrowLeft,
  ArrowRight,
  Home,
  FileText,
  AlertTriangle,
  Lock,
  Library,
  Brain,
  Activity
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LessonPlanViewer from "../components/lesson/LessonPlanViewer";
import TaskSubmissionCard from "../components/lesson/TaskSubmissionCard";
import YouTubePlayer from "../components/media/YouTubePlayer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNormalizedResources } from "@/components/hooks/useNormalizedResources";
import VARKEnforcer from "../components/learning/VARKEnforcer";
import { useCurrentUser } from "@/components/hooks/useUser";
import AdaptiveQuiz from "../components/assessment/AdaptiveQuiz";

const levelColors = {
  curiosity: '#3498DB',
  discovery: '#27AE60',
  pioneer: '#FF6F3C',
  challenger: '#E74C3C'
};

export default function LessonViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const lessonId = urlParams.get('id');
  
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [allModuleLessons, setAllModuleLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [teacherCertification, setTeacherCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonStartTime] = useState(Date.now());
  const [showAdaptiveQuiz, setShowAdaptiveQuiz] = useState(false);
  const [quizConcept, setQuizConcept] = useState(null);

  const logVARKAccessMutation = useMutation({
    mutationFn: async (accessData) => {
      return await base44.entities.VARKEffectivenessLog.create(accessData);
    }
  });

  const loadData = useCallback(async () => {
    if (!lessonId) {
      navigate(createPageUrl("Courses"));
      return;
    }

    setLoading(true);
    try {
      const lessonData = await base44.entities.Lesson.filter({ id: lessonId });
      if (lessonData.length === 0) {
        navigate(createPageUrl("Courses"));
        return;
      }

      const currentLesson = lessonData[0];
      setLesson(currentLesson);

      const allModules = await base44.entities.Module.list();
      const foundModule = allModules.find(m => m.id === currentLesson.module_id);
      
      if (foundModule) {
        setModule(foundModule);
      }

      const moduleLessons = await base44.entities.Lesson.filter({ module_id: currentLesson.module_id }, 'order');
      setAllModuleLessons(moduleLessons);

      if (user) {
        // Educadores têm acesso universal - não precisam de progresso de aluno
        const isEducator = ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);
        
        if (!isEducator) {
          const progressData = await base44.entities.StudentProgress.filter({
            student_email: user.email,
            lesson_id: lessonId
          });

          if (progressData.length > 0) {
            setProgress(progressData[0]);
          } else {
            setProgress(null);
          }
        } else {
          // Educadores têm "progresso virtual" completo para fins de UI
          setProgress({ completed: true, engagement_score: 100 });
        }

        // Buscar plano de aula (sempre para educadores)
        const lessonPlans = await base44.entities.LessonPlan.filter({ lesson_id: lessonId });
        if (lessonPlans.length > 0) {
          setLessonPlan(lessonPlans[0]);
        } else {
          setLessonPlan(null);
        }

        // Certificações (apenas para instrutores que ministram)
        if (user.user_type === 'instrutor') {
          const certifications = await base44.entities.TeacherLessonCertification.filter({
            teacher_email: user.email,
            lesson_id: lessonId
          });
          
          if (certifications.length > 0) {
            setTeacherCertification(certifications[0]);
          } else {
            setTeacherCertification(null);
          }
        } else if (['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
          // Admins e coordenadores são automaticamente considerados certificados
          setTeacherCertification({ certified: true, certification_date: new Date().toISOString() });
        } else {
          setTeacherCertification(null); // Students don't have teacher certifications
        }
      } else {
        setProgress(null);
        setLessonPlan(null);
        setTeacherCertification(null);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
    }
    setLoading(false);
  }, [lessonId, navigate, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [loadData, lessonId]);

  useEffect(() => {
    // Apenas alunos rastreiam tempo
    if (!user) return;
    const isStudent = user.user_type === 'aluno';
    if (!isStudent) return;

    return () => {
      if (user && lesson && lessonStartTime && !progress?.completed) {
        const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000 / 60);
        
        if (timeSpent > 0) {
          const currentProgress = progress;
          
          if (currentProgress) {
            base44.entities.StudentProgress.update(currentProgress.id, {
              time_spent_minutes: (currentProgress.time_spent_minutes || 0) + timeSpent
            }).catch(err => console.error('Error updating time:', err));
          } else {
            base44.entities.StudentProgress.create({
              student_email: user.email,
              course_id: lesson.course_id,
              module_id: lesson.module_id,
              lesson_id: lesson.id,
              completed: false,
              engagement_score: Math.min(100, (timeSpent / lesson.duration_minutes) * 100 || 0),
              time_spent_minutes: timeSpent
            }).catch(err => console.error('Error creating progress with time:', err));
          }
        }
      }
    };
  }, [user, lesson, progress, lessonStartTime]);

  const markAsComplete = async () => {
    // Apenas alunos marcam conclusão
    if (!user || user.user_type !== 'aluno') return;
    if (progress && progress.completed) return;

    const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000 / 60);

    if (progress) {
      await base44.entities.StudentProgress.update(progress.id, {
        completed: true,
        completion_date: new Date().toISOString(),
        engagement_score: 100,
        time_spent_minutes: (progress.time_spent_minutes || 0) + timeSpent
      });
    } else {
      await base44.entities.StudentProgress.create({
        student_email: user.email,
        course_id: lesson.course_id,
        module_id: lesson.module_id,
        lesson_id: lesson.id,
        completed: true,
        completion_date: new Date().toISOString(),
        engagement_score: 100,
        time_spent_minutes: timeSpent
      });
    }

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    await loadData();
  };

  const goToNextLesson = () => {
    const currentIndex = allModuleLessons.findIndex(l => l.id === lesson.id);
    if (currentIndex < allModuleLessons.length - 1) {
      const nextLesson = allModuleLessons[currentIndex + 1];
      navigate(createPageUrl("LessonView") + `?id=${nextLesson.id}`);
    }
  };

  const goToPrevLesson = () => {
    const currentIndex = allModuleLessons.findIndex(l => l.id === lesson.id);
    if (currentIndex > 0) {
      const prevLesson = allModuleLessons[currentIndex - 1];
      navigate(createPageUrl("LessonView") + `?id=${prevLesson.id}`);
    }
  };

  const handleResourceAccess = async (accessData) => {
    if (!accessData.student_email || !accessData.lesson_id || !accessData.resource_id || 
        !accessData.user_vark_style || !accessData.resource_vark_style || 
        typeof accessData.is_optimal_match !== 'boolean') {
      console.warn('⚠️ Skipping VARK log - missing or invalid required fields:', accessData);
      return;
    }

    try {
      await logVARKAccessMutation.mutateAsync(accessData);
      console.log('✅ VARK access logged');
    } catch (error) {
      console.error('❌ Error logging VARK access:', error);
    }
  };

  const handleStartAdaptiveQuiz = (concept) => {
    setQuizConcept(concept);
    setShowAdaptiveQuiz(true);
  };

  const handleQuizComplete = async (results) => {
    setShowAdaptiveQuiz(false);
    
    // Apenas alunos salvam resultados de quiz
    if (!user || user.user_type !== 'aluno') return;
    
    if (user && lesson && progress) {
      await base44.entities.StudentProgress.update(progress.id, {
        quiz_score: results.finalScore,
        engagement_score: Math.min(100, (results.finalScore + (progress.engagement_score || 0)) / 2)
      });
    } else if (user && lesson && !progress) {
      await base44.entities.StudentProgress.create({
        student_email: user.email,
        course_id: lesson.course_id,
        module_id: lesson.module_id,
        lesson_id: lesson.id,
        completed: false, 
        engagement_score: results.finalScore, 
        quiz_score: results.finalScore
      });
    }
    
    await loadData();
  };

  const normalizedResources = useNormalizedResources({
    lesson,
    propsResources: lesson?.resources,
    frontmatter: null
  });

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
          style={{ borderColor: 'var(--primary-teal)' }}
        />
        <p style={{ color: 'var(--text-secondary)' }}>Carregando aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Aula não encontrada</p>
            <Button onClick={() => navigate(createPageUrl("Courses"))} className="mt-4">
              Voltar aos Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentIndex = allModuleLessons.findIndex(l => l.id === lesson.id);
  const hasNext = currentIndex < allModuleLessons.length - 1;
  const hasPrev = currentIndex > 0;
  const levelColor = levelColors[lesson.course_id] || levelColors.curiosity;
  
  const isEducator = user && ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);
  const isStudent = user && user.user_type === 'aluno';
  const isCertified = teacherCertification?.certified || false;
  const hasLessonPlan = lessonPlan !== null;

  const hasContent = lesson.content_url || 
    (lessonPlan?.lesson_structure && lessonPlan.lesson_structure.length > 0) ||
    normalizedResources.length > 0 ||
    (lesson.learning_objectives && lesson.learning_objectives.length > 0 && user);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: levelColor }}>
              Parabéns!
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Você completou esta lição!
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
              <span className="font-semibold" style={{ color: 'var(--accent-yellow)' }}>
                +50 Innova Coins
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
          
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <button 
            onClick={() => navigate(createPageUrl("Courses"))}
            className="hover:underline flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Meus Cursos
          </button>
          <span>/</span>
          <span>{module?.title || 'Módulo'}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }} className="font-semibold">
            Lição {lesson.order}
          </span>
        </div>

        {/* Apenas instrutores veem banner de certificação */}
        {user?.user_type === 'instrutor' && hasLessonPlan && !isCertified && (
          <Alert className="border-2" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            <AlertDescription className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <p className="font-semibold mb-1">Certificação Pendente</p>
                <p className="text-sm">
                  Você precisa completar o treinamento desta lição antes de ministrá-la em sala.
                </p>
              </div>
              <Button
                onClick={() => navigate(createPageUrl("TeacherLessonTraining") + `?lessonId=${lesson.id}`)}
                style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                className="flex-shrink-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                Iniciar Treinamento
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {user?.user_type === 'instrutor' && isCertified && (
          <Alert className="border-2" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--success-light)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
            <AlertDescription className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <p className="font-semibold mb-1">Você está certificado para ministrar esta lição</p>
                <p className="text-sm">
                  Certificado em: {new Date(teacherCertification.certification_date).toLocaleDateString('pt-BR')}
                  {teacherCertification.times_taught > 0 && ` • Ministrada ${teacherCertification.times_taught}x`}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl("TeacherLessonTraining") + `?lessonId=${lesson.id}`)}
                className="flex-shrink-0"
              >
                Revisar Plano
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Banner para admins/coordenadores */}
        {['administrador', 'coordenador_pedagogico'].includes(user?.user_type) && (
          <Alert className="border-2" style={{ borderColor: 'var(--info)', backgroundColor: 'var(--info-light)' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--info)' }} />
            <AlertDescription>
              <p className="font-semibold mb-1">Acesso Universal de {user.user_type === 'administrador' ? 'Administrador' : 'Coordenador'}</p>
              <p className="text-sm">
                Você tem acesso a todos os conteúdos, planos de aula e recursos da plataforma.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-3" style={{ backgroundColor: levelColor }} />
          <CardHeader style={{ backgroundColor: 'var(--background)' }} className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                    style={{ backgroundColor: levelColor }}
                  >
                    {lesson.order}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-heading mb-1">{lesson.title}</CardTitle>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {module?.title} • Lição {lesson.order} de {allModuleLessons.length}
                    </p>
                  </div>
                </div>
                <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                  {lesson.description}
                </p>
              </div>
              {progress?.completed && isStudent && ( // Only show "Completada" badge for students
                <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1 px-4 py-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Completada
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lesson.duration_minutes} minutos
              </Badge>
              {lesson.difficulty_level && (
                <Badge variant="outline">
                  {lesson.difficulty_level === 'beginner' && 'Iniciante'}
                  {lesson.difficulty_level === 'intermediate' && 'Intermediário'}
                  {lesson.difficulty_level === 'advanced' && 'Avançado'}
                </Badge>
              )}
              {lesson.soft_skills && lesson.soft_skills.length > 0 && (
                <Badge style={{ backgroundColor: `${levelColor}20`, color: levelColor }}>
                  {lesson.soft_skills.length} Soft Skills
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full mb-6" style={{ 
            backgroundColor: 'var(--background)',
            gridTemplateColumns: isEducator && hasLessonPlan ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'
          }}>
            <TabsTrigger value="content">
              <BookOpen className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="objectives">
              <Target className="w-4 h-4 mr-2" />
              Objetivos
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Activity className="w-4 h-4 mr-2" />
              Atividades
            </TabsTrigger>
            {isEducator && hasLessonPlan && (
              <TabsTrigger value="lesson-plan">
                <FileText className="w-4 h-4 mr-2" />
                Plano de Aula
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="content" className="mt-0 space-y-6">
            {lesson.content_url && (
              <YouTubePlayer 
                url={lesson.content_url} 
                title={lesson.title}
              />
            )}

            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && user && (
              <Card className="border-l-4 shadow-md" style={{ borderColor: levelColor }}>
                <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Brain className="w-5 h-5" style={{ color: levelColor }} />
                    Avaliação Adaptativa (IRT)
                  </CardTitle>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Quiz inteligente que ajusta a dificuldade baseado no seu desempenho
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {!showAdaptiveQuiz ? (
                    <div className="space-y-3">
                      {lesson.learning_objectives.slice(0, 3).map((objective, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleStartAdaptiveQuiz(objective)}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Testar: {objective.substring(0, 60)}...
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <AdaptiveQuiz
                      studentEmail={user.email}
                      concept={quizConcept}
                      moduleId={lesson.module_id}
                      onComplete={handleQuizComplete}
                      onCancel={() => setShowAdaptiveQuiz(false)}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {normalizedResources.length > 0 && user && (
              <Card className="border-none shadow-lg">
                <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Library className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                    Recursos {isEducator ? 'Educacionais' : 'Adaptados para Você'}
                  </CardTitle>
                  {!isEducator && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selecionados com base no seu perfil de aprendizado {user.vark_primary_style ? `(${user.vark_primary_style})` : ''}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <VARKEnforcer
                    resources={normalizedResources}
                    userVARK={user}
                    lessonId={lesson.id}
                    onResourceAccess={handleResourceAccess}
                  />
                </CardContent>
              </Card>
            )}

            {!hasContent && (
              <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                <FileText className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Conteúdo em desenvolvimento</p>
                <p className="text-sm mt-2">Em breve você terá acesso ao material desta lição</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="objectives" className="mt-0">
            <Card className="border-none shadow-lg">
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <CardTitle className="flex items-center gap-2 font-heading">
                  <Target className="w-5 h-5" style={{ color: levelColor }} />
                  Objetivos de Aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {lesson.learning_objectives && lesson.learning_objectives.length > 0 ? (
                  <ul className="space-y-3">
                    {lesson.learning_objectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: levelColor }} />
                        <span style={{ color: 'var(--text-primary)' }}>{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>Objetivos serão adicionados em breve</p>
                )}

                {lesson.soft_skills && lesson.soft_skills.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                      Soft Skills Desenvolvidas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lesson.soft_skills.map((skill, idx) => (
                        <Badge key={idx} style={{ backgroundColor: `${levelColor}20`, color: levelColor }}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-0 space-y-6">
            {lesson.homework && (
              <TaskSubmissionCard
                lessonId={lesson.id}
                taskType="homework"
                taskData={lesson.homework}
                onStatusChange={loadData}
              />
            )}

            {lesson.familywork && (
              <TaskSubmissionCard
                lessonId={lesson.id}
                taskType="familywork"
                taskData={lesson.familywork}
                onStatusChange={loadData}
              />
            )}

            {lesson.extramile && (
              <TaskSubmissionCard
                lessonId={lesson.id}
                taskType="extramile"
                taskData={lesson.extramile}
                onStatusChange={loadData}
              />
            )}

            {!lesson.homework && !lesson.familywork && !lesson.extramile && (
              <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                <Activity className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Nenhuma atividade para esta lição</p>
              </div>
            )}
          </TabsContent>

          {isEducator && hasLessonPlan && (
            <TabsContent value="lesson-plan" className="mt-0">
              <LessonPlanViewer lessonPlan={lessonPlan} levelColor={levelColor} />
            </TabsContent>
          )}
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--neutral-medium)' }}>
          <Button
            variant="outline"
            onClick={goToPrevLesson}
            disabled={!hasPrev}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lição Anterior
          </Button>

          {isStudent && !progress?.completed && ( // Only show "Marcar como Concluída" for students
            <Button
              onClick={markAsComplete}
              style={{ backgroundColor: 'var(--success)', color: 'white' }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como Concluída
            </Button>
          )}

          <Button
            variant="outline"
            onClick={goToNextLesson}
            disabled={!hasNext}
            style={{
              backgroundColor: hasNext ? levelColor : 'transparent',
              color: hasNext ? 'white' : 'var(--text-secondary)',
              borderColor: hasNext ? levelColor : 'var(--neutral-medium)'
            }}
          >
            Próxima Lição
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
