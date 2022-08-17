const plugin = require('tailwindcss/plugin')

function spacing() {
  const scale = Array(101)
    .fill(null)
    .map((_, i) => [i * 0.5, `${i * 0.5 * 8}px`])
  const values = Object.fromEntries(scale)
  values.px = '1px'
  values.xs = '2px'
  values.sm = '4px'
  return values
}

function opacity() {
  const scale = Array(21)
    .fill(null)
    .map((_, i) => [i * 5, Math.round(i * 0.05 * 100) / 100])
  const values = Object.fromEntries(scale)
  return values
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#fff',
      black: '#000',
      transparent: 'transparent',
      gray: {
        50: '#fafafa',
        100: '#ebebeb',
        200: '#e1e1e1',
        300: '#c1c1c1',
        400: '#a1a1a1',
        500: '#818181',
        600: '#616161',
        700: '#414141',
        800: '#2b2b2b',
        850: '#1a1a1a',
        900: '#111111'
      },
      blue: {
        200: '#a9dffe',
        400: '#47b7f8',
        500: '#1e9de7',
        600: '#0b6ec5',
        800: '#0e3682'
      }
    },
    borderRadius: {
      xs: '2px',
      DEFAULT: '4px'
    },
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif'
      ],
      brand: ['Formula1-Regular', 'sans-serif']
    },
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700
    },
    extend: {
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)'
      },
      borderColor: {
        DEFAULT: 'var(--border-primary)',
        primary: 'var(--border-primary)',
        secondary: 'var(--border-secondary)'
      },
      fontSize: {
        '3xs': '7px',
        '2xs': '8px'
      },
      gridTemplateColumns: {
        21: 'repeat(21, minmax(0, 1fr))',
        22: 'repeat(22, minmax(0, 1fr))'
      },
      opacity: opacity(),
      spacing: spacing(),
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        blue: 'var(--text-blue)'
      },
      zIndex: {
        1: '1'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant }) {
      addVariant('supports-bg-blur', '@supports (backdrop-filter: blur())')
    })
  ]
}
