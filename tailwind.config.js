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
      red: {
        50: '#fffafa',
        100: '#ffe5e9',
        200: '#fbbfc7',
        300: '#ff909f',
        400: '#ff7082',
        500: '#ff455d',
        600: '#d92038',
        700: '#c11027',
        800: '#8f0718',
        900: '#341418'
      },
      orange: {
        50: '#fff8f3',
        100: '#ffe8d8',
        200: '#ffc59b',
        300: '#fc9c66',
        400: '#fd812d',
        500: '#f35815',
        600: '#b83a05',
        700: '#962d00',
        800: '#672002',
        900: '#3c1403'
      },
      yellow: {
        50: '#fffbe4',
        100: '#fff1a8',
        200: '#fed54a',
        300: '#f2b600',
        400: '#d19f03',
        500: '#a78103',
        600: '#7d5903',
        700: '#5c4716',
        800: '#41320c',
        900: '#281e03'
      },
      green: {
        50: '#effff3',
        100: '#d7fbdf',
        200: '#a9ecb8',
        300: '#75db8c',
        400: '#40d763',
        500: '#27b648',
        600: '#13862e',
        700: '#19652a',
        800: '#10481d',
        900: '#0a2b13'
      },
      blue: {
        50: '#f3fbff',
        100: '#ddf2ff',
        200: '#a9dffe',
        300: '#73c7f9',
        400: '#47b7f8',
        500: '#1e9de7',
        600: '#0b6ec5',
        700: '#144eb6',
        800: '#0e3682',
        900: '#08204e'
      },
      purple: {
        50: '#f9f8ff',
        100: '#eeeaff',
        200: '#d4c9fe',
        300: '#b7a5fb',
        400: '#a18bf5',
        500: '#8467f3',
        600: '#5e49af',
        700: '#4b3990',
        800: '#3e1f75',
        900: '#27124a'
      }
    },
    borderRadius: {
      none: '0',
      px: '1px',
      xs: '2px',
      sm: '4px',
      DEFAULT: '6px',
      md: '8px',
      lg: '10px',
      full: '9999px'
    },
    fontFamily: {
      sans: ['Formula1-Regular', 'sans-serif']
    },
    fontWeight: {
      normal: 400,
      bold: 700
    },
    extend: {
      fontSize: {
        '3xs': '7px',
        '2xs': '8px'
      },
      gridTemplateColumns: {
        21: 'repeat(21, minmax(0, 1fr))',
        22: 'repeat(22, minmax(0, 1fr))'
      },
      opacity: opacity(),
      spacing: spacing()
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
