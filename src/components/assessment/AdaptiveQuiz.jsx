import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Clock, Brain, TrendingUp, TrendingDown } from "lucide-react";
import { calculateAbilityEstimate, selectNextQuestion } from "@/components/utils/irt";

/**
 * PASSO 7: Adaptive Quiz Component com IRT
 * 
 * Implementa Item Response Theory para ajustar dificuldade dinamicamente
 */

export default function AdaptiveQuiz({ 
  studentEmail, 
  concept, 
  moduleId,
  onComplete,
  onCancel 
}) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [abilityEstimate, setAbilityEstimate] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(`session_${Date.now()}`);

  useEffect(() => {
    loadQuestions();
  }, [concept, moduleId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // Buscar questões do conceito
      const allQuestions = await base44.entities.QuestionBank.filter({ 
        concept: concept,
        module_id: moduleId 
      });

      if (allQuestions.length === 0) {
        // Fallback: buscar qualquer questão do módulo
        const moduleQuestions = await base44.entities.QuestionBank.filter({ module_id: moduleId });
        setQuestions(moduleQuestions);
        
        if (moduleQuestions.length > 0) {
          setCurrentQuestion(moduleQuestions[0]);
        }
      } else {
        setQuestions(allQuestions);
        setCurrentQuestion(allQuestions[0]);
      }
      
    } catch (error) {
      console.error("Error loading questions:", error);
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    
    // Registrar resposta
    const responseData = {
      student_email: studentEmail,
      question_id: currentQuestion.id,
      answer: selectedAnswer,
      correct: correct,
      ability_estimate: abilityEstimate,
      response_time_seconds: 0, // TODO: track real time
      concept: concept,
      assessment_session_id: sessionId
    };

    try {
      await base44.entities.StudentResponse.create(responseData);
    } catch (error) {
      console.error("Error saving response:", error);
    }

    // Atualizar histórico
    const newResponses = [...responses, { ...responseData, question: currentQuestion }];
    setResponses(newResponses);

    // Recalcular habilidade usando IRT
    const newAbility = calculateAbilityEstimate(newResponses);
    setAbilityEstimate(newAbility);

    // Incrementar contador
    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Verificar se deve continuar (5-7 questões)
    if (newCount >= 5 && Math.abs(newAbility) < 0.5) {
      // Convergiu - finalizar
      finishQuiz(newResponses, newAbility);
      return;
    }

    if (newCount >= 7) {
      // Máximo de questões - finalizar
      finishQuiz(newResponses, newAbility);
      return;
    }

    // Selecionar próxima questão com dificuldade adequada
    const nextQuestion = selectNextQuestion(questions, newResponses, newAbility);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer("");
    } else {
      // Sem mais questões - finalizar
      finishQuiz(newResponses, newAbility);
    }
  };

  const finishQuiz = (finalResponses, finalAbility) => {
    setQuizComplete(true);
    
    const correctCount = finalResponses.filter(r => r.correct).length;
    const totalCount = finalResponses.length;
    const finalScore = Math.round((correctCount / totalCount) * 100);

    if (onComplete) {
      onComplete({
        responses: finalResponses,
        abilityEstimate: finalAbility,
        correctCount,
        totalCount,
        finalScore
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 animate-pulse" style={{ color: 'var(--primary-teal)' }} />
          <p>Carregando quiz adaptativo...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <p className="mb-4">Nenhuma questão disponível para este conceito ainda.</p>
          <Button onClick={onCancel} variant="outline">Voltar</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    const correctCount = responses.filter(r => r.correct).length;
    const totalCount = responses.length;
    const finalScore = Math.round((correctCount / totalCount) * 100);

    return (
      <Card className="border-none shadow-xl">
        <CardHeader style={{ backgroundColor: 'var(--success-light)' }}>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Quiz Completado!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: 'var(--success)' }}>
              {finalScore}%
            </div>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {correctCount} de {totalCount} questões corretas
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Sua Habilidade Estimada (θ):</span>
              <Badge style={{ 
                backgroundColor: abilityEstimate >= 0 ? 'var(--success)' : 'var(--warning)',
                color: 'white'
              }}>
                {abilityEstimate.toFixed(2)}
              </Badge>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {abilityEstimate >= 1 && "Excelente! Você domina este conceito."}
              {abilityEstimate >= 0 && abilityEstimate < 1 && "Bom trabalho! Você está no caminho certo."}
              {abilityEstimate < 0 && "Continue praticando! Recomendamos revisar o material."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Tentar Novamente
            </Button>
            <Button 
              onClick={onCancel}
              className="flex-1"
              style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
            >
              Continuar Lição
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = ((questionCount + 1) / 7) * 100;

  return (
    <Card className="border-none shadow-xl">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Quiz Adaptativo IRT
          </CardTitle>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Questão {questionCount + 1} de ~7
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Ability Indicator */}
        {questionCount > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <span className="text-sm font-semibold">Habilidade Estimada:</span>
            <div className="flex items-center gap-2">
              {abilityEstimate >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-orange-500" />
              )}
              <span className="font-bold">{abilityEstimate.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {currentQuestion.question_text}
          </h3>

          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                      borderColor: selectedAnswer === option.id 
                        ? 'var(--primary-teal)' 
                        : 'var(--neutral-medium)',
                      backgroundColor: selectedAnswer === option.id 
                        ? 'rgba(0, 169, 157, 0.1)' 
                        : 'var(--background)'
                    }}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mr-3" />
                    <span className="flex-1">{option.text}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={onCancel}
            variant="outline"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="flex-1"
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            {questionCount >= 4 ? 'Submeter e Finalizar' : 'Próxima Questão'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}