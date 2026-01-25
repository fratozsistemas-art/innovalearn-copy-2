import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Calendar, CheckCircle2, PlayCircle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Lesson } from "@/entities/all";

export default function CourseDetail({ module, enrollment, onClose, onUpdateProgress }) {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState(
    enrollment?.completed_lessons || []
  );

  const loadLessons = useCallback(async () => {
    const lessonsData = await Lesson.filter({ module_id: module.id }, 'order');
    setLessons(lessonsData);
  }, [module.id]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const toggleLesson = async (lessonId) => {
    const newCompleted = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(newCompleted);
    
    const progress = Math.round((newCompleted.length / lessons.length) * 100);
    await onUpdateProgress(enrollment.id, {
      progress,
      completed_lessons: newCompleted
    });
  };

  const progress = enrollment?.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-auto"
      >
        <Card className="border-none shadow-2xl">
          <CardHeader 
            className="border-b text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
                <p className="opacity-90">{module.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <Calendar className="w-5 h-5 mb-2" style={{ color: 'var(--primary-teal)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Duração</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {module.duration_weeks} semanas
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <BookOpen className="w-5 h-5 mb-2" style={{ color: 'var(--primary-teal)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Aulas</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {lessons.length} aulas
                </p>
              </div>
            </div>

            {enrollment && (
              <div className="p-6 rounded-2xl space-y-3" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Seu Progresso</h3>
                  <span className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {completedLessons.length} de {lessons.length} aulas concluídas
                </p>
              </div>
            )}

            {module.objectives && module.objectives.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Target className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                  Objetivos de Aprendizado
                </h3>
                <ul className="space-y-2">
                  {module.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: 'var(--primary-teal)' }} />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <PlayCircle className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                Conteúdo do Módulo
              </h3>
              <div className="space-y-2">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => toggleLesson(lesson.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isCompleted
                          ? "border-green-200"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      style={{ 
                        backgroundColor: isCompleted ? 'rgba(76, 175, 80, 0.1)' : 'var(--background)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ 
                              backgroundColor: isCompleted ? 'var(--success)' : 'var(--neutral-medium)'
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-sm font-semibold text-white">{lesson.order}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {lesson.title}
                            </span>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {lesson.duration_minutes} min • {lesson.media_type}
                            </p>
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 border-0">
                            Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}