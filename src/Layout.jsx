import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  BookOpen,
  ClipboardList,
  Calendar,
  Library,
  User,
  LogOut,
  GraduationCap,
  TrendingUp,
  Shield,
  Trophy,
  Code,
  Rocket,
  Crown,
  Users,
  Settings,
  Award,
  AlertTriangle,
  CheckCircle2,
  Target,
  Wifi,
  Zap,
  BarChart3,
  Joystick,
  Sparkles,
  Brain, // New icon for "Meu Coach de IA"
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import NotificationBell from "./components/layout/NotificationBell";
import QueryProvider from "./components/hooks/QueryProvider";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import ToastProvider from "./components/notifications/ToastProvider";
import InnAIChatWidget from "./components/innai/InnAIChatWidget";

// USANDO REACT QUERY
import { useCurrentUser, useLogout } from "@/components/hooks/useUser";

// Detectar ambiente de desenvolvimento
const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Portal dos Pais 👨‍👩‍👧",
    url: createPageUrl("ParentPortal"),
    icon: Users,
    restricted: ['pai_responsavel']
  },
  {
    title: "🧑‍🏫 Dashboard do Professor",
    url: createPageUrl("TeacherDashboard"),
    icon: GraduationCap,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "🤖 Meu Coach de IA",
    url: createPageUrl("AILearningCoach"),
    icon: Brain,
  },
  {
    title: "Auditoria de Acesso 🔐",
    url: createPageUrl("AccessAudit"),
    icon: Shield,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Secrets & API Keys 🔑",
    url: createPageUrl("SecretsManagement"),
    icon: Settings,
    restricted: ['administrador']
  },
  {
    title: "Comparação Plataformas 📊",
    url: createPageUrl("PlatformComparison"),
    icon: BarChart3,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Status do Sistema 🔧",
    url: createPageUrl("PlatformStatus"),
    icon: CheckCircle2,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Análise de Gaps 🎯",
    url: createPageUrl("ContentGapAnalysis"),
    icon: Target,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Gaps Resolvidos 🎯",
    url: createPageUrl("GapsDemonstration"),
    icon: Target,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Syllabus",
    url: createPageUrl("Syllabus"),
    icon: BookOpen,
  },
  {
    title: "Meu Caminho",
    url: createPageUrl("AdaptiveLearningPath"),
    icon: Target,
  },
  {
    title: "Meus Cursos",
    url: createPageUrl("Courses"),
    icon: BookOpen,
  },
  {
    title: "Discovery",
    url: createPageUrl("Discovery"),
    icon: Code,
    restricted: ['discovery', 'pioneer', 'challenger', 'administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Pioneer",
    url: createPageUrl("Pioneer"),
    icon: Rocket,
    restricted: ['pioneer', 'challenger', 'administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Challenger",
    url: createPageUrl("Challenger"),
    icon: Crown,
    restricted: ['challenger', 'administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Estrutura",
    url: createPageUrl("CourseStructure"),
    icon: GraduationCap,
  },
  {
    title: "Tarefas",
    url: createPageUrl("Assignments"),
    icon: ClipboardList,
  },
  {
    title: "Cronograma",
    url: createPageUrl("Schedule"),
    icon: Calendar,
  },
  {
    title: "Recursos",
    url: createPageUrl("Resources"),
    icon: Library,
  },
  {
    title: "Visualização de Dados 📊",
    url: createPageUrl("DataVisualization"),
    icon: BarChart3,
  },
  {
    title: "Gerador de Tarefas ✨",
    url: createPageUrl("AssignmentGenerator"),
    icon: Zap,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Analytics da Turma 📊",
    url: createPageUrl("ClassroomAnalytics"),
    icon: Users,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Gamificação",
    url: createPageUrl("Gamification"),
    icon: Trophy,
  },
  {
    title: "Bartle Assessment",
    url: createPageUrl("BartleAssessment"),
    icon: Joystick,
    restricted: ['estudante']
  },
  {
    title: "Alerta Precoce",
    url: createPageUrl("EarlyWarningDashboard"),
    icon: AlertTriangle,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Analytics VARK",
    url: createPageUrl("VARKAnalytics"),
    icon: BarChart3,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Curadoria Automática",
    url: createPageUrl("AutoCurationDashboard"),
    icon: Sparkles,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Capacitação Docente",
    url: createPageUrl("TeacherTraining"),
    icon: Users,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Certificações Docentes",
    url: createPageUrl("TeacherCertificationDashboard"),
    icon: Award,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Gestão de Turma",
    url: createPageUrl("ClassManagement"),
    icon: Users,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor', 'secretaria']
  },
  {
    title: "Ética em IA",
    url: createPageUrl("AIEthics"),
    icon: Shield,
  },
  {
    title: "Documentação 📚",
    url: createPageUrl("Documentation"),
    icon: BookOpen,
    restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
  },
  {
    title: "Review: InnAI 🤖",
    url: createPageUrl("InnAIReview"),
    icon: Brain,
    restricted: ['administrador', 'coordenador_pedagogico']
  },
  {
    title: "Perfil",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();

  // USANDO REACT QUERY
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Debug: log quando user muda (apenas em dev)
  React.useEffect(() => {
    if (isDevelopment) {
      console.log('👤 User updated:', user);
    }
  }, [user]);

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');

        :root {
          --primary-teal: #00A99D;
          --primary-navy: #2C3E50;
          --accent-orange: #FF6F3C;
          --accent-yellow: #FFC857;
          --neutral-light: #ECF0F1;
          --neutral-dark: #34495E;
          --neutral-medium: #BDC3C7;
          --success: #27AE60;
          --warning: #F39C12;
          --error: #E74C3C;
          --info: #3498DB;
          --background: #FFFFFF;
          --text-primary: #2C3E50;
          --text-secondary: #7F8C8D;
        }

        * {
          font-family: 'Lato', sans-serif;
        }

        h1, h2, h3, h4, h5, h6, .font-heading {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
        }

        body {
          background-color: var(--neutral-light);
          color: var(--text-primary);
        }

        .btn-primary {
          background-color: var(--primary-teal);
          color: var(--background);
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #008C82;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 169, 157, 0.3);
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--primary-teal);
          border: 2px solid var(--primary-teal);
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background-color: var(--primary-teal);
          color: var(--background);
        }

        .card-innova {
          background-color: var(--background);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .card-innova:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        input, textarea, select {
          background-color: var(--neutral-light);
          border: 1px solid var(--neutral-medium);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: 'Lato', sans-serif;
          transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 3px rgba(0, 169, 157, 0.1);
        }
      `}</style>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: 'var(--neutral-light)' }}>
        <Sidebar className="border-r" style={{ borderColor: 'var(--neutral-medium)', backgroundColor: 'var(--background)' }}>
          <SidebarHeader className="border-b p-6" style={{ borderColor: 'var(--neutral-medium)', backgroundColor: 'var(--primary-teal)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--background)' }}>
                <GraduationCap className="w-7 h-7" style={{ color: 'var(--primary-teal)' }} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg tracking-tight" style={{ color: 'var(--background)' }}>Innova Academy</h2>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Portal do Aluno</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    if (item.restricted && user && !item.restricted.includes(user.user_type)) {
                      return null;
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 rounded-xl transition-all duration-300 hover:scale-105 ${
                            location.pathname === item.url
                              ? 'shadow-lg'
                              : ''
                          }`}
                          style={location.pathname === item.url ? {
                            backgroundColor: 'var(--primary-teal)',
                            color: 'var(--background)'
                          } : {
                            color: 'var(--text-primary)'
                          }}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  {/* Debug Dashboard & Network Diagnostic - apenas admins */}
                  {user?.user_type === 'administrador' && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 rounded-xl transition-all duration-300 hover:scale-105 ${
                            location.pathname === createPageUrl("DebugDashboard")
                              ? 'shadow-lg'
                              : ''
                          }`}
                          style={location.pathname === createPageUrl("DebugDashboard") ? {
                            backgroundColor: 'var(--error)',
                            color: 'var(--background)'
                          } : {
                            color: 'var(--text-primary)'
                          }}
                        >
                          <Link to={createPageUrl("DebugDashboard")} className="flex items-center gap-3 px-4 py-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">Debug</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 rounded-xl transition-all duration-300 hover:scale-105 ${
                            location.pathname === createPageUrl("NetworkDiagnostic")
                              ? 'shadow-lg'
                              : ''
                          }`}
                          style={location.pathname === createPageUrl("NetworkDiagnostic") ? {
                            backgroundColor: 'var(--warning)',
                            color: 'var(--background)'
                          } : {
                            color: 'var(--text-primary)'
                          }}
                        >
                          <Link to={createPageUrl("NetworkDiagnostic")} className="flex items-center gap-3 px-4 py-3">
                            <Wifi className="w-5 h-5" />
                            <span className="font-medium">Rede</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4" style={{ borderColor: 'var(--neutral-medium)', backgroundColor: 'var(--neutral-light)' }}>
            {user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-teal)' }}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--background)' }}>
                      {user.full_name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {user.full_name || "Aluno"}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 transition-all btn-secondary"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4" />
                  {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b px-6 py-4 shadow-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--neutral-medium)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="hover:bg-opacity-10 p-2 rounded-lg transition-colors" />
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6" style={{ color: 'var(--primary-teal)' }} />
                  <h1 className="text-lg font-heading font-bold" style={{ color: 'var(--text-primary)' }}>Innova Academy</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <NotificationBell />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>

        {/* InnAI Chat Widget - sempre visível quando autenticado */}
        {user && user.onboarding_completed && (
          <InnAIChatWidget pageContext={currentPageName} />
        )}
      </div>
    </SidebarProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </ToastProvider>
    </QueryProvider>
  );
}