/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#f5f7fb',
          card: '#ffffff',
          panel: '#f7f9fc',
          surface: '#eef2f8',
          border: '#dfe5ef',
          text: '#172033',
          dim: '#61708a',
          muted: '#94a0b5',
        },
        build: {
          DEFAULT: '#d56b2e',
          glow: 'rgba(213, 107, 46, 0.24)',
          dim: 'rgba(213, 107, 46, 0.10)',
          border: 'rgba(213, 107, 46, 0.35)',
        },
        partner: {
          DEFAULT: '#4169b8',
          glow: 'rgba(65, 105, 184, 0.22)',
          dim: 'rgba(65, 105, 184, 0.10)',
          border: 'rgba(65, 105, 184, 0.32)',
        },
        hybrid: {
          DEFAULT: '#2e8b72',
          glow: 'rgba(46, 139, 114, 0.22)',
          dim: 'rgba(46, 139, 114, 0.10)',
          border: 'rgba(46, 139, 114, 0.32)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-build': '0 12px 28px -14px rgba(213, 107, 46, 0.45)',
        'glow-partner': '0 12px 28px -14px rgba(65, 105, 184, 0.4)',
        'glow-hybrid': '0 12px 28px -14px rgba(46, 139, 114, 0.4)',
        'terminal': '0 18px 40px -24px rgba(23, 32, 51, 0.25)',
      },
      keyframes: {
        busPulse: {
          '0%': { left: '-20%', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { left: '120%', opacity: '0' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'bus-pulse': 'busPulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-slide-up': 'fadeSlideUp 220ms ease-out',
        blink: 'blink 1s step-start infinite',
        ticker: 'tickerScroll 35s linear infinite',
      },
    },
  },
  plugins: [],
}
