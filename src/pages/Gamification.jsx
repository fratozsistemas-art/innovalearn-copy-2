
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Coins, TrendingUp, Award, Flame, Target, ShoppingCart, BarChart3 } from "lucide-react";
import RewardShop from "../components/gamification/RewardShop";
import Leaderboard from "../components/gamification/Leaderboard";
import { useMotivationalProfile } from "@/components/hooks/useMotivationalProfile";
import { useCurrentUser } from "@/components/hooks/useUser";

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

export default function GamificationPage() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentCoins, setRecentCoins] = useState([]);

  // Buscar perfil motivacional COM ERROR HANDLING
  const { data: motivationalProfile } = useMotivationalProfile(user?.email);

  useEffect(() => {
    loadData();
  }, [user?.email]); // Depend on user.email to trigger data load when user is available

  const loadData = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const profiles = await base44.entities.GamificationProfile.filter({ student_email: user.email });
      
      if (profiles.length > 0) {
        setGamificationProfile(profiles[0]);
        setRecentCoins(profiles[0].coin_history?.slice(-10).reverse() || []);
      } else {
        // Criar perfil se não existir
        const newProfile = await base44.entities.GamificationProfile.create({
          student_email: user.email,
          innova_coins: 0,
          level: 1,
          badges: [],
          achievements: {
            lessons_completed: 0,
            projects_completed: 0,
            perfect_quizzes: 0,
            help_given: 0,
            presentations_done: 0
          },
          streak_days: 0,
          coin_history: [],
          total_coins_earned: 0,
          total_coins_spent: 0
        });
        setGamificationProfile(newProfile);
      }
    } catch (err) {
      console.error("Error loading gamification data:", err);
      setError(err.message || "Erro ao carregar dados");
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !gamificationProfile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-bold mb-2">Erro ao carregar perfil</h2>
            <p className="text-sm mb-4 text-gray-600">
              {error || "Não foi possível carregar seu perfil de gamificação."}
            </p>
            <Button 
              onClick={loadData} 
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLevel = gamificationProfile.level || 1;
  const currentCoins = gamificationProfile.innova_coins || 0;
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  const coinsInCurrentLevel = nextThreshold ? currentCoins - currentThreshold.coins : 0;
  const coinsNeededForNext = nextThreshold ? nextThreshold.coins - currentThreshold.coins : 10000;
  const progressPercent = nextThreshold ? Math.min((coinsInCurrentLevel / coinsNeededForNext) * 100, 100) : 100;

  const earnedBadges = gamificationProfile.badges || [];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Seu Progresso de Explorador
            </h1>
            <p className="text-gray-600">
              Continue aprendendo para ganhar Innova Coins, subir de nível e conquistar badges!
            </p>
          </div>
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid grid-cols-3 w-full bg-white">
            <TabsTrigger value="progress">
              <Trophy className="w-4 h-4 mr-2" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="shop">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Loja
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Innova Coins Display */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
                        <Coins className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Nível {currentLevel}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentThreshold.name}
                        </p>
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

                  {gamificationProfile.streak_days > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-orange-50">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-gray-900">
                          {gamificationProfile.streak_days} dias consecutivos!
                        </span>
                        <Badge className="ml-auto bg-orange-500 text-white border-0">
                          Em chamas! 🔥
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs mb-1 text-gray-600">Total Ganho</p>
                      <p className="text-lg font-bold text-green-600">
                        {(gamificationProfile.total_coins_earned || currentCoins).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs mb-1 text-gray-600">Total Gasto</p>
                      <p className="text-lg font-bold text-red-600">
                        {(gamificationProfile.total_coins_spent || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Atividade Recente */}
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {recentCoins.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {recentCoins.map((coin, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              {coin.description || coin.action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Atividade'}
                            </p>
                            <p className="text-xs text-gray-600">
                              {coin.timestamp ? new Date(coin.timestamp).toLocaleDateString('pt-BR') : 'Hoje'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-orange-500">
                              +{coin.coins || 0} 🪙
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Coins className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Complete atividades para ganhar Innova Coins!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Badge Collection */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Coleção de Badges
                </CardTitle>
                <p className="text-sm text-gray-600">
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
                          isEarned ? 'shadow-md cursor-pointer hover:scale-105' : 'opacity-40'
                        }`}
                        style={{
                          backgroundColor: isEarned ? `${badge.color}15` : '#f3f4f6',
                          border: `2px solid ${isEarned ? badge.color : '#d1d5db'}`
                        }}
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          {badge.name}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Como Ganhar Coins */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-500" />
                  Como Ganhar Innova Coins 🪙
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { action: 'Completar Aula', coins: 100, icon: '📚' },
                    { action: 'Marco do Projeto', coins: 250, icon: '🎯' },
                    { action: 'Completar Projeto', coins: 500, icon: '🏆' },
                    { action: 'Ajudar Colega', coins: 50, icon: '🤝' },
                    { action: 'Bônus Criatividade', coins: 150, icon: '🎨' },
                    { action: 'Apresentação Semana 17', coins: 300, icon: '🎤' },
                    { action: 'Login Diário', coins: 10, icon: '📅' },
                    { action: 'Quiz Perfeito', coins: 75, icon: '✅' }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-semibold text-gray-900">
                          {item.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-orange-500">
                          {item.coins} 🪙
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Loja de Recompensas */}
          <TabsContent value="shop" className="mt-6">
            <RewardShop 
              userEmail={user?.email}
              currentCoins={gamificationProfile?.innova_coins || 0}
              motivationalProfile={motivationalProfile}
            />
          </TabsContent>

          {/* Tab: Leaderboard */}
          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard 
              currentUserEmail={user?.email}
              explorerLevel={gamificationProfile?.level}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
