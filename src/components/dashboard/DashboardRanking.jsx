import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Crown, Medal, Flame, TrendingUp, Users, Star, Coins } from "lucide-react";

const MEDALS = {
  1: { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-300", label: "🥇" },
  2: { icon: Medal, color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-300", label: "🥈" },
  3: { icon: Medal, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-300", label: "🥉" },
};

function getInitials(name) {
  return (name || "?").split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function computeWeekCoins(profile) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return (profile.coin_history || [])
    .filter(h => h.coins > 0 && new Date(h.timestamp) >= weekAgo)
    .reduce((sum, h) => sum + h.coins, 0);
}

function RankRow({ profile, rank, isCurrentUser, timeframe }) {
  const medal = MEDALS[rank];
  const coins = timeframe === 'week' ? computeWeekCoins(profile) : (profile.innova_coins || 0);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      isCurrentUser
        ? 'bg-innova-teal-50 border-2 border-innova-teal-400 shadow-sm'
        : medal
        ? `${medal.bg} border ${medal.border}`
        : 'bg-gray-50 border border-transparent hover:border-gray-200'
    }`}>
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {medal
          ? <span className="text-xl">{medal.label}</span>
          : <span className="font-bold text-gray-500 text-sm">#{rank}</span>
        }
      </div>

      {/* Avatar */}
      <Avatar className="w-9 h-9 flex-shrink-0">
        <AvatarFallback className={`text-sm font-bold ${isCurrentUser ? 'bg-innova-teal-200 text-innova-teal-800' : 'bg-gray-200 text-gray-700'}`}>
          {getInitials(profile.name)}
        </AvatarFallback>
      </Avatar>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-innova-teal-700' : 'text-gray-800'}`}>
          {profile.name} {isCurrentUser && <span className="text-xs font-normal text-innova-teal-500">(você)</span>}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Nível {profile.level || 1}</span>
          {profile.streak_days > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-orange-500">
              <Flame className="w-3 h-3" />{profile.streak_days}d
            </span>
          )}
          {profile.badges?.length > 0 && (
            <span className="text-xs text-purple-500 flex items-center gap-0.5">
              <Star className="w-3 h-3" />{profile.badges.length}
            </span>
          )}
        </div>
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Coins className="w-4 h-4 text-yellow-500" />
        <span className={`font-bold text-sm ${isCurrentUser ? 'text-innova-teal-600' : 'text-orange-500'}`}>
          {coins.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function PodiumTop3({ top3, currentUserEmail, timeframe }) {
  if (top3.length === 0) return null;

  const order = [top3[1], top3[0], top3[2]].filter(Boolean); // 2nd, 1st, 3rd visually
  const heights = { 1: 'h-20', 2: 'h-14', 3: 'h-10' };

  return (
    <div className="flex items-end justify-center gap-3 pt-4 pb-2">
      {order.map((profile) => {
        const coins = timeframe === 'week' ? computeWeekCoins(profile) : (profile.innova_coins || 0);
        const isCurrentUser = profile.student_email === currentUserEmail;
        const medal = MEDALS[profile.rank];

        return (
          <div key={profile.id} className="flex flex-col items-center gap-1 flex-1 max-w-[100px]">
            <span className="text-xs font-semibold text-gray-600 truncate max-w-full text-center px-1">
              {profile.name.split(' ')[0]}
            </span>
            <Avatar className={`${profile.rank === 1 ? 'w-14 h-14' : 'w-11 h-11'} ring-2 ${isCurrentUser ? 'ring-innova-teal-400' : profile.rank === 1 ? 'ring-yellow-400' : 'ring-gray-300'}`}>
              <AvatarFallback className={`font-bold ${profile.rank === 1 ? 'text-base' : 'text-sm'} ${isCurrentUser ? 'bg-innova-teal-200 text-innova-teal-800' : 'bg-gray-200 text-gray-700'}`}>
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`w-full rounded-t-lg flex flex-col items-center justify-end pb-2 ${medal.bg} border-t-2 ${medal.border} ${heights[profile.rank]}`}>
              <span className="text-lg">{medal.label}</span>
              <span className="text-xs font-bold text-orange-600">{coins.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardRanking({ currentUserEmail, explorerLevel }) {
  const [timeframe, setTimeframe] = useState('week');
  const [scope, setScope] = useState('level');

  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ['dashboard-leaderboard', scope, explorerLevel],
    queryFn: async () => {
      const profiles = await base44.entities.GamificationProfile.list();
      if (scope === 'level' && explorerLevel) {
        const users = await base44.entities.User.list();
        const levelEmails = new Set(users.filter(u => u.explorer_level === explorerLevel).map(u => u.email));
        return profiles.filter(p => levelEmails.has(p.student_email));
      }
      return profiles;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-ranking-dashboard'],
    queryFn: () => base44.entities.User.list(),
    staleTime: 1000 * 60 * 10,
  });

  const nameMap = React.useMemo(() =>
    users.reduce((m, u) => { m[u.email] = u.explorer_name || u.full_name || u.email.split('@')[0]; return m; }, {}),
    [users]
  );

  const rankings = React.useMemo(() => {
    const sorted = [...allProfiles].sort((a, b) => {
      if (timeframe === 'week') return computeWeekCoins(b) - computeWeekCoins(a);
      return (b.innova_coins || 0) - (a.innova_coins || 0);
    });
    return sorted.map((p, i) => ({
      ...p,
      rank: i + 1,
      name: nameMap[p.student_email] || 'Explorador',
      isCurrentUser: p.student_email === currentUserEmail,
    }));
  }, [allProfiles, timeframe, nameMap, currentUserEmail]);

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3, 15); // show top 15
  const myRank = rankings.find(r => r.isCurrentUser);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Tabs value={scope} onValueChange={setScope} className="flex-1 min-w-[180px]">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100">
            <TabsTrigger value="level" className="text-xs">
              <Users className="w-3 h-3 mr-1" /> Meu Nível
            </TabsTrigger>
            <TabsTrigger value="global" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" /> Global
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="flex-1 min-w-[180px]">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100">
            <TabsTrigger value="week" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" /> Semana
            </TabsTrigger>
            <TabsTrigger value="all_time" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" /> Total
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Carregando ranking...</div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum aluno encontrado neste filtro.</p>
        </div>
      ) : (
        <>
          {/* My position (if outside top 3) */}
          {myRank && myRank.rank > 3 && (
            <div className="p-3 rounded-xl bg-innova-teal-50 border-2 border-innova-teal-400 flex items-center gap-3">
              <span className="text-2xl font-bold text-innova-teal-600">#{myRank.rank}</span>
              <div className="flex-1">
                <p className="font-semibold text-innova-teal-700 text-sm">Sua posição atual</p>
                <p className="text-xs text-innova-teal-500">
                  {timeframe === 'week' ? computeWeekCoins(myRank).toLocaleString() : (myRank.innova_coins || 0).toLocaleString()} coins {timeframe === 'week' ? 'esta semana' : 'no total'}
                </p>
              </div>
              <span className="text-sm font-bold text-innova-teal-600">
                {top3[0] ? `${Math.max(0, (timeframe === 'week' ? computeWeekCoins(top3[0]) : top3[0].innova_coins || 0) - (timeframe === 'week' ? computeWeekCoins(myRank) : myRank.innova_coins || 0)).toLocaleString()} 🪙 para o 1º` : ''}
              </span>
            </div>
          )}

          {/* Podium */}
          <PodiumTop3 top3={top3} currentUserEmail={currentUserEmail} timeframe={timeframe} />

          {/* Full list */}
          <div className="space-y-1.5">
            {top3.map(p => (
              <RankRow key={p.id} profile={p} rank={p.rank} isCurrentUser={p.isCurrentUser} timeframe={timeframe} />
            ))}
            {rest.length > 0 && <div className="border-t my-2" />}
            {rest.map(p => (
              <RankRow key={p.id} profile={p} rank={p.rank} isCurrentUser={p.isCurrentUser} timeframe={timeframe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}