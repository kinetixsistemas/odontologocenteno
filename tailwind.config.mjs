/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#BFB2C3',
        secondary: '#736B75',
        background: '#F8E7FD',
        surface: '#FFFFFF',
        border: '#E8DCEB',
      },
      fontFamily: {
        heading: ['"Prestigious"', '"Bodoni Moda"', 'serif'],
        body: ['"Montserrat"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
      },
      boxShadow: {
        subtle: '0 8px 24px rgba(115, 107, 117, 0.08)',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};
