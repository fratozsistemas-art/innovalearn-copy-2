/**
 * Configurações Centralizadas da Aplicação
 * InnovaLearn Academy
 */

export const APP_CONFIG = {
  // Informações da aplicação
  APP_NAME: 'InnovaLearn Academy',
  APP_VERSION: '1.0.0',
  APP_ENV: import.meta.env.MODE || 'development',

  // Upload de arquivos
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_SIZE_IMAGES: 5 * 1024 * 1024, // 5MB para imagens
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  },

  // Paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MOBILE_PAGE_SIZE: 10
  },

  // API
  API: {
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 segundo
  },

  // Cache (React Query)
  CACHE: {
    STALE_TIME: 5 * 60 * 1000, // 5 minutos
    CACHE_TIME: 10 * 60 * 1000, // 10 minutos
    REFETCH_ON_WINDOW_FOCUS: false,
    RETRY: 1
  },

  // Gamificação
  GAMIFICATION: {
    COINS: {
      LESSON_COMPLETE: 10,
      ASSIGNMENT_COMPLETE: 50,
      PERFECT_QUIZ: 25,
      HOMEWORK: 50,
      FAMILYWORK: 75,
      EXTRAMILE: 150
    },
    LEVEL_UP_THRESHOLD: 1000, // Coins para subir de nível
    STREAK_BONUS_MULTIPLIER: 1.5 // Bônus por sequência
  },

  // Níveis de Explorer
  EXPLORER_LEVELS: {
    CURIOSITY: {
      name: 'Curiosity',
      age: '6+',
      color: '#3B82F6',
      modules: 4
    },
    DISCOVERY: {
      name: 'Discovery',
      age: '9+',
      color: '#10B981',
      modules: 4
    },
    PIONEER: {
      name: 'Pioneer',
      age: '12+',
      color: '#F59E0B',
      modules: 4
    },
    CHALLENGER: {
      name: 'Challenger',
      age: '14+',
      color: '#EF4444',
      modules: 5
    }
  },

  // Tipos de usuário
  USER_TYPES: {
    ADMINISTRADOR: 'administrador',
    GERENTE: 'gerente',
    COORDENADOR_PEDAGOGICO: 'coordenador_pedagogico',
    INSTRUTOR: 'instrutor',
    FINANCEIRO: 'financeiro',
    SECRETARIA: 'secretaria',
    PAI_RESPONSAVEL: 'pai_responsavel',
    ALUNO: 'aluno'
  },

  // Notificações
  NOTIFICATIONS: {
    AUTO_DISMISS_DURATION: 5000, // 5 segundos
    MAX_NOTIFICATIONS_DISPLAY: 5
  },

  // Validações
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    MIN_AGE: 6,
    MAX_AGE: 18
  },

  // Monitoramento
  MONITORING: {
    ENABLE_ERROR_TRACKING: true,
    ENABLE_ANALYTICS: true,
    ENABLE_PERFORMANCE_MONITORING: true,
    SAMPLE_RATE: 0.1 // 10% das sessões
  },

  // Feature Flags
  FEATURES: {
    ENABLE_INNAI: true,
    ENABLE_GAMIFICATION: true,
    ENABLE_TEACHER_CERTIFICATION: true,
    ENABLE_CLASS_MANAGEMENT: true,
    ENABLE_DISCOVERY_PROJECTS: true,
    ENABLE_PIONEER_PROJECTS: true,
    ENABLE_CHALLENGER_PROJECTS: true
  },

  // URLs e Links
  URLS: {
    SUPPORT_EMAIL: 'suporte@innovalearn.com.br',
    WEBSITE: 'https://innovalearn.com.br',
    DOCUMENTATION: '/documentation',
    PRIVACY_POLICY: '/privacy',
    TERMS_OF_SERVICE: '/terms'
  }
};

// Helpers para acessar configurações
export function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], APP_CONFIG);
}

export function isFeatureEnabled(featureName) {
  return APP_CONFIG.FEATURES[`ENABLE_${featureName.toUpperCase()}`] || false;
}

export function getExplorerLevel(levelKey) {
  return APP_CONFIG.EXPLORER_LEVELS[levelKey.toUpperCase()];
}