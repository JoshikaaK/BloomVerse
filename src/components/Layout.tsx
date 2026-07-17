import { useState, type ReactNode } from 'react';
import {
  Home,
  Flower2,
  BookOpen,
  BarChart3,
  Sparkles,
  Trophy,
  Settings,
  Plus,
  Leaf,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PageKey = 'dashboard' | 'garden' | 'memories' | 'analytics' | 'reflection' | 'achievements' | 'settings' | 'capsules';

type Props = {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  onAddMemory: () => void;
  children: ReactNode;
};

const navItems: { key: PageKey; label: string; icon: typeof Home }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'garden', label: 'Garden', icon: Flower2 },
  { key: 'memories', label: 'Memories', icon: BookOpen },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'reflection', label: 'AI Reflection', icon: Sparkles },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'capsules', label: 'Capsules', icon: Clock },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ currentPage, onNavigate, onAddMemory, children }: Props) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-white/30 p-5 fixed h-full z-40">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">BloomVerse</h1>
            <p className="text-xs text-gray-500">Living Garden Journal</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-emerald-400/80 to-teal-400/80 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/30">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.email?.[0]?.toUpperCase() ?? 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
              <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/30 px-2 py-2 flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                active ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile More Menu */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-full glass border border-white/40 flex items-center justify-center shadow-lg"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        {sidebarOpen && (
          <div className="absolute bottom-12 right-0 glass rounded-2xl p-2 shadow-xl flex flex-col gap-1 min-w-[140px]">
            {navItems.slice(5).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-white/40"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50/40">
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 min-h-screen relative">
        {children}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={onAddMemory}
        className="fixed bottom-24 lg:bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <Plus className="w-6 h-6 text-white" />
        <span className="absolute right-full mr-3 whitespace-nowrap text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
          Add Memory
        </span>
      </button>
    </div>
  );
}
