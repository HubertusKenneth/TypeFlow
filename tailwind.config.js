/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#000000',      // <-- HITAM PEKAT
          surface: '#0a0a0a', // <-- HITAM SANGAT GELAP (Hampir pekat)
          text: '#e4e4e7',
          muted: '#71717a',
          accent: '#22d3ee',  // Biarkan cyan jika tetap ingin aksen teksnya menyala
          correct: '#4ade80',
          error: '#f87171',
          cursor: '#22d3ee',
        },
        light: {
          bg: '#fafafa',
          surface: '#f4f4f5',
          text: '#18181b',
          muted: '#71717a',
          accent: '#0891b2',
          correct: '#16a34a',
          error: '#dc2626',
          cursor: '#0891b2',
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1s step-end infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'caret-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};