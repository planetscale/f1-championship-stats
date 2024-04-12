const CONSTRUCTOR_COLOR = {
  alpine: '#FF87BC',
  aston_martin: '#229971',
  ferrari: '#E8002D',
  haas: '#B6BABD',
  mclaren: '#FF8000',
  mercedes: '#27F4D2',
  rb: '#6692FF',
  red_bull: '#3671C6',
  sauber: '#52E252',
  williams: '#64C4FF'
}

export function constructorColor(constructorId: string): string {
  return CONSTRUCTOR_COLOR[constructorId]
}

const CONSTRUCTOR_NAME = {
  alpine: 'Alpine',
  aston_martin: 'Aston Martin',
  ferrari: 'Ferrari',
  haas: 'Haas',
  mclaren: 'McLaren',
  mercedes: 'Mercedes',
  rb: 'VCARB',
  red_bull: 'Red Bull',
  sauber: 'Kick Sauber',
  williams: 'Williams'
}

export function constructorName(constructorId: string): string {
  return CONSTRUCTOR_NAME[constructorId]
}

const CIRCUIT_NAME = {
  'Bahrain Grand Prix': 'Bahrain',
  'Chinese Grand Prix': 'Shanghai',
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
  'Las Vegas Grand Prix': 'Las Vegas'
}

export function circuitName(raceName: string): string {
  const name = CIRCUIT_NAME[raceName]
  if (name) {
    return name
  } else {
    console.error(raceName)
    console.error('Circuit name not found, update utils/detail.ts')
    return raceName
  }
}
