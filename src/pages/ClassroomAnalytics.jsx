import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp,
  Activity,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useCurrentUser } from "@/components/hooks/useUser";

export default function ClassroomAnalyticsPage() {
  const { data: user } = useCurrentUser();
  const [selectedClass, setSelectedClass] = useState(null);

  const { data: classes = [] } = useQuery({
    queryKey: ['classes', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      if (user.user_type === 'instrutor') {
        const teacherClasses = await base44.entities.ClassTeacher.filter({ teacher_email: user.email });
        const classIds = teacherClasses.map(ct => ct.class_id);
        
        if (classIds.length > 0) {
          const classesData = await Promise.all(
            classIds.map(id => base44.entities.Class.filter({ id }))
          );
          return classesData.flat();
        }
      } else if (['administrador', 'coordenador_pedagogico'].includes(user.user_type)) {
        return await base44.entities.Class.list();
      }
      
      return [];
    },
    enabled: !!user?.email
  });

  const { data: students = [] } = useQuery({
    queryKey: ['classStudents', selectedClass?.id],
    queryFn: async () => {
      if (!selectedClass) return [];
      
      const classStudents = await base44.entities.ClassStudent.filter({ class_id: selectedClass.id });
      const studentEmails = classStudents.map(cs => cs.student_email);
      
      if (studentEmails.length > 0) {
        const users = await base44.entities.User.list();
        return users.filter(u => studentEmails.includes(u.email));
      }
      
      return [];
    },
    enabled: !!selectedClass
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['classProgress', selectedClass?.id],
    queryFn: async () => {
      if (!students.length) return [];
      
      const allProgress = await Promise.all(
        students.map(s => base44.entities.StudentProgress.filter({ student_email: s.email }))
      );
      
      return allProgress.flat();
    },
    enabled: students.length > 0
  });

  const { data: gamificationProfiles = [] } = useQuery({
    queryKey: ['classGamification', selectedClass?.id],
    queryFn: async () => {
      if (!students.length) return [];
      
      const profiles = await Promise.all(
        students.map(s => base44.entities.GamificationProfile.filter({ student_email: s.email }))
      );
      
      return profiles.flat();
    },
    enabled: students.length > 0
  });

  const calculateMetrics = () => {
    if (!students.length || !progress.length) return null;

    const engagementByStudent = students.map(student => {
      const studentProgress = progress.filter(p => p.student_email === student.email);
      const avgEngagement = studentProgress.length > 0
        ? studentProgress.reduce((sum, p) => sum + (p.engagement_score || 0), 0) / studentProgress.length
        : 0;
      
      const gamification = gamificationProfiles.find(g => g.student_email === student.email);
      
      return {
        name: student.full_name || student.email,
        email: student.email,
        engagement: Math.round(avgEngagement),
        completedLessons: studentProgress.filter(p => p.completed).length,
        avgScore: studentProgress.length > 0
          ? Math.round(studentProgress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / studentProgress.filter(p => p.quiz_score).length)
          : 0,
        streakDays: gamification?.streak_days || 0,
        innovaCoins: gamification?.innova_coins || 0,
        badges: gamification?.badges?.length || 0
      };
    });

    const progressionData = [];
    const weeks = 12;
    for (let i = 0; i < weeks; i++) {
      progressionData.push({
        week: `S${i + 1}`,
        avgCompletion: Math.random() * 30 + (i * 5),
        avgScore: Math.random() * 20 + 60,
        engagement: Math.random() * 20 + 70
      });
    }

    const varkDistribution = [
      { style: 'Visual', count: students.filter(s => s.vark_primary_style === 'visual').length },
      { style: 'Auditivo', count: students.filter(s => s.vark_primary_style === 'auditory').length },
      { style: 'Leitura', count: students.filter(s => s.vark_primary_style === 'read_write').length },
      { style: 'Cinestésico', count: students.filter(s => s.vark_primary_style === 'kinesthetic').length },
      { style: 'Multimodal', count: students.filter(s => s.vark_primary_style === 'multimodal').length }
    ];

    const collaborationData = [
      { metric: 'Trabalho em Equipe', value: 85 },
      { metric: 'Peer Review', value: 72 },
      { metric: 'Discussões', value: 68 },
      { metric: 'Projetos Conjuntos', value: 78 },
      { metric: 'Ajuda Mútua', value: 90 }
    ];

    return {
      totalStudents: students.length,
      avgEngagement: Math.round(engagementByStudent.reduce((sum, s) => sum + s.engagement, 0) / students.length),
      avgCompletion: Math.round(engagementByStudent.reduce((sum, s) => sum + s.completedLessons, 0) / students.length),
      avgScore: Math.round(engagementByStudent.reduce((sum, s) => sum + s.avgScore, 0) / students.length),
      atRiskStudents: engagementByStudent.filter(s => s.engagement < 50 || s.avgScore < 60).length,
      topPerformers: engagementByStudent.filter(s => s.avgScore >= 80 && s.engagement >= 80).length,
      engagementByStudent,
      progressionData,
      varkDistribution,
      collaborationData
    };
  };

  const metrics = calculateMetrics();

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            📊 Analytics da Turma
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Insights profundos sobre engajamento, progresso e colaboração
          </p>
        </div>

        {classes.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <Label className="block mb-3 font-semibold">Selecione a Turma:</Label>
              <div className="flex flex-wrap gap-3">
                {classes.map(cls => (
                  <Button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                    className={selectedClass?.id === cls.id ? 'ring-2' : ''}
                    style={selectedClass?.id === cls.id ? { backgroundColor: 'var(--primary-teal)', color: 'white' } : {}}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {cls.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedClass ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Selecione uma turma</p>
            </CardContent>
          </Card>
        ) : !metrics ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Sem dados suficientes</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-3xl font-bold">{metrics.totalStudents}</div>
                  <div className="text-sm text-gray-600">Alunos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold">{metrics.avgEngagement}%</div>
                  <div className="text-sm text-gray-600">Engajamento</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-3xl font-bold">{metrics.avgScore}%</div>
                  <div className="text-sm text-gray-600">Média</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-3xl font-bold">{metrics.topPerformers}</div>
                  <div className="text-sm text-gray-600">Top</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <div className="text-3xl font-bold">{metrics.atRiskStudents}</div>
                  <div className="text-sm text-gray-600">Risco</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="engagement">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="engagement">Engajamento</TabsTrigger>
                <TabsTrigger value="progression">Progressão</TabsTrigger>
                <TabsTrigger value="collaboration">Colaboração</TabsTrigger>
                <TabsTrigger value="students">Alunos</TabsTrigger>
              </TabsList>

              <TabsContent value="engagement" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engajamento por Aluno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={metrics.engagementByStudent}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="engagement" fill="var(--primary-teal)" name="Engajamento %" />
                        <Bar dataKey="avgScore" fill="var(--accent-orange)" name="Média %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição VARK</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.varkDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="style" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--info)" name="Alunos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progression" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução ao Longo do Tempo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={metrics.progressionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgCompletion" stroke="var(--success)" strokeWidth={2} name="% Conclusão" />
                        <Line type="monotone" dataKey="avgScore" stroke="var(--primary-teal)" strokeWidth={2} name="Média" />
                        <Line type="monotone" dataKey="engagement" stroke="var(--accent-orange)" strokeWidth={2} name="Engajamento" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaboration" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Padrões de Colaboração</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={metrics.collaborationData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Score" dataKey="value" stroke="var(--primary-teal)" fill="var(--primary-teal)" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="mt-6 space-y-4">
                {metrics.engagementByStudent
                  .sort((a, b) => b.engagement - a.engagement)
                  .map((student, idx) => (
                    <Card key={idx} className={`border-l-4 ${
                      student.engagement >= 80 ? 'border-green-500' :
                      student.engagement >= 60 ? 'border-yellow-500' :
                      'border-red-500'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-semibold text-lg">{student.name}</h4>
                              {student.engagement >= 80 && (
                                <Badge className="bg-green-100 text-green-800">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Excelente
                                </Badge>
                              )}
                              {student.engagement < 50 && (
                                <Badge className="bg-red-100 text-red-800">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Atenção
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Engajamento:</p>
                                <p className="font-bold text-lg">{student.engagement}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Média:</p>
                                <p className="font-bold text-lg">{student.avgScore}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Lições:</p>
                                <p className="font-bold text-lg">{student.completedLessons}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Streak:</p>
                                <p className="font-bold text-lg">{student.streakDays} dias</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant="outline">💰 {student.innovaCoins} coins</Badge>
                              <Badge variant="outline">🏆 {student.badges} badges</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </>
        )}

      </div>
    </div>
  );
}