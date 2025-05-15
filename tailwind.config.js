/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' based on user preference
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        miami: {
          pink: 'var(--miami-pink)',
          blue: 'var(--miami-blue)',
          yellow: 'var(--miami-yellow)',
          green: 'var(--miami-green)',
          purple: 'var(--miami-purple)',
        },
      },
      ringColor: {
        // Explicitly extend ring colors to include miami colors
        'miami-pink': 'var(--miami-pink)',
        'miami-blue': 'var(--miami-blue)',
        'miami-yellow': 'var(--miami-yellow)',
        'miami-green': 'var(--miami-green)',
        'miami-purple': 'var(--miami-purple)',
      },
      borderColor: {
        // Explicitly extend border colors to include miami colors
        'miami-pink': 'var(--miami-pink)',
        'miami-blue': 'var(--miami-blue)',
        'miami-yellow': 'var(--miami-yellow)',
        'miami-green': 'var(--miami-green)',
        'miami-purple': 'var(--miami-purple)',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'miami-gradient': 'linear-gradient(to right, var(--miami-pink), var(--miami-blue))',
        'miami-gradient-diagonal': 'linear-gradient(135deg, var(--miami-pink), var(--miami-blue))',
      },
    },
  },
  plugins: [],
}; 