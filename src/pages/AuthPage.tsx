import { useState } from 'react';
import { Leaf, Mail, Lock, User, ArrowLeft, Chrome } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type Props = {
  mode: 'login' | 'signup' | 'forgot';
  onModeChange: (mode: 'login' | 'signup' | 'forgot') => void;
  onBack: () => void;
};

export default function AuthPage({ mode, onModeChange, onBack }: Props) {
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) showToast(error, 'error');
      else showToast('Welcome back to your garden', 'success');
    } else if (mode === 'signup') {
      const { error } = await signUp(email, password, displayName || 'Gardener');
      if (error) showToast(error, 'error');
      else showToast('Your garden has been planted', 'success');
    } else {
      showToast('Password reset link sent to your email', 'success');
      onModeChange('login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AmbientBackground weather="sunset" showParticles />

      <button
        onClick={onBack}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Your Garden' : 'Reset Password'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === 'login'
                ? 'Your garden has been waiting for you'
                : mode === 'signup'
                ? 'Begin your journey of growing memories'
                : 'We\'ll send you a link to reset your password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="What should we call you?"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-gray-700"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onModeChange('forgot')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Enter Garden' : mode === 'signup' ? 'Plant Your First Seed' : 'Send Reset Link'}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/40" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-white/40" />
              </div>

              <button
                onClick={() => showToast('Google sign-in coming soon', 'info')}
                className="w-full py-3 rounded-2xl bg-white/60 border border-white/40 text-gray-700 font-medium hover:bg-white/80 transition flex items-center justify-center gap-2"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? "Don't have a garden yet? " : 'Already have a garden? '}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
