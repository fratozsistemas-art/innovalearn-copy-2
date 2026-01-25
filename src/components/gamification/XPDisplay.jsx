import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, name: "Explorador Iniciante" },
  { level: 2, xp: 500, name: "Explorador Curioso" },
  { level: 3, xp: 1200, name: "Explorador Aventureiro" },
  { level: 4, xp: 2000, name: "Explorador Expert" },
  { level: 5, xp: 3000, name: "Mestre Explorador" },
  { level: 6, xp: 4500, name: "Lenda do Curiosity" }
];

export default function XPDisplay({ gamificationProfile, showAnimation = false }) {
  if (!gamificationProfile) return null;

  const currentLevel = gamificationProfile.level;
  const currentXP = gamificationProfile.xp_total;
  
  // Encontrar thresholds do nível atual e próximo
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  const xpInCurrentLevel = currentXP - currentThreshold.xp;
  const xpNeededForNext = nextThreshold ? nextThreshold.xp - currentThreshold.xp : 1000;
  const progressPercent = Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);

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
              animate={showAnimation ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, var(--accent-yellow) 0%, var(--accent-orange) 100%)`
              }}
            >
              <Star className="w-8 h-8" style={{ color: 'var(--background)' }} />
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
              <Zap className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
              <span className="text-2xl font-bold font-heading" style={{ color: 'var(--accent-orange)' }}>
                {currentXP.toLocaleString()}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>XP Total</p>
          </div>
        </div>

        {nextThreshold && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>
                Progresso para Nível {currentLevel + 1}
              </span>
              <span className="font-semibold" style={{ color: 'var(--primary-teal)' }}>
                {xpInCurrentLevel} / {xpNeededForNext} XP
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        )}

        {gamificationProfile.streak_days > 0 && (
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {gamificationProfile.streak_days} dias consecutivos!
              </span>
              <Badge className="ml-auto border-0" style={{ backgroundColor: 'var(--success)', color: 'var(--background)' }}>
                Em chamas! 🔥
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}