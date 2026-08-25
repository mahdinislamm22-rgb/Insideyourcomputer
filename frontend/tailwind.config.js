/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        head: ['Chivo', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#050508',
        obsidian: '#0C0E12',
        obsidian2: '#131720',
        signal: '#00F0FF',
        amber2: '#FF9D00',
        phosphor: '#00FF66',
        laser: '#FF2A55',
        slate2: '#94A3B8',
        muted2: '#64748B',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'flow-dash': { to: { strokeDashoffset: '-24' } },
        'marquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-soft': { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        'scan': { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        'blink': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'float-y': { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-14px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flow-dash': 'flow-dash 1.2s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'scan': 'scan 9s linear infinite',
        'blink': 'blink 1.1s steps(1) infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
