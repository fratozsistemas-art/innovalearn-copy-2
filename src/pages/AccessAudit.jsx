import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  XCircle, 
  Shield,
  Users,
  Lock,
  Eye,
  AlertTriangle,
  GraduationCap,
  UserCog,
  Building2,
  FileText,
  Book,
  Target
} from "lucide-react";

/**
 * Auditoria Completa de Acesso por Perfil de Usuário
 */

// Perfis de usuário na plataforma
const userProfiles = {
  administrador: {
    name: "Administrador",
    icon: Shield,
    color: "#E74C3C",
    description: "Acesso total ao sistema, gestão completa"
  },
  coordenador_pedagogico: {
    name: "Coordenador Pedagógico",
    icon: GraduationCap,
    color: "#3498DB",
    description: "Gestão pedagógica, análises, curadoria"
  },
  instrutor: {
    name: "Instrutor",
    icon: Users,
    color: "#27AE60",
    description: "Ministrar aulas, avaliar alunos, planos de aula"
  },
  gerente: {
    name: "Gerente",
    icon: Building2,
    color: "#9B59B6",
    description: "Visão executiva, métricas B2B"
  },
  financeiro: {
    name: "Financeiro",
    icon: Target,
    color: "#F39C12",
    description: "Gestão financeira, cobranças"
  },
  secretaria: {
    name: "Secretaria",
    icon: FileText,
    color: "#16A085",
    description: "Gestão de matrículas, documentos"
  },
  pai_responsavel: {
    name: "Pai/Responsável",
    icon: UserCog,
    color: "#E67E22",
    description: "Acompanhamento do(s) filho(s)"
  },
  aluno: {
    name: "Aluno",
    icon: Book,
    color: "#2ECC71",
    description: "Estudante da plataforma"
  }
};

// Mapeamento completo de funcionalidades
const featureAudit = [
  {
    category: "🏠 Dashboard & Navegação",
    features: [
      {
        name: "Dashboard Principal",
        page: "Dashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "total",
          financeiro: "parcial",
          secretaria: "parcial",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Alunos veem dashboard adaptativo. Pais veem dashboard dos filhos."
      },
      {
        name: "Comparação de Plataformas",
        page: "PlatformComparison",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Apenas gestão superior"
      },
      {
        name: "Status da Plataforma",
        page: "PlatformStatus",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "total",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Monitoramento do sistema"
      },
      {
        name: "Gaps Resolvidos",
        page: "GapsDemonstration",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Demonstração de melhorias"
      },
      {
        name: "Validação de Recursos",
        page: "ResourceValidation",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Curadoria de conteúdo"
      }
    ]
  },
  {
    category: "📚 Conteúdo Pedagógico",
    features: [
      {
        name: "Syllabus (Programa Completo)",
        page: "Syllabus",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "parcial",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Todos veem estrutura curricular. Alunos veem seu nível."
      },
      {
        name: "Meus Cursos",
        page: "Courses",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Educadores: acesso universal. Alunos: apenas matriculados."
      },
      {
        name: "Visualizar Lições",
        page: "LessonView",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Educadores: todas as lições. Alunos: apenas matrículas."
      },
      {
        name: "Estrutura de Cursos",
        page: "CourseStructure",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Visualização da estrutura modular"
      },
      {
        name: "Recursos Educacionais",
        page: "Resources",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Biblioteca de recursos"
      },
      {
        name: "Dashboard de Recursos",
        page: "ResourcesDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Gestão de recursos"
      },
      {
        name: "Curadoria Automática",
        page: "AutoCurationDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Pipeline de curadoria IA"
      }
    ]
  },
  {
    category: "📝 Avaliações & Tarefas",
    features: [
      {
        name: "Minhas Tarefas",
        page: "Assignments",
        access: {
          administrador: "parcial",
          coordenador_pedagogico: "parcial",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Alunos fazem tarefas. Instrutores avaliam. Pais acompanham."
      },
      {
        name: "Ética em IA (Obrigatório)",
        page: "AIEthics",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Curso obrigatório para todos os alunos"
      },
      {
        name: "Bartle Assessment",
        page: "BartleAssessment",
        access: {
          administrador: "none",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Perfil motivacional dos alunos"
      },
      {
        name: "Assessment Motivacional",
        page: "MotivationalAssessment",
        access: {
          administrador: "none",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Parte do onboarding"
      }
    ]
  },
  {
    category: "🎮 Gamificação & Progresso",
    features: [
      {
        name: "Gamificação",
        page: "Gamification",
        access: {
          administrador: "parcial",
          coordenador_pedagogico: "parcial",
          instrutor: "parcial",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Alunos jogam. Educadores/pais acompanham."
      },
      {
        name: "Caminho Adaptativo",
        page: "AdaptiveLearningPath",
        access: {
          administrador: "parcial",
          coordenador_pedagogico: "parcial",
          instrutor: "parcial",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "total"
        },
        notes: "Recomendações personalizadas"
      },
      {
        name: "Cronograma",
        page: "Schedule",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "total",
          pai_responsavel: "parcial",
          aluno: "total"
        },
        notes: "Grade horária e feriados"
      },
      {
        name: "Perfil do Usuário",
        page: "Profile",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "total",
          financeiro: "total",
          secretaria: "total",
          pai_responsavel: "total",
          aluno: "total"
        },
        notes: "Todos gerenciam seus perfis"
      }
    ]
  },
  {
    category: "👩‍🏫 Ferramentas Docentes",
    features: [
      {
        name: "Capacitação Docente",
        page: "TeacherTraining",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Treinamento para professores"
      },
      {
        name: "Certificações Docentes",
        page: "TeacherCertificationDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Acompanhamento de certificações"
      },
      {
        name: "Treinamento de Lição",
        page: "TeacherLessonTraining",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Certificação por lição"
      },
      {
        name: "Revisão de Feedbacks",
        page: "TeacherFeedbackReview",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Feedbacks dos alunos"
      }
    ]
  },
  {
    category: "📊 Analytics & Relatórios",
    features: [
      {
        name: "Analytics Geral",
        page: "Analytics",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Métricas gerais da plataforma"
      },
      {
        name: "Analytics VARK",
        page: "VARKAnalytics",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Eficácia dos estilos de aprendizado"
      },
      {
        name: "Alerta Precoce",
        page: "EarlyWarningDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Identificação de alunos em risco"
      },
      {
        name: "Análise de Lacunas",
        page: "ContentGapAnalysis",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Gaps de conteúdo"
      },
      {
        name: "Dashboard Fratoz (B2B)",
        page: "FratozDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "total",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Métricas executivas B2B"
      },
      {
        name: "Dashboard Tenant",
        page: "TenantDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "total",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Multi-tenancy management"
      }
    ]
  },
  {
    category: "👥 Gestão Administrativa",
    features: [
      {
        name: "Gestão de Turmas",
        page: "ClassManagement",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "total",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Criar e gerenciar turmas"
      },
      {
        name: "Operações Admin",
        page: "AdminOperations",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Operações críticas do sistema"
      },
      {
        name: "Verificação de Dados",
        page: "DataVerification",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Auditoria de dados"
      },
      {
        name: "Verificação de Recursos",
        page: "ResourcesVerification",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Validação de recursos"
      }
    ]
  },
  {
    category: "🛠️ DevOps & Técnico",
    features: [
      {
        name: "Debug Dashboard",
        page: "DebugDashboard",
        access: {
          administrador: "total",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Apenas administradores"
      },
      {
        name: "System Health",
        page: "SystemHealth",
        access: {
          administrador: "total",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Monitoramento técnico"
      },
      {
        name: "Network Diagnostic",
        page: "NetworkDiagnostic",
        access: {
          administrador: "total",
          coordenador_pedagogico: "none",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Diagnóstico de rede"
      },
      {
        name: "Documentação",
        page: "Documentation",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Docs técnicas e pedagógicas"
      },
      {
        name: "Review de Código",
        page: "CodeReview",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Análise de código"
      },
      {
        name: "Gaps Técnicos",
        page: "TechnicalGapsAnalysis",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "none",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "none"
        },
        notes: "Gaps técnicos identificados"
      }
    ]
  },
  {
    category: "🚀 Trilhas Especiais",
    features: [
      {
        name: "Discovery Track",
        page: "Discovery",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "restricted"
        },
        notes: "Apenas alunos Discovery, Pioneer, Challenger"
      },
      {
        name: "Pioneer Track",
        page: "Pioneer",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "restricted"
        },
        notes: "Apenas alunos Pioneer, Challenger"
      },
      {
        name: "Challenger Track",
        page: "Challenger",
        access: {
          administrador: "total",
          coordenador_pedagogico: "total",
          instrutor: "total",
          gerente: "none",
          financeiro: "none",
          secretaria: "none",
          pai_responsavel: "none",
          aluno: "restricted"
        },
        notes: "Apenas alunos Challenger"
      }
    ]
  }
];

export default function AccessAuditPage() {
  const [selectedProfile, setSelectedProfile] = useState("administrador");
  const [selectedCategory, setSelectedCategory] = useState(featureAudit[0].category);

  const currentProfile = userProfiles[selectedProfile];
  const ProfileIcon = currentProfile.icon;

  // Contar features por nível de acesso
  const getAccessCounts = (profileType) => {
    const counts = { total: 0, parcial: 0, none: 0, restricted: 0 };
    
    featureAudit.forEach(cat => {
      cat.features.forEach(feat => {
        const accessLevel = feat.access[profileType];
        if (accessLevel === 'total') counts.total++;
        else if (accessLevel === 'parcial') counts.parcial++;
        else if (accessLevel === 'restricted') counts.restricted++;
        else counts.none++;
      });
    });

    return counts;
  };

  const accessCounts = getAccessCounts(selectedProfile);
  const totalFeatures = accessCounts.total + accessCounts.parcial + accessCounts.none + accessCounts.restricted;

  const getAccessBadge = (level) => {
    switch (level) {
      case 'total':
        return <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Acesso Total
        </Badge>;
      case 'parcial':
        return <Badge className="bg-blue-100 text-blue-800 border-0 flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Acesso Parcial
        </Badge>;
      case 'restricted':
        return <Badge className="bg-orange-100 text-orange-800 border-0 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Restrito
        </Badge>;
      case 'none':
        return <Badge className="bg-gray-100 text-gray-800 border-0 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Sem Acesso
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            🔐 Auditoria de Acesso
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Verificação completa de permissões por perfil de usuário
          </p>
        </div>

        {/* Profile Selector */}
        <Card className="border-2" style={{ borderColor: currentProfile.color }}>
          <CardHeader style={{ backgroundColor: currentProfile.color, color: 'white' }}>
            <CardTitle className="flex items-center gap-3">
              <ProfileIcon className="w-6 h-6" />
              {currentProfile.name}
            </CardTitle>
            <p className="text-sm opacity-90 mt-1">{currentProfile.description}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--success-light)' }}>
                <div className="text-3xl font-bold text-green-700">{accessCounts.total}</div>
                <div className="text-sm text-gray-600">Acesso Total</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--info-light)' }}>
                <div className="text-3xl font-bold text-blue-700">{accessCounts.parcial}</div>
                <div className="text-sm text-gray-600">Acesso Parcial</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--warning-light)' }}>
                <div className="text-3xl font-bold text-orange-700">{accessCounts.restricted}</div>
                <div className="text-sm text-gray-600">Restrito</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="text-3xl font-bold text-gray-700">{accessCounts.none}</div>
                <div className="text-sm text-gray-600">Sem Acesso</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <p className="text-sm font-semibold">
                Cobertura: {Math.round(((accessCounts.total + accessCounts.parcial) / totalFeatures) * 100)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${((accessCounts.total + accessCounts.parcial) / totalFeatures) * 100}%`,
                    backgroundColor: currentProfile.color
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={selectedProfile} onValueChange={setSelectedProfile}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {Object.entries(userProfiles).map(([key, profile]) => {
              const Icon = profile.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{profile.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Features Audit */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {featureAudit.map(cat => (
                  <TabsTrigger key={cat.category} value={cat.category} className="text-xs md:text-sm">
                    {cat.category.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {featureAudit.map(category => (
                <TabsContent key={category.category} value={category.category}>
                  <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.features.map((feature, idx) => {
                      const accessLevel = feature.access[selectedProfile];
                      
                      return (
                        <Card key={idx} className="border-l-4" style={{
                          borderLeftColor: 
                            accessLevel === 'total' ? '#27AE60' :
                            accessLevel === 'parcial' ? '#3498DB' :
                            accessLevel === 'restricted' ? '#F39C12' :
                            '#95A5A6'
                        }}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">{feature.name}</h4>
                                  {getAccessBadge(accessLevel)}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  Página: <code className="bg-gray-100 px-2 py-0.5 rounded">{feature.page}</code>
                                </p>
                                {feature.notes && (
                                  <p className="text-xs text-gray-500 italic">
                                    💡 {feature.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Acesso Completa</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <th className="p-3 text-left font-semibold">Funcionalidade</th>
                  {Object.entries(userProfiles).map(([key, profile]) => {
                    const Icon = profile.icon;
                    return (
                      <th key={key} className="p-3 text-center" style={{ color: profile.color }}>
                        <div className="flex flex-col items-center gap-1">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{profile.name.split(' ')[0]}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {featureAudit.flatMap(cat => cat.features).map((feature, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{feature.name}</td>
                    {Object.keys(userProfiles).map(profileKey => {
                      const access = feature.access[profileKey];
                      return (
                        <td key={profileKey} className="p-3 text-center">
                          {access === 'total' && <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />}
                          {access === 'parcial' && <Eye className="w-5 h-5 text-blue-600 mx-auto" />}
                          {access === 'restricted' && <Lock className="w-5 h-5 text-orange-600 mx-auto" />}
                          {access === 'none' && <XCircle className="w-5 h-5 text-gray-400 mx-auto" />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}