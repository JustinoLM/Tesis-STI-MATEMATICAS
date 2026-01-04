/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizables por narrativa
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      screens: {
        // Breakpoints tablet-first
        'xs': '480px',
        'sm': '768px',   // Tablets pequeñas
        'md': '1024px',  // Tablets grandes
        'lg': '1280px',  // Laptops
        'xl': '1920px',  // Desktops
      },
    },
  },
  plugins: [],
}
