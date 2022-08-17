export type Race = {
  id: number
  season: number
  round: number
  race_name: string
  date: string
}

export type Standing = {
  season: number
  teamId: string
  name: string
  position: number
  points: number
  wins: number
}

export type RaceResult = {
  name: string
  nationality: string
  points: number
  position: number
  race_name: string
  round: number
  teamId: string
  url: string
}

export type RaceData = {
  races: Race[]
  results: RaceResult[]
  standings: Standing[]
}

export type Constructor = {
  name: string
  points: any[]
  id: string
}
