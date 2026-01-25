
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { AIEthicsCourse } from "@/entities/all";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Brain,
  Eye,
  Scale,
  FileCheck,
  Lock,
  Award,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const MODULES = [
  {
    id: 1,
    title: "Introdução: IA e Responsabilidade",
    icon: Shield,
    color: 'var(--primary-teal)',
    duration: 15,
    description: "Entenda por que usar IA de forma ética é essencial",
    content: {
      video_url: null,
      text: `# Por que Ética em IA é Importante?

A Inteligência Artificial está transformando o mundo, mas com grande poder vem grande responsabilidade.

## Você Sabia?
- IA pode perpetuar preconceitos se não for usada corretamente
- 73% das empresas exigem conhecimento em ética de IA
- Profissionais que dominam uso ético de IA ganham até 40% mais

## Na Innova Academy
Acreditamos que **IA é ferramenta, não substituto do pensamento humano**. Este mini-curso te prepara para usar IA de forma responsável, criativa e ética.`,
      key_points: [
        "IA pode ter vieses e limitações",
        "Transparência é fundamental",
        "Pensamento crítico continua essencial",
        "Você é sempre responsável pelo resultado final"
      ]
    },
    quiz: [
      {
        question: "Qual a principal responsabilidade ao usar IA?",
        options: [
          "Sempre aceitar o que a IA sugere",
          "Usar IA apenas para tarefas simples",
          "Manter pensamento crítico e verificar informações",
          "Nunca usar IA para nada importante"
        ],
        correct: 2
      },
      {
        question: "IA pode ter preconceitos (vieses)?",
        options: [
          "Não, IA é sempre neutra",
          "Sim, porque aprende com dados que podem conter vieses",
          "Apenas IA antiga tem vieses",
          "Preconceitos não existem em tecnologia"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 2,
    title: "Limitações da IA",
    icon: Brain,
    color: 'var(--info)',
    duration: 20,
    description: "Reconheça o que IA pode e não pode fazer",
    content: {
      video_url: null,
      text: `# Entendendo as Limitações

IA é poderosa, mas não é mágica. Conhecer suas limitações é essencial.

## O que IA Pode Fazer Bem
✓ Processar grandes volumes de dados rapidamente
✓ Reconhecer padrões em informações
✓ Gerar textos e imagens baseadas em exemplos
✓ Automatizar tarefas repetitivas

## O que IA NÃO Pode Fazer
✗ Entender contexto emocional complexo
✗ Ter experiências pessoais ou empatia real
✗ Tomar decisões éticas complexas sozinha
✗ Criar algo verdadeiramente original sem base
✗ Verificar se suas próprias informações estão corretas

## Exemplo Real
ChatGPT pode "alucinar" (inventar informações falsas com confiança). Por isso, SEMPRE verifique fatos importantes!`,
      key_points: [
        "IA não tem consciência ou compreensão real",
        "IA pode 'alucinar' informações falsas",
        "Sem verificação humana, resultados podem ser enganosos",
        "IA reflete os dados com que foi treinada"
      ]
    },
    quiz: [
      {
        question: "Quando IA 'alucina', isso significa que:",
        options: [
          "A IA está com problemas técnicos",
          "A IA inventa informações falsas com confiança",
          "A IA está aprendendo algo novo",
          "A IA está sendo criativa"
        ],
        correct: 1
      },
      {
        question: "Qual a melhor forma de usar IA?",
        options: [
          "Confiar 100% no que ela diz",
          "Usar como assistente e sempre verificar resultados",
          "Apenas copiar e colar sem ler",
          "Evitar usar IA completamente"
        ],
        correct: 1
      },
      {
        question: "IA pode substituir completamente o pensamento humano?",
        options: [
          "Sim, em todas as situações",
          "Não, pensamento crítico humano continua essencial",
          "Apenas em tarefas criativas",
          "Sim, mas só para estudantes"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    title: "Transparência e Citação",
    icon: Eye,
    color: 'var(--warning)',
    duration: 15,
    description: "Aprenda a ser transparente sobre uso de IA",
    content: {
      video_url: null,
      text: `# Transparência é Fundamental

Ser honesto sobre quando e como usou IA é uma questão de integridade acadêmica e profissional.

## Por que Ser Transparente?
1. **Integridade**: Você é responsável pelo seu trabalho
2. **Aprendizado Real**: Esconder uso de IA prejudica seu próprio desenvolvimento
3. **Confiança**: Professores e empregadores valorizam honestidade
4. **Legal**: Em muitos contextos, não citar IA é plágio

## Como Citar Uso de IA

### ✓ Exemplo Correto
"Utilizei ChatGPT para gerar ideias iniciais sobre [tema]. A análise final e conclusões são minhas, baseadas em pesquisa adicional em [fontes]."

### ✗ Exemplo Incorreto
[Copiar resposta de IA sem mencionar e apresentar como própria]

## Regra de Ouro
**Se usou IA para qualquer parte do trabalho, mencione explicitamente o quê, como e em que extensão.**`,
      key_points: [
        "Sempre cite quando usou IA",
        "Explique como a IA foi usada",
        "Deixe claro que partes são suas vs. da IA",
        "Honestidade é sempre a melhor política"
      ]
    },
    quiz: [
      {
        question: "Você usou ChatGPT para gerar o outline de um trabalho. O que deve fazer?",
        options: [
          "Não mencionar, pois foi só o outline",
          "Citar que usou IA para brainstorming inicial",
          "Fingir que teve a ideia sozinho",
          "Pedir para IA escrever tudo"
        ],
        correct: 1
      },
      {
        question: "Por que transparência sobre IA é importante?",
        options: [
          "Para evitar punições",
          "Porque é lei",
          "Para manter integridade e confiança",
          "Não é importante"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 4,
    title: "Verificação de Informações",
    icon: FileCheck,
    color: 'var(--success)',
    duration: 20,
    description: "Desenvolva habilidades de fact-checking",
    content: {
      video_url: null,
      text: `# A Arte da Verificação

IA pode gerar informações convincentes, mas falsas. Verificar é SUA responsabilidade.

## Protocolo de Verificação em 3 Passos

### 1. Desconfie de Afirmações Factuais
Se IA menciona datas, estatísticas, estudos ou eventos específicos, **sempre verifique**.

### 2. Use Fontes Primárias
- ❌ "IA disse que..." 
- ✓ "Segundo [estudo/artigo/fonte oficial]..."

### 3. Triangule Informações
Se algo é verdadeiro, você encontrará em múltiplas fontes confiáveis.

## Fontes Confiáveis vs. Não Confiáveis

### ✓ Confiáveis
- Artigos científicos revisados por pares
- Sites governamentais oficiais
- Instituições acadêmicas reconhecidas
- Jornais estabelecidos com reputação

### ⚠️ Desconfie
- Blogs pessoais sem fontes
- Sites com muitos anúncios/clickbait
- Informações sem autor ou data
- Redes sociais sem verificação

## Dica de Ouro
Pergunte à IA: "Quais são as fontes para essa informação?" 
Se ela não citar fontes verificáveis, pesquise você mesmo!`,
      key_points: [
        "Nunca confie cegamente em IA para fatos",
        "Use sempre fontes primárias e verificáveis",
        "Triangule informações em múltiplas fontes",
        "Se não consegue verificar, não use"
      ]
    },
    quiz: [
      {
        question: "IA disse que um evento histórico aconteceu em 1987. O que fazer?",
        options: [
          "Usar a data sem verificar, IA sabe tudo",
          "Procurar a data em fontes históricas confiáveis",
          "Perguntar para outra IA",
          "Usar a data mas dizer 'aproximadamente'"
        ],
        correct: 1
      },
      {
        question: "O que é triangular informações?",
        options: [
          "Usar três IAs diferentes",
          "Verificar em três fontes confiáveis independentes",
          "Fazer um triângulo no texto",
          "Perguntar para três amigos"
        ],
        correct: 1
      },
      {
        question: "Qual é uma fonte confiável para pesquisa acadêmica?",
        options: [
          "Blog pessoal sem referências",
          "Post no Instagram",
          "Artigo científico revisado por pares",
          "Resposta do ChatGPT"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 5,
    title: "Checklist Ético Final",
    icon: Scale,
    color: 'var(--error)',
    duration: 15,
    description: "Comprometa-se com uso responsável de IA",
    content: {
      video_url: null,
      text: `# Seu Compromisso com IA Ética

Parabéns por chegar até aqui! Agora é hora de firmar seu compromisso.

## O Protocolo IA-CV (CAIO TSI v5.0)

Na Innova Academy, seguimos o protocolo **Validação Contextual de Inteligência Artificial**.

### Princípios Fundamentais

1. **Compreensão de Limitações**
   Reconheço que IA tem vieses, pode errar e não substitui pensamento crítico

2. **Transparência Total**
   Sempre citarei quando e como usei IA

3. **Verificação Rigorosa**
   Checagem de fatos é minha responsabilidade

4. **Pensamento Original**
   IA sugere, mas EU decido e analiso criticamente

5. **Supervisão Humana**
   Responsabilidade final é sempre minha

## Certificado de Conclusão

Ao completar o checklist, você receberá:
- ✓ Certificado de Ética em IA da Innova Academy
- ✓ Liberação para acessar todos os cursos
- ✓ Badge "AI Ethics Certified"
- ✓ +200 Innova Coins 🪙

## Próximos Passos

Após concluir, você estará pronto para:
- Iniciar qualquer curso da Innova Academy
- Usar IA de forma responsável em projetos
- Ser um exemplo de uso ético de tecnologia`,
      key_points: [
        "Compreendo limitações da IA",
        "Serei transparente sobre uso",
        "Verificarei todas as informações",
        "Manterei pensamento crítico ativo",
        "Assumo responsabilidade pelos resultados"
      ]
    },
    checklist: [
      {
        id: 'understand_limitations',
        label: 'Compreendo que IA pode ter vieses, alucinar e não substitui pensamento crítico',
        description: 'Entendo as limitações técnicas e éticas da IA'
      },
      {
        id: 'be_transparent',
        label: 'Serei sempre transparente sobre quando e como uso IA',
        description: 'Citarei explicitamente o uso de IA em trabalhos e projetos'
      },
      {
        id: 'verify_info',
        label: 'Verificarei informações geradas por IA em fontes confiáveis',
        description: 'Não aceitarei fatos da IA sem checagem independente'
      },
      {
        id: 'original_thinking',
        label: 'Usarei IA como ferramenta, mantendo meu pensamento crítico',
        description: 'IA sugerirá, mas análises e conclusões serão minhas'
      },
      {
        id: 'human_oversight',
        label: 'Assumo responsabilidade final por tudo que produzo com IA',
        description: 'Supervisão humana e decisões éticas são minhas'
      },
      {
        id: 'report_misuse',
        label: 'Reportarei usos antiéticos de IA que observar',
        description: 'Contribuirei para uma comunidade ética'
      }
    ]
  }
];

export default function AIEthicsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [checklist, setChecklist] = useState({});
  const [reflectionText, setReflectionText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    const progressData = await AIEthicsCourse.filter({ student_email: userData.email });
    
    if (progressData.length > 0) {
      const progress = progressData[0];
      setCourseProgress(progress);
      setCurrentModule(progress.current_module || 1);
    } else {
      const newProgress = await AIEthicsCourse.create({
        student_email: userData.email,
        started_at: new Date().toISOString(),
        current_module: 1,
        modules_completed: [],
        progress_percentage: 0
      });
      setCourseProgress(newProgress);
    }
    setLoading(false);
  };

  const handleQuizSubmit = () => {
    const module = MODULES[currentModule - 1];
    let correct = 0;
    
    module.quiz?.forEach((question, idx) => {
      if (quizAnswers[idx] === question.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / module.quiz.length) * 100);
    setQuizScore(score);
    setShowQuizResults(true);

    if (score >= 70) {
      updateModuleProgress(score);
    }
  };

  const updateModuleProgress = async (score) => {
    const modulesCompleted = [...(courseProgress.modules_completed || [])];
    if (!modulesCompleted.includes(currentModule)) {
      modulesCompleted.push(currentModule);
    }

    const quizScores = { ...(courseProgress.quiz_scores || {}) };
    quizScores[`module_${currentModule}`] = score;

    const progressPercentage = (modulesCompleted.length / MODULES.length) * 100;

    await AIEthicsCourse.update(courseProgress.id, {
      modules_completed: modulesCompleted,
      quiz_scores: quizScores,
      current_module: Math.min(currentModule + 1, MODULES.length),
      progress_percentage: progressPercentage
    });

    await loadData();
  };

  const handleChecklistSubmit = async () => {
    const allChecked = Object.keys(checklist).length === MODULES[4].checklist.length &&
                       Object.values(checklist).every(v => v === true) &&
                       reflectionText.length >= 50;

    if (!allChecked) {
      alert('Por favor, complete todos os itens do checklist e escreva uma reflexão de pelo menos 50 caracteres.');
      return;
    }

    await AIEthicsCourse.update(courseProgress.id, {
      checklist_completed: true,
      completed_at: new Date().toISOString(),
      certificate_issued: true,
      progress_percentage: 100
    });

    await loadData();
  };

  const goToNextModule = () => {
    setCurrentModule(prev => Math.min(prev + 1, MODULES.length));
    setQuizAnswers({});
    setShowQuizResults(false);
    setQuizScore(0);
  };

  const module = MODULES[currentModule - 1];
  const ModuleIcon = module.icon;
  const isModuleCompleted = courseProgress?.modules_completed?.includes(currentModule);
  const canAccessModule = currentModule === 1 || courseProgress?.modules_completed?.includes(currentModule - 1);
  const isCourseCompleted = courseProgress?.certificate_issued;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (isCourseCompleted) {
    return (
      <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-none shadow-2xl text-center overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-400 to-emerald-500" />
            <CardContent className="p-12">
              <div 
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: 'var(--success)' }}
              >
                <Award className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-3xl font-heading font-bold mb-3" style={{ color: 'var(--success)' }}>
                Certificado Emitido!
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
                Parabéns! Você completou o Mini-Curso de Ética em IA
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
                  <p className="text-sm font-semibold">100%</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Concluído</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-yellow)' }} />
                  <p className="text-sm font-semibold">+200 Coins</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Recompensa</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                  className="px-8"
                >
                  Ir para Dashboard
                </Button>
                <Button
                  onClick={() => navigate(createPageUrl("Courses"))}
                  style={{ backgroundColor: 'var(--success)', color: 'white' }}
                  className="px-8"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Começar Cursos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Hero Section */}
        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-4 border-0" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                  OBRIGATÓRIO PARA TODOS OS ALUNOS
                </Badge>
                <h1 className="text-4xl font-heading font-bold mb-2">
                  Mini-Curso: Ética em IA
                </h1>
                <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Aprenda a usar Inteligência Artificial de forma responsável, ética e eficaz
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>~85 minutos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>5 módulos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" style={{ color: 'var(--accent-yellow)' }} />
                    <span>+200 Innova Coins</span>
                  </div>
                </div>
              </div>
              <Shield className="w-20 h-20" style={{ color: 'var(--primary-teal)' }} />
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>Progresso Geral</span>
                <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                  {courseProgress?.progress_percentage || 0}%
                </span>
              </div>
              <Progress value={courseProgress?.progress_percentage || 0} className="h-3" />
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {courseProgress?.modules_completed?.length || 0} de {MODULES.length} módulos completados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Module Navigation */}
        <Card className="border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
            <CardTitle className="font-heading">Módulos do Curso</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-3">
              {MODULES.map((mod, idx) => {
                const Icon = mod.icon;
                const isCompleted = courseProgress?.modules_completed?.includes(mod.id);
                const isCurrent = mod.id === currentModule;
                const isLocked = mod.id > 1 && !courseProgress?.modules_completed?.includes(mod.id - 1);

                return (
                  <button
                    key={mod.id}
                    onClick={() => !isLocked && setCurrentModule(mod.id)}
                    disabled={isLocked}
                    className={`p-4 rounded-xl text-center transition-all ${
                      isCurrent ? 'ring-4 shadow-lg' : 'hover:shadow-md'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{
                      backgroundColor: isCurrent ? mod.color : 'var(--background)',
                      color: isCurrent ? 'white' : 'var(--text-primary)',
                      ringColor: mod.color
                    }}
                  >
                    {isLocked ? (
                      <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: isCurrent ? 'white' : 'var(--success)' }} />
                    ) : (
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: isCurrent ? 'white' : mod.color }} />
                    )}
                    <p className="text-xs font-semibold">{mod.title}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Module Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl">
              <div className="h-2" style={{ backgroundColor: module.color }} />
              <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: module.color }}
                    >
                      <ModuleIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-heading">Módulo {module.id}: {module.title}</CardTitle>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {module.description} • ~{module.duration} min
                      </p>
                    </div>
                  </div>
                  {isModuleCompleted && (
                    <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }} className="flex items-center gap-1 px-4 py-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Completado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                
                {/* Content */}
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: module.content.text.split('\n').map(line => {
                    if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mb-4" style="color: var(--text-primary)">${line.slice(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold mb-3 mt-6" style="color: var(--text-primary)">${line.slice(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3 class="text-xl font-semibold mb-2 mt-4" style="color: var(--text-primary)">${line.slice(4)}</h3>`;
                    if (line.startsWith('- ')) return `<li style="color: var(--text-secondary)">${line.slice(2)}</li>`;
                    if (line.startsWith('✓ ')) return `<li class="flex items-center gap-2" style="color: var(--success)"><span>✓</span><span>${line.slice(2)}</span></li>`;
                    if (line.startsWith('✗ ')) return `<li class="flex items-center gap-2" style="color: var(--error)"><span>✗</span><span>${line.slice(2)}</span></li>`;
                    if (line.startsWith('❌ ')) return `<li class="flex items-center gap-2" style="color: var(--error)"><span>❌</span><span>${line.slice(2)}</span></li>`;
                    if (line.startsWith('⚠️ ')) return `<li class="flex items-center gap-2" style="color: var(--warning)"><span>⚠️</span><span>${line.slice(2)}</span></li>`;
                    if (line.trim() === '') return '<br>';
                    return `<p style="color: var(--text-secondary); margin-bottom: 0.75rem">${line}</p>`;
                  }).join('')}} />
                </div>

                {/* Key Points */}
                {module.content.key_points && (
                  <Card className="border-l-4" style={{ borderColor: module.color, backgroundColor: 'var(--neutral-light)' }}>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Target className="w-5 h-5" style={{ color: module.color }} />
                        Pontos-Chave
                      </h4>
                      <ul className="space-y-2">
                        {module.content.key_points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: module.color }} />
                            <span style={{ color: 'var(--text-secondary)' }}>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Quiz */}
                {module.quiz && currentModule < 5 && (
                  <Card className="border-l-4" style={{ borderColor: module.color }}>
                    <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <CardTitle className="font-heading">Quiz de Verificação</CardTitle>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Responda corretamente 70% ou mais para avançar
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      {!showQuizResults ? (
                        <div className="space-y-6">
                          {module.quiz.map((question, qIdx) => (
                            <div key={qIdx} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
                              <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                {qIdx + 1}. {question.question}
                              </p>
                              <RadioGroup
                                value={quizAnswers[qIdx]?.toString()}
                                onValueChange={(value) => setQuizAnswers({...quizAnswers, [qIdx]: parseInt(value)})}
                              >
                                {question.options.map((option, oIdx) => (
                                  <div key={oIdx} className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                                    <Label htmlFor={`q${qIdx}-o${oIdx}`} className="cursor-pointer">
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                          
                          <Button
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length < module.quiz.length}
                            style={{ backgroundColor: module.color, color: 'white' }}
                            className="w-full"
                          >
                            Enviar Respostas
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <div 
                            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                            style={{ backgroundColor: quizScore >= 70 ? 'var(--success)' : 'var(--error)' }}
                          >
                            {quizScore >= 70 ? (
                              <CheckCircle2 className="w-12 h-12 text-white" />
                            ) : (
                              <AlertTriangle className="w-12 h-12 text-white" />
                            )}
                          </div>
                          <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Sua pontuação: {quizScore}%
                          </h3>
                          {quizScore >= 70 ? (
                            <>
                              <p style={{ color: 'var(--success)' }}>
                                Parabéns! Você pode avançar para o próximo módulo.
                              </p>
                              <Button
                                onClick={goToNextModule}
                                style={{ backgroundColor: 'var(--success)', color: 'white' }}
                              >
                                Próximo Módulo
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <p style={{ color: 'var(--error)' }}>
                                Você precisa de 70% ou mais. Revise o conteúdo e tente novamente.
                              </p>
                              <Button
                                onClick={() => {
                                  setShowQuizResults(false);
                                  setQuizAnswers({});
                                }}
                                variant="outline"
                              >
                                Tentar Novamente
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Checklist Final (Módulo 5) */}
                {module.checklist && (
                  <Card className="border-l-4" style={{ borderColor: 'var(--error)' }}>
                    <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <CardTitle className="font-heading flex items-center gap-2">
                        <Scale className="w-6 h-6" style={{ color: 'var(--error)' }} />
                        Compromisso Ético
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {module.checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-4 rounded-xl"
                          style={{ 
                            backgroundColor: checklist[item.id] ? 'rgba(39, 174, 96, 0.1)' : 'var(--neutral-light)',
                            border: `2px solid ${checklist[item.id] ? 'var(--success)' : 'var(--neutral-medium)'}`
                          }}
                        >
                          <Checkbox
                            id={item.id}
                            checked={checklist[item.id] || false}
                            onCheckedChange={(checked) => setChecklist({...checklist, [item.id]: checked})}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={item.id}
                              className="font-semibold cursor-pointer mb-1 block"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {item.label}
                            </Label>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6">
                        <Label className="font-semibold mb-2 block" style={{ color: 'var(--text-primary)' }}>
                          Reflexão Pessoal (mínimo 50 caracteres)
                        </Label>
                        <Textarea
                          placeholder="Escreva como você pretende aplicar esses princípios no seu dia a dia de estudos e projetos..."
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          className="min-h-32"
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {reflectionText.length} / 50 caracteres
                        </p>
                      </div>

                      <Button
                        onClick={handleChecklistSubmit}
                        disabled={
                          Object.keys(checklist).length < module.checklist.length ||
                          !Object.values(checklist).every(v => v === true) ||
                          reflectionText.length < 50
                        }
                        style={{ backgroundColor: 'var(--success)', color: 'white' }}
                        className="w-full mt-6"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Finalizar Curso e Emitir Certificado
                      </Button>
                    </CardContent>
                  </Card>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
