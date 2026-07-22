/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        ink: '#0F172A',
        felt: '#1E293B',
        rail: '#334155',
        chalk: '#F8FAFC',
        sage: '#94A3B8',
        leaf: '#10B981',
        strike: '#EF4444',
      },
    },
  },
  plugins: [],
};
