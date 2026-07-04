'use client';

// src/components/NavBar.tsx

import Link from 'next/link';
import { useState } from 'react';

interface NavBarProps {
  isLoggedIn?: boolean;
  userRole?: 'admin' | 'user' | null;
  onLogout?: () => void;
}

export default function NavBar({ isLoggedIn = false, userRole = null, onLogout }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🗺️</span>
            <span className="font-display font-bold text-xl text-brand-text group-hover:text-brand-amber transition-colors">
              Ethno<span className="text-brand-amber">Vibe</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-brand-subtle hover:text-brand-amber text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {userRole === 'admin' && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
                    ⚡ Evaluator
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="text-sm text-brand-subtle hover:text-brand-text transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className="px-4 py-1.5 rounded-full text-sm font-semibold border border-brand-amber/50 text-brand-amber hover:bg-brand-amber hover:text-brand-bg transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-brand-subtle hover:text-brand-text"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-brand-border bg-brand-surface px-4 py-4 flex flex-col gap-3">
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-brand-subtle hover:text-brand-amber text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => { onLogout?.(); setMenuOpen(false); }}
              className="text-left text-sm text-brand-subtle hover:text-brand-text"
            >
              Sign out
            </button>
          ) : (
            <Link href="/" className="text-sm text-brand-amber font-semibold">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
