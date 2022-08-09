import { connect } from '@planetscale/database'

const config = {
  host: 'aws.connect.psdb.cloud',
  username: '3am0d4n5iphbtckvthwm',
  password: 'pscale_pw_34w3GIrFwKMXoHED5MyU3ibDFIoxztR6re4AooU0t5b',
}

export interface Env { }

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		// TODO:
		// - if request.url.pathname === '/', return the html page showing the graph
		// - if request.url.pathname === '/data.json', return the data for the graph in JSON
		return new Response("hi mike", {
			headers: {'Content-Type': 'text/html'}
		})
	},

	// Grabs latest F1 standings from the API and writes them to the database.
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		const currentYear = 2022
		const conn = await connect(config)
		const latestRoundResp = await conn.execute(`select max(round) as max from constructor_standings where season = 2022;`)
		const latestRound = latestRoundResp.rows[0].max
		const nextRound = latestRound + 1

		// Try to get standings for the next round, if any we write to the DB
		const resp = await getJSON(`https://ergast.com/api/f1/${currentYear}/${nextRound}/constructorStandings.json`)

		if (resp.MRData.StandingsTable.StandingsLists.length > 0) {
			resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(async (standing) => {
				await conn.execute(`INSERT INTO constructor_standings (season, round, teamId, position, wins, points) values (${season}, ${round}, '${standing.Constructor.constructorId}', ${standing.position}, ${standing.wins}, ${standing.points})`)
			}
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

