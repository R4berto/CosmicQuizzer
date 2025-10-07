/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['"Orbitron"', 'system-ui', 'sans-serif'],
      },
      colors: {
        nebula: '#0b1020',
        neon: '#00e5ff',
        neonPink: '#ff00e5',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,229,255,0.5)',
      },
    },
  },
  plugins: [],
}

