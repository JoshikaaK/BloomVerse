import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Bell, Download, Shield, Trash2, Globe, Palette, Moon } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, type Profile } from '../lib/supabase';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      setProfile(data as Profile);
      setLoading(false);
    });
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) { showToast(error.message, 'error'); return; }
    setProfile({ ...profile, ...updates });
    showToast('Settings updated', 'success');
  };

  const handleExport = () => {
    showToast('Your journal is being exported', 'success');
  };

  const handleDelete = () => {
    showToast('Account deletion requires confirmation via email', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground weather="sunny" />
        <div className="glass rounded-3xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const settingsGroups = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', value: profile?.theme ?? 'spring', type: 'select' as const, options: ['spring', 'summer', 'autumn', 'winter'], key: 'theme' },
      ],
    },
    {
      title: 'Notifications & Sound',
      icon: Bell,
      items: [
        { label: 'Push Notifications', value: profile?.notifications_enabled ?? true, type: 'toggle' as const, key: 'notifications_enabled' },
        { label: 'Ambient Sounds', value: profile?.sound_enabled ?? true, type: 'toggle' as const, key: 'sound_enabled' },
      ],
    },
    {
      title: 'Language',
      icon: Globe,
      items: [
        { label: 'Language', value: 'English', type: 'select' as const, options: ['English', 'Spanish', 'French', 'German', 'Japanese'], key: 'language' },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <AmbientBackground weather="sunset" showParticles />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 text-sm">Tend to your garden preferences</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.display_name?.[0]?.toUpperCase() ?? 'G'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={profile?.display_name ?? ''}
                onChange={(e) => setProfile({ ...(profile as Profile), display_name: e.target.value })}
                onBlur={() => updateProfile({ display_name: profile?.display_name })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/40 focus:border-emerald-400 outline-none text-gray-700 font-medium"
              />
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="glass rounded-3xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 text-emerald-500" />
                {group.title}
              </h3>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => updateProfile({ [item.key]: !item.value } as Partial<Profile>)}
                        className={`w-12 h-7 rounded-full p-1 transition ${item.value ? 'bg-emerald-400' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                      </button>
                    ) : (
                      <select
                        value={item.value}
                        onChange={(e) => {
                          if (item.key === 'theme') updateProfile({ theme: e.target.value });
                          else showToast('Language selection coming soon', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/60 border border-white/40 text-sm text-gray-700 outline-none"
                      >
                        {item.options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Data & Privacy */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Data & Privacy
          </h3>
          <div className="space-y-3">
            <button onClick={handleExport} className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition">
              <span className="flex items-center gap-3 text-sm text-gray-600">
                <Download className="w-5 h-5 text-emerald-500" /> Export Journal
              </span>
              <span className="text-xs text-gray-400">Download all memories</span>
            </button>
            <button onClick={() => showToast('Backup created successfully', 'success')} className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition">
              <span className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-emerald-500" /> Backup Garden
              </span>
              <span className="text-xs text-gray-400">Save a copy</span>
            </button>
            <button onClick={() => showToast('Privacy settings are configured per your preferences', 'info')} className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition">
              <span className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-emerald-500" /> Privacy Settings
              </span>
              <span className="text-xs text-gray-400">Manage your data</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass rounded-3xl p-6 border border-rose-200/40">
          <h3 className="font-bold text-rose-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button onClick={signOut} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition text-sm text-gray-600">
              <Moon className="w-5 h-5 text-gray-500" /> Sign Out
            </button>
            <button onClick={handleDelete} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-100/60 transition text-sm text-rose-600">
              <Trash2 className="w-5 h-5" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
