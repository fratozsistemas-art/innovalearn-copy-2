
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Ear, BookText, Hand, Sparkles } from 'lucide-react';
import ResourceViewer from '../media/ResourceViewer'; // New import for ResourceViewer

/**
 * VARKEnforcer - Força adaptação de conteúdo ao estilo VARK
 * 
 * Gap Resolvido: VARK → Delivery
 * 
 * Funcionalidades:
 * - Filtra recursos para 70% estilo primário + 30% outros
 * - Avisa quando aluno tenta acessar conteúdo não ideal
 * - Rastreia eficácia por estilo
 */

const VARK_CONFIG = {
  visual: {
    name: 'Visual',
    icon: Eye,
    color: '#3B82F6',
    types: ['video', 'infografico', 'diagrama', 'imagem', 'mapa_mental']
  },
  auditory: {
    name: 'Auditivo',
    icon: Ear,
    color: '#10B981',
    types: ['audio', 'podcast', 'discussao', 'palestra', 'musica']
  },
  read_write: {
    name: 'Leitura/Escrita',
    icon: BookText,
    color: '#F59E0B',
    types: ['texto', 'artigo', 'resumo', 'lista', 'ebook']
  },
  kinesthetic: {
    name: 'Cinestésico',
    icon: Hand,
    color: '#EF4444',
    types: ['lab', 'simulacao', 'pratica', 'experimento', 'construcao']
  }
};

/**
 * Calcula distribuição ideal de recursos baseado em VARK
 */
function calculateIdealDistribution(primaryStyle, resources) {
  const total = resources.length;
  const primaryCount = Math.ceil(total * 0.7); // 70% primário
  const othersCount = Math.floor(total * 0.3 / 3); // 10% cada outro estilo

  return {
    [primaryStyle]: primaryCount,
    ...Object.keys(VARK_CONFIG)
      .filter(style => style !== primaryStyle)
      .reduce((acc, style) => ({ ...acc, [style]: othersCount }), {})
  };
}

/**
 * Filtra e ordena recursos baseado em VARK
 */
function enforceVARKDistribution(resources, primaryStyle, idealDistribution) {
  const categorized = {
    visual: [],
    auditory: [],
    read_write: [],
    kinesthetic: [],
    multimodal: []
  };

  // Categorizar recursos
  resources.forEach(resource => {
    const varkStyle = resource.vark_alignment?.[0] || resource.primary_vark || resource.vark_style || 'multimodal';
    if (categorized[varkStyle]) {
      categorized[varkStyle].push(resource);
    } else {
      categorized.multimodal.push(resource);
    }
  });

  // Construir lista filtrada
  const filtered = [];

  // Adicionar recursos do estilo primário (70%)
  const primaryResources = categorized[primaryStyle].slice(0, idealDistribution[primaryStyle]);
  filtered.push(...primaryResources);

  // Adicionar recursos dos outros estilos (30% dividido)
  Object.keys(VARK_CONFIG)
    .filter(style => style !== primaryStyle)
    .forEach(style => {
      const count = idealDistribution[style] || 0;
      filtered.push(...categorized[style].slice(0, count));
    });

  // Adicionar multimodais se necessário para completar
  if (filtered.length < resources.length * 0.7) {
    const remaining = Math.ceil(resources.length * 0.7) - filtered.length;
    filtered.push(...categorized.multimodal.slice(0, remaining));
  }

  return {
    filtered,
    distribution: {
      visual: filtered.filter(r => {
        const style = r.vark_alignment?.[0] || r.primary_vark || r.vark_style;
        return style === 'visual';
      }).length,
      auditory: filtered.filter(r => {
        const style = r.vark_alignment?.[0] || r.primary_vark || r.vark_style;
        return style === 'auditory';
      }).length,
      read_write: filtered.filter(r => {
        const style = r.vark_alignment?.[0] || r.primary_vark || r.vark_style;
        return style === 'read_write';
      }).length,
      kinesthetic: filtered.filter(r => {
        const style = r.vark_alignment?.[0] || r.primary_vark || r.vark_style;
        return style === 'kinesthetic';
      }).length
    }
  };
}

/**
 * Componente principal
 */
export default function VARKEnforcer({ 
  resources, 
  userVARK, 
  lessonId,
  onResourceAccess
}) {
  const primaryStyle = userVARK?.vark_primary_style || 'multimodal';
  const [selectedResource, setSelectedResource] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentAccessData, setCurrentAccessData] = useState(null);
  
  const { filtered, distribution, warning } = useMemo(() => {
    if (!resources || resources.length === 0) {
      return { filtered: [], distribution: {}, warning: null };
    }

    const idealDist = calculateIdealDistribution(primaryStyle, resources);
    const result = enforceVARKDistribution(resources, primaryStyle, idealDist);

    // Verificar se há recursos suficientes no estilo primário
    const primaryPercentage = (result.distribution[primaryStyle] / result.filtered.length) * 100;
    
    let warningMessage = null;
    if (primaryPercentage < 50) {
      warningMessage = `Atenção: Esta lição tem poucos recursos no seu estilo preferido (${VARK_CONFIG[primaryStyle].name}). Recomendamos avisar o coordenador pedagógico.`;
    }

    return {
      filtered: result.filtered,
      distribution: result.distribution,
      warning: warningMessage
    };
  }, [resources, primaryStyle]);

  const VARKIcon = VARK_CONFIG[primaryStyle]?.icon || Sparkles;
  const varkColor = VARK_CONFIG[primaryStyle]?.color || '#6B7280';

  // Rastrear acesso a recursos
  const handleResourceClick = (resource) => {
    const resourceStyle = resource.vark_alignment?.[0] || resource.primary_vark || resource.vark_style || 'multimodal';
    const isOptimal = resourceStyle === primaryStyle;

    // Preparar dados de acesso
    const accessData = {
      student_email: userVARK?.email,
      lesson_id: lessonId,
      resource_id: resource.id || resource.url || `resource-${Date.now()}`,
      user_vark_style: primaryStyle,
      resource_vark_style: resourceStyle,
      is_optimal_match: isOptimal,
      time_spent_seconds: 0,
      completed: false
    };

    // Validar campos obrigatórios para o logging.
    // userVARK.email and lessonId are critical for actual logging
    if (onResourceAccess && accessData.student_email && accessData.lesson_id && accessData.resource_id) {
        setCurrentAccessData(accessData);
        // Abrir visualizador DENTRO da plataforma
        setSelectedResource(resource);
        setViewerOpen(true);
    } else {
        console.warn('⚠️ Missing required fields for VARK logging. Opening resource without full tracking.', accessData);
        // Still open the viewer for user experience even if logging prerequisites are not met
        setSelectedResource(resource);
        setViewerOpen(true);
    }
  };

  const handleAccessComplete = (completionData) => {
    if (onResourceAccess && currentAccessData) {
      onResourceAccess({
        ...currentAccessData,
        ...completionData
      });
    }
    setCurrentAccessData(null); // Clear access data after completion
  };

  if (!userVARK || primaryStyle === 'multimodal') {
    // Sem VARK definido - mostrar todos os recursos
    return (
      <div>
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <Sparkles className="w-4 h-4" />
          <AlertDescription>
            Complete seu perfil VARK para receber recursos personalizados ao seu estilo de aprendizado.
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          {resources && resources.length > 0 ? (
            resources.map((resource, index) => (
              <div
                key={resource.id || index}
                className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
                style={{ borderColor: '#E5E7EB', backgroundColor: 'white' }}
                onClick={() => handleResourceClick(resource)}
              >
                <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
                {resource.description && (
                  <p className="text-xs text-gray-600">{resource.description}</p>
                )}
                <p className="text-xs mt-2 text-gray-500">
                    Clique para visualizar dentro da plataforma →
                </p>
              </div>
            ))
          ) : (
            <Alert>
              <AlertDescription>
                Nenhum recurso disponível para esta lição ainda.
              </AlertDescription>
            </Alert>
          )}
        </div>
        {/* Resource Viewer Modal */}
        <ResourceViewer
          resource={selectedResource}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onAccessComplete={handleAccessComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com estilo VARK */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `${varkColor}15` }}>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: varkColor }}
        >
          <VARKIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: varkColor }}>
            Seu Estilo: {VARK_CONFIG[primaryStyle].name}
          </p>
          <p className="text-xs text-gray-600">
            Recursos adaptados para maximizar seu aprendizado
          </p>
        </div>
      </div>

      {/* Warning se recursos insuficientes */}
      {warning && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertDescription className="text-sm">
            {warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Distribuição de recursos */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 rounded-lg">
        {Object.entries(VARK_CONFIG).map(([style, config]) => {
          const count = distribution[style] || 0;
          const Icon = config.icon;
          const isPrimary = style === primaryStyle;

          return (
            <div 
              key={style}
              className="text-center p-2 rounded-lg transition-all"
              style={{ 
                backgroundColor: isPrimary ? `${config.color}20` : 'transparent',
                border: isPrimary ? `2px solid ${config.color}` : '1px solid #E5E7EB'
              }}
            >
              <Icon 
                className="w-4 h-4 mx-auto mb-1" 
                style={{ color: config.color }}
              />
              <p className="text-xs font-semibold">{count}</p>
              <p className="text-[10px] text-gray-600">{config.name}</p>
            </div>
          );
        })}
      </div>

      {/* Recursos filtrados */}
      <div className="space-y-3">
        {filtered.map((resource, index) => {
          const resourceStyle = resource.vark_alignment?.[0] || resource.primary_vark || resource.vark_style || 'multimodal';
          const ResourceIcon = VARK_CONFIG[resourceStyle]?.icon || Sparkles;
          const isOptimal = resourceStyle === primaryStyle;

          return (
            <div
              key={resource.id || index}
              className="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer"
              style={{
                borderColor: isOptimal ? varkColor : '#E5E7EB',
                backgroundColor: isOptimal ? `${varkColor}05` : 'white'
              }}
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: VARK_CONFIG[resourceStyle]?.color + '20' || '#E5E7EB' }}
                >
                  <ResourceIcon 
                    className="w-4 h-4" 
                    style={{ color: VARK_CONFIG[resourceStyle]?.color || '#666' }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                    {isOptimal && (
                      <Badge 
                        className="text-[10px]"
                        style={{ backgroundColor: varkColor, color: 'white' }}
                      >
                        Ideal para você
                      </Badge>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-xs text-gray-600">{resource.description}</p>
                  )}
                  <p className="text-xs mt-2" style={{ color: varkColor }}>
                    Clique para visualizar dentro da plataforma →
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Alert>
          <AlertDescription>
            Nenhum recurso disponível para esta lição ainda.
          </AlertDescription>
        </Alert>
      )}

      {/* Resource Viewer Modal */}
      <ResourceViewer
        resource={selectedResource}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onAccessComplete={handleAccessComplete}
      />
    </div>
  );
}
