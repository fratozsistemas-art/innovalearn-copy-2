import { useMemo } from 'react';

/**
 * Função utilitária de normalização de recursos
 * 
 * Aceita recursos de múltiplas fontes e retorna uma lista normalizada.
 * Útil para componentes que recebem recursos de diferentes estruturas de dados.
 * 
 * Ordem de prioridade:
 * 1. frontmatter.resources (ex: markdown/MDX)
 * 2. lesson.plan.resources (lição com plano de aula)
 * 3. lesson.resources (lição direta)
 * 4. propsResources (passado via props)
 * 
 * @param {Object} options
 * @param {Object} options.lesson - Objeto da lição
 * @param {Array} options.propsResources - Recursos passados como prop
 * @param {Object} options.frontmatter - Frontmatter de markdown/MDX
 * @returns {Array} Lista normalizada de recursos
 */
export function normalizeResources({ lesson, propsResources, frontmatter }) {
  const resources = 
    frontmatter?.resources ||
    lesson?.plan?.resources ||
    lesson?.resources ||
    propsResources ||
    [];

  // Filtrar recursos vazios ou inválidos
  const validResources = Array.isArray(resources) 
    ? resources.filter(Boolean)
    : [];

  // Normalizar estrutura de cada recurso
  return validResources.map(resource => {
    // Se for string, converte para objeto
    if (typeof resource === 'string') {
      return {
        type: 'link',
        url: resource,
        title: resource,
        label: resource
      };
    }

    // Se já é objeto, garante campos básicos
    return {
      type: resource.type || 'link',
      url: resource.url || '',
      title: resource.title || resource.label || resource.url || 'Recurso',
      label: resource.label || resource.title || resource.url || 'Recurso',
      description: resource.description || '',
      vark_style: resource.vark_style || null,
      thumbnail: resource.thumbnail || resource.thumbnail_url || null,
      ...resource // Preserva campos adicionais
    };
  });
}

/**
 * React Hook para normalização de recursos (com memoização)
 * 
 * @param {Object} options
 * @param {Object} options.lesson - Objeto da lição
 * @param {Array} options.propsResources - Recursos passados como prop
 * @param {Object} options.frontmatter - Frontmatter de markdown/MDX
 * @returns {Array} Lista normalizada de recursos
 */
export function useNormalizedResources({ lesson, propsResources, frontmatter }) {
  return useMemo(() => {
    return normalizeResources({ lesson, propsResources, frontmatter });
  }, [lesson, propsResources, frontmatter]);
}

/**
 * Helper para agrupar recursos por tipo
 */
export function groupResourcesByType(resources) {
  const normalized = Array.isArray(resources) 
    ? resources 
    : normalizeResources({ propsResources: resources });

  return normalized.reduce((groups, resource) => {
    const type = resource.type || 'other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(resource);
    return groups;
  }, {});
}

/**
 * Helper para agrupar recursos por estilo VARK
 */
export function groupResourcesByVARK(resources) {
  const normalized = Array.isArray(resources) 
    ? resources 
    : normalizeResources({ propsResources: resources });

  return normalized.reduce((groups, resource) => {
    const vark = resource.vark_style || 'multimodal';
    if (!groups[vark]) {
      groups[vark] = [];
    }
    groups[vark].push(resource);
    return groups;
  }, {});
}

/**
 * Helper para filtrar recursos por tipo
 */
export function filterResourcesByType(resources, type) {
  const normalized = Array.isArray(resources) 
    ? resources 
    : normalizeResources({ propsResources: resources });

  return normalized.filter(r => r.type === type);
}

/**
 * Helper para obter apenas vídeos
 */
export function getVideoResources(resources) {
  return filterResourcesByType(resources, 'video');
}

/**
 * Helper para obter apenas PDFs
 */
export function getPDFResources(resources) {
  return filterResourcesByType(resources, 'pdf');
}

/**
 * Helper para obter apenas links externos
 */
export function getLinkResources(resources) {
  return filterResourcesByType(resources, 'link');
}