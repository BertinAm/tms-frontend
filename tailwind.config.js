/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: '#f0f0ff',
          50: '#e6e6ff',
          100: '#ccccff',
          200: '#9999ff',
          300: '#6666ff',
          400: '#3333ff',
          500: '#0000ff',
          600: '#0000cc',
          700: '#000099',
          800: '#000066',
          900: '#000033',
          950: '#000019',
        },
        secondary: {
          25: '#fffef0',
          50: '#fffde6',
          100: '#fffccc',
          200: '#fff999',
          300: '#fff666',
          400: '#fff333',
          500: '#fef736',
          600: '#fef500',
          700: '#fef200',
          800: '#feef00',
          900: '#feec00',
          950: '#fee900',
        },
        neutral: {
          25: '#fafafa',
          50: '#f5f5f5',
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#bdbdbd',
          400: '#9e9e9e',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#212121',
          900: '#121212',
          950: '#0a0a0a',
        }
      },
      fontFamily: {
        'google-sans': ['Google Sans Code', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 0, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 0, 255, 0.6)'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 0, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 0, 255, 0.4)',
        'yellow-glow': '0 0 20px rgba(254, 247, 54, 0.3)',
      }
    },
  },
  plugins: [],
} 