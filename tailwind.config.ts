import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0d0f14',
          surface: '#141720',
          card: '#1a1e2e',
          border: '#252a3d',
          amber: '#f59e0b',
          'amber-glow': '#fbbf24',
          teal: '#14b8a6',
          'teal-glow': '#2dd4bf',
          purple: '#8b5cf6',
          muted: '#6b7280',
          text: '#e2e8f0',
          subtle: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.06) 0%, transparent 60%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(26,30,46,0.9) 0%, rgba(20,23,32,0.95) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(245,158,11,0.25)',
        'glow-teal': '0 0 20px rgba(20,184,166,0.25)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
      },
    },
  },
  plugins: [],
};

export default config;
