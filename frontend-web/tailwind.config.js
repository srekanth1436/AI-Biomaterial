/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f4f6ff',
          100: '#e5ebff',
          200: '#ccd8ff',
          300: '#a3bcff',
          400: '#7594ff',
          500: '#4768ff',
          600: '#2b44f2',
          700: '#1e32d6',
          800: '#1a2ba8',
          900: '#192885',
        },
        surface: {
          dark: '#0B0F19',
          light: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.05)',
          glassLight: 'rgba(255, 255, 255, 0.6)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-dark': 'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0) 0px, transparent 50%)',
        'mesh-light': 'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
