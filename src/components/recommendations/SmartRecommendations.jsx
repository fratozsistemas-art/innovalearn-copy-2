import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Eye, Ear, BookText, Hand, TrendingUp, Globe, AlertTriangle } from "lucide-react";

const varkIcons = {
  visual: Eye,
  auditory: Ear,
  read_write: BookText,
  kinesthetic: Hand
};

const varkColors = {
  visual: 'var(--info)',
  auditory: 'var(--success)',
  read_write: 'var(--warning)',
  kinesthetic: 'var(--accent-orange)'
};

const getVARKStyleName = (style) => {
  const names = {
    visual: 'Visual',
    auditory: 'Auditivo',
    read_write: 'Leitura/Escrita',
    kinesthetic: 'Cinestésico',
    multimodal: 'Multimodal'
  };
  return names[style] || style;
};

/**
 * REGRAS OBRIGATÓRIAS DE IDIOMA POR NÍVEL
 */
const LANGUAGE_REQUIREMENTS = {
  curiosity: {
    allowed_languages: ['pt-BR'],
    strict: true,
    message: '🇧🇷 APENAS conteúdo em Português Brasileiro'
  },
  discovery: {
    allowed_languages: ['pt-BR', 'en'],
    preferred: 'pt-BR',
    strict: false,
    message: '🇧🇷 Preferencialmente PT-BR, inglês legendado OK'
  },
  pioneer: {
    allowed_languages: ['pt-BR', 'en', 'es'],
    preferred: 'pt-BR',
    strict: false,
    message: '🌎 Multilíngue permitido'
  },
  challenger: {
    allowed_languages: ['pt-BR', 'en', 'es', 'fr', 'outros'],
    preferred: 'en',
    strict: false,
    message: '🌍 Todos os idiomas permitidos'
  }
};

export default function SmartRecommendations({ userId, limit = 5 }) {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languageWarning, setLanguageWarning] = useState(null);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    const userData = await base44.auth.me();
    setUser(userData);

    const explorerLevel = userData.explorer_level || 'curiosity';
    const languageReq = LANGUAGE_REQUIREMENTS[explorerLevel];

    // FILTRO CRÍTICO: apenas recursos aprovados E no idioma correto
    let resources = await base44.entities.ExternalResource.filter({ 
      curator_approved: true 
    });

    // VALIDAÇÃO RIGOROSA DE IDIOMA
    if (languageReq.strict) {
      // Para Curiosity: APENAS PT-BR
      resources = resources.filter(r => 
        r.language === 'pt-BR' && languageReq.allowed_languages.includes(r.language)
      );
      
      if (resources.length < 5) {
        setLanguageWarning({
          type: 'critical',
          message: 'Poucos recursos em PT-BR disponíveis para Curiosity. Curadoria adicional necessária.'
        });
      }
    } else {
      // Para outros níveis: filtrar por idiomas permitidos
      resources = resources.filter(r => 
        languageReq.allowed_languages.includes(r.language)
      );
    }

    // Verificar se há recursos para o target_level do usuário
    resources = resources.filter(r => 
      r.target_level === explorerLevel || !r.target_level
    );

    const scored = [];

    resources.forEach(resource => {
      let score = 0;
      const reasonsList = [];

      // BONUS MASSIVO: PT-BR para níveis que preferem
      if (resource.language === 'pt-BR') {
        if (explorerLevel === 'curiosity') {
          score += 100; // Obrigatório, bonus máximo
          reasonsList.push('🇧🇷 Conteúdo em Português Brasileiro (obrigatório)');
        } else if (languageReq.preferred === 'pt-BR') {
          score += 50;
          reasonsList.push('🇧🇷 Conteúdo em Português (preferencial)');
        }
      }

      // Score por nível do explorador
      if (resource.target_level === explorerLevel) {
        score += 50;
        reasonsList.push(`Perfeito para seu nível ${explorerLevel}`);
      }

      // Score por estilo VARK
      if (userData.vark_primary_style && resource.vark_alignment && resource.vark_alignment.includes(userData.vark_primary_style)) {
        score += 30;
        reasonsList.push(`Alinhado com seu estilo ${getVARKStyleName(userData.vark_primary_style)}`);
      }

      // Score por relevância do recurso
      const relevanceScoreBonus = (resource.relevance_score || 0) * 10;
      score += relevanceScoreBonus;
      if (resource.relevance_score && resource.relevance_score >= 3) {
        reasonsList.push(`Alta relevância (${resource.relevance_score} estrelas)`);
      }

      // Bonus por fonte confiável
      if (['youtube', 'khan_academy', 'code_org'].includes(resource.source)) {
        score += 10;
        reasonsList.push(`Fonte confiável: ${resource.source.replace('_', ' ')}`);
      }

      // PENALIDADE: idioma não preferencial
      if (resource.language !== languageReq.preferred && languageReq.preferred) {
        score -= 20;
        reasonsList.push(`⚠️ Idioma: ${resource.language}`);
      }

      if (score > 30) {
        scored.push({
          ...resource,
          score,
          reason: reasonsList.length > 0 ? reasonsList.join(' • ') : 'Recomendado para você',
          type: 'external_resource'
        });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, limit));
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  if (loading) {
    return <div>Carregando recomendações...</div>;
  }

  const VARKIcon = varkIcons[user?.vark_primary_style] || Sparkles;
  const varkColor = varkColors[user?.vark_primary_style] || 'var(--primary-teal)';
  const explorerLevel = user?.explorer_level || 'curiosity';
  const languageReq = LANGUAGE_REQUIREMENTS[explorerLevel];

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <CardTitle className="flex items-center gap-2 font-heading">
          <Sparkles className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
          Recomendações Personalizadas
        </CardTitle>
        {user?.vark_primary_style && (
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              className="border-0"
              style={{ backgroundColor: varkColor, color: 'var(--background)' }}
            >
              <VARKIcon className="w-3 h-3 mr-1" />
              Perfil {getVARKStyleName(user.vark_primary_style)}
            </Badge>
            <Badge 
              variant="outline"
              style={{ borderColor: languageReq.strict ? 'var(--error)' : 'var(--info)' }}
            >
              <Globe className="w-3 h-3 mr-1" />
              {languageReq.message}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        
        {/* Language Warning for Curiosity */}
        {languageWarning && (
          <div className="mb-4 p-4 rounded-lg border-2" style={{ 
            backgroundColor: 'var(--error)' + '10', 
            borderColor: 'var(--error)' 
          }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: 'var(--error)' }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--error)' }}>
                  Atenção: Conteúdo Limitado
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {languageWarning.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec, idx) => {
              const isLanguageOptimal = rec.language === languageReq.preferred || 
                                       (languageReq.strict && rec.language === 'pt-BR');
              
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer group"
                  style={{ 
                    borderColor: isLanguageOptimal ? 'var(--success)' : 'var(--neutral-medium)',
                    backgroundColor: 'var(--background)'
                  }}
                  onClick={() => window.open(rec.url, '_blank')}
                  role="article"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(rec.url, '_blank');
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold flex-1 group-hover:text-teal-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {rec.title}
                    </h4>
                    <Badge 
                      className="border-0 ml-2"
                      style={{ backgroundColor: varkColor, color: 'var(--background)' }}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {rec.score}% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: isLanguageOptimal ? 'var(--success)' : 'var(--warning)',
                        color: isLanguageOptimal ? 'var(--success)' : 'var(--warning)'
                      }}
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {rec.language === 'pt-BR' ? '🇧🇷 PT-BR' : 
                       rec.language === 'en' ? '🇺🇸 EN' : 
                       rec.language}
                    </Badge>
                    <Badge variant="outline" style={{ borderColor: varkColor, color: varkColor }}>
                      {rec.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {rec.source.replace('_', ' ')}
                    </Badge>
                    {rec.relevance_score && (
                      <Badge variant="outline">
                        {'⭐'.repeat(rec.relevance_score)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    • {rec.reason}
                  </span>
                  <div className="mt-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: varkColor }}>
                    Clique para abrir →
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-semibold mb-2">
              {explorerLevel === 'curiosity' 
                ? 'Ainda estamos curando conteúdo em PT-BR para você!'
                : 'Complete seu perfil VARK para receber recomendações personalizadas!'
              }
            </p>
            {explorerLevel === 'curiosity' && (
              <p className="text-xs mt-2">
                🇧🇷 Buscando apenas conteúdo em Português Brasileiro de alta qualidade
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}