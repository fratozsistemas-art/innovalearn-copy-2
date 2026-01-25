import { useMemo } from 'react';
import { useCurrentUser } from './useUser';

/**
 * Hook para selecionar conteúdo baseado em perfil VARK
 * 
 * M1: Motor de Adaptação VARK-Aware (MVP Critical)
 */
export function useVARKContent(lesson) {
  const { data: user } = useCurrentUser();

  const selectedContent = useMemo(() => {
    if (!user || !lesson?.vark_resources) {
      // Fallback: conteúdo padrão
      return {
        primary: lesson?.content_url || null,
        secondary: [],
        varkMatch: false
      };
    }

    // Identificar estilo dominante
    const varkProfile = {
      visual: user.vark_visual || 0,
      auditory: user.vark_auditory || 0,
      read_write: user.vark_read_write || 0,
      kinesthetic: user.vark_kinesthetic || 0
    };

    const dominant = Object.keys(varkProfile).reduce((a, b) =>
      varkProfile[a] > varkProfile[b] ? a : b
    );

    // Prioriza recursos do estilo dominante
    const primaryResource = lesson.vark_resources[dominant]?.primary || lesson.content_url;
    const secondaryResources = [];

    // Adiciona secundários de estilos com score >= 60
    Object.entries(varkProfile).forEach(([style, score]) => {
      if (score >= 60 && style !== dominant) {
        const resources = lesson.vark_resources[style]?.secondary || [];
        secondaryResources.push(...resources);
      }
    });

    // Garante cobertura mínima se especificada
    if (lesson.vark_minimum_coverage) {
      Object.entries(lesson.vark_minimum_coverage).forEach(([style, minCount]) => {
        const currentCount = secondaryResources.filter(r =>
          r.vark_style === style
        ).length;

        if (currentCount < minCount) {
          const additionalResources = lesson.vark_resources[style]?.secondary || [];
          const needed = additionalResources.slice(0, minCount - currentCount);
          secondaryResources.push(...needed);
        }
      });
    }

    return {
      primary: primaryResource,
      secondary: secondaryResources,
      varkMatch: !!lesson.vark_resources[dominant],
      dominantStyle: dominant
    };
  }, [lesson, user]);

  return selectedContent;
}

/**
 * Hook para calcular distribuição VARK de recursos
 */
export function useVARKDistribution(resources, userVARK) {
  return useMemo(() => {
    if (!resources || !userVARK) return null;

    const distribution = {
      visual: 0,
      auditory: 0,
      read_write: 0,
      kinesthetic: 0
    };

    resources.forEach(resource => {
      const style = resource.vark_style || resource.primary_vark || resource.vark_alignment?.[0];
      if (distribution[style] !== undefined) {
        distribution[style]++;
      }
    });

    const total = resources.length;
    const percentages = {};
    Object.keys(distribution).forEach(style => {
      percentages[style] = total > 0 ? Math.round((distribution[style] / total) * 100) : 0;
    });

    // Calcular match com perfil do usuário
    const primaryStyle = userVARK.vark_primary_style;
    const primaryPercentage = percentages[primaryStyle] || 0;

    return {
      distribution,
      percentages,
      primaryStyle,
      primaryPercentage,
      isOptimal: primaryPercentage >= 70 // MVP target: 70% no estilo primário
    };
  }, [resources, userVARK]);
}