import { useEffect, useState, useMemo } from 'react';
import { Cloud, Sun, CloudRain, Wind, Moon, Sunset, Volume2, VolumeX } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import GardenScene from '../components/GardenScene';
import { useAuth } from '../context/AuthContext';
import { supabase, type Memory, type MemoryCapsule } from '../lib/supabase';
import { moodConfig, getTimeOfDay, moodToWeather, type MoodType, type WeatherType, categoryConfig, type CategoryType } from '../lib/garden';

export default function Garden() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [capsules, setCapsules] = useState<MemoryCapsule[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [soundOn, setSoundOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: mem }, { data: cap }] = await Promise.all([
        supabase.from('memories').select('*').order('memory_date', { ascending: false }),
        supabase.from('memory_capsules').select('*'),
      ]);
      setMemories((mem as Memory[]) ?? []);
      setCapsules((cap as MemoryCapsule[]) ?? []);

      const recentMoods = (mem as Memory[])?.slice(0, 5).map((m) => m.mood as MoodType) ?? [];
      if (recentMoods.length > 0) {
        const counts: Record<string, number> = {};
        recentMoods.forEach((m) => { counts[m] = (counts[m] ?? 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType;
        setWeather(moodToWeather[top] ?? 'sunny');
      }
      setLoading(false);
    })();
  }, [user]);

  const timeOfDay = getTimeOfDay();

  const gardenElements = useMemo(() => {
    const memEls = memories.map((m) => ({
      id: m.id,
      type: categoryConfig[m.category as CategoryType]?.gardenType ?? 'flower',
      x: m.garden_x,
      y: m.garden_y,
      category: m.category,
    }));
    const capsuleEls = capsules
      .filter((c) => !c.revealed && new Date(c.reveal_at) > new Date())
      .map((c) => ({
        id: c.id,
        type: 'bud',
        x: c.garden_x,
        y: c.garden_y,
        category: 'capsule',
      }));
    return [...memEls, ...capsuleEls];
  }, [memories, capsules]);

  const handleElementClick = (id: string) => {
    const mem = memories.find((m) => m.id === id);
    if (mem) setSelectedMemory(mem);
  };

  const weatherIcons: Record<WeatherType, typeof Sun> = {
    sunny: Sun,
    rain: CloudRain,
    sunset: Sunset,
    wind: Wind,
    night: Moon,
    rainbow: Cloud,
  };
  const WeatherIcon = weatherIcons[weather];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Growing your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather={weather} timeOfDay={timeOfDay} showFireflies={timeOfDay === 'night'} showParticles />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Living Garden</h1>
            <p className="text-gray-500 mt-1">Click any element to revisit the memory behind it</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
              <WeatherIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 capitalize">{weather}</span>
            </div>
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="glass rounded-2xl p-2.5 hover:bg-white/50 transition"
            >
              {soundOn ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Garden Canvas */}
        <div className="glass rounded-3xl overflow-hidden shadow-xl h-[60vh] lg:h-[65vh] relative">
          <GardenScene elements={gardenElements} onElementClick={handleElementClick} interactive />
        </div>

        {/* Weather Controls */}
        <div className="mt-6 glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Change Garden Atmosphere</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodConfig).map(([key, cfg]) => {
              const Icon = weatherIcons[cfg.weather];
              return (
                <button
                  key={key}
                  onClick={() => setWeather(cfg.weather)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    weather === cfg.weather
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambient Sounds */}
        <div className="mt-4 glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Ambient Sounds</h3>
          <div className="flex flex-wrap gap-2">
            {['Forest', 'Rain', 'River', 'Birds', 'Night Crickets', 'Wind', 'Piano'].map((s) => (
              <button
                key={s}
                onClick={() => setSoundOn(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white/50 text-gray-600 hover:bg-white/70 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="glass rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-3xl">{categoryConfig[selectedMemory.category as CategoryType]?.emoji ?? '🌸'}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">{selectedMemory.title}</h2>
                <p className="text-sm text-gray-400">{new Date(selectedMemory.memory_date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedMemory(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            {selectedMemory.description && (
              <p className="text-gray-600 leading-relaxed mb-4">{selectedMemory.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryConfig[selectedMemory.category as CategoryType]?.color} text-white`}>
                {categoryConfig[selectedMemory.category as CategoryType]?.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-600">
                {moodConfig[selectedMemory.mood as MoodType]?.emoji} {moodConfig[selectedMemory.mood as MoodType]?.label}
              </span>
              {selectedMemory.location && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-600">
                  📍 {selectedMemory.location}
                </span>
              )}
            </div>
            {selectedMemory.tags && selectedMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedMemory.tags.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-lg text-xs text-gray-500 bg-white/40">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
