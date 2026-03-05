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
  SidebarGroupLabel,
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
import { useCurrentUser, useLogout } from "@/components/hooks/useUser";

const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Organized navigation structure for MVP
const navigationStructure = {
  main: [
    {
      title: "Início",
      url: createPageUrl("Dashboard"),
      icon: Home,
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
      title: "Syllabus",
      url: createPageUrl("Syllabus"),
      icon: BookOpen,
    },
  ],
  learning: [
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
      title: "Semana 0 (2026)",
      url: createPageUrl("WeekZero"),
      icon: Sparkles,
      restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
    },
  ],
  projects: [
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
  ],
  engagement: [
    {
      title: "Gamificação",
      url: createPageUrl("Gamification"),
      icon: Trophy,
    },
    {
      title: "Meu Coach de IA",
      url: createPageUrl("AILearningCoach"),
      icon: Brain,
    },
  ],
  teacher: [
    {
      title: "Dashboard do Professor",
      url: createPageUrl("TeacherDashboard"),
      icon: GraduationCap,
      restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
    },
    {
      title: "Gestão de Turma",
      url: createPageUrl("ClassManagement"),
      icon: Users,
      restricted: ['administrador', 'coordenador_pedagogico', 'instrutor', 'secretaria']
    },
    {
      title: "Analytics da Turma",
      url: createPageUrl("ClassroomAnalytics"),
      icon: BarChart3,
      restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
    },
  ],
  parent: [
    {
      title: "Portal dos Pais",
      url: createPageUrl("ParentPortal"),
      icon: Users,
      restricted: ['pai_responsavel']
    },
  ],
  admin: [
    {
      title: "Analytics",
      url: createPageUrl("Analytics"),
      icon: TrendingUp,
      restricted: ['administrador', 'coordenador_pedagogico', 'instrutor']
    },
    {
      title: "Gestão de Usuários",
      url: createPageUrl("UserManagement"),
      icon: Users,
      restricted: ['administrador']
    },
    {
      title: "Status do Sistema",
      url: createPageUrl("PlatformStatus"),
      icon: CheckCircle2,
      restricted: ['administrador', 'coordenador_pedagogico']
    },
  ],
};

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  React.useEffect(() => {
    if (isDevelopment) {
      console.log('👤 User updated:', user);
    }
  }, [user]);

  const renderNavigationGroup = (items, groupLabel = null) => {
    const filteredItems = items.filter(item => {
      if (item.restricted && user && !item.restricted.includes(user.user_type)) {
        return false;
      }
      return true;
    });

    if (filteredItems.length === 0) return null;

    return (
      <SidebarGroup key={groupLabel || 'default'}>
        {groupLabel && (
          <SidebarGroupLabel className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-4 py-2">
            {groupLabel}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`mb-1 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#007A72] text-white shadow-md'
                        : 'text-[#F8F9FA] hover:bg-white/10'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-4 py-2.5">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-neutral-light-200">
        
        <Sidebar className="border-r border-neutral-light-300 bg-white">
          
          <SidebarHeader className="border-b border-[#4B5563] p-6 bg-gradient-to-br from-[#007A72] to-[#2C3E50]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00A99D', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#2C3E50', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M30 80 Q10 50 30 20 Q50 20 50 40 Q50 60 70 60 Q90 60 90 40 L90 20" 
                        fill="none" stroke="url(#logoGradient)" strokeWidth="12" strokeLinecap="round"/>
                  <circle cx="30" cy="20" r="6" fill="#FF6F3C"/>
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

          <SidebarContent className="p-3 overflow-y-auto">
            {renderNavigationGroup(navigationStructure.main)}
            {renderNavigationGroup(navigationStructure.learning, "Aprendizado")}
            {renderNavigationGroup(navigationStructure.projects, "Projetos")}
            {renderNavigationGroup(navigationStructure.engagement, "Engajamento")}
            {renderNavigationGroup(navigationStructure.teacher, "Professor")}
            {renderNavigationGroup(navigationStructure.parent, "Família")}
            {renderNavigationGroup(navigationStructure.admin, "Administração")}

            {/* Debug section for admins */}
            {user?.user_type === 'administrador' && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-[#F87171] uppercase tracking-wider px-4 py-2">
                  Debug
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="mb-1 rounded-xl text-[#F8F9FA] hover:bg-white/10"
                      >
                        <Link to={createPageUrl("DebugDashboard")} className="flex items-center gap-3 px-4 py-2.5">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium text-sm">Debug Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-neutral-light-300 p-4">
            <div className="flex items-center justify-between gap-2">
              <Link to={createPageUrl("Profile")}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-[#F8F9FA] hover:bg-white/10">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-semibold">Perfil</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-white/10 text-[#FCA5A5]"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sair</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-[#DEE2E6] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-heading font-bold text-[#1F2937]">
                {currentPageName || 'InnovaLearn'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-innova-teal-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-innova-teal-700">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2937] hidden md:block">
                    {user.name}
                  </span>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      <InnAIChatWidget />
    </SidebarProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <QueryProvider>
      <ErrorBoundary>
        <ToastProvider>
          <LayoutContent children={children} currentPageName={currentPageName} />
        </ToastProvider>
      </ErrorBoundary>
    </QueryProvider>
  );
}