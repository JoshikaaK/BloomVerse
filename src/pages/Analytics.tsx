import { useEffect, useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Flame, Flower2, Award } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { supabase, type Memory, type Achievement, type Profile } from '../lib/supabase';
import { moodConfig, categoryConfig } from '../lib/garden';

function AnimatedBar({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(max > 0 ? (value / max) * 100 : 0), delay);
  }, [value, max, delay]);
  return (
    <div className="h-3 rounded-full bg-white/40 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
    </div>
  );
}

function AnimatedCircle({ percentage, color, label, sublabel }: { percentage: number; color: string; label: string; sublabel: string }) {
  const [offset, setOffset] = useState(283);
  useEffect(() => {
    setTimeout(() => setOffset(283 - (283 * percentage) / 100), 200);
  }, [percentage]);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray="283" strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{label}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{sublabel}</p>
    </div>
  );
}

export default function Analytics() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: mem }, { data: ach }, { data: p }] = await Promise.all([
        supabase.from('memories').select('*').order('memory_date', { ascending: true }),
        supabase.from('achievements').select('*'),
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      ]);
      setMemories((mem as Memory[]) ?? []);
      setAchievements((ach as Achievement[]) ?? []);
      setProfile(p as Profile);
      setLoading(false);
    })();
  }, [user]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach((m) => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return Object.entries(moodConfig).map(([key, cfg]) => ({ key, label: cfg.label, emoji: cfg.emoji, count: counts[key] ?? 0, color: cfg.color.replace('text-', 'from-') + ' to-' + cfg.color.replace('text-', '') }));
  }, [memories]);

  const monthlyCounts = useMemo(() => {
    const now = new Date();
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en', { month: 'short' });
      const count = memories.filter((m) => {
        const md = new Date(m.memory_date);
        return md.getFullYear() === d.getFullYear() && md.getMonth() === d.getMonth();
      }).length;
      months.push({ label, count });
    }
    return months;
  }, [memories]);

  const categoryCounts = useMemo(() => {
    return Object.entries(categoryConfig).map(([key, cfg]) => ({
      key, label: cfg.label, emoji: cfg.emoji, color: cfg.color,
      count: memories.filter((m) => m.category === key).length,
    }));
  }, [memories]);

  const maxMonthly = Math.max(...monthlyCounts.map((m) => m.count), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Analyzing your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="sunny" showParticles />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500 text-sm">See how your garden grows over time</p>
          </div>
        </div>

        {/* Summary Circles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-3xl p-6 flex flex-col items-center">
            <AnimatedCircle percentage={Math.min(100, memories.length * 5)} color="#34d399" label={`${memories.length}`} sublabel="Total Memories" />
          </div>
          <div className="glass rounded-3xl p-6 flex flex-col items-center">
            <AnimatedCircle percentage={Math.min(100, (profile?.streak ?? 0) * 10)} color="#fb923c" label={`${profile?.streak ?? 0}`} sublabel="Day Streak" />
          </div>
          <div className="glass rounded-3xl p-6 flex flex-col items-center">
            <AnimatedCircle percentage={Math.min(100, achievements.length * 20)} color="#a78bfa" label={`${achievements.length}`} sublabel="Achievements" />
          </div>
          <div className="glass rounded-3xl p-6 flex flex-col items-center">
            <AnimatedCircle percentage={Math.min(100, (memories.length / 20) * 100)} color="#f472b6" label={`${Math.min(100, Math.round((memories.length / 20) * 100))}%`} sublabel="Garden Growth" />
          </div>
        </div>

        {/* Monthly Memories */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Monthly Memories
          </h3>
          <div className="flex items-end justify-between gap-3 h-40">
            {monthlyCounts.map((m, i) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-emerald-400 to-teal-300 transition-all duration-1000 ease-out"
                    style={{ height: `${(m.count / maxMonthly) * 100}%`, minHeight: m.count > 0 ? '8px' : '2px', animationDelay: `${i * 100}ms` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                <span className="text-xs text-gray-400">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood History */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-purple-400" />
            Mood History
          </h3>
          <div className="space-y-3">
            {moodCounts.map((m, i) => {
              const max = Math.max(...moodCounts.map((x) => x.count), 1);
              return (
                <div key={m.key} className="flex items-center gap-3">
                  <span className="text-xl w-8">{m.emoji}</span>
                  <span className="text-sm text-gray-600 w-20">{m.label}</span>
                  <div className="flex-1">
                    <AnimatedBar value={m.count} max={max} color="from-purple-400 to-pink-400" delay={i * 100} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8 text-right">{m.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Common Emotions */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Most Common Emotions (Categories)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {categoryCounts.filter((c) => c.count > 0).slice(0, 9).map((c, i) => (
              <div key={c.key} className={`rounded-2xl p-4 text-center bg-gradient-to-br ${c.color} text-white animate-fade-in-up`} style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-2xl block mb-1">{c.emoji}</span>
                <p className="text-lg font-bold">{c.count}</p>
                <p className="text-xs opacity-90">{c.label}</p>
              </div>
            ))}
            {categoryCounts.every((c) => c.count === 0) && (
              <div className="col-span-3 text-center py-4 text-gray-400 text-sm">No emotions tracked yet. Start adding memories!</div>
            )}
          </div>
        </div>

        {/* Streak */}
        <div className="glass rounded-3xl p-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Journal Streak
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <Flame className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{profile?.streak ?? 0} days</p>
              <p className="text-sm text-gray-500">Keep journaling to grow your streak!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
