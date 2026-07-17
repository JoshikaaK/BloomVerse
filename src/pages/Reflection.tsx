import { useEffect, useState, useMemo } from 'react';
import { Sparkles, RefreshCw, Quote, Heart, TrendingUp, Leaf } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { supabase, type Memory } from '../lib/supabase';
import { categoryConfig, type CategoryType } from '../lib/garden';

export default function Reflection() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('memories').select('*').order('memory_date', { ascending: false }).then(({ data }) => {
      setMemories((data as Memory[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekMemories = memories.filter((m) => new Date(m.memory_date) >= weekAgo);
    return {
      week: weekMemories,
      flowers: weekMemories.filter((m) => m.category === 'happy').length,
      trees: weekMemories.filter((m) => m.category === 'achievement').length,
      butterflies: weekMemories.filter((m) => m.category === 'gratitude').length,
      mountains: weekMemories.filter((m) => m.category === 'challenge').length,
      total: memories.length,
    };
  }, [memories]);

  const generateReflection = () => {
    setGenerating(true);
    setTimeout(() => {
      const s = stats;
      const parts: string[] = [];
      parts.push(`This week you planted ${s.flowers} flower${s.flowers !== 1 ? 's' : ''}, grew ${s.trees} tree${s.trees !== 1 ? 's' : ''}, and welcomed ${s.butterflies} butterfl${s.butterflies !== 1 ? 'ies' : 'y'} into your garden.`);
      if (s.mountains > 0) {
        parts.push(`Although ${s.mountains} mountain${s.mountains !== 1 ? 's' : ''} appeared, your garden is greener than ever.`);
      } else {
        parts.push(`Your garden flourished without any new mountains to climb — a peaceful, harmonious week.`);
      }
      parts.push(`In total, your garden now holds ${s.total} living memories, each one a testament to your journey.`);
      parts.push(`You continue to tend to your inner world with care, and it shows in every new bloom.`);

      setReflection(parts.join(' '));
      setGenerating(false);
    }, 1500);
  };

  const insights = useMemo(() => {
    if (stats.week.length === 0) return [];
    const cats = stats.week.map((m) => m.category);
    const counts: Record<string, number> = {};
    cats.forEach((c) => { counts[c] = (counts[c] ?? 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(([cat, count]) => ({
      label: categoryConfig[cat as CategoryType]?.label ?? cat,
      emoji: categoryConfig[cat as CategoryType]?.emoji ?? '🌸',
      count,
    }));
  }, [stats]);

  const quotes = [
    "The garden of your mind blooms when you water it with presence. — Unknown",
    "Every memory you plant is a seed of who you are becoming. — BloomVerse",
    "Growth is the only evidence of life. — John Henry Newman",
    "The earth laughs in flowers. — Ralph Waldo Emerson",
    "What we plant in the soil of contemplation, we shall reap in the harvest of action. — Meister Eckhart",
  ];
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunset" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Reflecting on your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="sunset" showParticles />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Reflection</h1>
            <p className="text-gray-500 text-sm">A gentle look at how your garden has grown</p>
          </div>
        </div>

        <button
          onClick={generateReflection}
          disabled={generating}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Reflecting on your week...
            </>
          ) : reflection ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Generate New Reflection
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate My Weekly Reflection
            </>
          )}
        </button>

        {reflection && (
          <div className="mt-6 glass rounded-3xl p-8 animate-fade-in-up">
            <div className="flex items-start gap-3 mb-4">
              <Leaf className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <p className="text-gray-700 leading-relaxed text-lg">{reflection}</p>
            </div>
          </div>
        )}

        {/* Growth Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Flowers Planted', value: stats.flowers, emoji: '🌼' },
            { label: 'Trees Grown', value: stats.trees, emoji: '🌳' },
            { label: 'Butterflies Welcomed', value: stats.butterflies, emoji: '🦋' },
            { label: 'Mountains Faced', value: stats.mountains, emoji: '🏔' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mt-6 glass rounded-3xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Positive Insights
            </h3>
            <div className="space-y-3">
              {insights.map((i) => (
                <div key={i.label} className="flex items-center gap-3 p-3 rounded-2xl bg-white/40">
                  <span className="text-2xl">{i.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-700">{i.label}</p>
                    <p className="text-xs text-gray-400">{i.count} memor{i.count !== 1 ? 'ies' : 'y'} this week</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gratitude Summary */}
        <div className="mt-6 glass rounded-3xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Gratitude Summary
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {stats.butterflies > 0
              ? `You expressed gratitude ${stats.butterflies} time${stats.butterflies !== 1 ? 's' : ''} this week. Each butterfly in your garden represents a moment of thankfulness — a reminder that appreciation makes life richer.`
              : 'This week, take a moment to notice what you are grateful for. Even the smallest appreciation brings a butterfly to your garden.'}
          </p>
        </div>

        {/* Quote */}
        <div className="mt-6 glass rounded-3xl p-8 text-center">
          <Quote className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <p className="text-gray-700 italic text-lg leading-relaxed">{quote}</p>
        </div>
      </div>
    </div>
  );
}
