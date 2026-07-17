import { useEffect, useState } from 'react';
import { Flower2, TreePine, Bird, Mountain, Heart, Cloud, Flame, TrendingUp, Plus, Sparkles, BarChart3, BookOpen } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { supabase, type Memory, type Profile } from '../lib/supabase';
import { moodConfig, getTimeOfDay, type MoodType } from '../lib/garden';
import type { PageKey } from '../components/Layout';

type Props = {
  onNavigate: (page: PageKey) => void;
  onAddMemory: () => void;
};

export default function Dashboard({ onNavigate, onAddMemory }: Props) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: mem }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('memories').select('*').order('memory_date', { ascending: false }),
      ]);
      setProfile(p as Profile);
      setMemories((mem as Memory[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const stats = {
    total: memories.length,
    flowers: memories.filter((m) => m.category === 'happy').length,
    trees: memories.filter((m) => m.category === 'achievement').length,
    butterflies: memories.filter((m) => m.category === 'gratitude').length,
    mountains: memories.filter((m) => m.category === 'challenge').length,
  };

  const recentMoods = memories.slice(0, 7).map((m) => m.mood as MoodType);
  const moodCounts: Record<string, number> = {};
  recentMoods.forEach((mood) => { moodCounts[mood] = (moodCounts[mood] ?? 0) + 1; });
  const topMood = (Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType) ?? 'happy';

  const timeOfDay = getTimeOfDay();
  const greeting = timeOfDay === 'morning' ? 'Good morning' : timeOfDay === 'afternoon' ? 'Good afternoon' : timeOfDay === 'sunset' ? 'Good evening' : 'Good night';

  const gardenHealth = Math.min(100, Math.round((stats.total / 20) * 100));

  const quickActions = [
    { label: 'Add Memory', icon: Plus, onClick: onAddMemory, color: 'from-emerald-400 to-teal-500' },
    { label: 'Visit Garden', icon: Flower2, onClick: () => onNavigate('garden'), color: 'from-purple-400 to-pink-400' },
    { label: 'Timeline', icon: BookOpen, onClick: () => onNavigate('memories'), color: 'from-sky-400 to-blue-500' },
    { label: 'AI Reflection', icon: Sparkles, onClick: () => onNavigate('reflection'), color: 'from-amber-400 to-orange-500' },
    { label: 'Analytics', icon: BarChart3, onClick: () => onNavigate('analytics'), color: 'from-indigo-400 to-purple-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Loading your garden...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Memories', value: stats.total, icon: BookOpen, color: 'from-emerald-400 to-teal-500' },
    { label: 'Flowers', value: stats.flowers, icon: Flower2, color: 'from-yellow-400 to-amber-500' },
    { label: 'Trees', value: stats.trees, icon: TreePine, color: 'from-green-400 to-emerald-600' },
    { label: 'Butterflies', value: stats.butterflies, icon: Bird, color: 'from-purple-400 to-pink-400' },
    { label: 'Mountains', value: stats.mountains, icon: Mountain, color: 'from-slate-400 to-slate-600' },
    { label: 'Garden Health', value: `${gardenHealth}%`, icon: Heart, color: 'from-rose-400 to-pink-500' },
    { label: 'Mood of the Week', value: moodConfig[topMood].label, icon: Sparkles, color: 'from-amber-400 to-orange-400' },
    { label: 'Current Weather', value: moodConfig[topMood].weather === 'sunny' ? 'Sunny' : moodConfig[topMood].weather === 'rain' ? 'Rainy' : moodConfig[topMood].weather === 'night' ? 'Night' : moodConfig[topMood].weather === 'sunset' ? 'Sunset' : moodConfig[topMood].weather === 'wind' ? 'Windy' : 'Rainbow', icon: Cloud, color: 'from-sky-400 to-blue-500' },
    { label: 'Journal Streak', value: `${profile?.streak ?? 0} days`, icon: Flame, color: 'from-orange-400 to-red-500' },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather={moodConfig[topMood].weather} timeOfDay={timeOfDay} showFireflies={timeOfDay === 'night'} />

      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            {greeting}, {profile?.display_name ?? 'Gardener'}!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Welcome back, your garden has grown today 🌱</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`group flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r ${a.color} text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition`}
              >
                <Icon className="w-5 h-5" />
                {a.label}
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-3xl p-5 hover:shadow-lg transition group">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Memories */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Memories</h2>
            <button onClick={() => onNavigate('memories')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </button>
          </div>
          {memories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🌱</div>
              <p className="text-gray-500">No memories yet. Plant your first seed!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {memories.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition cursor-pointer" onClick={() => onNavigate('memories')}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/80 to-teal-400/80 flex items-center justify-center text-lg">
                    {m.mood in moodConfig ? moodConfig[m.mood as MoodType].emoji : '🌸'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{m.title}</p>
                    <p className="text-xs text-gray-400">{new Date(m.memory_date).toLocaleDateString()}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
