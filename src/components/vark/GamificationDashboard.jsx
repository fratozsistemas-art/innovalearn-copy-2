import React from 'react';
import { Trophy, Coins, Zap, Target, TrendingUp, Award, Star } from 'lucide-react';

/**
 * Enhanced Gamification Dashboard
 * Displays comprehensive gamification stats and progress
 */
const GamificationDashboard = ({ userData }) => {
  const {
    coins = 0,
    level = 1,
    xp = 0,
    xpToNextLevel = 100,
    badges = [],
    streak = 0,
    achievements = [],
    rank = 'Novice',
  } = userData || {};

  const xpPercentage = (xp / xpToNextLevel) * 100;

  const stats = [
    {
      icon: Coins,
      label: 'Coins',
      value: coins.toLocaleString(),
      color: 'text-innova-yellow-600 dark:text-innova-yellow-400',
      bg: 'bg-innova-yellow-100 dark:bg-innova-yellow-900/30',
    },
    {
      icon: Zap,
      label: 'Level',
      value: level,
      color: 'text-innova-teal-600 dark:text-innova-teal-400',
      bg: 'bg-innova-teal-100 dark:bg-innova-teal-900/30',
    },
    {
      icon: Target,
      label: 'Streak',
      value: `${streak} days`,
      color: 'text-innova-orange-600 dark:text-innova-orange-400',
      bg: 'bg-innova-orange-100 dark:bg-innova-orange-900/30',
    },
    {
      icon: Award,
      label: 'Badges',
      value: badges.length,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Rank */}
      <div className="bg-gradient-to-r from-innova-teal-500 to-innova-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Level {level} - {rank}</h2>
            <p className="text-innova-teal-100">Keep learning to level up!</p>
          </div>
          <Trophy className="w-16 h-16 opacity-50" />
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
          <div className="w-full bg-innova-teal-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-innova-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bg} rounded-lg p-4 border-2 border-transparent hover:border-innova-teal-300 transition-all`}
            >
              <Icon className={`w-8 h-8 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Badges */}
      {badges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-innova-teal-600 dark:text-innova-teal-400" />
            Recent Badges
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {badges.slice(0, 6).map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 bg-gradient-to-br from-innova-yellow-50 to-innova-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-lg border-2 border-innova-yellow-200 dark:border-innova-yellow-700 hover:scale-105 transition-transform cursor-pointer"
                title={badge.description}
              >
                <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                <p className="text-xs font-medium text-center text-gray-900 dark:text-white">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-innova-orange-600 dark:text-innova-orange-400" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {achievements.slice(0, 5).map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-innova-orange-500 to-innova-yellow-500 rounded-full flex items-center justify-center text-2xl">
                  {achievement.icon || '⭐'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-innova-yellow-600 dark:text-innova-yellow-400">
                    +{achievement.xp} XP
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-innova-orange-50 to-innova-yellow-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6 border-2 border-innova-orange-200 dark:border-innova-orange-700">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 text-innova-orange-600 dark:text-innova-orange-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Keep up the great work!
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You're making excellent progress. Complete more lessons to earn coins, unlock badges, and level up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;

// Example usage:
/*
const sampleUserData = {
  coins: 1250,
  level: 5,
  xp: 350,
  xpToNextLevel: 500,
  streak: 7,
  rank: 'Explorer',
  badges: [
    { name: 'First Steps', icon: '👣', description: 'Completed first lesson' },
    { name: 'Quick Learner', icon: '⚡', description: 'Completed 5 lessons in one day' },
    { name: 'Consistent', icon: '🔥', description: '7-day streak' },
  ],
  achievements: [
    { title: 'Lesson Master', description: 'Completed 10 lessons', xp: 100, icon: '📚', date: 'Today' },
    { title: 'Perfect Score', description: 'Got 100% on a quiz', xp: 50, icon: '💯', date: 'Yesterday' },
  ],
};

<GamificationDashboard userData={sampleUserData} />
*/
