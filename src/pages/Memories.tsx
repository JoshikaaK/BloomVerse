import { useEffect, useState, useMemo } from 'react';
import { Search, Edit3, Trash2, X, MapPin, Calendar } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, type Memory } from '../lib/supabase';
import { moodConfig, categoryConfig, type MoodType, type CategoryType } from '../lib/garden';

export default function Memories() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Memory | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('memories')
      .select('*')
      .order('memory_date', { ascending: false })
      .then(({ data }) => {
        setMemories((data as Memory[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const years = useMemo(() => {
    const ys = new Set(memories.map((m) => new Date(m.memory_date).getFullYear()));
    return Array.from(ys).sort((a, b) => b - a);
  }, [memories]);

  const filtered = useMemo(() => {
    return memories.filter((m) => {
      if (moodFilter !== 'all' && m.mood !== moodFilter) return false;
      if (yearFilter !== 'all' && new Date(m.memory_date).getFullYear().toString() !== yearFilter) return false;
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.description?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [memories, moodFilter, yearFilter, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    filtered.forEach((m) => {
      const monthYear = new Date(m.memory_date).toLocaleDateString('en', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(m);
    });
    return groups;
  }, [filtered]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    setMemories(memories.filter((m) => m.id !== id));
    showToast('Memory removed from your garden', 'success');
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from('memories').update({
      title: editing.title,
      description: editing.description,
      mood: editing.mood,
      category: editing.category,
      tags: editing.tags,
      location: editing.location,
    }).eq('id', editing.id);
    if (error) { showToast(error.message, 'error'); return; }
    setMemories(memories.map((m) => (m.id === editing.id ? editing : m)));
    setEditing(null);
    showToast('Memory updated', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm">Loading memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="sunny" showParticles />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Memory Timeline</h1>
        <p className="text-gray-500 mb-6">Journey through your memories, one bloom at a time</p>

        {/* Filters */}
        <div className="glass rounded-3xl p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your memories..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 outline-none transition text-gray-700"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMoodFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${moodFilter === 'all' ? 'bg-emerald-400 text-white' : 'bg-white/50 text-gray-600'}`}
            >
              All Moods
            </button>
            {Object.entries(moodConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setMoodFilter(moodFilter === key ? 'all' : key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${moodFilter === key ? 'bg-emerald-400 text-white' : 'bg-white/50 text-gray-600'}`}
              >
                {cfg.emoji} {cfg.label}
              </button>
            ))}
            {years.length > 0 && (
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/50 text-gray-600 border border-white/40 outline-none"
              >
                <option value="all">All Years</option>
                {years.map((y) => <option key={y} value={y.toString()}>{y}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-gray-500">No memories found. Try a different filter or plant a new memory.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([monthYear, mems]) => (
              <div key={monthYear}>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  {monthYear}
                </h2>
                <div className="relative pl-8">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 to-transparent" />
                  {mems.map((m) => (
                    <div key={m.id} className="relative mb-4">
                      <div className="absolute -left-[22px] top-5 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow" />
                      <div className="glass rounded-2xl p-5 hover:shadow-lg transition group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{categoryConfig[m.category as CategoryType]?.emoji ?? '🌸'}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800">{m.title}</h3>
                              <p className="text-xs text-gray-400">{new Date(m.memory_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => setEditing(m)} className="p-1.5 rounded-lg hover:bg-white/50 text-gray-400 hover:text-emerald-600">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-white/50 text-gray-400 hover:text-rose-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {m.description && <p className="text-gray-600 text-sm mt-2 leading-relaxed">{m.description}</p>}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-white/50 text-gray-500">
                            {moodConfig[m.mood as MoodType]?.emoji} {moodConfig[m.mood as MoodType]?.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${categoryConfig[m.category as CategoryType]?.color} text-white`}>
                            {categoryConfig[m.category as CategoryType]?.label}
                          </span>
                          {m.location && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/50 text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {m.location}
                            </span>
                          )}
                          {m.tags?.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/40 text-gray-400">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="glass rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Memory</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 outline-none text-gray-700"
              />
              <textarea
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 outline-none text-gray-700 resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setEditing({ ...editing, mood: key })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium ${editing.mood === key ? 'bg-emerald-400 text-white' : 'bg-white/50 text-gray-600'}`}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setEditing({ ...editing, category: key })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs ${editing.category === key ? `bg-gradient-to-br ${cfg.color} text-white` : 'bg-white/50 text-gray-600'}`}
                  >
                    <span className="text-lg">{cfg.emoji}</span>
                    {cfg.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={editing.location ?? ''}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                placeholder="Location"
                className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 outline-none text-gray-700"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-2xl bg-white/50 text-gray-600 font-medium hover:bg-white/70 transition">Cancel</button>
              <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-lg transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
