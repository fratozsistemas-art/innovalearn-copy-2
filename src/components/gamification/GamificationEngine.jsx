// Motor de Gamificação - Lógica de XP e Badges
// Este é um componente auxiliar para calcular XP e badges

const XP_REWARDS = {
  lesson_completion: 100,
  project_milestone: 250,
  project_completion: 500,
  peer_help: 50,
  creativity_bonus: 150,
  presentation: 200,
  daily_login: 10,
  streak_bonus_multiplier: 1.5,
  perfect_quiz: 75,
  team_collaboration: 100
};

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 500 },
  { level: 3, xp: 1200 },
  { level: 4, xp: 2000 },
  { level: 5, xp: 3000 },
  { level: 6, xp: 4500 },
  { level: 7, xp: 6000 },
  { level: 8, xp: 8000 },
  { level: 9, xp: 10500 },
  { level: 10, xp: 13500 }
];

export class GamificationEngine {
  static calculateLevel(totalXP) {
    let level = 1;
    for (const threshold of LEVEL_THRESHOLDS) {
      if (totalXP >= threshold.xp) {
        level = threshold.level;
      } else {
        break;
      }
    }
    return level;
  }

  static calculateXPForAction(action, metadata = {}) {
    let baseXP = XP_REWARDS[action] || 0;
    let bonusXP = 0;

    // Bônus por streak
    if (metadata.currentStreak && metadata.currentStreak >= 7) {
      bonusXP += Math.floor(baseXP * (XP_REWARDS.streak_bonus_multiplier - 1));
    }

    // Bônus por criatividade
    if (metadata.creativityScore && metadata.creativityScore >= 90) {
      bonusXP += 50;
    }

    // Bônus por velocidade (completar rápido, mas não apressado)
    if (metadata.completionTime && metadata.expectedTime) {
      const efficiency = metadata.expectedTime / metadata.completionTime;
      if (efficiency > 0.8 && efficiency < 1.2) {
        bonusXP += 25; // Tempo ideal
      }
    }

    return {
      baseXP,
      bonusXP,
      totalXP: baseXP + bonusXP,
      breakdown: {
        action: baseXP,
        streak: metadata.currentStreak >= 7 ? Math.floor(baseXP * 0.5) : 0,
        creativity: metadata.creativityScore >= 90 ? 50 : 0,
        efficiency: bonusXP - (metadata.currentStreak >= 7 ? Math.floor(baseXP * 0.5) : 0) - (metadata.creativityScore >= 90 ? 50 : 0)
      }
    };
  }

  static checkBadgeEligibility(student, action, metadata = {}) {
    const newBadges = [];

    // Eco Warrior - Completar projeto de sustentabilidade
    if (action === 'project_completion' && metadata.module === 'curiosity-1') {
      newBadges.push({
        badge_id: 'eco-warrior',
        earned_at: new Date().toISOString(),
        rarity: 'common'
      });
    }

    // Space Explorer - Completar projeto do espaço
    if (action === 'project_completion' && metadata.module === 'curiosity-2') {
      newBadges.push({
        badge_id: 'space-explorer',
        earned_at: new Date().toISOString(),
        rarity: 'rare'
      });
    }

    // AI Artist - Usar IA generativa de imagem 10 vezes
    if (metadata.aiToolUsageCount && metadata.aiToolUsageCount.image_generation >= 10) {
      newBadges.push({
        badge_id: 'ai-artist',
        earned_at: new Date().toISOString(),
        rarity: 'epic'
      });
    }

    // Young Entrepreneur - Apresentar pitch
    if (action === 'presentation' && metadata.module === 'curiosity-4') {
      newBadges.push({
        badge_id: 'young-entrepreneur',
        earned_at: new Date().toISOString(),
        rarity: 'legendary'
      });
    }

    // Streak Champion - 30 dias consecutivos
    if (metadata.currentStreak && metadata.currentStreak >= 30) {
      newBadges.push({
        badge_id: 'streak-champion',
        earned_at: new Date().toISOString(),
        rarity: 'legendary'
      });
    }

    return newBadges;
  }

  static updateStreak(lastActivityDate, currentDate) {
    if (!lastActivityDate) {
      return { streak: 1, isNewStreak: true };
    }

    const lastDate = new Date(lastActivityDate);
    const today = new Date(currentDate);
    
    // Resetar horas para comparar apenas datas
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Mesmo dia, não incrementar streak
      return { streak: null, isNewStreak: false };
    } else if (daysDiff === 1) {
      // Dia consecutivo, incrementar
      return { streak: 'increment', isNewStreak: false };
    } else {
      // Quebrou streak, resetar
      return { streak: 1, isNewStreak: true };
    }
  }
}

export default GamificationEngine;