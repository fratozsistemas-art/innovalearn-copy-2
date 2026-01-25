import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle2, AlertCircle, FileText, Eye, Lock, Users } from "lucide-react";
import { toast } from "sonner";

const CONSENT_TYPES = [
  {
    id: 'full_platform_usage',
    title: 'Uso Completo da Plataforma',
    icon: CheckCircle2,
    color: 'var(--success)',
    description: 'Autorização completa para uso da plataforma InnovaLearn',
    details: [
      'Coleta e processamento de dados pessoais do aluno',
      'Dados acadêmicos (notas, progresso, frequência)',
      'Interações com IA (InnAI) para personalização',
      'Dados de gamificação (coins, badges, conquistas)',
      'Comunicação educacional (notificações, mensagens)'
    ],
    required: true
  },
  {
    id: 'data_collection',
    title: 'Coleta de Dados Educacionais',
    icon: FileText,
    color: 'var(--info)',
    description: 'Coleta de dados para personalização do aprendizado',
    details: [
      'Histórico de aprendizado e progresso',
      'Preferências de aprendizado (VARK)',
      'Padrões de engajamento',
      'Desempenho em avaliações',
      'Tempo dedicado a atividades'
    ],
    required: true
  },
  {
    id: 'ai_interaction',
    title: 'Interação com Inteligência Artificial',
    icon: Eye,
    color: 'var(--primary-teal)',
    description: 'Uso de IA para personalização e suporte ao aprendizado',
    details: [
      'Conversas com assistente InnAI',
      'Recomendações personalizadas de conteúdo',
      'Análise preditiva de dificuldades',
      'Sugestões adaptativas de caminho de aprendizado',
      'Feedback automatizado'
    ],
    required: false
  },
  {
    id: 'image_use',
    title: 'Uso de Imagem',
    icon: Users,
    color: 'var(--accent-orange)',
    description: 'Autorização para uso de imagem em contexto educacional',
    details: [
      'Fotos em atividades escolares',
      'Vídeos de apresentações de projetos',
      'Materiais de divulgação institucional',
      'Portfolio educacional do aluno',
      'Celebração de conquistas (com moderação)'
    ],
    required: false
  },
  {
    id: 'educational_tracking',
    title: 'Monitoramento Educacional',
    icon: Lock,
    color: 'var(--accent-yellow)',
    description: 'Acompanhamento detalhado para suporte pedagógico',
    details: [
      'Alertas de dificuldade de aprendizado',
      'Previsão de risco de evasão',
      'Análise de padrões de estudo',
      'Relatórios de progresso detalhados',
      'Sistema de early warning'
    ],
    required: false
  }
];

export default function LGPDConsentForm({ studentEmail, parentEmail, parentName }) {
  const [loading, setLoading] = useState(true);
  const [existingConsents, setExistingConsents] = useState([]);
  const [selectedConsents, setSelectedConsents] = useState({});
  const [revocationReason, setRevocationReason] = useState('');
  const [showRevocation, setShowRevocation] = useState(null);

  useEffect(() => {
    loadConsents();
  }, [studentEmail, parentEmail]);

  const loadConsents = async () => {
    setLoading(true);
    try {
      const consents = await base44.entities.ParentConsent.filter({
        student_email: studentEmail,
        parent_email: parentEmail,
        revoked: false
      });

      setExistingConsents(consents);

      // Initialize selected consents based on existing
      const selected = {};
      consents.forEach(consent => {
        selected[consent.consent_type] = consent.consent_granted;
      });
      setSelectedConsents(selected);
    } catch (error) {
      console.error('Error loading consents:', error);
    }
    setLoading(false);
  };

  const handleConsentChange = (consentType, granted) => {
    setSelectedConsents({
      ...selectedConsents,
      [consentType]: granted
    });
  };

  const handleGrantConsent = async (consentType) => {
    try {
      // Check if already exists
      const existing = existingConsents.find(c => c.consent_type === consentType);

      if (existing) {
        toast.info('Consentimento já concedido anteriormente');
        return;
      }

      await base44.entities.ParentConsent.create({
        student_email: studentEmail,
        parent_email: parentEmail,
        parent_name: parentName,
        relationship: 'legal_guardian',
        consent_type: consentType,
        consent_granted: true,
        consent_date: new Date().toISOString(),
        consent_ip: 'platform_ui', // In production, capture real IP
        version: 'v1.0',
        verified: true,
        verification_method: 'email',
        consent_details: {
          data_types_consented: ['personal_info', 'academic_performance', 'ai_interactions'],
          purposes_consented: ['personalization', 'analytics', 'communication'],
          retention_period_accepted: 'duration_of_enrollment',
          third_party_sharing_accepted: false
        }
      });

      toast.success('Consentimento registrado com sucesso!');
      await loadConsents();

      // Create audit log
      await base44.entities.AuditLog.create({
        user_email: parentEmail,
        action_type: 'ai_usage',
        entity_type: 'ParentConsent',
        entity_id: studentEmail,
        details: {
          action: 'consent_granted',
          consent_type: consentType,
          parent_name: parentName
        },
        success: true
      });

    } catch (error) {
      console.error('Error granting consent:', error);
      toast.error('Erro ao registrar consentimento');
    }
  };

  const handleRevokeConsent = async (consentType) => {
    if (!revocationReason) {
      toast.error('Por favor, indique o motivo da revogação');
      return;
    }

    try {
      const existing = existingConsents.find(c => c.consent_type === consentType);
      if (!existing) return;

      await base44.entities.ParentConsent.update(existing.id, {
        revoked: true,
        revocation_date: new Date().toISOString(),
        revocation_reason: revocationReason
      });

      toast.success('Consentimento revogado');
      setShowRevocation(null);
      setRevocationReason('');
      await loadConsents();

      // Audit log
      await base44.entities.AuditLog.create({
        user_email: parentEmail,
        action_type: 'ai_usage',
        entity_type: 'ParentConsent',
        entity_id: studentEmail,
        details: {
          action: 'consent_revoked',
          consent_type: consentType,
          reason: revocationReason
        },
        success: true
      });

    } catch (error) {
      console.error('Error revoking consent:', error);
      toast.error('Erro ao revogar consentimento');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p>Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  const hasRequiredConsents = CONSENT_TYPES
    .filter(ct => ct.required)
    .every(ct => existingConsents.some(ec => ec.consent_type === ct.id && ec.consent_granted));

  return (
    <div className="space-y-6">
      
      {/* LGPD Information */}
      <Card className="border-l-4" style={{ borderColor: 'var(--primary-teal)' }}>
        <CardHeader style={{ backgroundColor: 'var(--primary-teal)' + '10' }}>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" style={{ color: 'var(--primary-teal)' }} />
            Gestão de Consentimento - LGPD
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito de:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
              <span><strong>Confirmar</strong> que tratamos dados do seu filho</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
              <span><strong>Acessar</strong> todos os dados coletados</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
              <span><strong>Corrigir</strong> dados incompletos ou incorretos</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
              <span><strong>Revogar</strong> consentimentos a qualquer momento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
              <span><strong>Solicitar eliminação</strong> dos dados (exceto obrigações legais)</span>
            </li>
          </ul>

          {!hasRequiredConsents && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 text-sm">Ação Necessária</p>
                  <p className="text-xs text-yellow-800 mt-1">
                    Alguns consentimentos obrigatórios ainda não foram concedidos. 
                    O acesso completo à plataforma requer autorização dos itens marcados como obrigatórios.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent Types */}
      {CONSENT_TYPES.map((consentType) => {
        const existing = existingConsents.find(c => c.consent_type === consentType.id);
        const Icon = consentType.icon;

        return (
          <Card key={consentType.id} className="border-l-4" style={{ borderColor: consentType.color }}>
            <CardHeader style={{ backgroundColor: consentType.color + '10' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 mt-1" style={{ color: consentType.color }} />
                  <div>
                    <CardTitle className="text-lg mb-1">
                      {consentType.title}
                      {consentType.required && (
                        <Badge className="ml-2" style={{ backgroundColor: 'var(--error)', color: 'white' }}>
                          Obrigatório
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{consentType.description}</p>
                  </div>
                </div>
                {existing ? (
                  <Badge style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                    ✓ Concedido
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Pendente
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">O que isso inclui:</p>
                <ul className="space-y-1">
                  {consentType.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {existing ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Concedido em:</strong> {new Date(existing.consent_date).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {showRevocation === consentType.id ? (
                    <div className="space-y-3 p-4 bg-red-50 rounded-lg">
                      <Label>Motivo da Revogação:</Label>
                      <Textarea
                        value={revocationReason}
                        onChange={(e) => setRevocationReason(e.target.value)}
                        placeholder="Por favor, indique o motivo..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleRevokeConsent(consentType.id)}
                          disabled={!revocationReason}
                        >
                          Confirmar Revogação
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRevocation(null);
                            setRevocationReason('');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowRevocation(consentType.id)}
                    >
                      Revogar Consentimento
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleGrantConsent(consentType.id)}
                  style={{ backgroundColor: consentType.color, color: 'white' }}
                >
                  Conceder Consentimento
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Data Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Solicitar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Você pode solicitar uma cópia de todos os dados coletados sobre seu filho.
          </p>
          <Button variant="outline">
            Solicitar Relatório Completo de Dados
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}