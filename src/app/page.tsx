'use client';

// src/app/page.tsx — Landing page with hero + admin login

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import NavBar from '@/components/NavBar';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  const handleLoginSuccess = (role: 'admin' | 'user') => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <NavBar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />

      {/* Hero Section */}
      <main className="pt-16">
        <div className="relative overflow-hidden">
          {/* Ambient background orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-brand-purple/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Hero content */}
              <div className="animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-amber/30 bg-brand-amber/10 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
                  <span className="text-xs font-semibold text-brand-amber tracking-wide">
                    PromptWarsNoida 2026 · Gen AI Platform
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text leading-tight mb-6">
                  Travel Beyond the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-amber-glow">
                    Tourist Trap
                  </span>
                </h1>

                <p className="text-brand-subtle text-lg leading-relaxed mb-8 max-w-lg">
                  EthnoVibe uses Generative AI to uncover hidden heritage, generate cinematic
                  historical narratives, and connect you with authentic cultural experiences
                  that mass-market platforms will never show you.
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: '📜', label: 'Lore Engine', desc: 'AI historical narratives', color: 'amber' },
                    { icon: '💎', label: 'Hidden Gems', desc: 'Off-beaten-path spots', color: 'teal' },
                    { icon: '🎭', label: 'Cultural Pulse', desc: 'Live local events', color: 'purple' },
                  ].map(({ icon, label, desc, color }) => (
                    <div
                      key={label}
                      className={`rounded-xl p-3 border border-brand-border bg-brand-card/60 text-center hover:border-brand-${color}/40 transition-colors group cursor-default`}
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-xs font-semibold text-brand-text">{label}</div>
                      <div className="text-[10px] text-brand-muted mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-6 text-sm">
                  {[
                    { value: '3', label: 'Live AI Features' },
                    { value: '∞', label: 'Destinations' },
                    { value: '100%', label: 'Real AI streams' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="font-bold text-xl text-brand-amber">{value}</div>
                      <div className="text-xs text-brand-muted">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Login Form */}
              <div className="animate-slide-up">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom feature strip */}
        <div className="border-t border-brand-border bg-brand-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🔒', title: 'Secure AI Routes', desc: 'All AI calls via server-side Edge handlers' },
                { icon: '⚡', title: 'Live Streaming', desc: 'Real-time Gemini Flash token-by-token output' },
                { icon: '🌍', title: 'Global Coverage', desc: 'Any location, any cultural tradition' },
                { icon: '🎯', title: 'Zero Mock Data', desc: '100% live generative responses' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <div className="text-sm font-semibold text-brand-text">{title}</div>
                  <div className="text-xs text-brand-muted">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
