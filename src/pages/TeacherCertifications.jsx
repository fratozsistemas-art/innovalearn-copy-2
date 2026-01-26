import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/components/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  BookOpen,
  Users,
  Target,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CERTIFICATION_TYPES = {
  lesson_specialist: {
    name: "Especialista em Lições",
    icon: BookOpen,
    color: "#3B82F6",
    description: "Certificado para ministrar lições específicas",
    requirements: "Completar treinamento e revisar plano de aula"
  },
  level_master: {
    name: "Mestre de Nível",
    icon: GraduationCap,
    color: "#8B5CF6",
    description: "Domínio completo de um nível (Curiosity, Discovery, etc.)",
    requirements: "Certificar 80% das lições do nível"
  },
  pedagogical_expert: {
    name: "Expert Pedagógico",
    icon: Target,
    color: "#10B981",
    description: "Excelência em metodologias pedagógicas",
    requirements: "Completar 5 cursos de pedagogia + alta satisfação dos alunos"
  },
  technology_expert: {
    name: "Expert em Tecnologia",
    icon: Star,
    color: "#F59E0B",
    description: "Domínio de ferramentas e tecnologias educacionais",
    requirements: "Completar cursos de tecnologia + implementar inovações"
  },
  assessment_specialist: {
    name: "Especialista em Avaliação",
    icon: TrendingUp,
    color: "#EF4444",
    description: "Expertise em avaliação e feedback efetivo",
    requirements: "Curso de avaliação + feedback consistente e de qualidade"
  },
  innovation_leader: {
    name: "Líder de Inovação",
    icon: Award,
    color: "#EC4899",
    description: "Pioneiro em métodos e práticas inovadoras",
    requirements: "Todas as certificações anteriores + contribuições significativas"
  }
};

export default function TeacherCertificationsPage() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("myCertifications");

  const isAdmin = user?.user_type === 'administrador' || user?.user_type === 'coordenador_pedagogico';

  // Buscar certificações do professor atual
  const { data: myCertifications = [], isLoading: loadingMyCerts } = useQuery({
    queryKey: ['myCertifications', user?.email],
    queryFn: () => base44.entities.TeacherCertification.filter({ teacher_email: user.email }),
    enabled: !!user
  });

  // Buscar todas as certificações (admin)
  const { data: allCertifications = [], isLoading: loadingAllCerts } = useQuery({
    queryKey: ['allCertifications'],
    queryFn: () => base44.entities.TeacherCertification.list(),
    enabled: isAdmin
  });

  // Buscar certificações de lições
  const { data: lessonCertifications = [] } = useQuery({
    queryKey: ['lessonCertifications', user?.email],
    queryFn: () => base44.entities.TeacherLessonCertification.filter({ teacher_email: user.email, certified: true }),
    enabled: !!user
  });

  // Buscar cursos de treinamento
  const { data: trainingCourses = [] } = useQuery({
    queryKey: ['trainingCourses'],
    queryFn: () => base44.entities.TeacherTrainingCourse.list()
  });

  // Buscar progresso em treinamentos
  const { data: trainingProgress = [] } = useQuery({
    queryKey: ['trainingProgress', user?.email],
    queryFn: () => base44.entities.TeacherTrainingProgress.filter({ teacher_email: user.email }),
    enabled: !!user
  });

  const activeCertifications = myCertifications.filter(c => c.status === 'active');
  const expiringSoon = myCertifications.filter(c => {
    if (!c.expiry_date || c.status !== 'active') return false;
    const daysUntilExpiry = Math.floor((new Date(c.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const completedTrainings = trainingProgress.filter(p => p.progress === 100).length;

  if (!user) {
    return (
      <div className="p-8 text-center">
        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                Certificações Profissionais
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Acompanhe e gerencie suas certificações docentes
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" style={{ color: 'var(--primary-teal)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{activeCertifications.length}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Certificações Ativas
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: 'var(--success)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{lessonCertifications.length}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Lições Certificadas
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: 'var(--accent-yellow)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <GraduationCap className="w-8 h-8" style={{ color: 'var(--accent-yellow)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{completedTrainings}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Treinamentos Concluídos
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4" style={{ borderColor: expiringSoon.length > 0 ? 'var(--warning)' : 'var(--neutral-medium)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" style={{ color: expiringSoon.length > 0 ? 'var(--warning)' : 'var(--neutral-medium)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{expiringSoon.length}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Expirando em Breve
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: isAdmin ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
            <TabsTrigger value="myCertifications">Minhas Certificações</TabsTrigger>
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            {isAdmin && <TabsTrigger value="manage">Gerenciar</TabsTrigger>}
          </TabsList>

          {/* Minhas Certificações */}
          <TabsContent value="myCertifications" className="space-y-4">
            {loadingMyCerts ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                    style={{ borderColor: 'var(--primary-teal)' }}
                  />
                  <p style={{ color: 'var(--text-secondary)' }}>Carregando certificações...</p>
                </CardContent>
              </Card>
            ) : myCertifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma certificação ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Explore as certificações disponíveis e comece sua jornada de desenvolvimento profissional
                  </p>
                  <Button
                    onClick={() => setSelectedTab('available')}
                    style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                  >
                    Ver Certificações Disponíveis
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myCertifications.map(cert => {
                  const certType = CERTIFICATION_TYPES[cert.certification_type];
                  const Icon = certType?.icon || Award;
                  const isExpiringSoon = expiringSoon.some(c => c.id === cert.id);
                  const isExpired = cert.status === 'expired';

                  return (
                    <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader 
                        className="pb-3"
                        style={{ backgroundColor: isExpired ? '#FEE2E2' : isExpiringSoon ? '#FEF3C7' : 'var(--neutral-light)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: certType?.color || 'var(--primary-teal)', opacity: isExpired ? 0.5 : 1 }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{cert.certification_name}</h3>
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {cert.level === 'all' ? 'Todos os níveis' : cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            style={{ 
                              backgroundColor: isExpired ? 'var(--error)' : isExpiringSoon ? 'var(--warning)' : 'var(--success)',
                              color: 'white'
                            }}
                          >
                            {isExpired ? 'Expirada' : isExpiringSoon ? 'Expirando' : 'Ativa'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--text-secondary)' }}>Emitida em:</span>
                            <span className="font-medium">
                              {format(new Date(cert.issue_date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          {cert.expiry_date && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--text-secondary)' }}>Expira em:</span>
                              <span className="font-medium" style={{ color: isExpiringSoon ? 'var(--warning)' : 'inherit' }}>
                                {format(new Date(cert.expiry_date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                              </span>
                            </div>
                          )}
                        </div>
                        {cert.certificate_url && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(cert.certificate_url, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Certificado
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Certificações Disponíveis */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(CERTIFICATION_TYPES).map(([typeId, certInfo]) => {
                const Icon = certInfo.icon;
                const hasThis = myCertifications.some(c => c.certification_type === typeId && c.status === 'active');

                return (
                  <Card key={typeId} className="hover:shadow-lg transition-shadow">
                    <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: certInfo.color }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{certInfo.name}</CardTitle>
                          {hasThis && (
                            <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }} className="mt-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Você possui
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {certInfo.description}
                      </p>
                      <div 
                        className="p-3 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--neutral-light)' }}
                      >
                        <strong>Requisitos:</strong>
                        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {certInfo.requirements}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Gerenciar (Admin) */}
          {isAdmin && (
            <TabsContent value="manage" className="space-y-4">
              <Card>
                <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                    Todas as Certificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingAllCerts ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                        style={{ borderColor: 'var(--primary-teal)' }}
                      />
                      <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>
                    </div>
                  ) : allCertifications.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">Nenhuma certificação emitida ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allCertifications.map(cert => {
                        const certType = CERTIFICATION_TYPES[cert.certification_type];
                        const Icon = certType?.icon || Award;

                        return (
                          <div 
                            key={cert.id}
                            className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                            style={{ backgroundColor: 'white' }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: certType?.color || 'var(--primary-teal)' }}
                                >
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold">{cert.certification_name}</p>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {cert.teacher_email} • {cert.level}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  style={{ 
                                    backgroundColor: cert.status === 'active' ? 'var(--success)' : 'var(--neutral-medium)',
                                    color: 'white'
                                  }}
                                >
                                  {cert.status}
                                </Badge>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {format(new Date(cert.issue_date), "dd/MM/yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

      </div>
    </div>
  );
}