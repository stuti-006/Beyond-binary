/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#080b0f',       // Darker base depth layer behind floating panels
          card: '#0d1117',     // Panel card background
          panel: '#121720',    // Inner container fill
          surface: '#161b22',  // Surface elements
          border: '#212836',   // High-precision border
          text: '#f0f4f8',     // High-legibility text
          dim: '#8b949e',      // Subdued text
          muted: '#484f58',    // Muted text
        },
        build: {
          DEFAULT: '#e8590c',
          glow: 'rgba(232, 89, 12, 0.45)',
          dim: 'rgba(232, 89, 12, 0.12)',
          border: 'rgba(232, 89, 12, 0.45)',
        },
        partner: {
          DEFAULT: '#1971c2',
          glow: 'rgba(25, 113, 194, 0.45)',
          dim: 'rgba(25, 113, 194, 0.12)',
          border: 'rgba(25, 113, 194, 0.45)',
        },
        hybrid: {
          DEFAULT: '#2f9e44',
          glow: 'rgba(47, 158, 68, 0.45)',
          dim: 'rgba(47, 158, 68, 0.12)',
          border: 'rgba(47, 158, 68, 0.45)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-build': '0 0 20px -2px rgba(232, 89, 12, 0.5), 0 0 8px 0 rgba(232, 89, 12, 0.3)',
        'glow-partner': '0 0 20px -2px rgba(25, 113, 194, 0.5), 0 0 8px 0 rgba(25, 113, 194, 0.3)',
        'glow-hybrid': '0 0 20px -2px rgba(47, 158, 68, 0.5), 0 0 8px 0 rgba(47, 158, 68, 0.3)',
        'terminal': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
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
