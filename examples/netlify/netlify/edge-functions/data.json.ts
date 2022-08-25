import type { Context } from 'https://edge.netlify.com'
import { connect } from 'https://unpkg.com/@planetscale/database@^1.1'

const CURRENT_YEAR = 2022

export default async function handler(req: Request, context: Context) {
  const conn = connect({ url: Deno.env.get('DATABASE_URL') })

  const [resultsData, raceData, standingsData] = await Promise.all([
    conn.execute(
      'SELECT constructor_standings.round, race_name, teamId, name, nationality, url, position, points FROM constructor_standings JOIN constructor_teams ON constructor_standings.teamId = constructor_teams.id JOIN constructor_races on (constructor_standings.season = constructor_races.season AND constructor_standings.round = constructor_races.round) where constructor_standings.season = ? order by constructor_standings.round',
      [CURRENT_YEAR]
    ),
    conn.execute('SELECT * FROM constructor_races WHERE season = ?', [CURRENT_YEAR]),
    conn.execute(
      'SELECT constructor_standings.season, teamId, name, position, points, wins FROM constructor_standings JOIN constructor_teams on (constructor_standings.teamId = constructor_teams.id) WHERE season = ? and round = (select max(round) from constructor_standings where season = ?) order by position',
      [CURRENT_YEAR, CURRENT_YEAR]
    )
  ])

  const data = { races: raceData.rows, results: resultsData.rows, standings: standingsData.rows }
  const json = JSON.stringify(data)

  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*'
    }
  })
}
