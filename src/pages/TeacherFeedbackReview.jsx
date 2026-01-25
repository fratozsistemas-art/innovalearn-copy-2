import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ThumbsUp,
  Edit3
} from "lucide-react";
import { useCurrentUser } from "@/components/hooks/useUser";
import { FeedbackDisplay } from "../components/feedback/AutoGrader";

export default function TeacherFeedbackReviewPage() {
  const { data: user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('needs_review'); // needs_review, all, approved
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [teacherOverride, setTeacherOverride] = useState({
    final_score: '',
    teacher_comments: '',
    approved: true
  });

  useEffect(() => {
    if (user) {
      loadFeedbacks();
    }
  }, [user, filter]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      let query = {};
      
      if (filter === 'needs_review') {
        query.requires_teacher_review = true;
        query['teacher_override.reviewed_by'] = null;
      } else if (filter === 'approved') {
        query['teacher_override.approved'] = true;
      }

      const data = await base44.entities.AutomatedFeedback.filter(query, '-created_date', 50);
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
    setLoading(false);
  };

  const handleReview = async (feedbackId, approved) => {
    try {
      const feedback = feedbacks.find(f => f.id === feedbackId);
      
      await base44.entities.AutomatedFeedback.update(feedbackId, {
        teacher_override: {
          reviewed_by: user.email,
          reviewed_at: new Date().toISOString(),
          final_score: parseFloat(teacherOverride.final_score) || feedback.automated_score,
          teacher_comments: teacherOverride.teacher_comments,
          approved
        }
      });

      // Atualizar a nota do assignment original
      await base44.entities.Assignment.update(feedback.submission_id, {
        status: 'graded',
        grade: parseFloat(teacherOverride.final_score) || feedback.automated_score,
        feedback: teacherOverride.teacher_comments || feedback.feedback_text
      });

      alert(approved ? 'Feedback aprovado!' : 'Feedback rejeitado e corrigido!');
      
      // Reset
      setSelectedFeedback(null);
      setTeacherOverride({ final_score: '', teacher_comments: '', approved: true });
      loadFeedbacks();

    } catch (error) {
      console.error('Error reviewing feedback:', error);
      alert('Erro ao revisar feedback');
    }
  };

  const selectFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setTeacherOverride({
      final_score: feedback.automated_score?.toString() || '',
      teacher_comments: '',
      approved: true
    });
  };

  if (!user || !['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type)) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Acesso restrito a professores e coordenadores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            Revisão de Feedbacks Automáticos
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Valide e ajuste feedbacks gerados automaticamente
          </p>
        </div>

        {/* Filtros */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="needs_review">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Aguardando Revisão
              <Badge className="ml-2 bg-yellow-600 text-white">
                {feedbacks.filter(f => f.requires_teacher_review && !f.teacher_override).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all">
              Todos
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprovados
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lista de Feedbacks */}
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-semibold">Tudo em dia!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Não há feedbacks aguardando revisão.
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((feedback) => (
                <Card 
                  key={feedback.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedFeedback?.id === feedback.id ? 'ring-2 ring-teal-500' : ''
                  }`}
                  onClick={() => selectFeedback(feedback)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {feedback.student_email}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {feedback.submission_type}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={
                          feedback.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                          feedback.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {feedback.confidence_level}
                        </Badge>
                        {feedback.teacher_override?.approved !== undefined && (
                          <Badge className={
                            feedback.teacher_override.approved 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }>
                            {feedback.teacher_override.approved ? 'Aprovado' : 'Ajustado'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Nota Automática</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {feedback.automated_score?.toFixed(0) || 'N/A'}
                        </p>
                      </div>
                      {feedback.requires_teacher_review && !feedback.teacher_override && (
                        <Badge className="bg-yellow-600 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Requer Revisão
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Painel de Revisão */}
          <div className="lg:sticky lg:top-4">
            {selectedFeedback ? (
              <Card>
                <CardHeader style={{ backgroundColor: 'var(--neutral-light)' }}>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Revisão de Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Feedback Automático */}
                  <div>
                    <h4 className="font-semibold mb-3">Feedback Automático</h4>
                    <FeedbackDisplay feedback={selectedFeedback} showDetails={true} />
                  </div>

                  {/* Override do Professor */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Ajustar Feedback</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nota Final (0-100)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={teacherOverride.final_score}
                          onChange={(e) => setTeacherOverride({
                            ...teacherOverride,
                            final_score: e.target.value
                          })}
                          placeholder={selectedFeedback.automated_score?.toString() || '0'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Comentários Adicionais (opcional)
                        </label>
                        <Textarea
                          value={teacherOverride.teacher_comments}
                          onChange={(e) => setTeacherOverride({
                            ...teacherOverride,
                            teacher_comments: e.target.value
                          })}
                          placeholder="Adicione feedback personalizado aqui..."
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReview(selectedFeedback.id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => handleReview(selectedFeedback.id, false)}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Aprovar com Ajustes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    Selecione um feedback para revisar
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}