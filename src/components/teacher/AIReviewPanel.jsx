import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Star,
  TrendingUp,
  Target,
  Sparkles,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AIReviewPanel = ({ pendingReviews, onReviewComplete }) => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [teacherRating, setTeacherRating] = useState(3);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const openReviewDialog = (review, action) => {
    setSelectedReview(review);
    setReviewAction(action);
    setTeacherFeedback("");
    setTeacherRating(3);
    setRejectionReason("");
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();

      await base44.entities.AIRecommendationReview.update(selectedReview.id, {
        status: 'approved',
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
        teacher_feedback: teacherFeedback,
        teacher_rating: teacherRating,
        applied_to_student: true,
        applied_at: new Date().toISOString()
      });

      // Apply the recommendation to the student
      await applyRecommendationToStudent(selectedReview);

      toast.success('Recomendação aprovada e aplicada ao aluno!');
      setIsDialogOpen(false);
      if (onReviewComplete) onReviewComplete();
    } catch (error) {
      console.error('Error approving recommendation:', error);
      toast.error('Erro ao aprovar recomendação');
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Por favor, selecione um motivo para rejeição');
      return;
    }

    setLoading(true);
    try {
      const user = await base44.auth.me();

      await base44.entities.AIRecommendationReview.update(selectedReview.id, {
        status: 'rejected',
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
        teacher_feedback: teacherFeedback,
        teacher_rating: teacherRating,
        rejection_reason: rejectionReason
      });

      toast.success('Recomendação rejeitada. Feedback enviado para melhorar a IA.');
      setIsDialogOpen(false);
      if (onReviewComplete) onReviewComplete();
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      toast.error('Erro ao rejeitar recomendação');
    }
    setLoading(false);
  };

  const applyRecommendationToStudent = async (review) => {
    const { recommendation_type, recommendation_data, student_email } = review;

    try {
      if (recommendation_type === 'custom_assignment') {
        // Create assignment for student
        await base44.entities.Assignment.create({
          student_email: student_email,
          title: recommendation_data.title,
          description: recommendation_data.description,
          course_id: recommendation_data.course_id || 'personalized',
          lesson_id: recommendation_data.lesson_id || null,
          due_date: recommendation_data.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          points: recommendation_data.points || 100,
          assignment_type: recommendation_data.type || 'homework',
          status: 'pending',
          rubric: recommendation_data.rubric || null
        });
      } else if (recommendation_type === 'intervention') {
        // Create notification for student
        await base44.entities.Notification.create({
          user_email: student_email,
          type: 'at_risk_alert',
          priority: 'high',
          title: 'Suporte Personalizado Disponível',
          message: recommendation_data.intervention_message,
          action_url: recommendation_data.resource_url || null
        });
      }
    } catch (error) {
      console.error('Error applying recommendation:', error);
      throw error;
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 80) return 'Alta Confiança';
    if (score >= 60) return 'Confiança Média';
    return 'Baixa Confiança';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'learning_path': return <Target className="w-5 h-5" />;
      case 'custom_assignment': return <FileText className="w-5 h-5" />;
      case 'resource_recommendation': return <Sparkles className="w-5 h-5" />;
      case 'intervention': return <AlertCircle className="w-5 h-5" />;
      case 'difficulty_adjustment': return <TrendingUp className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      learning_path: 'Caminho de Aprendizado',
      custom_assignment: 'Tarefa Personalizada',
      resource_recommendation: 'Recomendação de Recurso',
      intervention: 'Intervenção',
      difficulty_adjustment: 'Ajuste de Dificuldade'
    };
    return labels[type] || type;
  };

  if (pendingReviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-bold mb-2">Tudo Revisado!</h3>
          <p className="text-gray-600">
            Não há recomendações de IA pendentes de revisão no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Revisão de Recomendações da IA
          </CardTitle>
          <p className="text-sm opacity-90 mt-2">
            Revise, aprove ou rejeite recomendações geradas pela IA. Seu feedback ajuda a melhorar o sistema.
          </p>
        </CardHeader>
      </Card>

      {pendingReviews.map((review) => (
        <Card key={review.id} className="hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary-teal)' + '20', color: 'var(--primary-teal)' }}
                >
                  {getTypeIcon(review.recommendation_type)}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    {review.recommendation_data?.title || getTypeLabel(review.recommendation_type)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Aluno: <span className="font-medium">{review.student_email}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {getTypeLabel(review.recommendation_type)}
                    </Badge>
                    <Badge style={{ 
                      backgroundColor: getConfidenceColor(review.ai_confidence_score) + '20',
                      color: getConfidenceColor(review.ai_confidence_score),
                      border: 'none'
                    }}>
                      {getConfidenceLabel(review.ai_confidence_score)} • {review.ai_confidence_score}%
                    </Badge>
                    {review.priority === 'urgent' && (
                      <Badge style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                        URGENTE
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <div className="flex items-start gap-2 mb-2">
                <Brain className="w-4 h-4 mt-1" style={{ color: 'var(--primary-teal)' }} />
                <div>
                  <p className="text-sm font-semibold">Justificativa da IA:</p>
                  <p className="text-sm text-gray-700 mt-1">{review.ai_reasoning}</p>
                </div>
              </div>
            </div>

            {/* Recommendation Content Preview */}
            <div className="border rounded-lg p-4 mb-4">
              <h5 className="font-semibold mb-2 text-sm text-gray-600">Conteúdo da Recomendação:</h5>
              {review.recommendation_type === 'custom_assignment' && (
                <div className="space-y-2 text-sm">
                  <p><strong>Descrição:</strong> {review.recommendation_data?.description}</p>
                  {review.recommendation_data?.instructions && (
                    <div>
                      <strong>Instruções:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        {review.recommendation_data.instructions.slice(0, 3).map((inst, idx) => (
                          <li key={idx}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p><strong>Tempo Estimado:</strong> {review.recommendation_data?.estimated_time_minutes} min</p>
                </div>
              )}
              
              {review.recommendation_type === 'learning_path' && (
                <div className="space-y-2 text-sm">
                  <p>{review.recommendation_data?.description}</p>
                  {review.recommendation_data?.next_steps && (
                    <div>
                      <strong>Próximos Passos:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        {review.recommendation_data.next_steps.slice(0, 3).map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {review.recommendation_type === 'intervention' && (
                <div className="space-y-2 text-sm">
                  <p>{review.recommendation_data?.intervention_message}</p>
                  {review.recommendation_data?.suggested_actions && (
                    <div>
                      <strong>Ações Sugeridas:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        {review.recommendation_data.suggested_actions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1"
                style={{ backgroundColor: 'var(--success)', color: 'white' }}
                onClick={() => openReviewDialog(review, 'approve')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => openReviewDialog(review, 'reject')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {reviewAction === 'approve' ? 'Aprovar Recomendação' : 'Rejeitar Recomendação'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {reviewAction === 'approve' 
                ? 'Confirme a aprovação e a recomendação será aplicada ao aluno.'
                : 'Indique o motivo da rejeição para melhorar futuras recomendações.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {reviewAction === 'reject' && (
              <div className="space-y-2">
                <Label className="text-gray-900 font-semibold">Motivo da Rejeição *</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger className="text-gray-900 bg-gray-50">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="inappropriate_content">Conteúdo Inadequado</SelectItem>
                    <SelectItem value="incorrect_level">Nível Incorreto</SelectItem>
                    <SelectItem value="wrong_vark_style">Estilo VARK Errado</SelectItem>
                    <SelectItem value="culturally_insensitive">Culturalmente Inadequado</SelectItem>
                    <SelectItem value="factually_incorrect">Factualmente Incorreto</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-900 font-semibold">Avaliação (1-5 estrelas)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTeacherRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= teacherRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 font-semibold">
                Feedback para a IA {reviewAction === 'approve' ? '(opcional)' : '(recomendado)'}
              </Label>
              <Textarea
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                placeholder="Seu feedback ajuda a IA a melhorar futuras recomendações..."
                rows={4}
                className="text-gray-900 bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              onClick={reviewAction === 'approve' ? handleApprove : handleReject}
              disabled={loading || (reviewAction === 'reject' && !rejectionReason)}
              style={{ 
                backgroundColor: reviewAction === 'approve' ? 'var(--success)' : 'var(--error)', 
                color: 'white' 
              }}
            >
              {loading ? 'Processando...' : reviewAction === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIReviewPanel;