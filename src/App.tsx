import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Garden from './pages/Garden';
import Memories from './pages/Memories';
import Analytics from './pages/Analytics';
import Reflection from './pages/Reflection';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Capsules from './pages/Capsules';
import Layout, { type PageKey } from './components/Layout';
import AddMemory from './pages/AddMemory';

type AppView = 'landing' | 'auth' | 'app';

function AppContent() {
  const { session, loading } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [page, setPage] = useState<PageKey>('dashboard');
  const [showAddMemory, setShowAddMemory] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-100 to-teal-100">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (session && view !== 'app') {
    setView('app');
  }

  if (!session && view === 'app') {
    setView('landing');
  }

  if (!session) {
    if (view === 'auth') {
      return <AuthPage mode={authMode} onModeChange={setAuthMode} onBack={() => setView('landing')} />;
    }
    return (
      <LandingPage
        onStartGarden={() => { setAuthMode('signup'); setView('auth'); }}
        onExploreDemo={() => { setAuthMode('signup'); setView('auth'); }}
      />
    );
  }

  const handleNavigate = (p: PageKey) => setPage(p);

  return (
    <>
      <Layout currentPage={page} onNavigate={handleNavigate} onAddMemory={() => setShowAddMemory(true)}>
        {page === 'dashboard' && <Dashboard onNavigate={handleNavigate} onAddMemory={() => setShowAddMemory(true)} />}
        {page === 'garden' && <Garden />}
        {page === 'memories' && <Memories />}
        {page === 'analytics' && <Analytics />}
        {page === 'reflection' && <Reflection />}
        {page === 'achievements' && <Achievements />}
        {page === 'capsules' && <Capsules />}
        {page === 'settings' && <Settings />}
      </Layout>

      {showAddMemory && (
        <AddMemory onClose={() => setShowAddMemory(false)} onSaved={() => { /* refresh handled by pages */ }} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
