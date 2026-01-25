import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Ear, BookText, Hand, Sparkles, Info } from "lucide-react";
import { useVARKContent } from "@/components/hooks/useVARKContent";
import { useCurrentUser } from "@/components/hooks/useUser";
import YouTubePlayer from "@/components/media/YouTubePlayer";
import ResourceViewer from "@/components/media/ResourceViewer";

const VARK_CONFIG = {
  visual: { name: 'Visual', icon: Eye, color: '#3B82F6' },
  auditory: { name: 'Auditivo', icon: Ear, color: '#10B981' },
  read_write: { name: 'Leitura/Escrita', icon: BookText, color: '#F59E0B' },
  kinesthetic: { name: 'Cinestésico', icon: Hand, color: '#EF4444' }
};

/**
 * AdaptiveContentViewer - M1: Motor de Adaptação VARK-Aware
 * 
 * Exibe conteúdo adaptado automaticamente ao estilo VARK do aluno
 */
export default function AdaptiveContentViewer({ lesson, onResourceAccess }) {
  const { data: user } = useCurrentUser();
  const content = useVARKContent(lesson);
  const [selectedResource, setSelectedResource] = useState(null);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Carregando conteúdo personalizado...</p>
      </div>
    );
  }

  const VARKIcon = content.dominantStyle ? VARK_CONFIG[content.dominantStyle].icon : Sparkles;
  const varkColor = content.dominantStyle ? VARK_CONFIG[content.dominantStyle].color : '#6B7280';

  return (
    <div className="space-y-6">
      {/* Explicação Pedagógica */}
      {content.varkMatch && (
        <Alert className="border-2" style={{ borderColor: varkColor, backgroundColor: `${varkColor}10` }}>
          <VARKIcon className="w-5 h-5" style={{ color: varkColor }} />
          <AlertDescription className="ml-2">
            <strong>Conteúdo Personalizado!</strong> Este material foi selecionado especialmente para você,
            baseado no seu estilo de aprendizagem <strong>{VARK_CONFIG[content.dominantStyle].name}</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Recurso Principal */}
      <Card className="border-2 shadow-lg" style={{ borderColor: varkColor }}>
        <CardHeader style={{ backgroundColor: `${varkColor}10` }}>
          <CardTitle className="flex items-center gap-2">
            <VARKIcon className="w-6 h-6" style={{ color: varkColor }} />
            Conteúdo Principal
            {content.varkMatch && (
              <Badge style={{ backgroundColor: varkColor, color: 'white' }}>
                Recomendado para você
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {content.primary && content.primary.includes('youtube') ? (
            <YouTubePlayer url={content.primary} title={lesson.title} />
          ) : content.primary ? (
            <div className="prose max-w-none">
              <iframe 
                src={content.primary} 
                className="w-full h-96 rounded-lg"
                title="Conteúdo Principal"
              />
            </div>
          ) : (
            <p className="text-gray-600">Conteúdo em desenvolvimento</p>
          )}
        </CardContent>
      </Card>

      {/* Recursos Complementares */}
      {content.secondary && content.secondary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
              Recursos Complementares
              <Badge variant="outline">
                {content.secondary.length} recursos adaptados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.secondary.map((resource, idx) => {
                const resourceStyle = resource.vark_style || 'multimodal';
                const ResourceIcon = VARK_CONFIG[resourceStyle]?.icon || Info;
                const resourceColor = VARK_CONFIG[resourceStyle]?.color || '#6B7280';

                return (
                  <Card 
                    key={idx}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 hover:scale-105"
                    style={{ borderColor: `${resourceColor}40` }}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <ResourceIcon className="w-5 h-5 mt-1" style={{ color: resourceColor }} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{resource.description}</p>
                          <Badge 
                            className="mt-2" 
                            style={{ backgroundColor: `${resourceColor}20`, color: resourceColor }}
                          >
                            {VARK_CONFIG[resourceStyle]?.name || 'Multimodal'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todos os Estilos VARK (Tabs) */}
      {lesson.vark_resources && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Explorar Outros Formatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue={content.dominantStyle || 'visual'}>
              <TabsList className="grid w-full grid-cols-4">
                {Object.keys(VARK_CONFIG).map(style => {
                  const StyleIcon = VARK_CONFIG[style].icon;
                  return (
                    <TabsTrigger key={style} value={style}>
                      <StyleIcon className="w-4 h-4 mr-2" />
                      {VARK_CONFIG[style].name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.keys(VARK_CONFIG).map(style => (
                <TabsContent key={style} value={style} className="mt-4">
                  {lesson.vark_resources[style] ? (
                    <div className="space-y-3">
                      {lesson.vark_resources[style].primary && (
                        <div>
                          <h4 className="font-semibold mb-2">Recurso Principal</h4>
                          {lesson.vark_resources[style].primary.includes('youtube') ? (
                            <YouTubePlayer url={lesson.vark_resources[style].primary} title={`${lesson.title} - ${style}`} />
                          ) : (
                            <a 
                              href={lesson.vark_resources[style].primary}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Acessar recurso →
                            </a>
                          )}
                        </div>
                      )}
                      {lesson.vark_resources[style].secondary && lesson.vark_resources[style].secondary.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Recursos Adicionais</h4>
                          <ul className="space-y-2">
                            {lesson.vark_resources[style].secondary.map((resource, idx) => (
                              <li key={idx}>
                                <a 
                                  href={resource.url || resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-2"
                                >
                                  {resource.title || `Recurso ${idx + 1}`} →
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Recursos {VARK_CONFIG[style].name.toLowerCase()}s em desenvolvimento
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Resource Viewer Dialog */}
      {selectedResource && (
        <ResourceViewer
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          onAccessComplete={(data) => {
            if (onResourceAccess) {
              onResourceAccess({
                ...data,
                resource_id: selectedResource.id,
                resource_vark_style: selectedResource.vark_style
              });
            }
          }}
        />
      )}
    </div>
  );
}