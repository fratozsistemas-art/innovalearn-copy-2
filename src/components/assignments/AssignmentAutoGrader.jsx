import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAutoGrade } from "@/components/hooks/useAutoGrader";
import { FeedbackDisplay } from "@/components/feedback/AutoGrader";
import RubricDisplay, { DEFAULT_RUBRIC } from "./RubricDisplay";

/**
 * AssignmentAutoGrader - Correção automática de tarefas
 */
export default function AssignmentAutoGrader({ assignment, submission, onGraded }) {
  const [autoFeedback, setAutoFeedback] = useState(null);
  const autoGradeMutation = useAutoGrade();

  const handleAutoGrade = async () => {
    try {
      // Preparar dados para auto-correção
      const submissionData = {
        submission_id: submission.id,
        student_email: submission.student_email,
        submission_type: determineSubmissionType(assignment, submission),
        question: assignment.description,
        answer: submission.content || "Arquivo enviado",
        correct_answer: assignment.expected_answer || null,
        rubric: assignment.rubric || DEFAULT_RUBRIC,
        file_url: submission.file_url
      };

      console.log('🤖 Iniciando correção automática...', submissionData);

      const feedback = await autoGradeMutation.mutateAsync(submissionData);
      setAutoFeedback(feedback);

      console.log('✅ Feedback gerado:', feedback);

      // Notificar componente pai
      if (onGraded) {
        onGraded(feedback);
      }
    } catch (error) {
      console.error('❌ Erro na correção automática:', error);
    }
  };

  const determineSubmissionType = (assignment, submission) => {
    if (submission.file_url) {
      if (submission.file_url.includes('.py')) return 'code';
      if (submission.file_url.includes('.pdf') || submission.file_url.includes('.doc')) return 'essay';
    }
    if (submission.content && submission.content.length > 500) return 'essay';
    if (submission.content && submission.content.length > 100) return 'short_answer';
    return 'short_answer';
  };

  return (
    <Card className="border-l-4 border-purple-500">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Correção Automática com IA
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Feedback instantâneo enquanto o professor não revisar
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        
        {!autoFeedback && (
          <div className="text-center">
            <Button
              onClick={handleAutoGrade}
              disabled={autoGradeMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {autoGradeMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Corrigindo...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Corrigir Automaticamente
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Tempo estimado: 5-10 segundos
            </p>
          </div>
        )}

        {autoFeedback && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">Correção Concluída</h4>
                  <p className="text-sm text-gray-600">
                    Feedback gerado em {autoFeedback.processing_time_ms || 0}ms
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {autoFeedback.automated_score}
                </div>
                <div className="text-sm text-gray-600">/ 100 pontos</div>
              </div>
            </div>

            {autoFeedback.confidence_level !== 'high' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 text-sm">
                    Revisão do professor recomendada
                  </p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Confiança da IA: {autoFeedback.confidence_level}. 
                    Esta correção será validada por um instrutor.
                  </p>
                </div>
              </div>
            )}

            <FeedbackDisplay feedback={autoFeedback} showDetails={true} />

            {assignment.rubric && autoFeedback.rubric_scores && (
              <RubricDisplay 
                rubric={assignment.rubric || DEFAULT_RUBRIC} 
                scores={autoFeedback.rubric_scores} 
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}