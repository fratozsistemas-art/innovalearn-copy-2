import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Leaf, 
  Code, 
  Rocket, 
  Crown, 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const levelInfo = {
  curiosity: { 
    name: 'Curiosity', 
    icon: Leaf, 
    color: '#3498DB',
    gradient: 'from-blue-400 to-cyan-500',
    age: '6-8 anos',
    focus: 'Despertar a Curiosidade Digital',
    objective: 'Diferenciar pensamento humano de execução de máquina',
    methodology: 'Círculos de Curiosidade com aprendizado lúdico',
    duration: '2 anos',
    modules: 4,
    lessons: 64,
    hours: 128
  },
  discovery: { 
    name: 'Discovery', 
    icon: Code, 
    color: '#27AE60',
    gradient: 'from-green-400 to-emerald-500',
    age: '9-11 anos',
    focus: 'Explorar as Ferramentas da Criação',
    objective: 'Compreender dados, software e hardware através de projetos reais',
    methodology: 'Projetos práticos com stakeholders externos (INMET, NASA)',
    duration: '2 anos',
    certifications: ['Python PCEP', 'Google AI Fundamentals'],
    modules: 4,
    lessons: 64,
    hours: 128
  },
  pioneer: { 
    name: 'Pioneer', 
    icon: Rocket, 
    color: '#FF6F3C',
    gradient: 'from-orange-400 to-red-500',
    age: '12-13 anos',
    focus: 'Construir Soluções para o Mundo Real',
    objective: 'Criar sistemas full-stack com IA integrada e deployment real',
    methodology: 'Desenvolvimento de aplicações empresariais com DevOps',
    duration: '2 anos',
    certifications: ['TensorFlow Developer', 'AWS ML Specialty'],
    modules: 4,
    lessons: 64,
    hours: 128
  },
  challenger: { 
    name: 'Challenger', 
    icon: Crown, 
    color: '#E74C3C',
    gradient: 'from-red-400 to-pink-500',
    age: '14-16 anos',
    focus: 'Inovar e Liderar na Era da IA',
    objective: 'Dominar uso estratégico de IA e desenvolver startups unicórnio',
    methodology: 'Impacto civilizacional + Incubação de startups',
    duration: '2.5 anos',
    certifications: ['Quantum ML', 'Global Leadership Recognition'],
    modules: 5,
    lessons: 80,
    hours: 160
  }
};

const trailsData = [
  { id: 'sustentabilidade', name: 'Sustentabilidade', icon: '🌱', pattern: 'odd', color: '#27AE60' },
  { id: 'mudancas_climaticas', name: 'Mudanças Climáticas', icon: '🌍', pattern: 'odd', color: '#3498DB' },
  { id: 'musica', name: 'Música', icon: '🎵', pattern: 'odd', color: '#9B59B6' },
  { id: 'educacao_financeira', name: 'Educação Financeira', icon: '💰', pattern: 'odd', color: '#F39C12' },
  { id: 'pensamento_sistemico', name: 'Pensamento Sistêmico', icon: '🧠', pattern: 'odd', color: '#E74C3C' },
  { id: 'iot', name: 'IoT', icon: '📡', pattern: 'even', color: '#1ABC9C' },
  { id: 'astrofisica', name: 'Astrofísica', icon: '🔭', pattern: 'even', color: '#34495E' },
  { id: 'xadrez', name: 'Xadrez', icon: '♟️', pattern: 'even', color: '#7F8C8D' },
  { id: 'empreendedorismo', name: 'Empreendedorismo', icon: '🚀', pattern: 'even', color: '#E67E22' }
];

const modulesData = {
  curiosity: [
    { order: 1, title: 'Sustentabilidade e IA', description: 'Introdução ao pensamento computacional através da sustentabilidade' },
    { order: 2, title: 'Astrofísica para Pequenos', description: 'Explorando o universo com ferramentas digitais' },
    { order: 3, title: 'Ritmo e Algoritmos', description: 'Música e lógica de programação' },
    { order: 4, title: 'Dinheirinho Digital', description: 'Primeiros passos em educação financeira' }
  ],
  discovery: [
    { order: 1, title: 'ClimatePredict', description: 'Previsão climática com Python e dados do INMET', stakeholder: 'INMET' },
    { order: 2, title: 'SkyNet', description: 'Classificação de objetos celestes com NASA', stakeholder: 'NASA' },
    { order: 3, title: 'MusicChess', description: 'IA para música e estratégia de xadrez', stakeholder: 'Conservatório' },
    { order: 4, title: 'FinanceAI', description: 'Análise financeira com machine learning', stakeholder: 'Banco Central' }
  ],
  pioneer: [
    { order: 1, title: 'CerradoWatch', description: 'Sistema de monitoramento ambiental em produção', stakeholder: 'IBAMA' },
    { order: 2, title: 'SETI-AI', description: 'Detecção de sinais extraterrestres com deep learning', stakeholder: 'NASA/SETI' },
    { order: 3, title: 'ArtStrategy', description: 'Plataforma de arte generativa e xadrez com IA', stakeholder: 'Museus' },
    { order: 4, title: 'EthicalFinAI', description: 'Sistema bancário com IA ética e explicável', stakeholder: 'Fintechs' }
  ],
  challenger: [
    { order: 1, title: 'EarthAI', description: 'Plataforma global de monitoramento climático', stakeholder: 'ONU' },
    { order: 2, title: 'SpaceAI', description: 'IA para exploração espacial e quantum computing', stakeholder: 'NASA' },
    { order: 3, title: 'CulturalAI', description: 'Preservação cultural com IA generativa', stakeholder: 'UNESCO' },
    { order: 4, title: 'GlobalFinAI', description: 'Sistema financeiro descentralizado global', stakeholder: 'World Bank' },
    { order: 5, title: 'Unicorn Startup', description: 'Incubação de startup com objetivo de $1B+', stakeholder: 'Y Combinator' }
  ]
};

export default function SyllabusPage() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('overview');

  // Calcular totais gerais
  const totalModules = 17; // 4 + 4 + 4 + 5
  const totalLessons = 272; // 64 + 64 + 64 + 80
  const totalHours = 544; // 128 + 128 + 128 + 160

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ECF0F1' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00A99D 0%, #2C3E50 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">Syllabus InnovaLearn</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Jornada Educacional Completa em Inteligência Artificial
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="text-lg px-6 py-3 bg-white/20 border-0 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 mr-2" />
                {totalLessons} lições
              </Badge>
              <Badge className="text-lg px-6 py-3 bg-white/20 border-0 backdrop-blur-sm">
                <Target className="w-5 h-5 mr-2" />
                {totalModules} módulos
              </Badge>
              <Badge className="text-lg px-6 py-3 bg-white/20 border-0 backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 mr-2" />
                {totalHours}h de curso
              </Badge>
              <Badge className="text-lg px-6 py-3 bg-white/20 border-0 backdrop-blur-sm">
                <Award className="w-5 h-5 mr-2" />
                8.5 anos de jornada
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-2" style={{ background: 'linear-gradient(90deg, #00A99D 0%, #3498DB 50%, #E74C3C 100%)' }} />
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl" style={{ backgroundColor: '#00A99D20' }}>
                  <Sparkles className="w-12 h-12" style={{ color: '#00A99D' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#2C3E50' }}>
                    Filosofia: Gramática da Possibilidade
                  </h3>
                  <p className="text-lg mb-4" style={{ color: '#7F8C8D' }}>
                    Sistema operacional cognitivo que presume que <strong>todo problema tem solução</strong>. 
                    Transformamos obstáculos em recursos através de metodologias ativas e abordagem adaptativa.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="text-sm px-4 py-2" style={{ borderColor: '#00A99D', color: '#00A99D' }}>
                      PBL (Project-Based Learning)
                    </Badge>
                    <Badge variant="outline" className="text-sm px-4 py-2" style={{ borderColor: '#3498DB', color: '#3498DB' }}>
                      Metodologias Ativas
                    </Badge>
                    <Badge variant="outline" className="text-sm px-4 py-2" style={{ borderColor: '#27AE60', color: '#27AE60' }}>
                      Abordagem Adaptativa VARK
                    </Badge>
                    <Badge variant="outline" className="text-sm px-4 py-2" style={{ borderColor: '#F39C12', color: '#F39C12' }}>
                      Gamificação Inteligente
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* View Selector */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto" style={{ backgroundColor: 'white' }}>
            <TabsTrigger value="overview" className="py-4 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <Target className="w-5 h-5 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="courses" className="py-4 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <GraduationCap className="w-5 h-5 mr-2" />
              Cursos Detalhados
            </TabsTrigger>
            <TabsTrigger value="trails" className="py-4 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Globe className="w-5 h-5 mr-2" />
              Trilhas Transversais
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(levelInfo).map(([courseId, course], index) => {
                const Icon = course.icon;
                
                return (
                  <motion.div
                    key={courseId}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(createPageUrl(`${course.name}Course`))}
                    >
                      <div className="h-2" style={{ backgroundColor: course.color }} />
                      <CardHeader className={`bg-gradient-to-r ${course.gradient} text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Icon className="w-8 h-8" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold">{course.name}</CardTitle>
                              <p className="text-sm opacity-90">{course.age} • {course.duration}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold text-sm mb-1" style={{ color: course.color }}>
                              {course.focus}
                            </p>
                            <p className="text-sm" style={{ color: '#7F8C8D' }}>
                              {course.objective}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: '#ECF0F1' }}>
                            <div className="text-center">
                              <div className="text-2xl font-bold" style={{ color: course.color }}>
                                {course.modules}
                              </div>
                              <div className="text-xs" style={{ color: '#7F8C8D' }}>Módulos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold" style={{ color: course.color }}>
                                {course.lessons}
                              </div>
                              <div className="text-xs" style={{ color: '#7F8C8D' }}>Lições</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold" style={{ color: course.color }}>
                                {course.hours}h
                              </div>
                              <div className="text-xs" style={{ color: '#7F8C8D' }}>Curso</div>
                            </div>
                          </div>

                          {course.certifications && (
                            <div className="pt-4 border-t" style={{ borderColor: '#ECF0F1' }}>
                              <p className="text-xs font-semibold mb-2" style={{ color: '#7F8C8D' }}>
                                Certificações Preparadas:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {course.certifications.map((cert, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs" style={{ borderColor: course.color, color: course.color }}>
                                    <Award className="w-3 h-3 mr-1" />
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-8 space-y-8">
            {Object.entries(levelInfo).map(([courseId, course]) => {
              const Icon = course.icon;
              const courseModules = modulesData[courseId] || [];

              return (
                <motion.div
                  key={courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-none shadow-xl overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: course.color }} />
                    <CardHeader className={`bg-gradient-to-r ${course.gradient} text-white`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold mb-1">{course.name}</CardTitle>
                          <p className="text-sm opacity-90">
                            {course.modules} módulos • {course.lessons} lições • {course.hours}h curso
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate(createPageUrl(`${course.name}Course`))}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                        >
                          Ver Curso Completo
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {courseModules.map((module, idx) => (
                          <div key={idx} className="border-l-4 pl-6" style={{ borderColor: course.color }}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                                  Módulo {module.order}: {module.title}
                                </h4>
                                <p className="text-sm mb-2" style={{ color: '#7F8C8D' }}>
                                  {module.description}
                                </p>
                                {module.stakeholder && (
                                  <Badge style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                                    Stakeholder: {module.stakeholder}
                                  </Badge>
                                )}
                              </div>
                              <Badge style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                                16 lições
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Trails Tab */}
          <TabsContent value="trails" className="mt-8 space-y-8">
            <Card className="border-none shadow-xl">
              <CardHeader style={{ backgroundColor: '#00A99D', color: 'white' }}>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Globe className="w-7 h-7" />
                  9 Trilhas Transversais
                </CardTitle>
                <p className="opacity-90">
                  Recall anual com complexidade crescente através dos 4 cursos
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#2C3E50' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A99D' }} />
                      Anos Ímpares (1, 3, 5, 7)
                    </h4>
                    <div className="space-y-3">
                      {trailsData.filter(t => t.pattern === 'odd').map((trail) => (
                        <div 
                          key={trail.id}
                          className="flex items-center gap-3 p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                          style={{ backgroundColor: '#ECF0F1' }}
                        >
                          <span className="text-3xl">{trail.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: '#2C3E50' }}>
                              {trail.name}
                            </p>
                            <p className="text-xs" style={{ color: '#7F8C8D' }}>
                              Revisitado 4 vezes com complexidade crescente
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5" style={{ color: trail.color }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#2C3E50' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6F3C' }} />
                      Anos Pares (2, 4, 6, 8)
                    </h4>
                    <div className="space-y-3">
                      {trailsData.filter(t => t.pattern === 'even').map((trail) => (
                        <div 
                          key={trail.id}
                          className="flex items-center gap-3 p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                          style={{ backgroundColor: '#ECF0F1' }}
                        >
                          <span className="text-3xl">{trail.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: '#2C3E50' }}>
                              {trail.name}
                            </p>
                            <p className="text-xs" style={{ color: '#7F8C8D' }}>
                              Revisitado 4 vezes com complexidade crescente
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5" style={{ color: trail.color }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: '#00A99D20' }}>
                  <h4 className="font-bold mb-2" style={{ color: '#00A99D' }}>
                    Como funcionam as Trilhas Transversais?
                  </h4>
                  <p className="text-sm" style={{ color: '#7F8C8D' }}>
                    Cada trilha transversal é revisitada anualmente através dos 4 níveis (Curiosity → Challenger), 
                    mas com complexidade progressiva. Por exemplo, <strong>Sustentabilidade</strong> é abordada todos 
                    os anos ímpares: aos 6 anos aprendem sobre reciclagem básica, aos 9 anos criam sistemas de 
                    classificação de lixo com IA, aos 12 anos desenvolvem plataformas de monitoramento ambiental, 
                    e aos 14 anos criam startups de impacto climático global.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: '#00A99D' }} />
                <div className="text-4xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                  {totalModules}
                </div>
                <div className="text-sm" style={{ color: '#7F8C8D' }}>Módulos Totais</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#27AE60' }} />
                <div className="text-4xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                  {totalLessons}
                </div>
                <div className="text-sm" style={{ color: '#7F8C8D' }}>Lições Totais</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-3" style={{ color: '#FF6F3C' }} />
                <div className="text-4xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                  {totalHours}h
                </div>
                <div className="text-sm" style={{ color: '#7F8C8D' }}>Horas de Curso</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-3" style={{ color: '#FFC857' }} />
                <div className="text-4xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                  8.5
                </div>
                <div className="text-sm" style={{ color: '#7F8C8D' }}>Anos de Jornada</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}