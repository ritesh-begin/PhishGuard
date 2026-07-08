/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leapRed: '#E2231A',
        leapDark: '#111111',
        leapMuted: '#6B7280',
        leapSoft: '#F7F7F7',
        threatSafe: '#22c55e', // green-500
        threatLow: '#eab308', // yellow-500
        threatMedium: '#f97316', // orange-500
        threatHigh: '#ef4444', // red-500
      },
      boxShadow: {
        soft: '0 18px 50px rgba(17, 17, 17, 0.10)',
      },
    },
  },
  plugins: [],
}
