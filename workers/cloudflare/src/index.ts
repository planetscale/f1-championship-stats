import { connect, Connection, ExecutedQuery } from '@planetscale/database'

export interface Env {
  PSCALE_HOST: string
  PSCALE_USERNAME: string
  PSCALE_PASSWORD: string
}

const currentYear = 2022

const Worker = {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    const config = {
      host: env.PSCALE_HOST,
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD
    }

    if (pathname === '/data.json') {
      const conn = connect(config)
      const [standingsData, raceData] = await Promise.all([
        conn.execute(
          'SELECT constructor_standings.round, race_name, teamId, name, nationality, url, position, points FROM constructor_standings JOIN constructor_teams ON constructor_standings.teamId = constructor_teams.id JOIN constructor_races on (constructor_standings.season = constructor_races.season AND constructor_standings.round = constructor_races.round) where constructor_standings.season = ? order by constructor_standings.round',
          [currentYear]
        ),
        conn.execute('SELECT * FROM constructor_races WHERE season = ?', [currentYear])
      ])

      const data = { races: raceData.rows, standings: standingsData.rows }
      const json = JSON.stringify(data)

      return new Response(json, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } else {
      return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      })
    }
  },

  // Grabs latest F1 standings from the Ergast API and writes them to the database.
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const config = {
      host: env.PSCALE_HOST,
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD
    }

    const conn = connect(config)

    // Update or create team and race information
    const [teams, races] = await Promise.all([
      getJSON(`https://ergast.com/api/f1/${currentYear}/constructors.json`),
      getJSON(`https://ergast.com/api/f1/${currentYear}.json`)
    ])

    await Promise.all(teams.MRData.ConstructorTable.Constructors.map((team: any) => saveTeam(conn, team)))
    await Promise.all(races.MRData.RaceTable.Races.map((race: any) => saveRace(conn, race)))

    const latestRoundResp = await conn.execute('SELECT MAX(round) AS max FROM constructor_standings WHERE season = ?', [
      currentYear
    ])
    const latestRound = Number(latestRoundResp.rows[0]?.max ?? 0)
    const nextRound = latestRound + 1

    // Try to get standings for the next round, if any we write to the DB
    const resp = await getJSON(`https://ergast.com/api/f1/${currentYear}/${nextRound}/constructorStandings.json`)

    if (resp.MRData.StandingsTable.StandingsLists.length > 0) {
      resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(async (standing) => {
        await conn.execute(
          'INSERT INTO constructor_standings (season, round, teamId, position, wins, points) VALUES (?, ?, ?, ?, ?, ?)',
          [
            currentYear,
            nextRound,
            standing.Constructor.constructorId,
            standing.position,
            standing.wins,
            standing.points
          ]
        )
      })
    }
  }
}

async function saveTeam(conn: Connection, team: any): Promise<ExecutedQuery> {
  return conn.execute(
    'INSERT INTO constructor_teams (id, name, nationality, url) VALUES (:constructorId, :name, :nationality, :url) ON DUPLICATE KEY UPDATE id = :constructorId',
    team
  )
}

async function saveRace(conn: Connection, race: any): Promise<ExecutedQuery> {
  return conn.execute(
    'INSERT INTO constructor_races (season, round, race_name, date) VALUES (:season, :round, :raceName, :date) ON DUPLICATE KEY UPDATE season = :season, round = :round, race_name = :raceName, date = :date',
    race
  )
}

async function getJSON(url: string) {
  const init = {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }
  const response = await fetch(url, init)
  return JSON.parse(JSON.stringify(await response.json()))
}

export default Worker
