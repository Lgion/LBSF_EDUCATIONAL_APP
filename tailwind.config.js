/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'primary': '#2E7D32',    // Vert nature
        'secondary': '#795548',   // Brun terre
        'accent': '#1976D2',     // Bleu professionnel
        'success': '#81C784',    // Vert clair
        'warning': '#FB8C00',    // Orange
        'error': '#D32F2F',      // Rouge
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'h1': '2.5rem',
        'h2': '2rem',
        'h3': '1.75rem',
        'body': '1rem',
        'caption': '0.875rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '8px',
      },
      padding: {
        'card': '16px',
      },
    },
  },
  plugins: [],
}
