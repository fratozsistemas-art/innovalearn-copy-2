import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, Globe, Heart, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useGenerateLearnerProfile } from "@/components/hooks/useLearnerProfile";
import { useCurrentUser } from "@/components/hooks/useUser";
import { toast } from "sonner";

/**
 * Comprehensive Learner Assessment - CAIO-TSI Function 1.1
 * 
 * Multi-dimensional profiling experience that generates a complete
 * learner intelligence profile through CAIO-TSI Orchestration
 */

const ASSESSMENT_SECTIONS = [
  {
    id: 'context',
    title: 'Seu Contexto de Aprendizado',
    icon: Globe,
    color: 'var(--primary-teal)'
  },
  {
    id: 'learning_preferences',
    title: 'Como Você Aprende Melhor',
    icon: Brain,
    color: 'var(--info)'
  },
  {
    id: 'interests',
    title: 'Seus Interesses e Motivações',
    icon: Heart,
    color: 'var(--accent-orange)'
  },
  {
    id: 'experience',
    title: 'Sua Jornada de Aprendizado',
    icon: TrendingUp,
    color: 'var(--success)'
  },
  {
    id: 'goals',
    title: 'Seus Objetivos',
    icon: Target,
    color: 'var(--accent-yellow)'
  }
];

export default function ComprehensiveAssessmentPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const generateProfile = useGenerateLearnerProfile();

  const [currentSection, setCurrentSection] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    // Context
    age_group: user?.explorer_level || '',
    cultural_context: 'brazilian',
    learning_environment: 'hybrid',
    family_dynamic: 'collaborative',
    
    // Learning Preferences
    visual_activities: [],
    auditory_activities: [],
    reading_activities: [],
    hands_on_activities: [],
    preferred_learning_time: '',
    social_preference: 'mixed',
    
    // Interests
    favorite_subjects: [],
    challenge_level: 'moderate_challenge',
    reward_preferences: [],
    what_excites_you: '',
    
    // Experience
    prior_ai_experience: 'some_exposure',
    previous_learning_quality: 'mixed',
    biggest_success: '',
    biggest_struggle: '',
    confidence_level: 50,
    
    // Goals
    what_want_to_learn: '',
    dream_project: '',
    how_want_to_use_ai: ''
  });

  const progress = ((currentSection + 1) / ASSESSMENT_SECTIONS.length) * 100;
  const currentSectionData = ASSESSMENT_SECTIONS[currentSection];

  const handleChange = (field, value) => {
    setAssessmentData({ ...assessmentData, [field]: value });
  };

  const handleNext = () => {
    if (currentSection < ASSESSMENT_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    toast.loading('CAIO-TSI está analisando seu perfil...', { id: 'profile-gen' });
    
    try {
      const result = await generateProfile.mutateAsync(assessmentData);
      
      toast.success('Perfil de Aprendizado Gerado com Sucesso!', { id: 'profile-gen' });
      
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
      
    } catch (error) {
      console.error('Error generating profile:', error);
      toast.error('Erro ao gerar perfil. Tente novamente.', { id: 'profile-gen' });
    }
  };

  const CurrentSectionIcon = currentSectionData.icon;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">CAIO-TSI Intelligence Assessment</h1>
          </div>
          <p className="text-white/90">
            Vamos descobrir como você aprende melhor para personalizar toda sua jornada!
          </p>
        </motion.div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Progresso</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--primary-teal)' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            
            <div className="flex justify-between">
              {ASSESSMENT_SECTIONS.map((section, idx) => (
                <div 
                  key={section.id}
                  className={`flex flex-col items-center ${idx === currentSection ? 'opacity-100' : 'opacity-40'}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{ 
                      backgroundColor: idx <= currentSection ? section.color : '#ccc',
                      color: 'white'
                    }}
                  >
                    {idx < currentSection ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <section.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs text-center hidden md:block">{section.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl">
              <CardHeader 
                className="border-b"
                style={{ backgroundColor: currentSectionData.color, color: 'white' }}
              >
                <CardTitle className="flex items-center gap-3">
                  <CurrentSectionIcon className="w-6 h-6" />
                  {currentSectionData.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                
                {/* Context Section */}
                {currentSection === 0 && (
                  <>
                    <div>
                      <Label>Contexto Cultural *</Label>
                      <Select value={assessmentData.cultural_context} onValueChange={(v) => handleChange('cultural_context', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brazilian">🇧🇷 Brasileiro</SelectItem>
                          <SelectItem value="middle_east">🌍 Oriente Médio</SelectItem>
                          <SelectItem value="global">🌎 Global/Internacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Ambiente de Aprendizado *</Label>
                      <RadioGroup value={assessmentData.learning_environment} onValueChange={(v) => handleChange('learning_environment', v)}>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home" className="flex-1 cursor-pointer">🏠 Casa (maior parte do tempo)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="school" id="school" />
                          <Label htmlFor="school" className="flex-1 cursor-pointer">🏫 Escola (presencial)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="hybrid" id="hybrid" />
                          <Label htmlFor="hybrid" className="flex-1 cursor-pointer">🔄 Híbrido (mix de casa e escola)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Dinâmica Familiar no Aprendizado *</Label>
                      <RadioGroup value={assessmentData.family_dynamic} onValueChange={(v) => handleChange('family_dynamic', v)}>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="collaborative" id="collab" />
                          <Label htmlFor="collab" className="flex-1 cursor-pointer">👨‍👩‍👧 Colaborativa (família participa ativamente)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="independent" id="indep" />
                          <Label htmlFor="indep" className="flex-1 cursor-pointer">🎯 Independente (aprendo sozinho)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                          <RadioGroupItem value="guided" id="guided" />
                          <Label htmlFor="guided" className="flex-1 cursor-pointer">🤝 Guiada (preciso de apoio constante)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* Learning Preferences Section */}
                {currentSection === 1 && (
                  <>
                    <div>
                      <Label>Quando você aprende melhor?</Label>
                      <Select value={assessmentData.preferred_learning_time} onValueChange={(v) => handleChange('preferred_learning_time', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">🌅 Manhã (mais alerta e focado)</SelectItem>
                          <SelectItem value="afternoon">☀️ Tarde (energia boa)</SelectItem>
                          <SelectItem value="evening">🌙 Noite (concentração máxima)</SelectItem>
                          <SelectItem value="flexible">🔄 Flexível (qualquer hora está bem)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Você prefere aprender:</Label>
                      <RadioGroup value={assessmentData.social_preference} onValueChange={(v) => handleChange('social_preference', v)}>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="solitary" id="solo" />
                          <Label htmlFor="solo" className="flex-1 cursor-pointer">👤 Sozinho (foco total)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="small_group" id="small" />
                          <Label htmlFor="small" className="flex-1 cursor-pointer">👥 Grupo pequeno (2-3 pessoas)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="large_group" id="large" />
                          <Label htmlFor="large" className="flex-1 cursor-pointer">👨‍👩‍👧‍👦 Grupo grande (colaboração intensa)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="mixed" id="mixed" />
                          <Label htmlFor="mixed" className="flex-1 cursor-pointer">🔀 Mix (depende da atividade)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Marque as atividades que você MAIS gosta:</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { value: 'watch_videos', label: '📹 Assistir vídeos' },
                          { value: 'listen_explanations', label: '🎧 Ouvir explicações' },
                          { value: 'read_articles', label: '📖 Ler artigos' },
                          { value: 'hands_on_projects', label: '🔨 Projetos práticos' },
                          { value: 'discussions', label: '💬 Discussões' },
                          { value: 'write_notes', label: '✍️ Escrever anotações' }
                        ].map((activity) => (
                          <Button
                            key={activity.value}
                            variant={assessmentData.visual_activities?.includes(activity.value) ? 'default' : 'outline'}
                            size="sm"
                            className="justify-start"
                            onClick={() => {
                              const current = assessmentData.visual_activities || [];
                              const updated = current.includes(activity.value)
                                ? current.filter(a => a !== activity.value)
                                : [...current, activity.value];
                              handleChange('visual_activities', updated);
                            }}
                          >
                            {activity.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Interests Section */}
                {currentSection === 2 && (
                  <>
                    <div>
                      <Label>Nível de Desafio Preferido</Label>
                      <RadioGroup value={assessmentData.challenge_level} onValueChange={(v) => handleChange('challenge_level', v)}>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="prefers_easy" id="easy" />
                          <Label htmlFor="easy" className="flex-1 cursor-pointer">😊 Prefiro mais fácil (construir confiança)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="moderate_challenge" id="moderate" />
                          <Label htmlFor="moderate" className="flex-1 cursor-pointer">💪 Desafio moderado (me estica um pouco)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="high_challenge" id="high" />
                          <Label htmlFor="high" className="flex-1 cursor-pointer">🚀 Alto desafio (quero ser testado!)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="extreme_challenge" id="extreme" />
                          <Label htmlFor="extreme" className="flex-1 cursor-pointer">⚡ Extremo (só o impossível me motiva)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>O que mais te empolga em aprender IA?</Label>
                      <Textarea
                        value={assessmentData.what_excites_you}
                        onChange={(e) => handleChange('what_excites_you', e.target.value)}
                        placeholder="Ex: Criar jogos, resolver problemas ambientais, fazer arte com IA..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {/* Experience Section */}
                {currentSection === 3 && (
                  <>
                    <div>
                      <Label>Sua experiência prévia com IA/Programação</Label>
                      <RadioGroup value={assessmentData.prior_ai_experience} onValueChange={(v) => handleChange('prior_ai_experience', v)}>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner" className="flex-1 cursor-pointer">🌱 Iniciante total (nunca fiz nada)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="some_exposure" id="some" />
                          <Label htmlFor="some" className="flex-1 cursor-pointer">👀 Já vi algo (mas não entendo muito)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="intermediate" id="inter" />
                          <Label htmlFor="inter" className="flex-1 cursor-pointer">💻 Intermediário (já fiz alguns projetos)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded">
                          <RadioGroupItem value="advanced" id="adv" />
                          <Label htmlFor="adv" className="flex-1 cursor-pointer">🚀 Avançado (programo regularmente)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Conte sobre um sucesso de aprendizado que te orgulha:</Label>
                      <Textarea
                        value={assessmentData.biggest_success}
                        onChange={(e) => handleChange('biggest_success', e.target.value)}
                        placeholder="Qualquer conquista, por menor que pareça..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Qual foi sua maior dificuldade ao aprender algo?</Label>
                      <Textarea
                        value={assessmentData.biggest_struggle}
                        onChange={(e) => handleChange('biggest_struggle', e.target.value)}
                        placeholder="Ser honesto aqui nos ajuda a te apoiar melhor..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Confiança Atual em Aprender Coisas Novas: {assessmentData.confidence_level}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={assessmentData.confidence_level}
                        onChange={(e) => handleChange('confidence_level', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {/* Goals Section */}
                {currentSection === 4 && (
                  <>
                    <div>
                      <Label>O que você MAIS quer aprender este ano?</Label>
                      <Textarea
                        value={assessmentData.what_want_to_learn}
                        onChange={(e) => handleChange('what_want_to_learn', e.target.value)}
                        placeholder="Seja específico! Ex: Criar meu próprio chatbot, fazer um jogo com IA..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Seu projeto dos sonhos (se pudesse criar qualquer coisa com IA):</Label>
                      <Textarea
                        value={assessmentData.dream_project}
                        onChange={(e) => handleChange('dream_project', e.target.value)}
                        placeholder="Sonhe grande! Não há limites aqui..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Como você quer usar IA no futuro?</Label>
                      <Textarea
                        value={assessmentData.how_want_to_use_ai}
                        onChange={(e) => handleChange('how_want_to_use_ai', e.target.value)}
                        placeholder="Ex: Ajudar o meio ambiente, criar arte, ser cientista..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentSection === 0}
            className="bg-white"
          >
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={generateProfile.isPending}
            style={{ backgroundColor: currentSectionData.color, color: 'white' }}
          >
            {currentSection === ASSESSMENT_SECTIONS.length - 1
              ? (generateProfile.isPending ? 'Gerando Perfil...' : 'Finalizar Assessment')
              : 'Próximo'}
          </Button>
        </div>

      </div>
    </div>
  );
}