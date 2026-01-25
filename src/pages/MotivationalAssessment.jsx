import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trophy, Compass, Users, Zap, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useUpdateMotivationalProfile, calculateBartleType } from "@/components/hooks/useMotivationalProfile";
import { useCurrentUser } from "@/components/hooks/useUser";
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";

const BARTLE_QUESTIONS = [
  {
    id: 1,
    question: "Quando você joga um jogo ou estuda algo novo, o que te deixa mais feliz?",
    options: [
      { text: "Ganhar todos os pontos e completar todos os desafios", type: "achiever" },
      { text: "Descobrir segredos escondidos e aprender coisas novas", type: "explorer" },
      { text: "Jogar/estudar com amigos e ajudar outras pessoas", type: "socializer" },
      { text: "Ser o melhor e ganhar de todo mundo", type: "competitor" }
    ]
  },
  {
    id: 2,
    question: "Se você ganhasse um prêmio, qual você preferiria?",
    options: [
      { text: "Um troféu grande que todo mundo pode ver", type: "achiever" },
      { text: "Acesso a conteúdos secretos e avançados", type: "explorer" },
      { text: "Festa com seus amigos para comemorar junto", type: "socializer" },
      { text: "Seu nome no topo do ranking da turma", type: "competitor" }
    ]
  },
  {
    id: 3,
    question: "Durante uma atividade em grupo, você prefere:",
    options: [
      { text: "Ser o líder e garantir que tudo seja concluído perfeitamente", type: "achiever" },
      { text: "Pesquisar e trazer ideias criativas para o grupo", type: "explorer" },
      { text: "Ajudar todo mundo e garantir que ninguém fique para trás", type: "socializer" },
      { text: "Fazer o melhor trabalho e mostrar que seu grupo é o melhor", type: "competitor" }
    ]
  },
  {
    id: 4,
    question: "O que te motiva mais a estudar?",
    options: [
      { text: "Ver meu progresso aumentando e conquistar badges", type: "achiever" },
      { text: "Aprender coisas fascinantes que ninguém mais sabe", type: "explorer" },
      { text: "Estudar junto com colegas e ensinar o que aprendi", type: "socializer" },
      { text: "Tirar notas melhores que os outros", type: "competitor" }
    ]
  },
  {
    id: 5,
    question: "Se você pudesse escolher uma recompensa, qual seria?",
    options: [
      { text: "100 Innova Coins para comprar o que quiser", type: "achiever" },
      { text: "Acessar um módulo secreto com conteúdo exclusivo", type: "explorer" },
      { text: "Ser 'Ajudante da Semana' e poder ajudar outros alunos", type: "socializer" },
      { text: "Ver meu nome no ranking de melhores alunos", type: "competitor" }
    ]
  },
  {
    id: 6,
    question: "Quando você enfrenta um desafio difícil, você:",
    options: [
      { text: "Fica determinado a completar 100% perfeitamente", type: "achiever" },
      { text: "Testa várias formas criativas de resolver", type: "explorer" },
      { text: "Pede ajuda aos amigos e resolvem juntos", type: "socializer" },
      { text: "Quer resolver primeiro que todo mundo", type: "competitor" }
    ]
  },
  {
    id: 7,
    question: "Seu momento favorito de aula é quando:",
    options: [
      { text: "O professor anuncia que você completou todos os objetivos", type: "achiever" },
      { text: "Você aprende algo surpreendente que nunca imaginou", type: "explorer" },
      { text: "Trabalha em equipe em um projeto legal", type: "socializer" },
      { text: "Sua resposta é a melhor da turma", type: "competitor" }
    ]
  },
  {
    id: 8,
    question: "Se você pudesse ter um super poder de aprendizado, seria:",
    options: [
      { text: "Memorizar tudo perfeitamente e nunca esquecer", type: "achiever" },
      { text: "Entender assuntos avançados que ninguém domina", type: "explorer" },
      { text: "Ensinar qualquer coisa de forma que todos entendam", type: "socializer" },
      { text: "Aprender mais rápido que qualquer outra pessoa", type: "competitor" }
    ]
  },
  {
    id: 9,
    question: "Você gosta mais de atividades que:",
    options: [
      { text: "Têm metas claras e checklist para completar", type: "achiever" },
      { text: "São abertas e você pode experimentar livremente", type: "explorer" },
      { text: "Envolvem trabalhar e conversar com outras pessoas", type: "socializer" },
      { text: "Têm competição e você pode mostrar suas habilidades", type: "competitor" }
    ]
  },
  {
    id: 10,
    question: "Qual dessas frases mais combina com você?",
    options: [
      { text: "Eu gosto de coletar badges e completar tudo", type: "achiever" },
      { text: "Eu adoro descobrir coisas novas e explorar", type: "explorer" },
      { text: "Eu me sinto bem quando ajudo meus amigos", type: "socializer" },
      { text: "Eu quero ser o melhor e vencer desafios", type: "competitor" }
    ]
  }
];

const TYPE_INFO = {
  achiever: {
    icon: Trophy,
    color: '#F59E0B',
    title: 'Conquistador',
    description: 'Você é motivado por conquistas e completar objetivos',
    strengths: [
      'Focado em metas',
      'Persistente e determinado',
      'Gosta de ver progresso claro'
    ],
    recommendations: [
      'Você vai adorar colecionar badges',
      'Foque em completar módulos 100%',
      'Use o sistema de níveis como motivação'
    ]
  },
  explorer: {
    icon: Compass,
    color: '#10B981',
    title: 'Explorador',
    description: 'Você é motivado por descoberta e aprendizado profundo',
    strengths: [
      'Curioso e criativo',
      'Gosta de experimentar',
      'Busca entender como as coisas funcionam'
    ],
    recommendations: [
      'Explore os desafios Extra Mile',
      'Acesse conteúdos avançados',
      'Experimente projetos próprios'
    ]
  },
  socializer: {
    icon: Users,
    color: '#3B82F6',
    title: 'Socializador',
    description: 'Você é motivado por interações sociais e colaboração',
    strengths: [
      'Colaborativo e empático',
      'Ajuda outros alunos',
      'Trabalha bem em equipe'
    ],
    recommendations: [
      'Participe de projetos em grupo',
      'Ajude colegas (ganhe coins!)',
      'Engaje nas atividades familiares'
    ]
  },
  competitor: {
    icon: Zap,
    color: '#EF4444',
    title: 'Competidor',
    description: 'Você é motivado por competição e superar desafios',
    strengths: [
      'Orientado a resultados',
      'Rápido e eficiente',
      'Busca excelência'
    ],
    recommendations: [
      'Confira os leaderboards',
      'Participe de competições',
      'Tente ser top 3 da turma'
    ]
  },
  mixed: {
    icon: Trophy,
    color: '#8B5CF6',
    title: 'Balanceado',
    description: 'Você tem múltiplas motivações equilibradas',
    strengths: [
      'Adaptável e versátil',
      'Aproveita diversos tipos de atividades',
      'Perfil equilibrado'
    ],
    recommendations: [
      'Você pode aproveitar todos os recursos',
      'Experimente diferentes abordagens',
      'Seu perfil é flexível e poderoso'
    ]
  }
};

export default function MotivationalAssessmentPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateMotivationalProfile();
  const { showSuccess, executeWithFeedback } = useNotificationSystem();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const totalQuestions = BARTLE_QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const canProceed = answers[BARTLE_QUESTIONS[currentQuestion].id] !== undefined;

  const handleAnswer = (questionId, type) => {
    setAnswers({ ...answers, [questionId]: type });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    // Contar respostas por tipo
    const scores = {
      achiever: 0,
      explorer: 0,
      socializer: 0,
      competitor: 0
    };

    Object.values(answers).forEach(type => {
      scores[type] = (scores[type] || 0) + 10;
    });

    const bartleType = calculateBartleType(
      scores.achiever,
      scores.explorer,
      scores.socializer,
      scores.competitor
    );

    const resultData = {
      bartle_type: bartleType,
      achiever_score: scores.achiever,
      explorer_score: scores.explorer,
      socializer_score: scores.socializer,
      competitor_score: scores.competitor,
      assessment_completed: true,
      behavioral_patterns: {
        prefers_solo_work: scores.achiever > 60 || scores.competitor > 60,
        seeks_challenges: scores.competitor > 60 || scores.explorer > 60,
        values_rankings: scores.competitor > 70,
        enjoys_exploration: scores.explorer > 60,
        collaborative: scores.socializer > 60
      },
      recommended_rewards: getRecommendedRewards(bartleType),
      last_assessed: new Date().toISOString()
    };

    setResults({
      ...resultData,
      typeInfo: TYPE_INFO[bartleType]
    });

    // Salvar no banco
    await executeWithFeedback({
      asyncFn: async () => {
        await updateProfile.mutateAsync({
          studentEmail: user.email,
          profileData: resultData
        });
      },
      loadingMessage: 'Salvando perfil...',
      successMessage: 'Perfil motivacional salvo!',
      errorMessage: 'Erro ao salvar perfil'
    });

    setShowResults(true);
  };

  const getRecommendedRewards = (type) => {
    const recommendations = {
      achiever: ['academic', 'privilege'],
      explorer: ['experience', 'academic'],
      socializer: ['social', 'experience'],
      competitor: ['cosmetic', 'privilege'],
      mixed: ['academic', 'social', 'experience']
    };
    return recommendations[type] || [];
  };

  const finishAssessment = () => {
    navigate(createPageUrl("Dashboard"));
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (showResults && results) {
    const TypeIcon = results.typeInfo.icon;

    return (
      <div className="min-h-screen flex items-center justify-center p-4" 
        style={{ background: `linear-gradient(135deg, ${results.typeInfo.color}20 0%, var(--primary-navy)20 100%)` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-3" style={{ backgroundColor: results.typeInfo.color }} />
            
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div 
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: results.typeInfo.color }}
                >
                  <TypeIcon className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-4xl font-bold mb-3" style={{ color: results.typeInfo.color }}>
                  {results.typeInfo.title}
                </h1>
                
                <p className="text-xl text-gray-700 mb-6">
                  {results.typeInfo.description}
                </p>

                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                  {Object.entries({
                    achiever: { label: 'Conquistador', icon: Trophy },
                    explorer: { label: 'Explorador', icon: Compass },
                    socializer: { label: 'Social', icon: Users },
                    competitor: { label: 'Competidor', icon: Zap }
                  }).map(([key, { label, icon: Icon }]) => {
                    const score = results[`${key}_score`];
                    const isTop = score === Math.max(
                      results.achiever_score,
                      results.explorer_score,
                      results.socializer_score,
                      results.competitor_score
                    );

                    return (
                      <div key={key} className={`text-center p-4 rounded-xl ${isTop ? 'ring-2' : ''}`}
                        style={{ 
                          backgroundColor: isTop ? `${TYPE_INFO[key].color}20` : 'var(--neutral-light)',
                          ringColor: isTop ? TYPE_INFO[key].color : 'transparent'
                        }}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" 
                          style={{ color: TYPE_INFO[key].color }} 
                        />
                        <p className="text-xs text-gray-600 mb-1">{label}</p>
                        <p className="text-2xl font-bold" style={{ color: TYPE_INFO[key].color }}>
                          {score}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900">Seus Pontos Fortes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.typeInfo.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.typeInfo.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">💡</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={finishAssessment}
                  size="lg"
                  className="text-white px-8 py-6 text-lg"
                  style={{ backgroundColor: results.typeInfo.color }}
                >
                  Começar Jornada de Aprendizado 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = BARTLE_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}
    >
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-2" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <div 
                className="h-full transition-all duration-500" 
                style={{ width: `${progress}%`, backgroundColor: 'var(--accent-orange)' }}
              />
            </div>

            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary-teal)' }}>
                    Pergunta {currentQuestion + 1} de {totalQuestions}
                  </span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
                    <span className="text-sm font-medium">Descubra seu Perfil!</span>
                  </div>
                </div>
                <h2 className="text-2xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                  {question.question}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(value) => handleAnswer(question.id, value)}
                    className="space-y-3"
                  >
                    {question.options.map((option, idx) => (
                      <div key={idx}>
                        <Label
                          htmlFor={`option-${idx}`}
                          className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                          style={{
                            borderColor: answers[question.id] === option.type 
                              ? 'var(--primary-teal)' 
                              : 'var(--neutral-medium)',
                            backgroundColor: answers[question.id] === option.type 
                              ? 'rgba(0, 169, 157, 0.1)' 
                              : 'var(--background)'
                          }}
                        >
                          <RadioGroupItem 
                            value={option.type} 
                            id={`option-${idx}`} 
                            className="mr-3" 
                          />
                          <span className="flex-1 text-base">{option.text}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--neutral-medium)' }}>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={currentQuestion === 0}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="btn-primary"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  {currentQuestion === totalQuestions - 1 ? (
                    <>Ver Resultado 🎯</>
                  ) : (
                    <>
                      Próxima
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}