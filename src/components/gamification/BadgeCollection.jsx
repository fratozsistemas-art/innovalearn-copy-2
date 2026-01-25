import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AVAILABLE_BADGES = {
  'eco-warrior': {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Completou projeto de sustentabilidade',
    icon: '🌱',
    rarity: 'common',
    color: 'var(--success)'
  },
  'space-explorer': {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'Construiu estação espacial virtual',
    icon: '🚀',
    rarity: 'rare',
    color: 'var(--info)'
  },
  'ai-artist': {
    id: 'ai-artist',
    name: 'AI Artist',
    description: 'Criou arte com inteligência artificial',
    icon: '🎨',
    rarity: 'epic',
    color: 'var(--accent-orange)'
  },
  'young-entrepreneur': {
    id: 'young-entrepreneur',
    name: 'Young Entrepreneur',
    description: 'Apresentou pitch de startup',
    icon: '💡',
    rarity: 'legendary',
    color: 'var(--accent-yellow)'
  },
  'team-player': {
    id: 'team-player',
    name: 'Team Player',
    description: 'Colaborou em 5 projetos em equipe',
    icon: '🤝',
    rarity: 'rare',
    color: 'var(--primary-teal)'
  },
  'code-master': {
    id: 'code-master',
    name: 'Code Master',
    description: 'Completou 10 atividades de programação',
    icon: '💻',
    rarity: 'epic',
    color: 'var(--primary-navy)'
  },
  'streak-champion': {
    id: 'streak-champion',
    name: 'Streak Champion',
    description: '30 dias consecutivos de atividade',
    icon: '🔥',
    rarity: 'legendary',
    color: 'var(--error)'
  },
  'helper-hero': {
    id: 'helper-hero',
    name: 'Helper Hero',
    description: 'Ajudou 10 colegas em atividades',
    icon: '🦸',
    rarity: 'rare',
    color: 'var(--info)'
  }
};

const rarityColors = {
  common: 'var(--neutral-medium)',
  rare: 'var(--info)',
  epic: 'var(--accent-orange)',
  legendary: 'var(--accent-yellow)'
};

export default function BadgeCollection({ gamificationProfile }) {
  if (!gamificationProfile) return null;

  const earnedBadges = gamificationProfile.badges || [];
  const earnedBadgeIds = earnedBadges.map(b => b.badge_id);

  return (
    <Card className="card-innova border-none shadow-lg">
      <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
        <CardTitle className="flex items-center gap-2 font-heading">
          <Award className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
          Coleção de Badges
        </CardTitle>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {earnedBadges.length} de {Object.keys(AVAILABLE_BADGES).length} conquistados
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(AVAILABLE_BADGES).map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            const earnedInfo = earnedBadges.find(b => b.badge_id === badge.id);

            return (
              <motion.div
                key={badge.id}
                whileHover={isEarned ? { scale: 1.05 } : {}}
                className="relative"
              >
                <div
                  className={`p-4 rounded-xl text-center transition-all ${
                    isEarned ? 'shadow-md cursor-pointer' : 'opacity-40'
                  }`}
                  style={{
                    backgroundColor: isEarned ? `${badge.color}10` : 'var(--neutral-light)',
                    border: `2px solid ${isEarned ? badge.color : 'var(--neutral-medium)'}`
                  }}
                >
                  {!isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                      <Lock className="w-6 h-6" style={{ color: 'var(--neutral-dark)' }} />
                    </div>
                  )}
                  
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {badge.name}
                  </h4>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {badge.description}
                  </p>
                  
                  <Badge 
                    className="border-0 text-xs"
                    style={{ 
                      backgroundColor: rarityColors[badge.rarity],
                      color: 'var(--background)'
                    }}
                  >
                    {badge.rarity}
                  </Badge>

                  {isEarned && earnedInfo && (
                    <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {format(new Date(earnedInfo.earned_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}