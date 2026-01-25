import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, Music, Rocket, DollarSign, BookOpen, Clock, Target, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const moduleIcons = { 1: Leaf, 2: Rocket, 3: Music, 4: DollarSign };

const modulesData = [
  {
    id: 'curiosity-1',
    order: 1,
    title: 'Sustentabilidade e IA',
    description: 'Introdução ao pensamento computacional através da sustentabilidade',
    semester: 1,
    duration_weeks: 18,
    objectives: [
      'Compreender conceitos básicos de sustentabilidade',
      'Reconhecer padrões simples na natureza',
      'Introduzir classificação e categorização',
      'Desenvolver consciência ambiental através de IA'
    ],
    lessons: [
      { order: 1, title: 'O que é Sustentabilidade?', description: 'Descobrindo como cuidar do nosso planeta', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Classificando Materiais', description: 'Aprendendo sobre reciclagem com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Plantas e Animais', description: 'Reconhecendo seres vivos com Teachable Machine', duration_minutes: 120, media_type: 'mixed' },
      { order: 4, title: 'Energia Limpa', description: 'Explorando fontes de energia', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Água Preciosa', description: 'A importância da água e como economizar', duration_minutes: 120, media_type: 'interactive' },
      { order: 6, title: 'Meu Jardim Digital', description: 'Criando um jardim virtual', duration_minutes: 120, media_type: 'simulation' },
      { order: 7, title: 'Animais em Perigo', description: 'Conhecendo animais ameaçados', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Classificador de Lixo', description: 'Projeto: criar classificador com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Revisitando o que aprendemos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Compostagem Mágica', description: 'Transformando lixo em adubo', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Árvores da Minha Cidade', description: 'Mapeando árvores com fotos', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Poluição do Ar', description: 'Entendendo a qualidade do ar', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Eco-Heróis', description: 'Histórias de pessoas que salvam o planeta', duration_minutes: 120, media_type: 'text' },
      { order: 14, title: 'Minha Pegada Ecológica', description: 'Calculando nosso impacto', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Planejando apresentação para a escola', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Mostrando o que aprendemos', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'curiosity-2',
    order: 2,
    title: 'Astrofísica para Pequenos',
    description: 'Explorando o universo com ferramentas digitais',
    semester: 2,
    duration_weeks: 18,
    objectives: [
      'Despertar curiosidade sobre o universo',
      'Reconhecer planetas e estrelas',
      'Usar ferramentas digitais de observação',
      'Conectar astronomia com tecnologia'
    ],
    lessons: [
      { order: 1, title: 'O que é o Espaço?', description: 'Descobrindo o universo ao nosso redor', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Sol, Lua e Terra', description: 'Nosso sistema solar básico', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Reconhecendo Planetas', description: 'Classificando planetas com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Estrelas Brilhantes', description: 'Por que as estrelas piscam?', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Constelações', description: 'Encontrando formas no céu', duration_minutes: 120, media_type: 'mixed' },
      { order: 6, title: 'Meu Planetário Digital', description: 'Criando um planetário virtual', duration_minutes: 120, media_type: 'simulation' },
      { order: 7, title: 'Foguetes e Viagens', description: 'Como chegamos ao espaço?', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Classificador de Estrelas', description: 'Projeto: identificar tipos de estrelas', duration_minutes: 120, media_type: 'interactive' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Revisitando o que aprendemos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'A Lua e suas Fases', description: 'Por que a lua muda?', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Observatório Virtual', description: 'Usando telescópios online', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Alienígenas Existem?', description: 'Buscando vida no espaço', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Astronautas Famosos', description: 'Heróis da exploração espacial', duration_minutes: 120, media_type: 'text' },
      { order: 14, title: 'Meu Mapa Espacial', description: 'Criando mapa do sistema solar', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Planejando apresentação para a escola', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Mostrando o que aprendemos', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'curiosity-3',
    order: 3,
    title: 'Ritmo e Algoritmos',
    description: 'Música e lógica de programação',
    semester: 3,
    duration_weeks: 18,
    objectives: [
      'Conectar música com padrões',
      'Reconhecer ritmos e melodias',
      'Criar música com ferramentas digitais',
      'Desenvolver pensamento sequencial'
    ],
    lessons: [
      { order: 1, title: 'O que é Música?', description: 'Sons, ritmos e melodias', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Padrões Musicais', description: 'Reconhecendo repetições na música', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Classificando Instrumentos', description: 'IA para reconhecer sons', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Ritmo e Batida', description: 'Criando padrões rítmicos', duration_minutes: 120, media_type: 'mixed' },
      { order: 5, title: 'Notas Musicais', description: 'Dó, Ré, Mi... aprendendo notas', duration_minutes: 120, media_type: 'video' },
      { order: 6, title: 'Meu Piano Digital', description: 'Criando um piano virtual', duration_minutes: 120, media_type: 'simulation' },
      { order: 7, title: 'Compositores Famosos', description: 'Mozart, Beethoven e outros', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Criador de Melodias', description: 'Projeto: compor música com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Revisitando o que aprendemos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Música pelo Mundo', description: 'Diferentes estilos musicais', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Reconhecedor de Canções', description: 'IA que identifica músicas', duration_minutes: 120, media_type: 'interactive' },
      { order: 12, title: 'Bateria Virtual', description: 'Criando ritmos de bateria', duration_minutes: 120, media_type: 'simulation' },
      { order: 13, title: 'Dança e Movimento', description: 'Música e expressão corporal', duration_minutes: 120, media_type: 'video' },
      { order: 14, title: 'Minha Banda Digital', description: 'Orquestrando vários instrumentos', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Planejando apresentação para a escola', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Mostrando o que aprendemos', duration_minutes: 120, media_type: 'mixed' }
    ]
  },
  {
    id: 'curiosity-4',
    order: 4,
    title: 'Dinheirinho Digital',
    description: 'Primeiros passos em educação financeira',
    semester: 4,
    duration_weeks: 18,
    objectives: [
      'Compreender conceitos básicos de dinheiro',
      'Aprender sobre economia e poupança',
      'Reconhecer moedas e valores',
      'Desenvolver consciência financeira'
    ],
    lessons: [
      { order: 1, title: 'O que é Dinheiro?', description: 'Descobrindo o valor das coisas', duration_minutes: 120, media_type: 'video' },
      { order: 2, title: 'Moedas e Notas', description: 'Reconhecendo dinheiro brasileiro', duration_minutes: 120, media_type: 'interactive' },
      { order: 3, title: 'Classificando Valores', description: 'IA para contar dinheiro', duration_minutes: 120, media_type: 'interactive' },
      { order: 4, title: 'Comprar e Vender', description: 'Como funcionam as trocas', duration_minutes: 120, media_type: 'video' },
      { order: 5, title: 'Meu Cofrinho Digital', description: 'Economizando dinheiro', duration_minutes: 120, media_type: 'simulation' },
      { order: 6, title: 'Quanto Custa?', description: 'Calculando preços', duration_minutes: 120, media_type: 'interactive' },
      { order: 7, title: 'Trabalhando e Ganhando', description: 'De onde vem o dinheiro?', duration_minutes: 120, media_type: 'video' },
      { order: 8, title: 'Calculadora Inteligente', description: 'Projeto: calculadora com IA', duration_minutes: 120, media_type: 'interactive' },
      { order: 9, title: 'Revisão de Meio-Semestre', description: 'Revisitando o que aprendemos', duration_minutes: 120, media_type: 'quiz' },
      { order: 10, title: 'Planejando Compras', description: 'Fazendo uma lista de compras', duration_minutes: 120, media_type: 'video' },
      { order: 11, title: 'Loja Virtual', description: 'Simulando compras online', duration_minutes: 120, media_type: 'simulation' },
      { order: 12, title: 'Doando e Compartilhando', description: 'A importância de ajudar', duration_minutes: 120, media_type: 'video' },
      { order: 13, title: 'Empresários Mirins', description: 'Histórias de jovens empreendedores', duration_minutes: 120, media_type: 'text' },
      { order: 14, title: 'Minha Primeira Empresa', description: 'Criando um negócio simples', duration_minutes: 120, media_type: 'interactive' },
      { order: 15, title: 'Projeto Final - Preparação', description: 'Planejando apresentação para a escola', duration_minutes: 120, media_type: 'mixed' },
      { order: 16, title: 'Projeto Final - Apresentação', description: 'Mostrando o que aprendemos', duration_minutes: 120, media_type: 'mixed' }
    ]
  }
];

export default function CuriosityCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header com botão voltar */}
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

        {/* Hero do Curso */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl"
          style={{ background: 'linear-gradient(135deg, var(--info) 0%, var(--primary-navy) 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-12 h-12" />
              <Badge className="border-0 text-lg px-4 py-2" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                6-8 anos
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              Curiosity - Despertar a Curiosidade Digital
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Introdução lúdica à IA através de experiências práticas e projetos significativos
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

        {/* Competências Desenvolvidas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="font-heading text-lg">Competências Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {['Fundamentos de IA', 'Teachable Machine', 'Scratch AI', 'Computer Vision básica', 'MIT App Inventor'].map((comp, idx) => (
                  <Badge key={idx} variant="outline" 
                    style={{ borderColor: 'var(--info)', color: 'var(--info)' }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-innova border-none shadow-lg">
            <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
              <CardTitle className="font-heading text-lg">Competências Socioemocionais</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {['Curiosidade', 'Colaboração', 'Comunicação', 'Empatia', 'Criatividade'].map((comp, idx) => (
                  <Badge key={idx} className="border-0" 
                    style={{ backgroundColor: 'rgba(52, 152, 219, 0.2)', color: 'var(--info)' }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            4 Módulos Semestrais
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {modulesData.map((module) => {
              const ModuleIcon = moduleIcons[module.order] || BookOpen;
              
              return (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="border-2 rounded-xl overflow-hidden shadow-lg"
                  style={{ borderColor: 'var(--info)' }}
                >
                  <AccordionTrigger 
                    className="px-6 py-4 hover:no-underline"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: 'var(--info)' }}
                      >
                        <ModuleIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Módulo {module.order}: {module.title}
                          </h4>
                          <Badge style={{ backgroundColor: 'var(--info)', color: 'white' }}>
                            Semestre {module.semester}
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
                          <Target className="w-5 h-5" style={{ color: 'var(--info)' }} />
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
                        <PlayCircle className="w-5 h-5" style={{ color: 'var(--info)' }} />
                        📝 {module.lessons.length} Lições
                      </h5>
                      
                      <div className="grid gap-3">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.order}
                            className="p-4 rounded-lg border-l-4"
                            style={{ 
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--info)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: 'var(--info)' }}
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
                                  <Badge variant="outline" style={{ borderColor: 'var(--info)', color: 'var(--info)' }}>
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