import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket, Globe, Music, DollarSign, BookOpen, Clock, Target, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const moduleIcons = { 1: Globe, 2: Rocket, 3: Music, 4: DollarSign };

const modulesData = [
  {
    id: 'pioneer-1',
    order: 1,
    title: 'CerradoWatch',
    description: 'Sistema nacional de monitoramento ambiental em produção',
    stakeholder: 'IBAMA',
    semester: 1,
    duration_weeks: 18,
    objectives: [
      'Deep Learning com TensorFlow/PyTorch',
      'Computer Vision avançada (U-Net, CNNs)',
      'Deploy em produção com Docker',
      'Trabalhar com stakeholder governamental'
    ],
    lessons: [
      { order: 1, title: 'Visão Geral do Projeto', description: 'Desmatamento no Cerrado e o papel da IA', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Arquitetura de Sistemas de Monitoramento', description: 'Do satélite ao alerta', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Imagens de Satélite', description: 'Trabalhando com dados geoespaciais', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Segmentação Semântica', description: 'U-Net para detecção de desmatamento', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Transfer Learning Avançado', description: 'Fine-tuning ResNet e EfficientNet', duration_minutes: 120, media_type: 'interactive' },
      { order: 6, title: 'Data Augmentation', description: 'Aumentando dataset de treinamento', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Métricas de Performance', description: 'IoU, Precision, Recall para segmentação', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - Modelo Baseline', description: 'Primeiro modelo funcional', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Backend com FastAPI', description: 'Criando API REST para o modelo', duration_minutes: 120, media_type: 'interactive' },
      { order: 11, title: 'Frontend com React', description: 'Interface para visualizar alertas', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Containerização com Docker', description: 'Preparando para deploy', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Deploy em Produção', description: 'AWS EC2 e monitoramento', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação para IBAMA', description: 'Demo e feedback stakeholder', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Sistema completo em produção', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para IBAMA e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'pioneer-2',
    order: 2,
    title: 'SETI-AI',
    description: 'Detecção de sinais extraterrestres com deep learning',
    stakeholder: 'NASA/SETI',
    semester: 2,
    duration_weeks: 18,
    objectives: [
      'Processamento de sinais com Deep Learning',
      'Transformers para dados temporais',
      'Trabalhar com dados astronômicos',
      'Sistema escalável de análise'
    ],
    lessons: [
      { order: 1, title: 'O que é SETI?', description: 'Busca por inteligência extraterrestre', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Sinais de Rádio', description: 'Como telescópios captam dados', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Datasets SETI', description: 'Breakthrough Listen e dados abertos', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Preprocessamento de Sinais', description: 'FFT e espectrogramas', duration_minutes: 120, media_type: 'interactive' },
      { order: 5, title: 'CNNs para Sinais', description: 'Classificação de padrões', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Recurrent Neural Networks', description: 'LSTMs para séries temporais', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Transformers para Sinais', description: 'Atenção em dados temporais', duration_minutes: 120, media_type: 'interactive' },
      { order: 8, title: 'Checkpoint 1 - Detector Básico', description: 'Modelo funcional', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Apache Spark', description: 'Processamento distribuído de dados', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Pipeline Escalável', description: 'Processando petabytes de dados', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Redução de Falsos Positivos', description: 'Otimizando precisão', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Dashboard de Monitoramento', description: 'Visualização em tempo real', duration_minutes: 120, media_type: 'interactive' },
      { order: 14, title: 'Apresentação para NASA/SETI', description: 'Demo e feedback', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Sistema SETI-AI completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para NASA e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'pioneer-3',
    order: 3,
    title: 'ArtStrategy',
    description: 'Plataforma de arte generativa e xadrez com IA',
    stakeholder: 'Museus',
    semester: 3,
    duration_weeks: 18,
    objectives: [
      'GANs para geração de arte',
      'Reinforcement Learning para xadrez',
      'Sistemas multimodais',
      'Plataforma web escalável'
    ],
    lessons: [
      { order: 1, title: 'Arte e Tecnologia', description: 'História da arte digital', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Generative Adversarial Networks', description: 'Teoria e arquitetura de GANs', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Treinando StyleGAN', description: 'Gerando pinturas originais', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Latent Space Exploration', description: 'Navegando no espaço criativo', duration_minutes: 120, media_type: 'interactive' },
      { order: 5, title: 'Music Generation com RNNs', description: 'Compondo música com IA', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Engines de Xadrez', description: 'Stockfish e avaliação de posições', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Reinforcement Learning', description: 'Q-Learning e DQN', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - Bot + Gerador', description: 'Protótipo funcional', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Conectando Domínios', description: 'Arte baseada em estratégia de xadrez', duration_minutes: 120, media_type: 'interactive' },
      { order: 11, title: 'WebRTC para Multiplayer', description: 'Xadrez online em tempo real', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Galeria Interativa', description: 'Exibindo arte gerada', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Microserviços', description: 'Arquitetura escalável', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação para Museus', description: 'Demo artística', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Plataforma ArtStrategy completa', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Exposição interativa', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'pioneer-4',
    order: 4,
    title: 'EthicalFinAI',
    description: 'Sistema bancário com IA ética e explicável',
    stakeholder: 'Fintechs',
    semester: 4,
    duration_weeks: 18,
    objectives: [
      'NLP com BERT/GPT',
      'Explicabilidade (XAI)',
      'Ética em IA financeira',
      'Blockchain e segurança'
    ],
    lessons: [
      { order: 1, title: 'Fintech e Revolução Bancária', description: 'O futuro das finanças', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'NLP para Finanças', description: 'Análise de sentimento de notícias', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'BERT e Transformers', description: 'State-of-the-art em NLP', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Classificação de Transações', description: 'Categorizando gastos automaticamente', duration_minutes: 120, media_type: 'interactive' },
      { order: 5, title: 'Detecção de Fraude', description: 'Anomaly detection com autoencoders', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Viés Algorítmico', description: 'Fairness em modelos de crédito', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Explicabilidade com SHAP', description: 'Tornando modelos interpretáveis', duration_minutes: 120, media_type: 'interactive' },
      { order: 8, title: 'Checkpoint 1 - Sistema Básico', description: 'App de análise financeira', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Chatbot com GPT', description: 'Assistente financeiro inteligente', duration_minutes: 120, media_type: 'interactive' },
      { order: 11, title: 'Blockchain Basics', description: 'Introdução a smart contracts', duration_minutes: 120, media_type: 'video' },
      { order: 12, title: 'Segurança e Criptografia', description: 'Protegendo dados financeiros', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Kafka para Streaming', description: 'Processamento em tempo real', duration_minutes: 120, media_type: 'interactive' },
      { order: 14, title: 'Apresentação para Fintechs', description: 'Proposta comercial', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Sistema EthicalFinAI completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para fintechs e escola', duration_minutes: 120, media_type: 'mixed' }
    ]
  }
];

export default function PioneerCourse() {
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
          style={{ background: 'linear-gradient(135deg, var(--accent-orange) 0%, var(--primary-navy) 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-12 h-12" />
              <Badge className="border-0 text-lg px-4 py-2" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                12-13 anos
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Pioneer - Construir Soluções para o Mundo Real
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Deep Learning, sistemas full-stack, DevOps e deployment em produção com stakeholders empresariais
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
                {['TensorFlow/PyTorch', 'Docker', 'Kubernetes', 'FastAPI', 'React', 'AWS', 'Deep Learning', 'DevOps'].map((comp, idx) => (
                  <Badge key={idx} variant="outline" 
                    style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
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
                {['TensorFlow Developer', 'AWS ML Specialty', 'Kubernetes App Developer'].map((comp, idx) => (
                  <Badge key={idx} className="border-0" 
                    style={{ backgroundColor: 'rgba(255, 111, 60, 0.2)', color: 'var(--accent-orange)' }}
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
            4 Módulos Semestrais com Deploy em Produção
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {modulesData.map((module) => {
              const ModuleIcon = moduleIcons[module.order] || BookOpen;
              
              return (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="border-2 rounded-xl overflow-hidden shadow-lg"
                  style={{ borderColor: 'var(--accent-orange)' }}
                >
                  <AccordionTrigger 
                    className="px-6 py-4 hover:no-underline"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: 'var(--accent-orange)' }}
                      >
                        <ModuleIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Módulo {module.order}: {module.title}
                          </h4>
                          <Badge style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                            Semestre {module.semester}
                          </Badge>
                          <Badge variant="outline" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>
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
                          <Target className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
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
                        <PlayCircle className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                        📝 {module.lessons.length} Lições
                      </h5>
                      
                      <div className="grid gap-3">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.order}
                            className="p-4 rounded-lg border-l-4"
                            style={{ 
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--accent-orange)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: 'var(--accent-orange)' }}
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
                                  <Badge variant="outline" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>
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