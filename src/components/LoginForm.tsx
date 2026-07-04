'use client';

// src/components/LoginForm.tsx
// Features: auto-fill "Login as Evaluator" bypass button

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthResponse } from '@/types';

// Constants removed for security

interface LoginFormProps {
  onSuccess?: (role: 'admin' | 'user') => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await attemptLogin(email, password);
  };


  const attemptLogin = async (emailVal: string, passwordVal: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passwordVal }),
      });

      const data = await res.json() as AuthResponse;

      if (data.success) {
        onSuccess?.(data.role);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Glassmorphism card */}
      <div className="relative rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur-xl p-8 shadow-card">
        {/* Decorative glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-amber/10 via-transparent to-brand-teal/10 pointer-events-none" />

        <div className="relative">
          <h2 className="font-display text-2xl font-bold text-brand-text mb-1">
            Welcome to EthnoVibe
          </h2>
          <p className="text-brand-muted text-sm mb-6">
            Sign in to begin your cultural journey
          </p>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-brand-subtle mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-text placeholder-brand-muted text-sm focus:outline-none focus:border-brand-amber/60 focus:ring-1 focus:ring-brand-amber/30 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-brand-subtle mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-text placeholder-brand-muted text-sm focus:outline-none focus:border-brand-amber/60 focus:ring-1 focus:ring-brand-amber/30 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-subtle text-xs"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              id="manual-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-surface border border-brand-border text-brand-text hover:border-brand-amber/50 hover:text-brand-amber transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
