
import React, { useState, useEffect, useCallback } from "react";
import { TaskSubmission } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  Clock, 
  Send,
  Award,
  XCircle,
  Eye,
  ExternalLink,
  Play
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_CONFIG = {
  not_started: { 
    label: "Não Iniciada", 
    color: "bg-gray-100 text-gray-800", 
    icon: Clock 
  },
  in_progress: { 
    label: "Em Andamento", 
    color: "bg-blue-100 text-blue-800", 
    icon: Clock 
  },
  awaiting_verification: { 
    label: "Aguardando Verificação", 
    color: "bg-yellow-100 text-yellow-800", 
    icon: Eye 
  },
  verified: { 
    label: "Verificada", 
    color: "bg-green-100 text-green-800", 
    icon: CheckCircle2 
  },
  rejected: { 
    label: "Rejeitada", 
    color: "bg-red-100 text-red-800", 
    icon: XCircle 
  }
};

// Função para extrair ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Função para verificar se é URL do YouTube
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Componente para renderizar vídeo do YouTube embedado
const YouTubeEmbed = ({ url, title }) => {
  const videoId = getYouTubeVideoId(url);
  
  if (!videoId) {
    return (
      <Button
        onClick={() => window.open(url, '_blank')}
        variant="outline"
        className="w-full"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Acessar Vídeo
      </Button>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border-2 hover:border-red-500 transition-all bg-black">
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title || "Vídeo da atividade"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          loading="lazy"
        />
      </div>
      <div className="p-3 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-red-600" />
          <span className="text-xs font-semibold text-white">
            {title || "Vídeo"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(url, '_blank')}
          className="text-white hover:bg-white/10 text-xs h-7"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Abrir no YouTube
        </Button>
      </div>
    </div>
  );
};

// Componente para renderizar recurso interativo
const InteractiveResource = ({ url, title, description }) => {
  return (
    <div 
      className="relative group cursor-pointer rounded-lg overflow-hidden border-2 hover:border-blue-500 transition-all bg-gradient-to-br from-blue-500 to-cyan-600"
      onClick={() => window.open(url, '_blank')}
    >
      <div className="h-48 flex items-center justify-center">
        <div className="text-center text-white">
          <ExternalLink className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-lg font-bold">Atividade Interativa</p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default function TaskSubmissionCard({ 
  lessonId, 
  taskType, 
  taskData,
  onStatusChange 
}) {
  const [user, setUser] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [verifierNotes, setVerifierNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    const submissions = await TaskSubmission.filter({
      student_email: userData.email,
      lesson_id: lessonId,
      task_type: taskType
    });

    if (submissions.length > 0) {
      setSubmission(submissions[0]);
    }
    setLoading(false);
  }, [lessonId, taskType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitForVerification = async () => {
    if (submission) {
      await TaskSubmission.update(submission.id, {
        status: "awaiting_verification",
        submitted_at: new Date().toISOString(),
        submission_notes: submissionNotes
      });
    } else {
      await TaskSubmission.create({
        student_email: user.email,
        lesson_id: lessonId,
        task_type: taskType,
        status: "awaiting_verification",
        submitted_at: new Date().toISOString(),
        submission_notes: submissionNotes
      });
    }

    setIsSubmitDialogOpen(false);
    setSubmissionNotes("");
    await loadData();
    if (onStatusChange) onStatusChange();
  };

  const handleVerify = async (approved) => {
    const updateData = {
      status: approved ? "verified" : "rejected",
      verified_by: user.email,
      verified_at: new Date().toISOString(),
      verifier_notes: verifierNotes
    };

    if (approved && taskData.innova_coins_reward) {
      updateData.coins_awarded = taskData.innova_coins_reward;
    }

    if (!approved) {
      updateData.rejection_reason = verifierNotes;
    }

    await TaskSubmission.update(submission.id, updateData);

    setIsVerifyDialogOpen(false);
    setVerifierNotes("");
    await loadData();
    if (onStatusChange) onStatusChange();
  };

  const canVerify = () => {
    if (!user || !submission) return false;
    
    if (taskType === "familywork") {
      return user.user_type === "pai_responsavel";
    }
    
    return ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);
  };

  const isStudent = user && user.user_type === "aluno";

  if (loading) {
    return <div>Carregando...</div>;
  }

  const statusInfo = STATUS_CONFIG[submission?.status || "not_started"];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="border-l-4" style={{ borderColor: taskData.innova_coins_reward ? 'var(--accent-yellow)' : 'var(--primary-teal)' }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {taskData.titulo}
              {submission && (
                <Badge className={`${statusInfo.color} border-0 ml-2`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{taskData.descricao}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Recursos Principais */}
        {taskData.resource_url && (
          <div>
            {isYouTubeUrl(taskData.resource_url) ? (
              <YouTubeEmbed 
                url={taskData.resource_url} 
                title={taskData.titulo}
              />
            ) : (
              <Button
                onClick={() => window.open(taskData.resource_url, '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Acessar Material
              </Button>
            )}
          </div>
        )}

        {/* Recursos Adicionais */}
        {taskData.recursos_adicionais && taskData.recursos_adicionais.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Recursos:</p>
            <div className="grid gap-4">
              {taskData.recursos_adicionais.map((recurso, idx) => (
                <div key={idx}>
                  {isYouTubeUrl(recurso.url) ? (
                    <YouTubeEmbed 
                      url={recurso.url} 
                      title={recurso.titulo}
                    />
                  ) : recurso.tipo === 'atividade_interativa' ? (
                    <InteractiveResource
                      url={recurso.url}
                      title={recurso.titulo}
                      description={recurso.descricao}
                    />
                  ) : (
                    <Button
                      onClick={() => window.open(recurso.url, '_blank')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {recurso.titulo}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {taskData.tempo_estimado} min
          </span>
          {taskData.innova_coins_reward && (
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-yellow-500" />
              +{taskData.innova_coins_reward} Coins
            </span>
          )}
        </div>

        {/* Notas de Submissão */}
        {submission?.submission_notes && (
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs font-semibold mb-1">Notas do Aluno:</p>
            <p className="text-sm">{submission.submission_notes}</p>
          </div>
        )}

        {/* Feedback do Verificador */}
        {submission?.verifier_notes && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: submission.status === 'verified' ? 'var(--success)' : 'var(--error)', color: 'white' }}>
            <p className="text-xs font-semibold mb-1">
              Feedback do {taskType === 'familywork' ? 'Responsável' : 'Professor'}:
            </p>
            <p className="text-sm">{submission.verifier_notes}</p>
          </div>
        )}

        {/* Ações do Aluno */}
        {isStudent && (
          <div>
            {(!submission || submission.status === "not_started" || submission.status === "in_progress" || submission.status === "rejected") && (
              <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar para Verificação
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enviar Tarefa para Verificação</DialogTitle>
                    <DialogDescription>
                      Conte-nos o que você fez e aprendeu com esta atividade.
                      {taskType === 'familywork' && ' Um responsável precisará verificar sua conclusão.'}
                      {taskType !== 'familywork' && ' Seu professor verificará sua conclusão.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>O que você fez? O que aprendeu?</Label>
                      <Textarea
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Descreva o que você fez e o que aprendeu..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubmitForVerification}
                      disabled={!submissionNotes.trim()}
                      style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
                    >
                      Enviar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {/* Ações do Verificador */}
        {canVerify() && submission?.status === "awaiting_verification" && (
          <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Verificar Conclusão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verificar Tarefa</DialogTitle>
                <DialogDescription>
                  Confirme se o aluno completou a atividade adequadamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {submission.submission_notes && (
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm font-semibold mb-1">Notas do Aluno:</p>
                    <p className="text-sm">{submission.submission_notes}</p>
                  </div>
                )}
                <div>
                  <Label>Feedback para o aluno:</Label>
                  <Textarea
                    value={verifierNotes}
                    onChange={(e) => setVerifierNotes(e.target.value)}
                    placeholder="Deixe um feedback sobre o trabalho do aluno..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => handleVerify(false)}
                  disabled={!verifierNotes.trim()}
                  style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeitar
                </Button>
                <Button 
                  onClick={() => handleVerify(true)}
                  disabled={!verifierNotes.trim()}
                  style={{ backgroundColor: 'var(--success)', color: 'white' }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
