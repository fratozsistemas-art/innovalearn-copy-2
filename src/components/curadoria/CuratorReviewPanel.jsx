import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ThumbsUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function CuratorReviewPanel({ resource, onApprove, onReject, onRequestChanges }) {
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(resource.id, feedback);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(resource.id, feedback);
    setIsProcessing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="card-innova">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{resource.type}</Badge>
                <Badge variant="outline">{resource.source}</Badge>
                {resource.language && (
                  <Badge variant="outline">{resource.language.toUpperCase()}</Badge>
                )}
                {resource.duration_minutes && (
                  <Badge variant="outline">{resource.duration_minutes} min</Badge>
                )}
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {resource.description}
              </p>
            </div>
            <Badge className={getScoreBadgeColor(resource.auto_quality_score)}>
              {resource.auto_quality_score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Recurso
          </Button>
        </CardContent>
      </Card>

      {/* Scores Detalhados */}
      <Card className="card-innova">
        <CardHeader>
          <CardTitle className="text-lg">📊 Análise de Qualidade Automática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Rigor Pedagógico</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(resource.pedagogical_rigor) }}>
                {resource.pedagogical_rigor}/100
              </span>
            </div>
            <Progress value={resource.pedagogical_rigor} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Acessibilidade</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(resource.accessibility_score) }}>
                {resource.accessibility_score}/100
              </span>
            </div>
            <Progress value={resource.accessibility_score} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Engajamento</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(resource.engagement_score) }}>
                {resource.engagement_score}/100
              </span>
            </div>
            <Progress value={resource.engagement_score} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Profundidade</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(resource.depth_score) }}>
                {resource.depth_score}/100
              </span>
            </div>
            <Progress value={resource.depth_score} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Confiabilidade</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(resource.reliability_score) }}>
                {resource.reliability_score}/100
              </span>
            </div>
            <Progress value={resource.reliability_score} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Perfil VARK */}
      <Card className="card-innova">
        <CardHeader>
          <CardTitle className="text-lg">🎨 Perfil VARK</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-blue)' }}>
              {resource.vark_visual}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Visual</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-green)' }}>
              {resource.vark_auditory}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Auditivo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--warning)' }}>
              {resource.vark_read_write}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Leitura/Escrita</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--danger)' }}>
              {resource.vark_kinesthetic}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cinestésico</div>
          </div>
        </CardContent>
      </Card>

      {/* Preocupações e Pontos Fortes */}
      <div className="grid md:grid-cols-2 gap-4">
        {resource.concerns && resource.concerns.length > 0 && (
          <Card className="card-innova border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                Preocupações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resource.concerns.map((concern, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-warning">•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {resource.strengths && resource.strengths.length > 0 && (
          <Card className="card-innova border-l-4" style={{ borderLeftColor: 'var(--success)' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
                Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resource.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feedback do Curador */}
      <Card className="card-innova">
        <CardHeader>
          <CardTitle className="text-lg">💬 Feedback do Curador</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione observações, ajustes necessários, ou justificativa da decisão..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="mb-4"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprovar Recurso
            </Button>

            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar Recurso
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}