import { connect } from "@planetscale/database";

import html from "./index.html";

export interface Env {
  PSCALE_USERNAME: string;
  PSCALE_PASSWORD: string;
}

const currentYear = 2022;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const config = {
      host: "aws.connect.psdb.cloud",
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD,
    };

    if (pathname === "/") {
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    } else if (pathname === "/data.json") {
      const conn = connect(config);
      const data = await conn.execute(
        "SELECT constructor_standings.round, race_name, teamId, name, nationality, url, position, points FROM constructor_standings JOIN constructor_teams ON constructor_standings.teamId = constructor_teams.id JOIN constructor_races on (constructor_standings.season = constructor_races.season AND constructor_standings.round = constructor_races.round) where constructor_standings.season = ? order by constructor_standings.round",
        [currentYear]
      );
      const json = JSON.stringify(data.rows);

      return new Response(json, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } else {
      return new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }
  },

  // Grabs latest F1 standings from the API and writes them to the database.
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const config = {
      host: "aws.connect.psdb.cloud",
      username: env.PSCALE_USERNAME,
      password: env.PSCALE_PASSWORD,
    };

    const conn = connect(config);

    // Update or create team information
    const teams = await getJSON(
      `https://ergast.com/api/f1/${currentYear}/constructors.json`
    );
    for (const team of teams.MRData.ConstructorTable.Constructors) {
      await conn.execute(
        "INSERT INTO constructor_teams (id, name, nationality, url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = ?",
        [
          team.constructorId,
          team.name,
          team.nationality,
          team.url,
          team.constructorId,
        ]
      );
    }

    // Update or create race information
    const races = await getJSON(
      `https://ergast.com/api/f1/${currentYear}.json`
    );
    for (const race of races.MRData.RaceTable.Races) {
      await conn.execute(
        "INSERT INTO constructor_races (season, round, race_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE season = ?, round = ?, race_name = ?",
        [
          race.season,
          race.round,
          race.raceName,
          race.season,
          race.round,
          race.raceName,
        ]
      );
    }

    const latestRoundResp = await conn.execute(
      "SELECT MAX(round) AS max FROM constructor_standings WHERE season = ?",
      [currentYear]
    );
    const latestRound = latestRoundResp.rows[0]
      ? latestRoundResp.rows[0].max
      : 0;
    const nextRound = latestRound + 1;

    // Try to get standings for the next round, if any we write to the DB
    const resp = await getJSON(
      `https://ergast.com/api/f1/${currentYear}/${nextRound}/constructorStandings.json`
    );

    if (resp.MRData.StandingsTable.StandingsLists.length > 0) {
      resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.forEach(
        async (standing) => {
          await conn.execute(
            "INSERT INTO constructor_standings (season, round, teamId, position, wins, points) VALUES (?, ?, ?, ?, ?, ?)",
            [
              currentYear,
              nextRound,
              standing.Constructor.constructorId,
              standing.position,
              standing.wins,
              standing.points,
            ]
          );
        }
      );
    }
  },
};

async function getJSON(url: string) {
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  const response = await fetch(url, init);
  return JSON.parse(JSON.stringify(await response.json()));
}
