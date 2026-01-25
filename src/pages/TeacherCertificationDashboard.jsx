import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  CheckCircle2,
  Lock,
  Leaf,
  Code,
  Rocket,
  Crown,
  ChevronRight,
  Award,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

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
    gradient: 'from-blue-400 to-cyan-500',
    age: '6-8 anos',
    description: 'Despertar a Curiosidade Digital'
  },
  discovery: { 
    name: 'Discovery', 
    color: '#27AE60', 
    icon: Code, 
    gradient: 'from-green-400 to-emerald-500',
    age: '9-11 anos',
    description: 'Explorar as Ferramentas da Criação'
  },
  pioneer: { 
    name: 'Pioneer', 
    color: '#FF6F3C', 
    icon: Rocket, 
    gradient: 'from-orange-400 to-red-500',
    age: '12-13 anos',
    description: 'Construir Soluções para o Mundo Real'
  },
  challenger: { 
    name: 'Challenger', 
    color: '#E74C3C', 
    icon: Crown, 
    gradient: 'from-red-400 to-pink-500',
    age: '14-16 anos',
    description: 'Inovar e Liderar na Era da IA'
  }
};

export default function TeacherCertificationDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modulesByLevel, setModulesByLevel] = useState({});
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [certifications, setCertifications] = useState({});
  const [lessonPlans, setLessonPlans] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await User.me();
      setUser(userData);

      if (!['administrador', 'coordenador_pedagogico', 'instrutor'].includes(userData.user_type)) {
        setLoading(false);
        return;
      }

      const entities = await loadEntities();
      if (!entities) {
        throw new Error("Não foi possível carregar as entidades necessárias");
      }

      const { Lesson, Module, TeacherLessonCertification, LessonPlan } = entities;

      const allModules = await Module.list();
      
      const organized = {
        curiosity: [],
        discovery: [],
        pioneer: [],
        challenger: []
      };

      allModules.forEach(module => {
        if (organized[module.course_id]) {
          organized[module.course_id].push(module);
        }
      });

      Object.keys(organized).forEach(level => {
        organized[level].sort((a, b) => (a.order || 0) - (b.order || 0));
      });

      setModulesByLevel(organized);

      const allLessons = await Lesson.list();
      
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
        teacher_email: userData.email
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

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message || "Erro ao carregar dados");
    }
    
    setLoading(false);
  };

  const getLevelStats = (level) => {
    const modules = modulesByLevel[level] || [];
    let totalLessons = 0;
    let certifiedLessons = 0;
    let availableLessons = 0;

    modules.forEach(module => {
      const lessons = lessonsByModule[module.id] || [];
      totalLessons += lessons.length;
      
      lessons.forEach(lesson => {
        if (lessonPlans[lesson.id]) {
          availableLessons++;
        }
        if (certifications[lesson.id]?.certified) {
          certifiedLessons++;
        }
      });
    });

    return {
      totalModules: modules.length,
      totalLessons,
      availableLessons,
      certifiedLessons,
      progress: availableLessons > 0 ? Math.round((certifiedLessons / availableLessons) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando certificações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
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

  if (!user || !['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type)) {
    return (
      <div className="p-8">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-orange-600" />
            <h3 className="text-xl font-bold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">
              Esta área é exclusiva para professores e coordenadores.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
              Certificações Docentes
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gerencie suas certificações para ministrar aulas
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(levelInfo).map(([levelId, level]) => {
            const Icon = level.icon;
            const stats = getLevelStats(levelId);

            return (
              <motion.div
                key={levelId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate(createPageUrl("TeacherCertificationCourse") + `?level=${levelId}`)}
                >
                  <div className="h-3" style={{ backgroundColor: level.color }} />
                  
                  <CardHeader className={`bg-gradient-to-r ${level.gradient} text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{level.name}</CardTitle>
                        <p className="text-sm opacity-90">{level.age}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {level.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Módulos</span>
                        <span className="font-semibold">{stats.totalModules}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Lições Totais</span>
                        <span className="font-semibold">{stats.totalLessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Disponíveis</span>
                        <span className="font-semibold" style={{ color: level.color }}>
                          {stats.availableLessons}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Certificadas</span>
                        <span className="font-semibold" style={{ color: 'var(--success)' }}>
                          {stats.certifiedLessons}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                        <span className="font-semibold" style={{ color: level.color }}>
                          {stats.progress}%
                        </span>
                      </div>
                      <Progress value={stats.progress} className="h-2" />
                    </div>

                    <Button 
                      className="w-full mt-4"
                      style={{ backgroundColor: level.color, color: 'white' }}
                    >
                      Ver Certificações
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Como Funciona a Certificação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--info)' }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">1. Estudar o Conteúdo</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Revise o plano de aula completo e todos os materiais disponíveis
                </p>
              </div>

              <div className="text-center p-4">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--warning)' }}
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">2. Complete o Checklist</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Marque todos os itens de preparação como concluídos
                </p>
              </div>

              <div className="text-center p-4">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--success)' }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">3. Obter Certificação</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Receba sua certificação e esteja pronto para ensinar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}