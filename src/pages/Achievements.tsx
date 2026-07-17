import { useEffect, useState } from 'react';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { supabase, type Achievement, type Memory } from '../lib/supabase';

const achievementDefs = [
  { key: 'first_bloom', emoji: '🌸', title: 'First Bloom', desc: 'Plant your first memory', requirement: 1 },
  { key: 'growing_strong', emoji: '🌳', title: 'Growing Strong', desc: 'Plant 5 memories', requirement: 5 },
  { key: 'gratitude_master', emoji: '🦋', title: 'Gratitude Master', desc: 'Express gratitude 3 times', requirement: 3 },
  { key: 'dream_chaser', emoji: '⭐', title: 'Dream Chaser', desc: 'Record 3 dreams', requirement: 3 },
  { key: 'hope_keeper', emoji: '🌈', title: 'Hope Keeper', desc: 'Stay positive for 7 days', requirement: 7 },
  { key: 'bloom_champion', emoji: '🏆', title: 'Bloom Champion', desc: 'Plant 20 memories', requirement: 20 },
];

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ach }, { data: mem }] = await Promise.all([
        supabase.from('achievements').select('*'),
        supabase.from('memories').select('*'),
      ]);
      setAchievements((ach as Achievement[]) ?? []);
      setMemories((mem as Memory[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const unlockedKeys = new Set(achievements.map((a) => a.achievement_key));

  const progress = achievementDefs.map((def) => {
    let current = 0;
    if (def.key === 'first_bloom' || def.key === 'growing_strong' || def.key === 'bloom_champion') {
      current = memories.length;
    } else if (def.key === 'gratitude_master') {
      current = memories.filter((m) => m.category === 'gratitude').length;
    } else if (def.key === 'dream_chaser') {
      current = memories.filter((m) => m.category === 'dream').length;
    } else if (def.key === 'hope_keeper') {
      current = Math.min(7, memories.filter((m) => m.mood === 'happy' || m.mood === 'excited').length);
    }
    return { ...def, current, unlocked: unlockedKeys.has(def.key) || current >= def.requirement };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const unlockedCount = progress.filter((p) => p.unlocked).length;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="rainbow" showParticles />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
            <p className="text-gray-500 text-sm">{unlockedCount} of {achievementDefs.length} badges unlocked</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass rounded-3xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-bold text-gray-800">{Math.round((unlockedCount / achievementDefs.length) * 100)}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
              style={{ width: `${(unlockedCount / achievementDefs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {progress.map((a, i) => (
            <div
              key={a.key}
              className={`rounded-3xl p-6 text-center transition animate-fade-in-up ${
                a.unlocked
                  ? 'glass shadow-lg hover:shadow-xl hover:-translate-y-1'
                  : 'bg-white/30 border border-white/20'
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`relative w-20 h-20 mx-auto mb-3 ${a.unlocked ? 'animate-glow-pulse' : ''}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl ${
                  a.unlocked
                    ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg'
                    : 'bg-gray-200/60 grayscale'
                }`}>
                  {a.unlocked ? a.emoji : <Lock className="w-7 h-7 text-gray-400" />}
                </div>
                {a.unlocked && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shadow">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <h3 className={`font-bold ${a.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>{a.title}</h3>
              <p className={`text-xs mt-1 ${a.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>{a.desc}</p>
              {!a.unlocked && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-1000"
                      style={{ width: `${Math.min(100, (a.current / a.requirement) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{a.current} / {a.requirement}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
