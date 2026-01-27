import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Rocket, Sparkles, Calendar, Target } from "lucide-react";

const PublicRoadmap = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("q1");

  const roadmapData = {
    q1: {
      title: "Q1 2026 (Jan-Mar)",
      status: "in-progress",
      items: [
        {
          title: "Innova Academy Branding Migration",
          status: "completed",
          date: "January 27, 2026",
          description: "Complete visual identity update with official Innova color palette and design system.",
          impact: "high"
        },
        {
          title: "Security Vulnerability Remediation",
          status: "completed",
          date: "January 27, 2026",
          description: "Fixed 8 critical and high-severity security vulnerabilities including XSS and command injection.",
          impact: "critical"
        },
        {
          title: "Base44 SDK Integration",
          status: "completed",
          date: "January 27, 2026",
          description: "Replaced placeholder entities with proper Base44 SDK implementation for 22 entities and integrations.",
          impact: "high"
        },
        {
          title: "v1.0 MVP Launch",
          status: "in-progress",
          date: "February 23, 2026",
          description: "Initial platform launch with 120 curated lessons, gamification v1.0, and essential teacher/parent portals.",
          impact: "critical"
        },
        {
          title: "Pilot School Rollout",
          status: "planned",
          date: "February 23 - March 15, 2026",
          description: "Controlled launch to 3-5 partner schools with intensive support and feedback collection.",
          impact: "high"
        }
      ]
    },
    q2: {
      title: "Q2 2026 (Apr-Jun)",
      status: "planned",
      items: [
        {
          title: "Curiosity Studio - Phase 1",
          status: "planned",
          date: "April 2026",
          description: "Launch AI Image Generator, AI Story Writer, and Blockly Studio for creative expression.",
          impact: "high"
        },
        {
          title: "Curiosity Studio - Phase 2",
          status: "planned",
          date: "May 2026",
          description: "Add Music Composer and 3D Design Studio with soft launch to pilot schools.",
          impact: "medium"
        },
        {
          title: "AI Learning Coach Enhancement",
          status: "planned",
          date: "April-May 2026",
          description: "Enhanced AI coach with personalized study plans, proactive interventions, and contextual homework help.",
          impact: "high"
        },
        {
          title: "Quill Editor Security Update",
          status: "planned",
          date: "April-June 2026",
          description: "Evaluate and migrate to secure rich text editor, resolving remaining moderate-severity vulnerability.",
          impact: "medium"
        },
        {
          title: "Controlled Platform Expansion",
          status: "planned",
          date: "March 16 - April 30, 2026",
          description: "Expand to 10-15 schools with 500-800 students, validating scalability and support processes.",
          impact: "high"
        },
        {
          title: "Public Launch",
          status: "planned",
          date: "May 1, 2026",
          description: "Open platform to all interested schools and families with self-service onboarding.",
          impact: "critical"
        }
      ]
    },
    q3: {
      title: "Q3 2026 (Jul-Sep)",
      status: "planned",
      items: [
        {
          title: "VARK UI Adaptation (Phase 2)",
          status: "planned",
          date: "July-August 2026",
          description: "Dynamic UI adaptation based on learning styles with visual, auditory, and kinesthetic modes.",
          impact: "high"
        },
        {
          title: "Advanced Gamification (v2.0)",
          status: "planned",
          date: "July-September 2026",
          description: "Dynamic quest system, complete virtual store, achievement trees, and social competition features.",
          impact: "high"
        },
        {
          title: "Curiosity Studio - Complete Suite",
          status: "planned",
          date: "July 2026",
          description: "Add Video Editor, Podcast Studio, and Animation Creator to complete creative toolkit.",
          impact: "medium"
        },
        {
          title: "Grades 6-8 Content Expansion",
          status: "planned",
          date: "July-September 2026",
          description: "Comprehensive middle school curriculum with advanced topics and assessments.",
          impact: "high"
        },
        {
          title: "Foreign Language Courses",
          status: "planned",
          date: "August-September 2026",
          description: "Launch English and Spanish language learning programs with interactive exercises.",
          impact: "medium"
        }
      ]
    },
    q4: {
      title: "Q4 2026 (Oct-Dec)",
      status: "planned",
      items: [
        {
          title: "High School Curriculum (Grades 9-12)",
          status: "planned",
          date: "October-December 2026",
          description: "Advanced high school content including exam preparation and college readiness.",
          impact: "high"
        },
        {
          title: "Arts and Music Education",
          status: "planned",
          date: "October-November 2026",
          description: "Comprehensive arts curriculum with music theory, visual arts, and performance.",
          impact: "medium"
        },
        {
          title: "Teacher Certification Program",
          status: "planned",
          date: "October-December 2026",
          description: "Professional development certification for educators with specialized training modules.",
          impact: "medium"
        },
        {
          title: "B2B Corporate Features",
          status: "planned",
          date: "November-December 2026",
          description: "Enterprise features for large school districts and educational secretariats.",
          impact: "high"
        },
        {
          title: "Mobile App (iOS/Android)",
          status: "planned",
          date: "November-December 2026",
          description: "Native mobile applications for on-the-go learning and offline access.",
          impact: "high"
        }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-innova-teal-600" />;
      case "planned":
        return <Rocket className="h-5 w-5 text-innova-navy-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      "in-progress": "bg-innova-teal-100 text-innova-teal-800 border-innova-teal-200",
      planned: "bg-innova-navy-100 text-innova-navy-800 border-innova-navy-200"
    };
    
    const labels = {
      completed: "Concluído",
      "in-progress": "Em Andamento",
      planned: "Planejado"
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getImpactBadge = (impact) => {
    const variants = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-innova-orange-100 text-innova-orange-800 border-innova-orange-200",
      medium: "bg-innova-yellow-100 text-innova-yellow-800 border-innova-yellow-200"
    };

    const labels = {
      critical: "Crítico",
      high: "Alto Impacto",
      medium: "Médio Impacto"
    };

    return (
      <Badge variant="outline" className={variants[impact]}>
        {labels[impact]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-8 w-8 text-innova-teal-600" />
          <h1 className="text-3xl font-bold text-innova-navy-900">Roadmap InnovaLearn 2026</h1>
        </div>
        <p className="text-lg text-gray-600">
          Acompanhe o desenvolvimento da plataforma e as próximas funcionalidades planejadas.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-xs text-green-700">Itens finalizados</p>
          </CardContent>
        </Card>

        <Card className="border-innova-teal-200 bg-innova-teal-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-innova-teal-900">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-innova-teal-600">2</div>
            <p className="text-xs text-innova-teal-700">Itens ativos</p>
          </CardContent>
        </Card>

        <Card className="border-innova-navy-200 bg-innova-navy-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-innova-navy-900">Planejados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-innova-navy-600">15</div>
            <p className="text-xs text-innova-navy-700">Próximas entregas</p>
          </CardContent>
        </Card>

        <Card className="border-innova-orange-200 bg-innova-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-innova-orange-900">Alto Impacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-innova-orange-600">12</div>
            <p className="text-xs text-innova-orange-700">Funcionalidades críticas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedQuarter} onValueChange={setSelectedQuarter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="q1">Q1 2026</TabsTrigger>
          <TabsTrigger value="q2">Q2 2026</TabsTrigger>
          <TabsTrigger value="q3">Q3 2026</TabsTrigger>
          <TabsTrigger value="q4">Q4 2026</TabsTrigger>
        </TabsList>

        {Object.entries(roadmapData).map(([quarter, data]) => (
          <TabsContent key={quarter} value={quarter} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-innova-navy-900">{data.title}</h2>
              {getStatusBadge(data.status)}
            </div>

            <div className="space-y-4">
              {data.items.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                          <CardDescription className="text-sm mb-3">
                            {item.description}
                          </CardDescription>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(item.status)}
                            {getImpactBadge(item.impact)}
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.date}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8 border-innova-teal-200 bg-innova-teal-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-innova-teal-600" />
            <CardTitle className="text-innova-teal-900">Sobre o Roadmap</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-innova-teal-800 space-y-2">
          <p>
            Este roadmap representa nosso planejamento atual para 2026. As datas e funcionalidades podem ser ajustadas
            com base no feedback dos usuários, prioridades de negócio e descobertas técnicas.
          </p>
          <p>
            <strong>Lançamento Progressivo:</strong> Adotamos uma estratégia de lançamento progressivo, começando com
            escolas piloto e expandindo gradualmente para garantir qualidade e estabilidade.
          </p>
          <p>
            <strong>Feedback Contínuo:</strong> Suas sugestões e feedback são essenciais para priorizar o desenvolvimento.
            Entre em contato através dos canais de suporte para compartilhar suas ideias!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicRoadmap;
