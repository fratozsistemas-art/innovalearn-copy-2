import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal,
  TrendingUp,
  Users,
  Crown,
  Flame,
  Target
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Leaderboard({ currentUserEmail, explorerLevel }) {
  const [timeframe, setTimeframe] = useState('all_time');
  const [scope, setScope] = useState('level'); // 'level' or 'global'

  // Buscar dados de gamificação
  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ['gamification-leaderboard', scope, explorerLevel],
    queryFn: async () => {
      const profiles = await base44.entities.GamificationProfile.list();
      
      // Se scope é 'level', filtrar por nível
      if (scope === 'level' && explorerLevel) {
        const users = await base44.entities.User.list();
        const levelUsers = users.filter(u => u.explorer_level === explorerLevel);
        const levelEmails = new Set(levelUsers.map(u => u.email));
        return profiles.filter(p => levelEmails.has(p.student_email));
      }
      
      return profiles;
    }
  });

  // Buscar usuários para nomes
  const { data: users = [] } = useQuery({
    queryKey: ['users-for-leaderboard'],
    queryFn: () => base44.entities.User.list()
  });

  // Criar mapa de email -> nome
  const userNameMap = React.useMemo(() => {
    return users.reduce((map, user) => {
      map[user.email] = user.full_name || user.explorer_name || user.email.split('@')[0];
      return map;
    }, {});
  }, [users]);

  // Processar rankings
  const rankings = React.useMemo(() => {
    const sorted = [...allProfiles].sort((a, b) => {
      switch (timeframe) {
        case 'week':
          // Coins ganhos na última semana
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const aWeekCoins = (a.coin_history || [])
            .filter(h => new Date(h.timestamp) >= weekAgo && h.coins > 0)
            .reduce((sum, h) => sum + h.coins, 0);
          const bWeekCoins = (b.coin_history || [])
            .filter(h => new Date(h.timestamp) >= weekAgo && h.coins > 0)
            .reduce((sum, h) => sum + h.coins, 0);
          return bWeekCoins - aWeekCoins;
        
        case 'month':
          // Coins ganhos no último mês
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const aMonthCoins = (a.coin_history || [])
            .filter(h => new Date(h.timestamp) >= monthAgo && h.coins > 0)
            .reduce((sum, h) => sum + h.coins, 0);
          const bMonthCoins = (b.coin_history || [])
            .filter(h => new Date(h.timestamp) >= monthAgo && h.coins > 0)
            .reduce((sum, h) => sum + h.coins, 0);
          return bMonthCoins - aMonthCoins;
        
        default: // all_time
          return (b.innova_coins || 0) - (a.innova_coins || 0);
      }
    });

    return sorted.map((profile, index) => ({
      ...profile,
      rank: index + 1,
      name: userNameMap[profile.student_email] || 'Explorador',
      isCurrentUser: profile.student_email === currentUserEmail
    }));
  }, [allProfiles, timeframe, userNameMap, currentUserEmail]);

  // Top 3
  const topThree = rankings.slice(0, 3);
  const rest = rankings.slice(3);
  
  // Posição do usuário atual
  const currentUserRanking = rankings.find(r => r.isCurrentUser);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-600" />;
      default: return <span className="font-bold text-gray-600">#{rank}</span>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando ranking...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Filtros */}
      <div className="flex gap-4">
        <Tabs value={scope} onValueChange={setScope} className="flex-1">
          <TabsList className="grid grid-cols-2 w-full bg-white">
            <TabsTrigger value="level">
              <Users className="w-4 h-4 mr-2" />
              Meu Nível
            </TabsTrigger>
            <TabsTrigger value="global">
              <Trophy className="w-4 h-4 mr-2" />
              Global
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={timeframe} onValueChange={setTimeframe} className="flex-1">
          <TabsList className="grid grid-cols-3 w-full bg-white">
            <TabsTrigger value="week">
              Semana
            </TabsTrigger>
            <TabsTrigger value="month">
              Mês
            </TabsTrigger>
            <TabsTrigger value="all_time">
              Total
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Posição do usuário atual */}
      {currentUserRanking && currentUserRanking.rank > 3 && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-blue-600">
                #{currentUserRanking.rank}
              </div>
              <div className="flex-1">
                <p className="font-semibold">Sua Posição</p>
                <p className="text-sm text-gray-600">
                  {currentUserRanking.innova_coins} Innova Coins
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pódio Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {topThree.map((profile) => {
          const isFirst = profile.rank === 1;
          
          return (
            <Card 
              key={profile.id}
              className={`${
                profile.isCurrentUser ? 'ring-2 ring-blue-500' : ''
              } ${
                isFirst ? 'col-span-3 md:col-span-1 md:order-2 scale-105' : 
                profile.rank === 2 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {getRankIcon(profile.rank)}
                </div>
                
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarFallback className="text-2xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h4 className="font-bold mb-1">{profile.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Nível {profile.level || 1}
                </p>

                <div className="flex items-center justify-center gap-1 text-orange-600 font-bold text-xl">
                  <Trophy className="w-5 h-5" />
                  {profile.innova_coins}
                </div>

                {profile.streak_days > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {profile.streak_days} dias
                  </div>
                )}

                {profile.badges && profile.badges.length > 0 && (
                  <Badge variant="outline" className="mt-2">
                    {profile.badges.length} badges
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista do resto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ranking Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rest.map((profile) => (
              <div 
                key={profile.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  profile.isCurrentUser ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                }`}
              >
                <div className="w-12 text-center font-bold text-gray-600">
                  #{profile.rank}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-xs text-gray-600">
                    Nível {profile.level || 1}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-600 font-bold">
                    <Trophy className="w-4 h-4" />
                    {profile.innova_coins}
                  </div>
                  {profile.streak_days > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {profile.streak_days}d
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}