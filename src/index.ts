import { connect } from '@planetscale/database'

import html from "./index.html"

export interface Env { }

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const config = {
      host: 'aws.connect.psdb.cloud',
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD,
    }

    if (pathname === '/') {
      return new Response(html, {
        headers: {'Content-Type': 'text/html'}
      })
    } else if (pathname === '/data.json') {
      const conn = await connect(config)
      const data = await conn.execute('SELECT round, teamId, name, nationality, url, position, points FROM constructor_standings JOIN constructor_teams on constructor_standings.teamId = constructor_teams.id where season = ?', [2022])
      const json = JSON.stringify(data.rows)

      return new Response(json, {
        headers: {'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*'}
      })
    } else {
      return new Response("Not Found", {
        status: 404,
        headers: {'Content-Type': 'text/html'}
      })
    }
  },

  // Grabs latest F1 standings from the API and writes them to the database.
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const config = {
      host: 'aws.connect.psdb.cloud',
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD,
    }

    const currentYear = 2022
    const conn = await connect(config)

    const teams = await getJSON('https://ergast.com/api/f1/' + currentYear + '/constructors.json')

    for (const team of teams.MRData.ConstructorTable.Constructors) {
      // update or create the database with team data
      await conn.execute('INSERT INTO constructor_teams (id, name, nationality, url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = ?', [team.constructorId, team.name, team.nationality, team.url, team.constructorId])
    }

    const latestRoundResp = await conn.execute('select max(round) as max from constructor_standings where season = ?', [currentYear])
    const latestRound = latestRoundResp.rows[0] ? latestRoundResp.rows[0].max : 0
    const nextRound = latestRound + 1

    // Try to get standings for the next round, if any we write to the DB
    const resp = await getJSON(`https://ergast.com/api/f1/${currentYear}/${nextRound}/constructorStandings.json`)

    if (resp.MRData.StandingsTable.StandingsLists.length > 0) {
      resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(async (standing) => {
        await conn.execute(
          'INSERT INTO constructor_standings (season, round, teamId, position, wins, points) values (?, ?, ?, ?, ?, ?)',
          [currentYear, nextRound, standing.Constructor.constructorId, standing.position, standing.wins, standing.points]
        )
      })
    }
  },
}

async function getJSON(url: string) {
  const init = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  };
  const response = await fetch(url, init)
  return JSON.parse(JSON.stringify(await response.json()))
}
