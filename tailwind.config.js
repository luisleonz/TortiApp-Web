/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#B5740F',
          50: '#FDF8EE',
          100: '#F7E8C9',
          200: '#EAD3A2',
          300: '#D4A96A',
          400: '#C8861F',
          500: '#B5740F',
          600: '#8A5A0C',
          700: '#6B4209',
          800: '#4D2F06',
          900: '#2E1C03',
        },
        brown: {
          DEFAULT: '#7A4A1E',
          50: '#FBF6EF',
          100: '#ECE0D2',
          200: '#D4B898',
          300: '#B8895A',
          400: '#9A6330',
          500: '#7A4A1E',
          600: '#6B3F18',
          700: '#4F2E11',
          800: '#351E0B',
          900: '#1C1005',
        },
        cream: {
          DEFAULT: '#F7F2E7',
          50: '#FDFCF8',
          100: '#F7F2E7',
          200: '#EBE3D2',
          300: '#D9CEB8',
          400: '#C4B396',
          500: '#AD9573',
          600: '#917551',
          700: '#6E5A3A',
          800: '#4A3D27',
          900: '#261F14',
        },
        ink: {
          DEFAULT: '#2B2218',
          2: '#6E614C',
          3: '#9C8E78',
        },
        stage: '#E7DECC',
        surface: '#FFFFFF',
        'surface-2': '#F5EFE3',
        line: '#EBE3D2',
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        field: '12px',
        btn: '12px',
      },
      minHeight: {
        touch: '44px',
      },
      height: {
        touch: '44px',
        'touch-lg': '52px',
      },
    },
  },
  plugins: [],
}
