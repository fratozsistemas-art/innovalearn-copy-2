import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Code, 
  BarChart3, 
  Download, 
  ExternalLink,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

const courses = {
  curiosity: {
    title: "Curiosity (6+ anos)",
    theme: "Despertar Digital - Meu Primeiro Avatar com IA",
    artifact: "Avatar IA gerado por prompts",
    technology: "IA Generativa (DALL-E, Midjourney)",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    icon: Brain,
  },
  discovery: {
    title: "Discovery (9+ anos)",
    theme: "Descobrindo como as Máquinas Pensam",
    artifact: "Classificador de Objetos (Machine Learning)",
    technology: "Google Teachable Machine",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: Code,
  },
  pioneer: {
    title: "Pioneer (12+ anos)",
    theme: "Construindo com Código - Primeiro Chatbot",
    artifact: "Chatbot Inteligente em Python",
    technology: "Python + ChatGPT API + Google Colab",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    icon: Code,
  },
  challenger: {
    title: "Challenger (14+ anos)",
    theme: "Inovando com Dados - Dashboard de Insights",
    artifact: "Dashboard Interativo de Análise de Dados",
    technology: "Python (Pandas, Plotly) + Google Colab",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    icon: BarChart3,
  },
};

const visualResources = [
  {
    title: "Tipos de Gráficos",
    description: "Referência visual para escolha de gráficos apropriados",
    image: "/images/semana_0/tipos_graficos.png",
    type: "Guia Visual",
  },
  {
    title: "Banco de Palavras",
    description: "Vocabulário técnico organizado por níveis de cursos",
    image: "/images/semana_0/banco_palavras.png",
    type: "Referência",
  },
  {
    title: "Menu Lateral",
    description: "Estrutura de navegação da plataforma",
    image: "/images/semana_0/sidebar_menu.png",
    type: "Interface",
  },
];

export default function WeekZeroResources() {
  const [selectedCourse, setSelectedCourse] = React.useState('curiosity');

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-innova-navy-500">
          Semana 0 - Recursos Pedagógicos (2026)
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Materiais completos para a aula inaugural de nivelamento e aplicabilidade
        </p>
      </div>

      {/* Course Selection */}
      <Tabs value={selectedCourse} onValueChange={setSelectedCourse} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-2">
          {Object.entries(courses).map(([key, course]) => {
            const Icon = course.icon;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{course.title.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(courses).map(([key, course]) => {
          const Icon = course.icon;
          return (
            <TabsContent key={key} value={key} className="space-y-6">
              {/* Course Overview */}
              <Card className={`border-2 ${course.color}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-8 h-8" />
                    <CardTitle className="text-2xl">{course.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    <strong>Tema:</strong> {course.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Artefato:</strong> {course.artifact}
                  </div>
                  <div>
                    <strong>Tecnologia:</strong> {course.technology}
                  </div>
                  <div>
                    <strong>Duração:</strong> 120 minutos (2 horas)
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentos Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      asChild
                    >
                      <a 
                        href={`/semana_0_2026/${key}/Semana0_${key.charAt(0).toUpperCase() + key.slice(1)}_PlanoDetalhado.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <BookOpen className="w-5 h-5" />
                          <div className="text-left flex-1">
                            <div className="font-semibold">Plano de Aula Detalhado</div>
                            <div className="text-xs text-gray-500">Markdown completo</div>
                          </div>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </a>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      asChild
                    >
                      <a 
                        href={`/semana_0_2026/${key}/Semana0_${key.charAt(0).toUpperCase() + key.slice(1)}_Atividades.csv`}
                        download
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Download className="w-5 h-5" />
                          <div className="text-left flex-1">
                            <div className="font-semibold">Tabela de Atividades</div>
                            <div className="text-xs text-gray-500">CSV estruturado</div>
                          </div>
                          <Download className="w-4 h-4" />
                        </div>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Visual Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Recursos Visuais
          </CardTitle>
          <CardDescription>
            Imagens de referência para apoio pedagógico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visualResources.map((resource, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative group">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a href={resource.image} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Completo
                      </a>
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-innova-teal-100 text-innova-teal-700 rounded">
                      {resource.type}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação Geral</CardTitle>
          <CardDescription>
            Guias de implementação e referência técnica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" asChild>
              <a href="/semana_0_2026/README.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                README Principal
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/semana_0_2026/INDEX.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Índice Rápido
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/semana_0_2026/INTEGRATION_GUIDE.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Guia de Integração
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/semana_0_2026/IMPLEMENTATION_SUMMARY.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Resumo Executivo
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/semana_0_2026/README_MASTER.md" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Doc. Completa
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
