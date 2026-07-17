import { useEffect, useState } from 'react';
import { Clock, Plus, X, Lock, Sparkles } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, type MemoryCapsule } from '../lib/supabase';

export default function Capsules() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [capsules, setCapsules] = useState<MemoryCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [revealAt, setRevealAt] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('memory_capsules').select('*').order('reveal_at', { ascending: true }).then(({ data }) => {
      setCapsules((data as MemoryCapsule[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  const handleCreate = async () => {
    if (!title.trim() || !message.trim() || !revealAt) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const gardenX = 10 + Math.random() * 80;
    const gardenY = 30 + Math.random() * 50;
    const { error } = await supabase.from('memory_capsules').insert({
      user_id: user?.id,
      title,
      message,
      reveal_at: revealAt,
      garden_x: gardenX,
      garden_y: gardenY,
    });
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Your memory capsule has been planted as a bud', 'success');
    setTitle(''); setMessage(''); setRevealAt(''); setShowAdd(false);
    const { data } = await supabase.from('memory_capsules').select('*').order('reveal_at', { ascending: true });
    setCapsules((data as MemoryCapsule[]) ?? []);
  };

  const today = new Date().toISOString().slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="night" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="night" showFireflies showParticles />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Memory Capsules</h1>
              <p className="text-gray-500 text-sm">Write a memory for your future self to discover</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-medium shadow-md hover:shadow-lg transition"
          >
            <Plus className="w-5 h-5" /> New Capsule
          </button>
        </div>

        {capsules.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-3">🔮</div>
            <p className="text-gray-500 mb-2">No memory capsules yet</p>
            <p className="text-gray-400 text-sm">Create a time-locked memory that will bloom as a flower on a future date</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {capsules.map((c) => {
              const revealed = new Date(c.reveal_at) <= new Date();
              return (
                <div key={c.id} className={`glass rounded-3xl p-6 ${revealed ? 'animate-glow-pulse' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{revealed ? '🌸' : '🥀'}</div>
                    {revealed ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/60 text-emerald-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Bloomed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100/60 text-purple-700 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Sealed
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
                  {revealed ? (
                    <p className="text-gray-600 text-sm leading-relaxed">{c.message}</p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">This capsule will bloom on {new Date(c.reveal_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">Reveal date: {new Date(c.reveal_at).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="glass rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Memory Capsule</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A message for your future self..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-purple-400 outline-none text-gray-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-purple-400 outline-none text-gray-700 resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Reveal Date</label>
                <input type="date" min={today} value={revealAt} onChange={(e) => setRevealAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-purple-400 outline-none text-gray-700" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-2xl bg-white/50 text-gray-600 font-medium hover:bg-white/70 transition">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold shadow-lg transition">Seal Capsule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
