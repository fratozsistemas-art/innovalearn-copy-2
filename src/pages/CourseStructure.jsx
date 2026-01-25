import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Leaf, Code, Rocket, Crown, Music, DollarSign, Globe, Download, FileText, Activity } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useCurrentUser } from "@/components/hooks/useUser";

const levelInfo = {
  curiosity: { name: 'Curiosity', color: 'var(--info)', totalModules: 4, age: '6+', icon: Leaf },
  discovery: { name: 'Discovery', color: 'var(--success)', totalModules: 4, age: '9+', icon: Code },
  pioneer: { name: 'Pioneer', color: 'var(--accent-orange)', totalModules: 4, age: '12+', icon: Rocket },
  challenger: { name: 'Challenger', color: 'var(--error)', totalModules: 5, age: '14+', icon: Crown }
};

const moduleIcons = { 1: Leaf, 2: Rocket, 3: Music, 4: DollarSign, 5: Globe };

export default function CourseStructurePage() {
  const { data: user } = useCurrentUser();
  const [modules, setModules] = useState({});
  const [lessons, setLessons] = useState({});
  const [lessonPlans, setLessonPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('curiosity');
  const [totalOverallModules, setTotalOverallModules] = useState(0);
  const [totalOverallLessons, setTotalOverallLessons] = useState(0);

  const navigate = useNavigate();

  // Educadores têm acesso universal
  const isEducator = user && ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    
    try {
      const allModules = await base44.entities.Module.list();
      
      const modulesByCourse = {};
      let calculatedOverallModules = 0;
      allModules.forEach(module => {
        const courseId = module.course_id;
        if (!modulesByCourse[courseId]) {
          modulesByCourse[courseId] = [];
        }
        modulesByCourse[courseId].push(module);
        calculatedOverallModules++;
      });
      
      Object.keys(modulesByCourse).forEach(courseId => {
        modulesByCourse[courseId].sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      
      setModules(modulesByCourse);
      setTotalOverallModules(calculatedOverallModules);

      const allLessons = await base44.entities.Lesson.list();
      
      const lessonsByModule = {};
      let calculatedOverallLessons = 0;
      allLessons.forEach(lesson => {
        if (!lessonsByModule[lesson.module_id]) {
          lessonsByModule[lesson.module_id] = [];
        }
        lessonsByModule[lesson.module_id].push(lesson);
        calculatedOverallLessons++;
      });
      
      Object.keys(lessonsByModule).forEach(moduleId => {
        lessonsByModule[moduleId].sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      
      setLessons(lessonsByModule);
      setTotalOverallLessons(calculatedOverallLessons);

      const allLessonPlans = await base44.entities.LessonPlan.list();
      const plansMap = {};
      allLessonPlans.forEach(plan => {
        plansMap[plan.lesson_id] = plan;
      });
      setLessonPlans(plansMap);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-teal)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Carregando estrutura completa...</p>
        </div>
      </div>
    );
  }

  const modulesInLevel = modules[selectedLevel] || [];
  const totalLessonsInLevel = modulesInLevel.reduce((sum, m) => 
    sum + (lessons[m.id]?.length || 0), 0
  );

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Estrutura Completa dos Cursos
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Visão master: {Object.keys(levelInfo).length} cursos • {totalOverallModules} módulos • {totalOverallLessons} lições
          </p>
        </div>

        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto" style={{ backgroundColor: 'var(--background)' }}>
            {Object.entries(levelInfo).map(([level, config]) => {
              const Icon = config.icon;
              const modulesCount = (modules[level] || []).length;
              const expectedModules = config.totalModules;
              
              return (
                <TabsTrigger 
                  key={level} 
                  value={level}
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:shadow-lg"
                  style={{
                    ...(selectedLevel === level && {
                      backgroundColor: config.color,
                      color: 'white'
                    })
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{config.name}</div>
                    <div className="text-xs opacity-75">
                      {config.age} • {modulesCount}/{expectedModules} módulos
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(levelInfo).map(level => (
            <TabsContent key={level} value={level} className="mt-6">
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="card-innova border-none">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: levelInfo[level].color }}>
                      {modulesInLevel.length}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Módulos</div>
                  </CardContent>
                </Card>
                <Card className="card-innova border-none">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: levelInfo[level].color }}>
                      {totalLessonsInLevel}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lições</div>
                  </CardContent>
                </Card>
                <Card className="card-innova border-none">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: levelInfo[level].color }}>
                      {level === 'challenger' ? '2.5' : '2'}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Anos</div>
                  </CardContent>
                </Card>
              </div>

              {modulesInLevel.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {modulesInLevel.map((module) => {
                    const ModuleIcon = moduleIcons[module.order] || BookOpen;
                    const moduleLessons = lessons[module.id] || [];
                    
                    return (
                      <AccordionItem 
                        key={module.id} 
                        value={module.id}
                        className="border-2 rounded-xl overflow-hidden shadow-lg"
                        style={{ borderColor: levelInfo[level].color }}
                      >
                        <AccordionTrigger 
                          className="px-6 py-4 hover:no-underline"
                          style={{ backgroundColor: 'var(--background)' }}
                        >
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                              style={{ backgroundColor: levelInfo[level].color }}
                            >
                              <ModuleIcon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                  Módulo {module.order}: {module.title}
                                </h4>
                                <Badge style={{ backgroundColor: levelInfo[level].color, color: 'white' }}>
                                  Semestre {module.semester}
                                </Badge>
                              </div>
                              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {module.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <span>📅 {module.duration_weeks} semanas</span>
                                <span>📚 {moduleLessons.length} lições</span>
                                <span>⏱️ {moduleLessons.length * 2}h totais</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        
                        <AccordionContent className="px-6 py-4" style={{ backgroundColor: 'var(--neutral-light)' }}>
                          
                          {module.objectives && module.objectives.length > 0 && (
                            <div className="mb-6">
                              <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                🎯 Objetivos de Aprendizado
                              </h5>
                              <ul className="space-y-2">
                                {module.objectives.map((obj, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="mt-1">✓</span>
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div>
                            <h5 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                              📝 {moduleLessons.length} Lições ({moduleLessons.length * 2} horas)
                            </h5>
                            
                            {moduleLessons.length > 0 ? (
                              <div className="grid gap-3">
                                {moduleLessons.map((lesson) => {
                                  const hasPlan = lessonPlans[lesson.id];
                                  
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all cursor-pointer"
                                      style={{ 
                                        backgroundColor: 'var(--background)',
                                        borderColor: levelInfo[level].color
                                      }}
                                      onClick={() => navigate(createPageUrl("LessonView") + `?id=${lesson.id}`)}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div 
                                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                          style={{ backgroundColor: levelInfo[level].color }}
                                        >
                                          {lesson.order}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1">
                                              <h6 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                                {lesson.title}
                                                {hasPlan && (
                                                  <Badge variant="outline" className="text-xs" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    Plano Completo
                                                  </Badge>
                                                )}
                                              </h6>
                                              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                                {lesson.description}
                                              </p>
                                            </div>
                                            <div className="flex gap-2">
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
                                            </div>
                                          </div>
                                          
                                          {isEducator && hasPlan && (
                                            <div className="mb-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                                              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary-teal)' }}>
                                                📋 Materiais para Educadores:
                                              </p>
                                              <div className="flex flex-wrap gap-2">
                                                {hasPlan.pdf_url && (
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      window.open(hasPlan.pdf_url, '_blank');
                                                    }}
                                                  >
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    Plano de Aula
                                                  </Button>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                  <Activity className="w-3 h-3 mr-1" />
                                                  {hasPlan.lesson_structure?.length || 0} atividades
                                                </Badge>
                                              </div>
                                            </div>
                                          )}

                                          <div className="flex flex-wrap gap-2 text-xs">
                                            <Badge variant="outline" style={{ borderColor: levelInfo[level].color, color: levelInfo[level].color }}>
                                              {lesson.media_type}
                                            </Badge>
                                            <Badge variant="outline">
                                              ⏱️ {lesson.duration_minutes} min
                                            </Badge>
                                            {lesson.difficulty_level && (
                                              <Badge variant="outline">
                                                {lesson.difficulty_level}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  Lições em construção
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <Card className="card-innova border-none">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Módulos em Desenvolvimento
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Os módulos do programa {levelInfo[level].name} serão carregados em breve
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

      </div>
    </div>
  );
}