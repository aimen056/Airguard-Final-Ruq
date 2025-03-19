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
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Add the paths to your project files
  theme: {
    extend: {
      animation: {
        slowFade: "slowFade 3s ease-in-out",
        zoomIn: "zoomIn 1.5s ease-out",
        fadeIn: 'fadeIn 1s ease-in-out',
        slideIn: 'slideIn 1s ease-out',
        slideIn1:'slideIn 1s ease-out',
        flipIn: 'flipIn 1s ease-in-out',
        slideLeft: "slideLeft 1s ease-in-out",
        slideRight: "slideRight 1s ease-in-out",
        slideUp: "slideUp 1s ease-in-out",
        loopScroll: 'scrollLoop 20s linear infinite',
      },
      keyframes: {
        slowFade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
      },
      slideIn: {
        '0%': { transform: 'translateX(-100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      slideIn1: { 
        '0%': { transform: 'translateX(100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
    },
    
      flipIn: {
        '0%': {
          transform: 'rotateY(90deg)',
          opacity: '0',
        },
        '100%': {
          transform: 'rotateY(0deg)',
          opacity: '1',
        },
      },
      slideLeft: { "0%": { transform: "translateX(-50px)", opacity: 0 }, "100%": { transform: "translateX(0)", opacity: 1 } },
      slideRight: { "0%": { transform: "translateX(50px)", opacity: 0 }, "100%": { transform: "translateX(0)", opacity: 1 } },
      slideUp: { "0%": { transform: "translateY(50px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } },
      scrollLoop: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-100%)' },
      },
    },
  },
  plugins: [],
}};

