/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── 新调性：深夜 · 酒红 · 铜金 ── */
        ink: '#0A0607',
        surface: '#120D0F',
        raised: '#1B1416',
        line: '#2A1E21',
        muted: '#A08F91',
        cream: '#F6EBE0',
        blush: '#E9A9A1',
        copper: '#C08A5C',
        wine: '#7C1B2C',
        wineDeep: '#4A0E1A',

        /* 兼容旧 token（组件里还在用），值已换成暖色 */
        brand: '#7C1B2C',
        brand2: '#C08A5C',
        accent: '#E9A9A1',
        mint: '#E7C79B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'sans-serif'],
        display: ['"Noto Serif SC"', '"Songti SC"', 'SimSun', 'Georgia', 'serif'],
        latin: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 30px 90px -34px rgba(124,27,44,0.85)',
        ember: '0 40px 120px -50px rgba(150,40,52,0.95)',
        panel: '0 24px 80px -24px rgba(0,0,0,0.92)',
        device: '0 50px 130px -34px rgba(0,0,0,0.95)',
        warm: '0 20px 60px -30px rgba(192,138,92,0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          '0%': { opacity: '0', transform: 'translateY(36px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'heart-pop': {
          '0%': { opacity: '0', transform: 'scale(0.4) rotate(-12deg)' },
          '35%': { opacity: '1', transform: 'scale(1.22) rotate(4deg)' },
          '100%': { opacity: '0', transform: 'scale(1.75) rotate(8deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-9px)' },
        },
        'ping-soft': {
          '0%': { opacity: '0.55', transform: 'scale(0.9)' },
          '80%, 100%': { opacity: '0', transform: 'scale(1.7)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.03) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.12) translate3d(-1.5%,-2%,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'sheet-up': 'sheet-up 0.34s cubic-bezier(0.22,1,0.36,1) both',
        'pop-in': 'pop-in 0.38s cubic-bezier(0.22,1,0.36,1) both',
        'heart-pop': 'heart-pop 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        float: 'float 6s ease-in-out infinite',
        'ping-soft': 'ping-soft 2.4s cubic-bezier(0,0,0.2,1) infinite',
        'spin-slow': 'spin-slow 9s linear infinite',
        'ken-burns': 'ken-burns 22s ease-out both',
      },
    },
  },
  plugins: [],
}
