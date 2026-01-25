import React, { useState, useEffect, useCallback } from "react";
import { ExternalResource } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video, Book, Lightbulb, Star } from "lucide-react";

const sourceIcons = {
  youtube: Video,
  scratch: Lightbulb,
  khan_academy: Book,
  code_org: Lightbulb,
  thingiverse: Lightbulb,
  outros: ExternalLink
};

const relevanceLabels = {
  3: { label: "Essencial", color: "var(--success)" },
  2: { label: "Recomendado", color: "var(--info)" },
  1: { label: "Complementar", color: "var(--neutral-medium)" }
};

export default function CuratedResourcesPanel({ subject, explorerLevel }) {
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadResources = useCallback(async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    // Buscar recursos curados para o nível e assunto
    const allResources = await ExternalResource.filter({
      target_level: explorerLevel || userData.explorer_level,
      curator_approved: true
    });

    // Filtrar por assunto se especificado
    let filtered = allResources;
    if (subject) {
      filtered = allResources.filter(r => r.subjects?.includes(subject));
    }

    // Ordenar por relevância
    filtered.sort((a, b) => b.relevance_score - a.relevance_score);

    // Filtrar por VARK se disponível
    if (userData.vark_primary_style && userData.vark_primary_style !== 'multimodal') {
      filtered = filtered.filter(r => 
        !r.vark_alignment || r.vark_alignment.includes(userData.vark_primary_style)
      );
    }

    setResources(filtered.slice(0, 6)); // Top 6 recursos
    setLoading(false);
  }, [subject, explorerLevel]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  if (loading || resources.length === 0) {
    return null;
  }

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <CardTitle className="flex items-center gap-2 font-heading">
          <Star className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
          Recursos Curados para Você
        </CardTitle>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Conteúdos selecionados especialmente para o seu perfil de aprendizado
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const SourceIcon = sourceIcons[resource.source] || ExternalLink;
            const relevanceInfo = relevanceLabels[resource.relevance_score];

            return (
              <div
                key={resource.id}
                className="p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer"
                style={{ 
                  borderColor: 'var(--neutral-medium)',
                  backgroundColor: 'var(--background)'
                }}
                onClick={() => window.open(resource.url, '_blank')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SourceIcon className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
                    <Badge 
                      className="border-0 text-xs"
                      style={{ backgroundColor: relevanceInfo.color, color: 'var(--background)' }}
                    >
                      {relevanceInfo.label}
                    </Badge>
                  </div>
                  <ExternalLink className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                </div>

                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {resource.title}
                </h4>

                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.subjects?.slice(0, 2).map((subj, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                    >
                      {subj}
                    </Badge>
                  ))}
                </div>

                {resource.engagement_metrics?.average_rating && (
                  <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Star className="w-4 h-4 fill-current" style={{ color: 'var(--accent-yellow)' }} />
                    <span>{resource.engagement_metrics.average_rating.toFixed(1)}/5.0</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => window.location.href = '/resources'}
        >
          Ver Todos os Recursos Curados
        </Button>
      </CardContent>
    </Card>
  );
}