/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0f',
          darker: '#050508',
          card: '#12121a',
          border: '#1f1f2e',
          gold: '#FFD700',
          'gold-glow': 'rgba(255, 215, 0, 0.2)',
          emerald: '#10B981',
          'emerald-glow': 'rgba(16, 185, 129, 0.2)',
          rose: '#F43F5E',
          'rose-glow': 'rgba(244, 63, 94, 0.2)',
          cyan: '#06B6D4',
          'cyan-glow': 'rgba(6, 182, 212, 0.2)',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
};
