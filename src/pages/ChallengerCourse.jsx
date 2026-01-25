import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Globe, Rocket, Music, DollarSign, BookOpen, Clock, Target, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const moduleIcons = { 1: Globe, 2: Rocket, 3: Music, 4: DollarSign, 5: Crown };

const modulesData = [
  {
    id: 'challenger-1',
    order: 1,
    title: 'EarthAI',
    description: 'Sistema global de inteligência climática',
    stakeholder: 'ONU',
    semester: 1,
    duration_weeks: 18,
    objectives: [
      'Quantum Machine Learning',
      'Satellite Constellations',
      'Global IoT platforms',
      'Impacto civilizacional'
    ],
    lessons: [
      { order: 1, title: 'Visão Global da Crise Climática', description: 'Papel da IA na sustentabilidade planetária', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Arquitetura de Sistemas Globais', description: 'Do sensor local ao insight global', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Satellite Data Processing', description: 'Sentinel, Landsat e constelações', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'IoT Planetário', description: 'Redes de sensores em escala global', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Quantum Computing Intro', description: 'Qubits e algoritmos quânticos', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Quantum ML Algorithms', description: 'QAOA e VQE para otimização', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Carbon Markets e IA', description: 'Precificação inteligente de carbono', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - Sistema Regional', description: 'Protótipo funcional', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Edge AI para Sustentabilidade', description: 'Processamento descentralizado', duration_minutes: 120, media_type: 'interactive' },
      { order: 11, title: 'Kubernetes Multi-Cloud', description: 'Deploy global escalável', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Alertas Preditivos', description: 'Prevenindo desastres climáticos', duration_minutes: 120, media_type: 'interactive' },
      { order: 13, title: 'Políticas Públicas com IA', description: 'Influenciando decisões governamentais', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação para ONU', description: 'Proposta para agências internacionais', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'EarthAI em produção global', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Summit Global EarthAI', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'challenger-2',
    order: 2,
    title: 'SpaceAI',
    description: 'Ecossistema de IA para exploração espacial',
    stakeholder: 'NASA/ESA',
    semester: 2,
    duration_weeks: 18,
    objectives: [
      'Edge AI espacial',
      'Sistemas autônomos planetários',
      'Quantum sensing',
      'Colonização de Marte com IA'
    ],
    lessons: [
      { order: 1, title: 'A Nova Era Espacial', description: 'SpaceX, Blue Origin e o papel da IA', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'IA Autônoma para Rovers', description: 'Navegação sem comunicação terrestre', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Computer Vision Espacial', description: 'Detecção de terreno e obstáculos', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Reinforcement Learning Planetário', description: 'Aprendendo a explorar Marte', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Edge Computing no Espaço', description: 'Hardware limitado, IA eficiente', duration_minutes: 120, media_type: 'interactive' },
      { order: 6, title: 'Quantum Sensing', description: 'Sensores quânticos para navegação', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Astrobiology e IA', description: 'Busca por vida extraterrestre', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - Rover Simulado', description: 'Navegação autônoma', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Mining Automation', description: 'Extração de recursos com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 11, title: 'Habitat Inteligente', description: 'Colônias autossustentáveis', duration_minutes: 120, media_type: 'video' },
      { order: 12, title: 'Comunicação Interestelar', description: 'Protocolos para grandes distâncias', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Economia Espacial', description: 'Construindo $1T space economy', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação para NASA/ESA', description: 'Proposta de missão real', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'SpaceAI completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Demo para agências espaciais', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'challenger-3',
    order: 3,
    title: 'CulturalAI',
    description: 'Plataforma global de criação cultural',
    stakeholder: 'UNESCO',
    semester: 3,
    duration_weeks: 18,
    objectives: [
      'Generative AI avançada',
      'Neural interfaces',
      'Global streaming',
      'Democratização criativa'
    ],
    lessons: [
      { order: 1, title: 'Revolução Criativa com IA', description: 'Arte, música, literatura e IA', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Diffusion Models', description: 'Stable Diffusion, DALL-E 3', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'Music Generation at Scale', description: 'MusicLM e Jukebox', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'GPT-4 para Literatura', description: 'Co-criação humano-IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 5, title: 'Neural Interfaces', description: 'BCI e controle mental criativo', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'AR/VR para Cultura', description: 'Museus virtuais imersivos', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Preservação Cultural', description: 'IA para patrimônio histórico', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - Estúdio Criativo', description: 'Plataforma de criação', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Global Streaming Architecture', description: 'CDN e edge computing', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Recommendation Systems', description: 'Algoritmos de descoberta cultural', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Creator Economy', description: 'Monetização e NFTs', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Copyright e IA', description: 'Ética e legalidade da criação', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação para UNESCO', description: 'Democratização global da cultura', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'CulturalAI em produção', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Festival Global CulturalAI', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'challenger-4',
    order: 4,
    title: 'GlobalFinAI',
    description: 'Sistema financeiro global ético',
    stakeholder: 'World Bank/IMF',
    semester: 4,
    duration_weeks: 18,
    objectives: [
      'Blockchain e DeFi',
      'CBDCs (moedas digitais)',
      'Inclusão financeira global',
      'IA ética em finanças'
    ],
    lessons: [
      { order: 1, title: 'Revolução FinTech Global', description: 'Bitcoin, CBDCs e o futuro do dinheiro', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Blockchain Avançado', description: 'Ethereum, Solana e smart contracts', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'DeFi Protocols', description: 'Uniswap, Aave e yield farming', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'CBDCs Architecture', description: 'Moedas digitais de bancos centrais', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Inclusão Financeira', description: 'IA para 3B+ pessoas sem banco', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Credit Scoring com IA', description: 'Alternative data e fairness', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Anti-Money Laundering', description: 'Detecção de lavagem com graph ML', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Checkpoint 1 - DeFi App', description: 'Plataforma funcional', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Regulatory Compliance', description: 'KYC/AML com IA', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Trading Algorithms', description: 'HFT e market making', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Risk Management', description: 'VaR e stress testing', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Sustainable Finance', description: 'ESG e investimentos éticos', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação World Bank', description: 'Proposta de inclusão global', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'GlobalFinAI completo', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Summit Global FinTech', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'challenger-5',
    order: 5,
    title: 'Sua Startup Unicórnio',
    description: 'Criação de unicórnio de base tecnológica',
    stakeholder: 'Y Combinator/Sequoia',
    semester: 5,
    duration_weeks: 18,
    objectives: [
      'Validação de startup real',
      'Fundraising e VCs',
      'Scaling para $1B+',
      'IPO preparation'
    ],
    lessons: [
      { order: 1, title: 'Idea to Unicorn', description: 'Jornada de $0 a $1B+', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Problem-Solution Fit', description: 'Validando a dor do cliente', duration_minutes: 120, media_type: 'video' },
      { order: 3, title: 'MVP Development', description: 'Construindo produto mínimo viável', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Product-Market Fit', description: 'Métricas e validação', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Go-to-Market Strategy', description: 'Aquisição de usuários', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Fundraising 101', description: 'Seed, Series A, B, C...', duration_minutes: 120, media_type: 'video' },
      { order: 7, title: 'Pitch Deck Mastery', description: 'Convencendo investidores', duration_minutes: 120, media_type: 'interactive' },
      { order: 8, title: 'Checkpoint 1 - Seed Round', description: 'Primeiro investimento', duration_minutes: 120, media_type: 'mixed' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Consolidando conhecimentos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Scaling Operations', description: 'De 10 para 1000 clientes', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Unit Economics', description: 'CAC, LTV e margem', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Team Building', description: 'Contratando os melhores', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'IPO Preparation', description: 'Caminho para bolsa de valores', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Apresentação Investors', description: 'Series A pitch para VCs', duration_minutes: 120, media_type: 'mixed' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Startup completa funcionando', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Demo Day', description: 'Apresentação para Y Combinator', duration_minutes: 120, media_type: 'mixed' }
    ]
  }
];

export default function ChallengerCourse() {
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
          style={{ background: 'linear-gradient(135deg, var(--error) 0%, var(--accent-orange) 50%, var(--primary-navy) 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-12 h-12" />
              <Badge className="border-0 text-lg px-4 py-2" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                14-16 anos • Elite Global
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Challenger - Inovar e Liderar na Era da IA
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Quantum ML, impacto civilizacional, criação de unicórnios e liderança global
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">2.5 anos</div>
                <div className="text-sm opacity-90">Duração</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">5</div>
                <div className="text-sm opacity-90">Módulos</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">80</div>
                <div className="text-sm opacity-90">Lições</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-3xl font-bold mb-1">160h</div>
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
                {['Quantum ML', 'Blockchain', 'Edge AI', 'Neural Interfaces', 'Global Architecture', 'CBDCs', 'IPO Prep'].map((comp, idx) => (
                  <Badge key={idx} variant="outline" 
                    style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="font-heading text-lg">Reconhecimento Global</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {['Forbes 30 Under 30', 'TIME 100 Next', 'WEF Young Leader', 'MIT Innovators'].map((comp, idx) => (
                  <Badge key={idx} className="border-0" 
                    style={{ backgroundColor: 'rgba(231, 76, 60, 0.2)', color: 'var(--error)' }}
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
            5 Módulos Civilizacionais + Startup Unicórnio
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {modulesData.map((module) => {
              const ModuleIcon = moduleIcons[module.order] || BookOpen;
              
              return (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="border-2 rounded-xl overflow-hidden shadow-lg"
                  style={{ borderColor: 'var(--error)' }}
                >
                  <AccordionTrigger 
                    className="px-6 py-4 hover:no-underline"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: 'var(--error)' }}
                      >
                        <ModuleIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Módulo {module.order}: {module.title}
                          </h4>
                          <Badge style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                            Semestre {module.semester}
                          </Badge>
                          <Badge variant="outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
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
                          <Target className="w-5 h-5" style={{ color: 'var(--error)' }} />
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
                        <PlayCircle className="w-5 h-5" style={{ color: 'var(--error)' }} />
                        📝 {module.lessons.length} Lições
                      </h5>
                      
                      <div className="grid gap-3">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.order}
                            className="p-4 rounded-lg border-l-4"
                            style={{ 
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--error)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: 'var(--error)' }}
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
                                  <Badge variant="outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
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