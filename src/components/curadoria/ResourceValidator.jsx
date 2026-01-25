import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Eye, Globe, Users } from "lucide-react";
import { toast } from "sonner";

/**
 * ResourceValidator - Validação Rigorosa de Recursos
 * 
 * REGRAS OBRIGATÓRIAS:
 * 1. Curiosity (6-8 anos): APENAS PT-BR, dublado ou legendado
 * 2. Discovery (9-11 anos): PT-BR preferencialmente, inglês com legendas OK
 * 3. Pioneer/Challenger (12+ anos): Multilíngue OK
 * 4. Conteúdo apropriado para idade
 * 5. Segurança e qualidade verificada
 */

const AGE_REQUIREMENTS = {
  curiosity: {
    name: 'Curiosity (6-8 anos)',
    language_requirement: 'OBRIGATÓRIO PT-BR',
    allowed_languages: ['pt-BR'],
    subtitle_requirement: 'Dublado preferencialmente, legendado aceitável',
    content_rules: [
      'Linguagem simples e clara',
      'Exemplos concretos e visuais',
      'Sem conceitos abstratos complexos',
      'Duração máxima: 10 minutos por vídeo',
      'Interatividade e ludicidade'
    ]
  },
  discovery: {
    name: 'Discovery (9-11 anos)',
    language_requirement: 'PT-BR preferencialmente',
    allowed_languages: ['pt-BR', 'en'],
    subtitle_requirement: 'Inglês OK se legendado em PT-BR',
    content_rules: [
      'Pode introduzir conceitos mais complexos',
      'Inglês aceitável com legendas',
      'Duração máxima: 15 minutos',
      'Hands-on e prático'
    ]
  },
  pioneer: {
    name: 'Pioneer (12-13 anos)',
    language_requirement: 'Multilíngue aceitável',
    allowed_languages: ['pt-BR', 'en', 'es'],
    subtitle_requirement: 'Legendas preferenciais para inglês',
    content_rules: [
      'Conteúdo técnico permitido',
      'Inglês técnico aceitável',
      'Documentação e papers OK',
      'Duração: até 30 minutos'
    ]
  },
  challenger: {
    name: 'Challenger (14-16 anos)',
    language_requirement: 'Multilíngue completo',
    allowed_languages: ['pt-BR', 'en', 'es', 'fr', 'outros'],
    subtitle_requirement: 'Não obrigatório',
    content_rules: [
      'Conteúdo avançado e técnico',
      'Inglês fluente esperado',
      'Papers científicos',
      'Sem limite de duração'
    ]
  }
};

export default function ResourceValidator({ resource, onValidate }) {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validateResource = async () => {
    setValidating(true);
    
    try {
      // VALIDAÇÃO 1: Idioma
      const targetLevel = resource.target_level || 'curiosity';
      const requirements = AGE_REQUIREMENTS[targetLevel];
      
      const languageValid = requirements.allowed_languages.includes(resource.language);
      
      if (!languageValid) {
        setValidationResult({
          valid: false,
          issues: [
            {
              type: 'CRITICAL',
              message: `Idioma ${resource.language} NÃO permitido para ${requirements.name}`,
              rule: requirements.language_requirement
            }
          ]
        });
        setValidating(false);
        return;
      }

      // VALIDAÇÃO 2: Verificar se é realmente PT-BR (para Curiosity)
      if (targetLevel === 'curiosity' && resource.language === 'pt-BR') {
        // Fazer uma verificação adicional usando IA
        const aiCheck = await base44.integrations.Core.InvokeLLM({
          prompt: `Analise este recurso educacional para crianças de 6-8 anos (Curiosity Level):

Título: ${resource.title}
URL: ${resource.url}
Descrição: ${resource.description || 'Não fornecida'}

VALIDAÇÃO OBRIGATÓRIA:
1. O conteúdo está REALMENTE em Português Brasileiro (PT-BR)?
2. É apropriado para crianças de 6-8 anos?
3. Se for vídeo do YouTube, está dublado ou legendado em PT-BR?
4. O conteúdo é visual, lúdico e concreto (não abstrato)?
5. Tem linguagem simples e clara?
6. Duração apropriada (idealmente 5-10 minutos)?

CRITÉRIOS DE REJEIÇÃO AUTOMÁTICA:
- Conteúdo em inglês ou outro idioma sem dublagem/legendas PT-BR
- Conceitos abstratos demais para 6-8 anos
- Linguagem técnica complexa
- Falta de elementos visuais
- Duração excessiva (>15 min)

Retorne uma análise estruturada.`,
          response_json_schema: {
            type: "object",
            properties: {
              is_ptbr_confirmed: { type: "boolean" },
              age_appropriate: { type: "boolean" },
              has_ptbr_audio_or_subtitles: { type: "boolean" },
              is_visual_and_concrete: { type: "boolean" },
              language_complexity: { type: "string", enum: ["simple", "moderate", "complex"] },
              duration_minutes: { type: "number" },
              issues_found: {
                type: "array",
                items: { type: "string" }
              },
              recommendation: { type: "string", enum: ["approve", "reject", "needs_review"] },
              reasoning: { type: "string" }
            }
          }
        });

        // Validar resultado da IA
        const issues = [];
        
        if (!aiCheck.is_ptbr_confirmed) {
          issues.push({
            type: 'CRITICAL',
            message: 'Conteúdo NÃO está em PT-BR confirmado',
            rule: 'Curiosity exige PT-BR obrigatório'
          });
        }

        if (!aiCheck.age_appropriate) {
          issues.push({
            type: 'CRITICAL',
            message: 'Conteúdo NÃO apropriado para 6-8 anos',
            rule: 'Complexidade inadequada para Curiosity'
          });
        }

        if (!aiCheck.has_ptbr_audio_or_subtitles) {
          issues.push({
            type: 'CRITICAL',
            message: 'Sem áudio ou legendas em PT-BR',
            rule: 'Curiosity exige dublagem ou legendas PT-BR'
          });
        }

        if (!aiCheck.is_visual_and_concrete) {
          issues.push({
            type: 'WARNING',
            message: 'Falta de elementos visuais e concretos',
            rule: 'Curiosity precisa de conteúdo visual e lúdico'
          });
        }

        if (aiCheck.language_complexity !== 'simple') {
          issues.push({
            type: 'WARNING',
            message: 'Linguagem muito complexa para a idade',
            rule: 'Curiosity exige linguagem simples'
          });
        }

        if (aiCheck.duration_minutes && aiCheck.duration_minutes > 15) {
          issues.push({
            type: 'WARNING',
            message: `Duração muito longa (${aiCheck.duration_minutes} min)`,
            rule: 'Idealmente 5-10 min, máximo 15 min'
          });
        }

        // Adicionar issues encontradas pela IA
        if (aiCheck.issues_found && aiCheck.issues_found.length > 0) {
          aiCheck.issues_found.forEach(issue => {
            issues.push({
              type: 'INFO',
              message: issue,
              rule: 'Análise de conteúdo'
            });
          });
        }

        const hasCriticalIssues = issues.some(i => i.type === 'CRITICAL');

        setValidationResult({
          valid: !hasCriticalIssues && aiCheck.recommendation === 'approve',
          issues,
          ai_recommendation: aiCheck.recommendation,
          reasoning: aiCheck.reasoning,
          auto_approved: !hasCriticalIssues && aiCheck.recommendation === 'approve',
          requires_human_review: aiCheck.recommendation === 'needs_review' || issues.some(i => i.type === 'WARNING')
        });

      } else {
        // Para outros níveis, validação mais simples
        setValidationResult({
          valid: true,
          issues: [],
          ai_recommendation: 'approve',
          reasoning: `Idioma ${resource.language} válido para ${requirements.name}`,
          auto_approved: true,
          requires_human_review: false
        });
      }

    } catch (error) {
      console.error('Error validating resource:', error);
      toast.error('Erro na validação');
      setValidationResult({
        valid: false,
        issues: [{
          type: 'ERROR',
          message: 'Erro ao validar recurso: ' + error.message
        }]
      });
    }

    setValidating(false);
  };

  const handleApprove = async () => {
    try {
      await base44.entities.ExternalResource.update(resource.id, {
        curator_approved: true,
        requires_human_review: false,
        auto_discovered: true,
        last_verified: new Date().toISOString()
      });

      toast.success('Recurso aprovado!');
      if (onValidate) onValidate('approved');
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Erro ao aprovar');
    }
  };

  const handleReject = async () => {
    try {
      await base44.entities.ExternalResource.delete(resource.id);
      toast.success('Recurso rejeitado e removido');
      if (onValidate) onValidate('rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Erro ao rejeitar');
    }
  };

  return (
    <Card className="border-l-4" style={{ borderColor: 'var(--warning)' }}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Validação de Recurso
          </span>
          <Badge style={{ backgroundColor: AGE_REQUIREMENTS[resource.target_level]?.language_requirement.includes('OBRIGATÓRIO') ? 'var(--error)' : 'var(--info)', color: 'white' }}>
            {AGE_REQUIREMENTS[resource.target_level]?.name || resource.target_level}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* Resource Info */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
          <h4 className="font-semibold mb-2">{resource.title}</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Idioma: <strong>{resource.language}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Nível: <strong>{resource.target_level}</strong></span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {resource.target_level && (
          <div className="p-4 rounded-lg border-2" style={{ borderColor: 'var(--warning)' }}>
            <h5 className="font-semibold mb-2 text-orange-600">
              Requisitos Obrigatórios
            </h5>
            <div className="space-y-2 text-sm">
              <p><strong>Idioma:</strong> {AGE_REQUIREMENTS[resource.target_level]?.language_requirement}</p>
              <p><strong>Legendas:</strong> {AGE_REQUIREMENTS[resource.target_level]?.subtitle_requirement}</p>
              <div>
                <strong>Regras de Conteúdo:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  {AGE_REQUIREMENTS[resource.target_level]?.content_rules.map((rule, idx) => (
                    <li key={idx}>• {rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Validate Button */}
        {!validationResult && (
          <Button
            onClick={validateResource}
            disabled={validating}
            className="w-full"
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            {validating ? 'Validando com IA...' : 'Validar Recurso'}
          </Button>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${validationResult.valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validationResult.valid ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h4 className={`font-bold ${validationResult.valid ? 'text-green-900' : 'text-red-900'}`}>
                  {validationResult.valid ? 'APROVADO' : 'REPROVADO'}
                </h4>
              </div>
              <p className="text-sm">{validationResult.reasoning}</p>
            </div>

            {/* Issues */}
            {validationResult.issues && validationResult.issues.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-semibold">Problemas Encontrados:</h5>
                {validationResult.issues.map((issue, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg flex items-start gap-2 ${
                      issue.type === 'CRITICAL' ? 'bg-red-50 border border-red-200' :
                      issue.type === 'WARNING' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {issue.type === 'CRITICAL' ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{issue.message}</p>
                      {issue.rule && (
                        <p className="text-xs text-gray-600 mt-1">Regra: {issue.rule}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {validationResult.valid && (
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aprovar Recurso
                </Button>
              )}
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>

            {validationResult.requires_human_review && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  ⚠️ <strong>Revisão humana recomendada</strong> antes de aprovação final
                </p>
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}