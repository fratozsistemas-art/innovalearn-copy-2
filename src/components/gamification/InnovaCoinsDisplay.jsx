import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Flame } from "lucide-react";
import { motion } from "framer-motion";

const LEVEL_THRESHOLDS = [
  { level: 1, coins: 0, name: "Explorador Iniciante" },
  { level: 2, coins: 1000, name: "Explorador Curioso" },
  { level: 3, coins: 2500, name: "Explorador Aventureiro" },
  { level: 4, coins: 5000, name: "Explorador Expert" },
  { level: 5, coins: 10000, name: "Mestre Explorador" },
  { level: 6, coins: 20000, name: "Lenda Innova" }
];

export default function InnovaCoinsDisplay({ gamificationProfile, showAnimation = false }) {
  if (!gamificationProfile) return null;

  const currentLevel = gamificationProfile.level;
  const currentCoins = gamificationProfile.innova_coins;
  
  // Encontrar thresholds do nível atual e próximo
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  const coinsInCurrentLevel = currentCoins - currentThreshold.coins;
  const coinsNeededForNext = nextThreshold ? nextThreshold.coins - currentThreshold.coins : 10000;
  const progressPercent = Math.min((coinsInCurrentLevel / coinsNeededForNext) * 100, 100);

  return (
    <Card className="card-innova border-none shadow-lg overflow-hidden">
      <div 
        className="h-2"
        style={{ 
          background: `linear-gradient(90deg, var(--accent-yellow) 0%, var(--accent-orange) 100%)`
        }}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={showAnimation ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, var(--accent-yellow) 0%, var(--accent-orange) 100%)`
              }}
            >
              <Coins className="w-8 h-8" style={{ color: 'var(--background)' }} />
            </motion.div>
            <div>
              <h3 className="text-2xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                Nível {currentLevel}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {currentThreshold.name}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
              <span className="text-2xl font-bold font-heading" style={{ color: 'var(--accent-orange)' }}>
                {currentCoins.toLocaleString()}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Innova Coins</p>
          </div>
        </div>

        {nextThreshold && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>
                Progresso para Nível {currentLevel + 1}
              </span>
              <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                {coinsInCurrentLevel} / {coinsNeededForNext} coins
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        )}

        {gamificationProfile.streak_days > 0 && (
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {gamificationProfile.streak_days} dias consecutivos!
              </span>
              <Badge className="ml-auto border-0" style={{ backgroundColor: 'var(--accent-orange)', color: 'var(--background)' }}>
                Em chamas! 🔥
              </Badge>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Total Ganho</p>
            <p className="text-lg font-bold" style={{ color: 'var(--success)' }}>
              {(gamificationProfile.total_coins_earned || currentCoins).toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Total Gasto</p>
            <p className="text-lg font-bold" style={{ color: 'var(--error)' }}>
              {(gamificationProfile.total_coins_spent || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}