import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Target, Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * Bartle Assessment - Perfil Motivacional
 * Baseado em Bartle's Taxonomy of Player Types
 */

const QUESTIONS = [
  {
    id: 1,
    text: "Quando jogo um jogo, eu prefiro:",
    options: [
      { value: "achiever", text: "Completar todos os desafios e conquistar todas as conquistas" },
      { value: "explorer", text: "Descobrir todos os segredos e áreas escondidas" },
      { value: "socializer", text: "Interagir com outros jogadores e fazer amigos" },
      { value: "competitor", text: "Ser o melhor e vencer os outros jogadores" }
    ]
  },
  {
    id: 2,
    text: "O que mais me motiva a aprender algo novo é:",
    options: [
      { value: "achiever", text: "Ganhar certificados e reconhecimento" },
      { value: "explorer", text: "Entender profundamente como as coisas funcionam" },
      { value: "socializer", text: "Poder ajudar e ensinar outras pessoas" },
      { value: "competitor", text: "Ser melhor que os outros naquela habilidade" }
    ]
  },
  {
    id: 3,
    text: "Em um projeto em grupo, eu geralmente:",
    options: [
      { value: "achiever", text: "Foco em completar minhas tarefas perfeitamente" },
      { value: "explorer", text: "Pesquiso diferentes formas de fazer o projeto" },
      { value: "socializer", text: "Ajudo a manter o grupo unido e colaborando" },
      { value: "competitor", text: "Quero que nosso grupo seja o melhor" }
    ]
  },
  {
    id: 4,
    text: "Quando vejo um ranking ou placar, eu:",
    options: [
      { value: "achiever", text: "Verifico se completei todos os requisitos" },
      { value: "explorer", text: "Me pergunto como o sistema de pontos funciona" },
      { value: "socializer", text: "Vejo onde meus amigos estão posicionados" },
      { value: "competitor", text: "Quero subir para o topo imediatamente" }
    ]
  },
  {
    id: 5,
    text: "O que me deixa mais orgulhoso é:",
    options: [
      { value: "achiever", text: "Completar algo difícil que poucos conseguem" },
      { value: "explorer", text: "Descobrir algo que ninguém sabia" },
      { value: "socializer", text: "Ser reconhecido pelos meus amigos" },
      { value: "competitor", text: "Vencer uma competição" }
    ]
  },
  {
    id: 6,
    text: "Quando tenho tempo livre, eu prefiro:",
    options: [
      { value: "achiever", text: "Trabalhar em metas pessoais e conquistas" },
      { value: "explorer", text: "Explorar novos hobbies e interesses" },
      { value: "socializer", text: "Passar tempo com amigos" },
      { value: "competitor", text: "Treinar para melhorar minhas habilidades" }
    ]
  },
  {
    id: 7,
    text: "O que mais me frustra é:",
    options: [
      { value: "achiever", text: "Não conseguir completar algo que comecei" },
      { value: "explorer", text: "Não entender como algo funciona" },
      { value: "socializer", text: "Conflitos no grupo ou solidão" },
      { value: "competitor", text: "Perder ou ficar em segundo lugar" }
    ]
  },
  {
    id: 8,
    text: "Meu objetivo principal ao estudar IA é:",
    options: [
      { value: "achiever", text: "Dominar a tecnologia e ter certificações" },
      { value: "explorer", text: "Entender profundamente como a IA funciona" },
      { value: "socializer", text: "Usar IA para ajudar pessoas e conectar comunidades" },
      { value: "competitor", text: "Ser o melhor desenvolvedor de IA da minha turma" }
    ]
  }
];

const PROFILES = {
  achiever: {
    name: "Conquistador",
    icon: Trophy,
    color: "#F59E0B",
    description: "Você é motivado por conquistas, metas e reconhecimento. Adora completar desafios e colecionar badges.",
    strengths: ["Foco em objetivos", "Persistência", "Autodisciplina"],
    recommendations: [
      "Definir metas claras para cada módulo",
      "Colecionar badges e certificações",
      "Acompanhar progresso com gráficos",
      "Participar de desafios extra"
    ]
  },
  explorer: {
    name: "Explorador",
    icon: Compass,
    color: "#10B981",
    description: "Você é movido pela curiosidade e pelo desejo de entender profundamente. Adora experimentar e descobrir.",
    strengths: ["Curiosidade", "Pensamento crítico", "Criatividade"],
    recommendations: [
      "Explorar recursos adicionais livremente",
      "Fazer projetos experimentais",
      "Pesquisar além do currículo",
      "Participar de descobertas guiadas"
    ]
  },
  socializer: {
    name: "Socializador",
    icon: Users,
    color: "#3B82F6",
    description: "Você valoriza conexões humanas e aprende melhor em grupo. Adora colaborar e ajudar outros.",
    strengths: ["Empatia", "Comunicação", "Trabalho em equipe"],
    recommendations: [
      "Participar de projetos em grupo",
      "Ajudar colegas com dúvidas",
      "Compartilhar descobertas no fórum",
      "Fazer pair programming"
    ]
  },
  competitor: {
    name: "Competidor",
    icon: Target,
    color: "#EF4444",
    description: "Você é impulsionado pela competição saudável e pelo desejo de ser o melhor. Adora desafios difíceis.",
    strengths: ["Determinação", "Resiliência", "Ambição"],
    recommendations: [
      "Participar de hackathons e competições",
      "Acompanhar rankings e leaderboards",
      "Fazer desafios de tempo limitado",
      "Resolver problemas cada vez mais difíceis"
    ]
  }
};

export default function BartleAssessmentPage() {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState(null);

  // Mutation para salvar perfil
  const saveProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      // Verificar se já existe perfil
      const existing = await base44.entities.MotivationalProfile.filter({
        student_email: user.email
      });

      if (existing.length > 0) {
        return await base44.entities.MotivationalProfile.update(existing[0].id, profileData);
      } else {
        return await base44.entities.MotivationalProfile.create({
          student_email: user.email,
          ...profileData
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivationalProfile'] });
    }
  });

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateProfile();
    }
  };

  const calculateProfile = () => {
    // Contar respostas por tipo
    const scores = {
      achiever: 0,
      explorer: 0,
      socializer: 0,
      competitor: 0
    };

    Object.values(answers).forEach(answer => {
      scores[answer] = (scores[answer] || 0) + 1;
    });

    // Normalizar para 0-100
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const normalized = {
      achiever_score: Math.round((scores.achiever / total) * 100),
      explorer_score: Math.round((scores.explorer / total) * 100),
      socializer_score: Math.round((scores.socializer / total) * 100),
      competitor_score: Math.round((scores.competitor / total) * 100)
    };

    // Determinar tipo primário
    const primaryType = Object.entries(normalized)
      .sort((a, b) => b[1] - a[1])[0][0]
      .replace('_score', '');

    const profileData = {
      ...normalized,
      bartle_type: normalized[`${primaryType}_score`] > 40 ? primaryType : 'mixed',
      assessment_completed: true,
      last_assessed: new Date().toISOString()
    };

    setProfile(profileData);
    saveProfileMutation.mutate(profileData);
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];
  const hasAnswered = answers[currentQ.id] !== undefined;

  if (!user || user.user_type !== 'estudante') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
        <p>Este assessment é apenas para estudantes.</p>
      </div>
    );
  }

  if (showResults && profile) {
    const primaryType = profile.bartle_type === 'mixed' 
      ? Object.entries(profile)
          .filter(([key]) => key.endsWith('_score'))
          .sort((a, b) => b[1] - a[1])[0][0].replace('_score', '')
      : profile.bartle_type;

    const profileInfo = PROFILES[primaryType];
    const Icon = profileInfo.icon;

    return (
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="card-innova border-none shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: profileInfo.color }} />
                <h2 className="text-3xl font-heading font-bold mb-2">Assessment Completo!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Seu perfil motivacional foi identificado
                </p>
              </div>

              <div className="bg-gradient-to-r p-8 rounded-2xl text-white mb-8"
                style={{ background: `linear-gradient(135deg, ${profileInfo.color} 0%, ${profileInfo.color}AA 100%)` }}
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Icon className="w-12 h-12" />
                  <h3 className="text-4xl font-bold">{profileInfo.name}</h3>
                </div>
                <p className="text-center text-lg">
                  {profileInfo.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    💪 Seus Pontos Fortes
                  </h4>
                  <ul className="space-y-2">
                    {profileInfo.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" style={{ color: profileInfo.color }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    🎯 Recomendações para Você
                  </h4>
                  <ul className="space-y-2">
                    {profileInfo.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-lg">•</span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
                  Distribuição do Seu Perfil
                </h4>
                {Object.entries(PROFILES).map(([type, info]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{info.name}</span>
                      <span className="text-sm font-bold" style={{ color: info.color }}>
                        {profile[`${type}_score`]}%
                      </span>
                    </div>
                    <Progress value={profile[`${type}_score`]} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="px-8 py-3"
                  style={{ backgroundColor: profileInfo.color, color: 'white' }}
                >
                  Começar Jornada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold mb-2">Descubra Seu Perfil Motivacional</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Responda 8 perguntas para personalizar sua experiência
          </p>
        </div>

        <Card className="card-innova border-none shadow-xl">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>
                  Pergunta {currentQuestion + 1} de {QUESTIONS.length}
                </span>
                <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              {currentQ.text}
            </h2>

            <RadioGroup 
              value={answers[currentQ.id]} 
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start space-x-3 p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer"
                    style={{ 
                      borderColor: answers[currentQ.id] === option.value 
                        ? 'var(--primary-teal)' 
                        : 'var(--neutral-medium)',
                      backgroundColor: answers[currentQ.id] === option.value
                        ? 'var(--primary-teal)10'
                        : 'var(--background)'
                    }}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                  >
                    <RadioGroupItem value={option.value} id={`${currentQ.id}-${idx}`} />
                    <Label 
                      htmlFor={`${currentQ.id}-${idx}`}
                      className="cursor-pointer flex-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={!hasAnswered}
                style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
              >
                {currentQuestion < QUESTIONS.length - 1 ? (
                  <>
                    Próxima
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Ver Resultado'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}