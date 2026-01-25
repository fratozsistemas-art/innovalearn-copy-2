import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  CheckCircle2,
  Leaf,
  Code,
  Rocket,
  Crown,
  ChevronRight,
  Award,
  Clock,
  FileText,
  PlayCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const loadEntities = async () => {
  try {
    const { Lesson } = await import("@/entities/all");
    const { Module } = await import("@/entities/all");
    const { TeacherLessonCertification } = await import("@/entities/all");
    const { LessonPlan } = await import("@/entities/all");
    return { Lesson, Module, TeacherLessonCertification, LessonPlan };
  } catch (error) {
    console.error("Erro ao importar entidades:", error);
    return null;
  }
};

const levelInfo = {
  curiosity: { 
    name: 'Curiosity', 
    color: '#3498DB', 
    icon: Leaf, 
    gradient: 'from-blue-400 to-cyan-500'
  },
  discovery: { 
    name: 'Discovery', 
    color: '#27AE60', 
    icon: Code, 
    gradient: 'from-green-400 to-emerald-500'
  },
  pioneer: { 
    name: 'Pioneer', 
    color: '#FF6F3C', 
    icon: Rocket, 
    gradient: 'from-orange-400 to-red-500'
  },
  challenger: { 
    name: 'Challenger', 
    color: '#E74C3C', 
    icon: Crown, 
    gradient: 'from-red-400 to-pink-500'
  }
};

export default function TeacherCertificationCourse() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get('level');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [certifications, setCertifications] = useState({});
  const [lessonPlans, setLessonPlans] = useState({});
  const [expandedModule, setExpandedModule] = useState(null);

  const loadData = useCallback(async () => {
    if (!level || !levelInfo[level]) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userData = await User.me();
      setUser(userData);

      const entities = await loadEntities();
      if (!entities) {
        throw new Error("Não foi possível carregar as entidades necessárias");
      }

      const { Lesson, Module, TeacherLessonCertification, LessonPlan } = entities;

      const allModules = await Module.filter({ course_id: level }, 'order');
      setModules(allModules);

      const allLessons = await Lesson.filter({ course_id: level });
      
      const lessonsByMod = {};
      
      allLessons.forEach(lesson => {
        if (!lessonsByMod[lesson.module_id]) {
          lessonsByMod[lesson.module_id] = [];
        }
        lessonsByMod[lesson.module_id].push(lesson);
      });

      Object.keys(lessonsByMod).forEach(moduleId => {
        lessonsByMod[moduleId].sort((a, b) => (a.order || 0) - (b.order || 0));
      });

      setLessonsByModule(lessonsByMod);

      const allCertifications = await TeacherLessonCertification.filter({
        teacher_email: userData.email,
        course_level: level
      });

      const certsMap = {};
      allCertifications.forEach(cert => {
        certsMap[cert.lesson_id] = cert;
      });

      setCertifications(certsMap);

      const allPlans = await LessonPlan.list();
      
      const plansMap = {};
      allPlans.forEach(plan => {
        plansMap[plan.lesson_id] = plan;
      });
      setLessonPlans(plansMap);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(error.message || "Erro ao carregar dados. Por favor, tente novamente.");
    }
    setLoading(false);
  }, [level]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getModuleStats = (moduleId) => {
    const lessons = lessonsByModule[moduleId] || [];
    const certified = lessons.filter(l => certifications[l.id]?.certified).length;
    return {
      total: lessons.length,
      certified,
      progress: lessons.length > 0 ? Math.round((certified / lessons.length) * 100) : 0
    };
  };

  if (!level || !levelInfo[level]) {
    return (
      <div className="p-8">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Nível Inválido
                </h3>
                <p className="text-orange-700 mb-4">
                  O nível "{level}" não foi encontrado. Por favor, selecione um nível válido.
                </p>
                <Button 
                  onClick={() => navigate(createPageUrl("TeacherCertificationDashboard"))}
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  Voltar para Certificações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const courseInfo = levelInfo[level];
  const Icon = courseInfo.icon;
  const levelColor = courseInfo.color;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando módulos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("TeacherCertificationDashboard"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Certificações
        </Button>
        
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Erro ao Carregar Dados
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button 
                  onClick={loadData}
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("TeacherCertificationDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Certificações
        </Button>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-3" style={{ backgroundColor: levelColor }} />
          <CardHeader className={`bg-gradient-to-r ${courseInfo.gradient} text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-heading font-bold mb-2">
                    Certificação {courseInfo.name}
                  </CardTitle>
                  <p className="opacity-90">
                    {modules.length} módulos • {Object.values(lessonsByModule).flat().length} lições
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {modules.map((module) => {
            const stats = getModuleStats(module.id);
            const lessons = lessonsByModule[module.id] || [];
            const isExpanded = expandedModule === module.id;

            return (
              <Card key={module.id} className="overflow-hidden shadow-lg">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  style={{ backgroundColor: 'var(--background)' }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0"
                      style={{ backgroundColor: levelColor }}
                    >
                      {module.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl font-heading">{module.title}</CardTitle>
                        <Badge style={{ backgroundColor: levelColor, color: 'white' }}>
                          Semestre {module.semester}
                        </Badge>
                        {stats.progress === 100 && (
                          <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Certificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {module.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                            <span className="font-semibold" style={{ color: levelColor }}>
                              {stats.certified} / {stats.total} lições
                            </span>
                          </div>
                          <Progress value={stats.progress} className="h-2" />
                        </div>
                        <ChevronRight 
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          style={{ color: levelColor }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6 bg-gray-50">
                        <div className="space-y-3">
                          {lessons.map((lesson) => {
                            const cert = certifications[lesson.id];
                            const hasPlan = lessonPlans[lesson.id];
                            const isCertified = cert?.certified;

                            return (
                              <Card
                                key={lesson.id}
                                className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                                  isCertified ? 'border-2' : 'border'
                                }`}
                                style={{ borderColor: isCertified ? 'var(--success)' : 'var(--neutral-medium)' }}
                                onClick={() => {
                                  navigate(createPageUrl("TeacherLessonPage") + `?lessonId=${lesson.id}`);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                    style={{ backgroundColor: isCertified ? 'var(--success)' : levelColor }}
                                  >
                                    {isCertified ? <CheckCircle2 className="w-5 h-5" /> : lesson.order}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                      {lesson.title}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {lesson.duration_minutes} min
                                      </Badge>
                                      {hasPlan && (
                                        <Badge 
                                          variant="outline" 
                                          className="text-xs" 
                                          style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                                        >
                                          <FileText className="w-3 h-3 mr-1" />
                                          Plano Disponível
                                        </Badge>
                                      )}
                                      {isCertified && cert.times_taught > 0 && (
                                        <Badge variant="outline" className="text-xs" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                                          Ministrada {cert.times_taught}x
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="text-white"
                                    style={{ backgroundColor: isCertified ? 'var(--success)' : levelColor }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(createPageUrl("TeacherLessonPage") + `?lessonId=${lesson.id}`);
                                    }}
                                  >
                                    {isCertified ? (
                                      <>
                                        <Award className="w-4 h-4 mr-2" />
                                        Certificado
                                      </>
                                    ) : (
                                      <>
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        {hasPlan ? 'Iniciar Certificação' : 'Em Breve'}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}