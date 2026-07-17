import { useState } from 'react';
import { X, MapPin, Tag, Mic, Camera, Calendar, Heart, ArrowLeft } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { moodConfig, categoryConfig, type MoodType, type CategoryType } from '../lib/garden';
import type { PageKey } from '../components/Layout';

type Props = {
  onClose: () => void;
  onSaved: () => void;
  onNavigate?: (page: PageKey) => void;
};

export default function AddMemory({ onClose, onSaved }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mood, setMood] = useState<MoodType>('happy');
  const [emotion, setEmotion] = useState('');
  const [category, setCategory] = useState<CategoryType>('happy');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showToast('Please give your memory a title', 'error');
      return;
    }
    setSaving(true);
    const gardenX = 10 + Math.random() * 80;
    const gardenY = 30 + Math.random() * 50;
    const { error } = await supabase.from('memories').insert({
      user_id: user?.id,
      title,
      description: description || null,
      mood,
      emotion: emotion || null,
      category,
      tags,
      location: location || null,
      memory_date: date,
      garden_x: gardenX,
      garden_y: gardenY,
    });
    setSaving(false);
    if (error) {
      showToast(error.message, 'error');
      return;
    }
    showToast('Your memory has bloomed in the garden', 'success');
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <AmbientBackground weather="sunny" showParticles={false} />
      <div
        className="glass rounded-3xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Plant a New Memory</h2>
          </div>
          <button onClick={onClose} className="hidden lg:block text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a name..."
              className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened? How did it make you feel?"
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700 resize-none"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where?"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Mood</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(moodConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setMood(key as MoodType)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    mood === key
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  }`}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Emotion (optional)</label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="e.g., grateful, inspired, nostalgic..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Memory Category</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key as CategoryType)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-xs font-medium transition ${
                    category === key
                      ? `bg-gradient-to-br ${cfg.color} text-white shadow-md`
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <span className="text-xl">{cfg.emoji}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Tags</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                />
              </div>
              <button onClick={handleAddTag} className="px-4 py-3 rounded-2xl bg-emerald-400/80 text-white font-medium hover:bg-emerald-500 transition">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/60 text-emerald-700">
                    #{t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-rose-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Photos & Voice Note (UI only) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => showToast('Photo upload coming soon', 'info')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 border border-white/40 text-gray-500 hover:bg-white/70 transition"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium">Add Photo</span>
            </button>
            <button
              onClick={() => showToast('Voice notes coming soon', 'info')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 border border-white/40 text-gray-500 hover:bg-white/70 transition"
            >
              <Mic className="w-6 h-6" />
              <span className="text-sm font-medium">Voice Note</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/50 text-gray-600 font-medium hover:bg-white/70 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {saving ? 'Planting...' : 'Plant Memory'}
          </button>
        </div>
      </div>
    </div>
  );
}
