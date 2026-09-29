import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#dc2626',
          darkred: '#991b1b',
          glow: '#ef4444',
          black: '#09090b',
          surface: '#121215',
          border: '#27272a',
        },
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontWeight: {
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
      },
    },
  },
  plugins: [],
} satisfies Config;
