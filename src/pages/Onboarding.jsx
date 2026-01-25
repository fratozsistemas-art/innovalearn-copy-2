import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Brain, Rocket, Award, Eye, Ear, BookOpen, Hand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useNotificationSystem } from "@/components/hooks/useNotificationSystem";
import { useUpdateMyUser, useCurrentUser } from "@/components/hooks/useUser";
import VARKExperientialAssessment from "../components/onboarding/VARKExperience";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [explorerName, setExplorerName] = useState("");
  const [varkProfile, setVarkProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { executeWithFeedback } = useNotificationSystem();
  const updateUserMutation = useUpdateMyUser();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleVARKComplete = (profile) => {
    setVarkProfile(profile);
    setStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const result = await executeWithFeedback({
      asyncFn: async () => {
        await updateUserMutation.mutateAsync({
          ...varkProfile,
          explorer_name: explorerName,
          onboarding_completed: true
        });

        navigate(createPageUrl("MotivationalAssessment"));
      },
      loadingMessage: 'Salvando perfil de aprendizado...',
      successMessage: 'Perfil salvo! Agora vamos descobrir o que te motiva.',
      errorMessage: 'Erro ao salvar perfil'
    });

    if (!result.success) {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return explorerName.trim().length > 0;
    if (step === 2) return false;
    if (step === 3) return varkProfile !== null;
    return false;
  };

  const handleNext = () => {
    if (step === 3) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0 && step !== 2) {
      setStep(step - 1);
    }
  };

  const explorerLevel = user?.explorer_level || 'curiosity';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-navy) 100%)' }}>
      <div className="w-full max-w-4xl">
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
              <AnimatePresence mode="wait">
                
                {step === 0 && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-6"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-teal)' }}>
                        <Rocket className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h1 className="text-4xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                      Bem-vindo à Innova Academy!
                    </h1>
                    <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                      Você está prestes a começar sua jornada como <span className="font-bold" style={{ color: 'var(--primary-teal)' }}>Explorador Digital</span>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <Brain className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-teal)' }} />
                        <p className="text-sm font-semibold">Curiosity</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--info)' }} />
                        <p className="text-sm font-semibold">Discovery</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <Rocket className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-orange)' }} />
                        <p className="text-sm font-semibold">Pioneer</p>
                      </div>
                      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
                        <Award className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-yellow)' }} />
                        <p className="text-sm font-semibold">Challenger</p>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Vamos descobrir como você aprende melhor através de experiências reais!
                    </p>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-heading font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Como devemos te chamar, Explorador?
                      </h2>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Escolha um nome de explorador que te represente nesta jornada
                      </p>
                    </div>
                    <div className="max-w-md mx-auto">
                      <Label className="text-lg mb-3 block" style={{ color: 'var(--text-primary)' }}>
                        Seu Nome de Explorador
                      </Label>
                      <Input
                        placeholder="Ex: Explorador Alpha, Navegador Nova, etc."
                        value={explorerName}
                        onChange={(e) => setExplorerName(e.target.value)}
                        className="text-lg p-6"
                        style={{ borderColor: 'var(--primary-teal)' }}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="vark-experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Descubra Como Você Aprende Melhor
                      </h2>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        Vamos explorar 3 curiosidades. Escolha como prefere aprender cada uma!
                      </p>
                    </div>
                    
                    <VARKExperientialAssessment
                      explorerLevel={explorerLevel}
                      onComplete={handleVARKComplete}
                    />
                  </motion.div>
                )}

                {step === 3 && varkProfile && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--success)' }}>
                        <Brain className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                      Perfil Descoberto, {explorerName}!
                    </h2>
                    
                    <Card className="max-w-md mx-auto" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Seu Jeito de Aprender:</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" style={{ color: '#3B82F6' }} />
                              <span className="text-sm">Visual</span>
                            </div>
                            <span className="font-bold">{varkProfile.vark_visual}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Ear className="w-4 h-4" style={{ color: '#10B981' }} />
                              <span className="text-sm">Auditivo</span>
                            </div>
                            <span className="font-bold">{varkProfile.vark_auditory}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" style={{ color: '#F59E0B' }} />
                              <span className="text-sm">Leitura/Escrita</span>
                            </div>
                            <span className="font-bold">{varkProfile.vark_read_write}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Hand className="w-4 h-4" style={{ color: '#EF4444' }} />
                              <span className="text-sm">Cinestésico</span>
                            </div>
                            <span className="font-bold">{varkProfile.vark_kinesthetic}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                      Agora vamos descobrir o que te motiva a aprender
                    </p>
                    <div className="p-6 rounded-2xl my-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
                      <p className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Próximo Passo: Assessment Motivacional
                      </p>
                      <ul className="space-y-2 text-left max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        <li className="flex items-start gap-2">
                          <span style={{ color: 'var(--primary-teal)' }}>✓</span>
                          <span>Descobrir se você é Conquistador, Explorador, Social ou Competidor</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: 'var(--primary-teal)' }}>✓</span>
                          <span>Personalizar recompensas e desafios para você</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: 'var(--primary-teal)' }}>✓</span>
                          <span>Criar experiência única de aprendizado</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {step !== 2 && (
                <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--neutral-medium)' }}>
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    disabled={step === 0 || step === 2}
                    className="btn-secondary"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--primary-teal)' }}
                  >
                    {isSubmitting ? "Salvando..." : step === 3 ? "Continuar para Motivação →" : "Próximo"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}