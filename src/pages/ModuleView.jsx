import React, { useState, useEffect, useCallback } from "react";
import { Module, Lesson, StudentProgress } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PlayCircle, CheckCircle2, Clock, BookOpen, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const levelColors = {
  curiosity: '#3498DB',
  discovery: '#27AE60',
  pioneer: '#FF6F3C',
  challenger: '#E74C3C'
};

export default function ModuleViewPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = urlParams.get('id');
  
  const [user, setUser] = useState(null);
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // CORREÇÃO: Buscar módulo por ID real (não customizado)
      const allModules = await Module.list();
      const foundModule = allModules.find(m => m.id === moduleId);

      if (!foundModule) {
        navigate(createPageUrl("Courses"));
        return;
      }

      setModule(foundModule);

      // Buscar lições do módulo
      const moduleLessons = await Lesson.filter({ module_id: moduleId }, 'order');
      setLessons(moduleLessons);

      // Buscar progresso
      const progressData = await StudentProgress.filter({
        student_email: userData.email,
        module_id: moduleId
      });

      const completed = progressData
        .filter(p => p.completed)
        .map(p => p.lesson_id);
      
      setCompletedLessons(completed);
    } catch (error) {
      console.error("Error loading module:", error);
    }
    setLoading(false);
  }, [moduleId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartLesson = (lessonId) => {
    navigate(createPageUrl("LessonView") + `?id=${lessonId}`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando módulo...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Módulo não encontrado</p>
            <Button onClick={() => navigate(createPageUrl("Courses"))} className="mt-4">
              Voltar aos Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelColor = levelColors[module.course_id] || levelColors.curiosity;
  const progress = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const nextLesson = lessons.find(l => !completedLessons.includes(l.id));

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Courses"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Cursos
          </Button>
          
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="h-3" style={{ backgroundColor: levelColor }} />
            <CardHeader style={{ backgroundColor: 'var(--background)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-heading font-bold mb-2">
                    {module.title}
                  </CardTitle>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {module.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge style={{ backgroundColor: levelColor, color: 'white' }}>
                      Semestre {module.semester}
                    </Badge>
                    <Badge variant="outline">
                      {lessons.length} lições
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                  <span className="font-semibold" style={{ color: levelColor }}>
                    {completedLessons.length} / {lessons.length} lições
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectives */}
        {module.objectives && module.objectives.length > 0 && (
          <Card className="border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: levelColor }} />
                Objetivos de Aprendizado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {module.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: levelColor }} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        <Card className="border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: levelColor }} />
              Lições do Módulo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {lessons.length > 0 ? (
              <div className="grid gap-4">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isNext = nextLesson?.id === lesson.id;

                  return (
                    <Card
                      key={lesson.id}
                      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                        isNext ? 'border-2' : 'border'
                      }`}
                      style={{
                        borderColor: isNext ? levelColor : 'var(--neutral-medium)',
                        backgroundColor: isCompleted ? 'var(--neutral-light)' : 'var(--background)'
                      }}
                      onClick={() => handleStartLesson(lesson.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ backgroundColor: isCompleted ? 'var(--success)' : levelColor }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              lesson.order
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                              {lesson.title}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration_minutes} min
                              </Badge>
                              <Badge variant="outline">
                                {lesson.media_type}
                              </Badge>
                              {isNext && (
                                <Badge style={{ backgroundColor: levelColor, color: 'white' }}>
                                  Próxima
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="text-white"
                            style={{ backgroundColor: levelColor }}
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {isCompleted ? 'Revisar' : 'Iniciar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Nenhuma lição disponível ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}