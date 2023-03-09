const CONSTRUCTOR_COLOR = {
  alfa: '#A32F3C',
  alphatauri: '#587B98',
  alpine: '#4891CC',
  aston_martin: '#46806E',
  ferrari: '#ED1D25',
  haas: '#B7B9BC',
  mclaren: '#E6863B',
  mercedes: '#6BD4BF',
  red_bull: '#2F5ABF',
  williams: '#63BBD9'
}

export function constructorColor(constructorId: string): string {
  return CONSTRUCTOR_COLOR[constructorId]
}

const CIRCUIT_NAME = {
  'Bahrain Grand Prix': 'Bahrain',
  'Saudi Arabian Grand Prix': 'Jeddah',
  'Australian Grand Prix': 'Melbourne',
  'Emilia Romagna Grand Prix': 'Imola',
  'Miami Grand Prix': 'Miami',
  'Spanish Grand Prix': 'Catalunya',
  'Monaco Grand Prix': 'Monaco',
  'Azerbaijan Grand Prix': 'Baku',
  'Canadian Grand Prix': 'Montreal',
  'British Grand Prix': 'Silverstone',
  'Austrian Grand Prix': 'Spielberg',
  'French Grand Prix': 'Paul Ricard',
  'Hungarian Grand Prix': 'Hungaroring',
  'Belgian Grand Prix': 'Spa',
  'Dutch Grand Prix': 'Zandvort',
  'Italian Grand Prix': 'Monza',
  'Singapore Grand Prix': 'Marina Bay',
  'Japanese Grand Prix': 'Suzuka',
  'United States Grand Prix': 'Austin',
  'Mexico City Grand Prix': 'Mexico City',
  'Brazilian Grand Prix': 'Sao Paulo',
  'Abu Dhabi Grand Prix': 'Yas Marina',
  'Qatar Grand Prix': 'Qatar',
  'São Paulo Grand Prix': 'Sao Paulo',
  'Las Vegas Grand Prix': 'Las Vegas',
}

export function circuitName(raceName: string): string {
  const name = CIRCUIT_NAME[raceName]
  if (name) {
    return name
  } else {
    console.error(raceName)
    console.error("Circuit name not found, update utils/detail.ts")
    return raceName
  }
}
