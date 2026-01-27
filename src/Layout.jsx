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
  Brain,
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
    title: "Gestão de Usuários 👥",
    url: createPageUrl("UserManagement"),
    icon: Users,
    restricted: ['administrador']
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
      <div className="min-h-screen flex w-full bg-neutral-light-200">
        
        {/* ═══════════════════════════════════════════════════════════════
            SIDEBAR PRINCIPAL
            ═══════════════════════════════════════════════════════════════ */}
        
        <Sidebar className="border-r border-neutral-light-300 bg-white">
          
          {/* ────────────────────────────────────────────────────────────
              SIDEBAR HEADER (Branding)
              ──────────────────────────────────────────────────────────── */}
          
          <SidebarHeader className="border-b border-neutral-light-300 p-6" style={{ background: 'linear-gradient(135deg, #5D4E9F 0%, #00A9CE 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#5D4E9F', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#3B8ECC', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#00A9CE', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M30 80 Q10 50 30 20 Q50 20 50 40 Q50 60 70 60 Q90 60 90 40 L90 20" 
                        fill="none" stroke="url(#logoGradient)" strokeWidth="12" strokeLinecap="round"/>
                  <circle cx="30" cy="20" r="6" fill="#F7941D"/>
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg tracking-tight text-white">
                  Innova Academy
                </h2>
                <p className="text-xs text-white/90">
                  Escola de IA
                </p>
              </div>
            </div>
          </SidebarHeader>

          {/* ────────────────────────────────────────────────────────────
              SIDEBAR CONTENT (Navigation)
              ──────────────────────────────────────────────────────────── */}
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    if (item.restricted && user && !item.restricted.includes(user.user_type)) {
                      return null;
                    }

                    const isActive = location.pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 rounded-xl transition-all duration-300 hover:scale-105 ${
                            isActive
                              ? 'text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50'
                          }`}
                          style={isActive ? { background: 'linear-gradient(135deg, #5D4E9F 0%, #00A9CE 100%)' } : {}}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  {/* ────────────────────────────────────────────────────
                      Debug Dashboard & Network Diagnostic (Admins)
                      ──────────────────────────────────────────────────── */}
                  
                  {user?.user_type === 'administrador' && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={`mb-1 rounded-xl transition-all duration-300 hover:scale-105 ${
                            location.pathname === createPageUrl("DebugDashboard")
                              ? 'bg-destructive text-white shadow-lg'
                              : 'text-gray-700 hover:bg-red-50'
                          }`}
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
                              ? 'bg-warning-500 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-yellow-50'
                          }`}
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

          {/* ────────────────────────────────────────────────────────────
              SIDEBAR FOOTER (User Profile & Logout)
              ──────────────────────────────────────────────────────────── */}
          
          <SidebarFooter className="border-t border-neutral-light-300 bg-neutral-light-100 p-4">
            {user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5D4E9F 0%, #00A9CE 100%)' }}>
                    <span className="font-semibold text-sm text-white">
                      {user.full_name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-innova-navy-500 truncate">
                      {user.full_name || "Aluno"}
                    </p>
                    <p className="text-xs text-neutral-dark-50 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-2 text-white hover:opacity-90 transition-all"
                  style={{ borderColor: '#5D4E9F', background: 'linear-gradient(135deg, #5D4E9F 0%, #00A9CE 100%)' }}
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

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
            ═══════════════════════════════════════════════════════════════ */}
        
        <main className="flex-1 flex flex-col">
          
          {/* ────────────────────────────────────────────────────────────
              HEADER (Mobile Trigger + Notifications)
              ──────────────────────────────────────────────────────────── */}
          
          <header className="border-b border-neutral-light-300 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="hover:bg-purple-50 p-2 rounded-lg transition-colors" />
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 100 100" className="w-6 h-6">
                    <defs>
                      <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#5D4E9F', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#3B8ECC', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00A9CE', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M30 80 Q10 50 30 20 Q50 20 50 40 Q50 60 70 60 Q90 60 90 40 L90 20" 
                          fill="none" stroke="url(#logoGradientMobile)" strokeWidth="12" strokeLinecap="round"/>
                    <circle cx="30" cy="20" r="6" fill="#F7941D"/>
                  </svg>
                  <h1 className="text-lg font-heading font-bold" style={{ background: 'linear-gradient(135deg, #5D4E9F 0%, #00A9CE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Innova Academy
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <NotificationBell />
              </div>
            </div>
          </header>

          {/* ────────────────────────────────────────────────────────────
              PAGE CONTENT (Children)
              ──────────────────────────────────────────────────────────── */}
          
          <div className="flex-1 overflow-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════════
            INNAI CHAT WIDGET (Conditional)
            ═══════════════════════════════════════════════════════════════ */}
        
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