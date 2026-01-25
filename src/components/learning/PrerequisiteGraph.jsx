/**
 * PrerequisiteGraph - Grafo de Dependências entre Lições
 * 
 * Define quais lições são pré-requisitos de outras
 * Permite navegação não-linear mas respeitando dependências
 */

/**
 * Grafo de pré-requisitos por módulo
 * 
 * Formato:
 * {
 *   "lesson_id": ["prerequisite1", "prerequisite2"]
 * }
 */
export const PREREQUISITE_GRAPH = {
  // Curiosity Módulo 1 - Sustentabilidade e IA
  "curiosity-1": {
    "curiosity-1-lesson-2": ["curiosity-1-lesson-1"],
    "curiosity-1-lesson-3": ["curiosity-1-lesson-1", "curiosity-1-lesson-2"],
    "curiosity-1-lesson-5": ["curiosity-1-lesson-4"],
    "curiosity-1-lesson-6": ["curiosity-1-lesson-4", "curiosity-1-lesson-5"],
    "curiosity-1-lesson-8": ["curiosity-1-lesson-7"],
    "curiosity-1-lesson-10": ["curiosity-1-lesson-9"],
    "curiosity-1-lesson-12": ["curiosity-1-lesson-11"],
    "curiosity-1-lesson-14": ["curiosity-1-lesson-13"],
    "curiosity-1-lesson-16": ["curiosity-1-lesson-15"]
  },
  
  // Discovery Módulo 1 - ClimatePredict
  "discovery-1": {
    "discovery-1-lesson-2": ["discovery-1-lesson-1"], // Python básico → DataFrames
    "discovery-1-lesson-3": ["discovery-1-lesson-2"], // DataFrames → Visualização
    "discovery-1-lesson-4": ["discovery-1-lesson-1", "discovery-1-lesson-2"], // Precisa Python + Data
    "discovery-1-lesson-5": ["discovery-1-lesson-3", "discovery-1-lesson-4"], // Análise avançada
    "discovery-1-lesson-6": ["discovery-1-lesson-5"], // ML Intro precisa análise
    "discovery-1-lesson-7": ["discovery-1-lesson-6"], // Treinamento precisa ML Intro
    "discovery-1-lesson-8": ["discovery-1-lesson-7"], // Avaliação precisa treino
    "discovery-1-lesson-10": ["discovery-1-lesson-6", "discovery-1-lesson-7"], // Precisa ML básico
    "discovery-1-lesson-12": ["discovery-1-lesson-11"], // Deploy precisa preparação
    "discovery-1-lesson-14": ["discovery-1-lesson-13"], // Stakeholder precisa revisão
    "discovery-1-lesson-16": ["discovery-1-lesson-15"] // Apresentação precisa preparação
  },

  // Pioneer Módulo 1 - CerradoWatch
  "pioneer-1": {
    "pioneer-1-lesson-2": ["pioneer-1-lesson-1"],
    "pioneer-1-lesson-3": ["pioneer-1-lesson-2"],
    "pioneer-1-lesson-4": ["pioneer-1-lesson-3"],
    "pioneer-1-lesson-5": ["pioneer-1-lesson-4"],
    "pioneer-1-lesson-6": ["pioneer-1-lesson-5"], // Transfer Learning precisa CNNs
    "pioneer-1-lesson-7": ["pioneer-1-lesson-6"],
    "pioneer-1-lesson-8": ["pioneer-1-lesson-7"],
    "pioneer-1-lesson-10": ["pioneer-1-lesson-9"],
    "pioneer-1-lesson-12": ["pioneer-1-lesson-11"],
    "pioneer-1-lesson-14": ["pioneer-1-lesson-13"],
    "pioneer-1-lesson-16": ["pioneer-1-lesson-15"]
  },

  // Challenger Módulo 1 - EarthAI
  "challenger-1": {
    "challenger-1-lesson-2": ["challenger-1-lesson-1"],
    "challenger-1-lesson-3": ["challenger-1-lesson-2"],
    "challenger-1-lesson-4": ["challenger-1-lesson-3"],
    "challenger-1-lesson-5": ["challenger-1-lesson-4"],
    "challenger-1-lesson-6": ["challenger-1-lesson-5"],
    "challenger-1-lesson-7": ["challenger-1-lesson-6"],
    "challenger-1-lesson-8": ["challenger-1-lesson-7"],
    "challenger-1-lesson-10": ["challenger-1-lesson-9"],
    "challenger-1-lesson-12": ["challenger-1-lesson-11"],
    "challenger-1-lesson-14": ["challenger-1-lesson-13"],
    "challenger-1-lesson-16": ["challenger-1-lesson-15"]
  }
};

/**
 * Verifica se aluno pode acessar uma lição
 */
export function canAccessLesson(lessonId, completedLessons, moduleId) {
  const moduleGraph = PREREQUISITE_GRAPH[moduleId] || {};
  const prerequisites = moduleGraph[lessonId] || [];
  
  // Se não tem pré-requisitos, pode acessar
  if (prerequisites.length === 0) return true;
  
  // Verificar se todos os pré-requisitos foram completados
  return prerequisites.every(prereq => completedLessons.includes(prereq));
}

/**
 * Retorna todas as lições disponíveis para o aluno
 */
export function getAvailableLessons(allLessons, completedLessons, moduleId) {
  return allLessons.filter(lesson => 
    canAccessLesson(lesson.id, completedLessons, moduleId)
  );
}

/**
 * Retorna lições bloqueadas e seus pré-requisitos faltando
 */
export function getBlockedLessons(allLessons, completedLessons, moduleId) {
  const moduleGraph = PREREQUISITE_GRAPH[moduleId] || {};
  
  return allLessons
    .filter(lesson => !canAccessLesson(lesson.id, completedLessons, moduleId))
    .map(lesson => ({
      lesson,
      missingPrerequisites: (moduleGraph[lesson.id] || [])
        .filter(prereq => !completedLessons.includes(prereq))
    }));
}

/**
 * Retorna o próximo melhor caminho (BFS no grafo)
 */
export function findOptimalPath(startLesson, targetLesson, completedLessons, moduleId) {
  const moduleGraph = PREREQUISITE_GRAPH[moduleId] || {};
  
  // Se já completou, não precisa de caminho
  if (completedLessons.includes(targetLesson)) {
    return [];
  }
  
  // BFS para encontrar caminho mais curto
  const queue = [[startLesson]];
  const visited = new Set([startLesson]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === targetLesson) {
      return path.slice(1); // Remove o start
    }
    
    // Buscar lições que dependem da atual
    for (const [lessonId, prerequisites] of Object.entries(moduleGraph)) {
      if (visited.has(lessonId)) continue;
      
      // Se a lição atual é pré-requisito e todos outros foram completados
      if (prerequisites.includes(current) && 
          prerequisites.every(p => p === current || completedLessons.includes(p))) {
        visited.add(lessonId);
        queue.push([...path, lessonId]);
      }
    }
  }
  
  return null; // Não há caminho
}

/**
 * Calcula progresso considerando dependências
 */
export function calculateGraphProgress(completedLessons, totalLessons, moduleId) {
  const moduleGraph = PREREQUISITE_GRAPH[moduleId] || {};
  
  // Lições sem pré-requisitos (entrada do grafo)
  const entryLessons = totalLessons.filter(lesson => {
    const prereqs = moduleGraph[lesson.id] || [];
    return prereqs.length === 0;
  });
  
  // Score baseado em profundidade no grafo
  let totalDepth = 0;
  let completedDepth = 0;
  
  totalLessons.forEach(lesson => {
    const depth = calculateDepth(lesson.id, moduleGraph);
    totalDepth += depth;
    
    if (completedLessons.includes(lesson.id)) {
      completedDepth += depth;
    }
  });
  
  return totalDepth > 0 ? (completedDepth / totalDepth) * 100 : 0;
}

/**
 * Calcula profundidade de uma lição no grafo
 */
function calculateDepth(lessonId, graph) {
  const prerequisites = graph[lessonId] || [];
  
  if (prerequisites.length === 0) return 1;
  
  const depths = prerequisites.map(prereq => calculateDepth(prereq, graph));
  return 1 + Math.max(...depths);
}

/**
 * Identifica conceitos-chave (lições com muitas dependências)
 */
export function identifyKeyLessons(moduleId) {
  const moduleGraph = PREREQUISITE_GRAPH[moduleId] || {};
  const dependencyCount = {};
  
  // Contar quantas lições dependem de cada uma
  Object.values(moduleGraph).forEach(prerequisites => {
    prerequisites.forEach(prereq => {
      dependencyCount[prereq] = (dependencyCount[prereq] || 0) + 1;
    });
  });
  
  // Retornar lições ordenadas por número de dependências
  return Object.entries(dependencyCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lessonId, count]) => ({ lessonId, dependents: count }));
}