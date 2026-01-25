import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Coins, Trophy, Award, TrendingUp, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LEVEL_THRESHOLDS = [
  { level: 1, coins: 0, name: "Explorador Iniciante" },
  { level: 2, coins: 1000, name: "Explorador Curioso" },
  { level: 3, coins: 2500, name: "Explorador Aventureiro" },
  { level: 4, coins: 5000, name: "Explorador Expert" },
  { level: 5, coins: 10000, name: "Mestre Explorador" },
  { level: 6, coins: 20000, name: "Lenda Innova" }
];

const AVAILABLE_BADGES = {
  'eco-warrior': { name: 'Eco Warrior', icon: '🌱', color: '#10b981' },
  'space-explorer': { name: 'Space Explorer', icon: '🚀', color: '#3b82f6' },
  'ai-artist': { name: 'AI Artist', icon: '🎨', color: '#f97316' },
  'young-entrepreneur': { name: 'Young Entrepreneur', icon: '💡', color: '#eab308' },
  'team-player': { name: 'Team Player', icon: '🤝', color: '#14b8a6' },
  'code-master': { name: 'Code Master', icon: '💻', color: '#1e3a8a' },
  'streak-champion': { name: 'Streak Champion', icon: '🔥', color: '#ef4444' },
  'helper-hero': { name: 'Helper Hero', icon: '🦸', color: '#8b5cf6' }
};

export default function GamificationMonitor({ studentEmail }) {
  const [loading, setLoading] = useState(true);
  const [gamificationData, setGamificationData] = useState(null);

  useEffect(() => {
    loadGamificationData();
  }, [studentEmail]);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      const profiles = await base44.entities.GamificationProfile.filter({ 
        student_email: studentEmail 
      });

      if (profiles.length > 0) {
        setGamificationData(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading gamification:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: 'var(--primary-teal)' }}
          />
          <p>Carregando conquistas...</p>
        </CardContent>
      </Card>
    );
  }

  if (!gamificationData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Gamificação em Breve</h3>
          <p className="text-gray-600">
            O perfil de gamificação será criado assim que seu filho começar a participar das atividades.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentLevel = gamificationData.level || 1;
  const currentCoins = gamificationData.innova_coins || 0;
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  const coinsInCurrentLevel = nextThreshold ? currentCoins - currentThreshold.coins : 0;
  const coinsNeededForNext = nextThreshold ? nextThreshold.coins - currentThreshold.coins : 10000;
  const progressPercent = nextThreshold ? Math.min((coinsInCurrentLevel / coinsNeededForNext) * 100, 100) : 100;

  const earnedBadges = gamificationData.badges || [];
  const recentCoins = gamificationData.coin_history?.slice(-5).reverse() || [];

  return (
    <div className="space-y-6">
      
      {/* Innova Coins & Level */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Nível {currentLevel}</h3>
                  <p className="text-sm text-gray-600">{currentThreshold.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-orange-500">
                    {currentCoins.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Innova Coins</p>
              </div>
            </div>

            {nextThreshold && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Progresso para Nível {currentLevel + 1}
                  </span>
                  <span className="font-semibold text-teal-600">
                    {coinsInCurrentLevel} / {coinsNeededForNext} coins
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>
            )}

            {gamificationData.streak_days > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-orange-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900">
                    {gamificationData.streak_days} dias consecutivos de estudo!
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent-yellow)' }} />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {gamificationData.achievements?.lessons_completed || 0}
                </div>
                <div className="text-xs text-gray-600">Lições Completas</div>
              </div>

              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {gamificationData.achievements?.projects_completed || 0}
                </div>
                <div className="text-xs text-gray-600">Projetos Finalizados</div>
              </div>

              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {gamificationData.achievements?.perfect_quizzes || 0}
                </div>
                <div className="text-xs text-gray-600">Quizzes Perfeitos</div>
              </div>

              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="text-3xl font-bold text-teal-600 mb-1">
                  {gamificationData.achievements?.help_given || 0}
                </div>
                <div className="text-xs text-gray-600">Ajudou Colegas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge Collection */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Coleção de Badges
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {earnedBadges.length} de {Object.keys(AVAILABLE_BADGES).length} conquistados
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(AVAILABLE_BADGES).map(([badgeId, badge]) => {
              const isEarned = earnedBadges.some(b => b.badge_id === badgeId);
              
              return (
                <div
                  key={badgeId}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isEarned ? 'shadow-md' : 'opacity-40'
                  }`}
                  style={{
                    backgroundColor: isEarned ? `${badge.color}15` : '#f3f4f6',
                    border: `2px solid ${isEarned ? badge.color : '#d1d5db'}`
                  }}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm">{badge.name}</h4>
                  {isEarned && (
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(earnedBadges.find(b => b.badge_id === badgeId)?.earned_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Coin Earnings */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
            Innova Coins Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recentCoins.length > 0 ? (
            <div className="space-y-3">
              {recentCoins.map((coin, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {coin.description || coin.action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-600">
                      {coin.timestamp ? new Date(coin.timestamp).toLocaleDateString('pt-BR') : 'Recente'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-orange-500">+{coin.coins || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Coins className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}