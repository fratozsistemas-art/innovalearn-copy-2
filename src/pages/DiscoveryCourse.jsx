import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, Globe, Music, DollarSign, BookOpen, Clock, Target, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const moduleIcons = { 1: Globe, 2: Code, 3: Music, 4: DollarSign };

const modulesData = [
  {
    id: 'discovery-1',
    order: 1,
    title: 'ClimatePredict',
    description: 'Previsão climática com Python e dados do INMET',
    stakeholder: 'INMET',
    semester: 1,
    duration_weeks: 18,
    objectives: [
      'Fundamentos de Python para análise de dados',
      'Trabalhar com datasets reais do INMET',
      'Criar modelos preditivos básicos',
      'Visualizar dados climáticos'
    ],
    lessons: [
      { order: 1, title: 'Introdução ao Python', description: 'Primeiros passos com Python e Jupyter', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Variáveis e Tipos de Dados', description: 'Trabalhando com números, textos e listas', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Coletando Dados Climáticos', description: 'Usando APIs do INMET', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Introdução ao Pandas', description: 'Manipulação de dados com DataFrames', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Limpeza de Dados', description: 'Tratando dados faltantes e inconsistentes', duration_minutes: 120, media_type: 'interactive' },
      { order: 6, title: 'Visualização com Matplotlib', description: 'Criando gráficos de temperatura', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Análise Exploratória', description: 'Descobrindo padrões nos dados', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Projeto Checkpoint 1', description: 'Dashboard de temperatura mensal', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Machine Learning Básico', description: 'Introdução a Scikit-learn', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Regressão Linear', description: 'Prevendo temperatura futura', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Avaliando Modelos', description: 'Métricas de performance (MAE, RMSE)', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Apresentando para INMET', description: 'Preparando apresentação stakeholder', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Otimizando o Modelo', description: 'Melhorando previsões', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Sistema completo de previsão', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para INMET e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'discovery-2',
    order: 2,
    title: 'SkyNet',
    description: 'Classificação de objetos celestes com NASA',
    stakeholder: 'NASA',
    semester: 2,
    duration_weeks: 18,
    objectives: [
      'Computer Vision com Python',
      'Trabalhar com datasets astronômicos',
      'Classificação de imagens com ML',
      'APIs da NASA'
    ],
    lessons: [
      { order: 1, title: 'Introdução à Computer Vision', description: 'Como computadores "veem"', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Processamento de Imagens', description: 'OpenCV básico', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'API da NASA', description: 'Acessando imagens astronômicas', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Estrelas, Planetas e Galáxias', description: 'Diferenciando objetos celestes', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Preparando Dataset', description: 'Organizar e rotular imagens', duration_minutes: 120, media_type: 'interactive' },
      { order: 6, title: 'K-Nearest Neighbors', description: 'Primeiro algoritmo de classificação', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Treinando Classificador', description: 'Scikit-learn para imagens', duration_minutes: 120, media_type: 'interactive' },
      { order: 8, title: 'Projeto Checkpoint 1', description: 'Classificador de 3 tipos de objetos', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Redes Neurais Básicas', description: 'Introdução a TensorFlow', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'CNN para Astronomia', description: 'Convolutional Neural Networks', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Transfer Learning', description: 'Usando modelos pré-treinados', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Melhorando Acurácia', description: 'Data augmentation e tunning', duration_minutes: 120, media_type: 'interactive' },
      { order: 14, title: 'Interface Web', description: 'Deploy do modelo com Streamlit', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'SkyNet completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para NASA e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'discovery-3',
    order: 3,
    title: 'MusicChess',
    description: 'IA para música e estratégia de xadrez',
    stakeholder: 'Conservatório',
    semester: 3,
    duration_weeks: 18,
    objectives: [
      'Processamento de áudio com Python',
      'Algoritmos de xadrez',
      'Criação musical com IA',
      'Combinação de domínios'
    ],
    lessons: [
      { order: 1, title: 'Música e Dados', description: 'Representando música em Python', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Librosa Básico', description: 'Analisando áudio', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Reconhecimento de Gênero Musical', description: 'Classificando estilos', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Geração de Melodias', description: 'Markov Chains para música', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Introdução ao Xadrez', description: 'Regras e notação', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Python Chess Library', description: 'Programando movimentos', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Minimax Algorithm', description: 'IA básica para xadrez', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Projeto Checkpoint 1', description: 'Bot de xadrez simples', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Conectando Xadrez e Música', description: 'Sonificação de partidas', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Compositores Algorítmicos', description: 'RNN para geração musical', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Estilo Baseado em Estratégia', description: 'Música que reflete jogo', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Interface Musical', description: 'Criar interface web com sons', duration_minutes: 120, media_type: 'interactive' },
      { order: 14, title: 'Apresentação para Conservatório', description: 'Preparando demo artística', duration_minutes: 120, media_type: 'video' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'MusicChess completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Performance musical + xadrez', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'discovery-4',
    order: 4,
    title: 'FinanceAI',
    description: 'Análise financeira com machine learning',
    stakeholder: 'Banco Central',
    semester: 4,
    duration_weeks: 18,
    objectives: [
      'Análise de dados financeiros',
      'Previsão de séries temporais',
      'Educação financeira com IA',
      'Ética em FinTech'
    ],
    lessons: [
      { order: 1, title: 'Introdução a Finanças', description: 'Conceitos básicos de economia', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Dados Financeiros', description: 'APIs do Banco Central', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Inflação e IPCA', description: 'Analisando índices econômicos', duration_minutes: 120, media_type: 'video' },
      { order: 4, title: 'Visualização Financeira', description: 'Dashboards com Plotly', duration_minutes: 120, media_type: 'interactive' },
      { order: 5, title: 'Séries Temporais', description: 'Dados ao longo do tempo', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Previsão de Inflação', description: 'ARIMA e Prophet', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Educação Financeira Pessoal', description: 'Orçamento inteligente', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Projeto Checkpoint 1', description: 'App de controle financeiro', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Classificação de Gastos', description: 'Categorizando despesas com NLP', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Detecção de Anomalias', description: 'Identificando gastos suspeitos', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Chatbot Financeiro', description: 'Assistente de educação financeira', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Ética em FinTech', description: 'Viés algorítmico e inclusão', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação Banco Central', description: 'Preparando proposta oficial', duration_minutes: 120, media_type: 'video' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Plataforma FinanceAI completa', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para Banco Central e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  }
];

export default function DiscoveryCourse() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Syllabus"))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Syllabus
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl"
          style={{ background: 'linear-gradient(135deg, var(--success) 0%, var(--primary-navy) 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-12 h-12" />
              <Badge className="border-0 text-lg px-4 py-2" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                9-11 anos
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Discovery - Explorar as Ferramentas da Criação
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Python real, Machine Learning e projetos com stakeholders externos (INMET, NASA, Conservatório, Banco Central)
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">2 anos</div>
                <div className="text-sm opacity-90">Duração</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">4</div>
                <div className="text-sm opacity-90">Módulos</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">64</div>
                <div className="text-sm opacity-90">Lições</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">128h</div>
                <div className="text-sm opacity-90">Carga Horária</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="font-heading text-lg">Competências Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'APIs', 'Data Visualization', 'ML Básico'].map((comp, idx) => (
                  <Badge key={idx} variant="outline" 
                    style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="font-heading text-lg">Certificações Preparadas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {['Python PCEP', 'Google AI Fundamentals'].map((comp, idx) => (
                  <Badge key={idx} className="border-0" 
                    style={{ backgroundColor: 'rgba(39, 174, 96, 0.2)', color: 'var(--success)' }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            4 Módulos Semestrais com Stakeholders Reais
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {modulesData.map((module) => {
              const ModuleIcon = moduleIcons[module.order] || BookOpen;
              
              return (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="border-2 rounded-xl overflow-hidden shadow-lg"
                  style={{ borderColor: 'var(--success)' }}
                >
                  <AccordionTrigger 
                    className="px-6 py-4 hover:no-underline"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: 'var(--success)' }}
                      >
                        <ModuleIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Módulo {module.order}: {module.title}
                          </h4>
                          <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                            Semestre {module.semester}
                          </Badge>
                          <Badge variant="outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                            {module.stakeholder}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {module.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration_weeks} semanas
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {module.lessons.length} lições
                          </span>
                          <span>⏱️ {module.lessons.length * 2}h</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 py-4" style={{ backgroundColor: 'var(--neutral-light)' }}>
                    
                    {module.objectives && module.objectives.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <Target className="w-5 h-5" style={{ color: 'var(--success)' }} />
                          Objetivos de Aprendizado
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
                      <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <PlayCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                        📝 {module.lessons.length} Lições
                      </h5>
                      
                      <div className="grid gap-3">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.order}
                            className="p-4 rounded-lg border-l-4"
                            style={{ 
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--success)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: 'var(--success)' }}
                              >
                                {lesson.order}
                              </div>
                              <div className="flex-1">
                                <h6 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                  {lesson.title}
                                </h6>
                                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                  {lesson.description}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <Badge variant="outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                                    {lesson.media_type}
                                  </Badge>
                                  <Badge variant="outline">
                                    ⏱️ {lesson.duration_minutes} min
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

      </div>
    </div>
  );
}