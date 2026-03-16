import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn, Mail, Lock, Chrome } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success('Signed in with Google');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-zinc-400">Sign in to manage your tracked products.</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-black pl-12 pr-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-black pl-12 pr-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            <LogIn className="h-5 w-5" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition-all hover:bg-white/10"
        >
          <Chrome className="h-5 w-5" />
          Google
        </button>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-500 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
