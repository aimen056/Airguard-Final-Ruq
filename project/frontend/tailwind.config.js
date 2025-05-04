/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navBarbg:'rgba(var(--navbarbg))',
        background:'rgba(var(--background))',
        surfaceColor: 'rgba(var(--surface))',
        primaryText:'rgba(var(--primarytext))',
        secondaryText:'rgba(var(--secondarytext))',
        primaryBtnBg:'rgba(var(--primaryBtnBg))',
        primaryBtnText:'rgba(var(--primaryBtnText))',
        secBtnBg:'rgba(var(--secBtnBg))',
        secBtnText:'rgba(var(--secBtnText))',
        danger:'rgba(var(--danger))',
        success:'rgba(var(--success))',
        aqi: {
          good: "#00E400", // Green
          moderate: "#FFFF00", // Yellow
          unhealthySensitive: "#FF7E00", // Orange
          unhealthy: "#FF0000", // Red
          veryUnhealthy: "#8F3F97", // Purple
          hazardous: "#7E0023", // Maroon
        },
      },
      
    },
  },
  plugins: [],
}