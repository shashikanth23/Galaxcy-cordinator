import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe, Loader } from 'lucide-react';
import { authApi } from '../../api/client';
import { useAuthStore } from '../../store/stores';

// ── Login ──────────────────────────────────────────────────────────────────
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-aurora/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-nova/5 rounded-full blur-3xl" />
        {/* Stars */}
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.6+0.1, animationDelay: `${Math.random()*4}s` }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-aurora/20 border border-aurora/40 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-aurora" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gradient-aurora">GALAXCY</h1>
          <p className="text-white/40 text-sm mt-1">Your universe awaits</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Welcome back</h2>

          {error && (
            <div className="bg-pulsar/10 border border-pulsar/30 rounded-xl p-3 mb-5 text-pulsar text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="data-label block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required className="input-space w-full" />
            </div>
            <div>
              <label className="data-label block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required className="input-space w-full pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-50">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="border-t border-glassborder" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nebula px-3 text-white/30 text-xs">or</span>
          </div>

          <button disabled className="btn-ghost w-full justify-center py-3 opacity-50 cursor-not-allowed">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            Continue with Google
          </button>

          <p className="text-center text-white/40 text-sm mt-6">
            No account?{' '}
            <Link to="/auth/register" className="text-aurora hover:text-aurora/80 transition-colors">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Register ───────────────────────────────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-void">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-nova/5 rounded-full blur-3xl" />
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.1, animationDelay: `${Math.random()*4}s` }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-nova/20 border border-nova/40 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-nova" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gradient-nova">GALAXCY</h1>
          <p className="text-white/40 text-sm mt-1">Join the cosmos</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {error && (
            <div className="bg-pulsar/10 border border-pulsar/30 rounded-xl p-3 mb-5 text-pulsar text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="data-label block mb-1.5">Name</label>
              <input value={form.name} onChange={update('name')} placeholder="Your name" required className="input-space w-full" />
            </div>
            <div>
              <label className="data-label block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required className="input-space w-full" />
            </div>
            <div>
              <label className="data-label block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={update('password')}
                  placeholder="Min. 8 characters" required className="input-space w-full pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-50">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Have an account?{' '}
            <Link to="/auth/login" className="text-aurora hover:text-aurora/80 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
