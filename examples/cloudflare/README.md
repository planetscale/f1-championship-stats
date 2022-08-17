# F1 Stats on Cloudflare Workers
This is an example Cloudflare Worker that connects to a PlanetScale database to update and retrieve Formula 1 stats.
It has two parts: a `cron` that runs to update the database with stats. And a `data.json` endpoint that serves the stats up in JSON format.

## Setup
1. Run `npm install`.
2. Create a PlanetScale database to store the stats. Add the schema shown below.
3. Enroll your new database in the **PlanetScale serverless driver for JavaScript** beta (under your database's **Settings** > **Beta features** section).
3. Create a PlanetScale password and add the new credentials as secrets:
- `npx wrangler secret put PSCALE_HOST`
- `npx wrangler secret put PSCALE_PASSWORD`
- `npx wrangler secret put PSCALE_USERNAME`
4. Run `npx wrangler dev` to start the app.

### Running the cron
1. To connect to the database when running the app locally you'll need to add the connection details to your environment. One way to do this is to add them to `wrangler.toml`, just be sure not to check them in to your Git repo.
  ```
  [vars]
  PSCALE_USERNAME = "USERNAME"
  PSCALE_PASSWORD = "PASSWORD"
  PSCALE_HOST = “REGION.connect.psdb.cloud”
  ```
2. Run `npx wrangler dev`
3. Press `L` for local mode
4. Run `curl http://localhost:8787/cdn-cgi/mf/scheduled`

This will execute the cron job and sync F1 stats data to your database.

## Data.json endpoint
This endpoint is used by the frontend app to display the F1 statistics. It queries the PlanetScale database and returns the data in JSON format.
The code for this endpoint is [here](https://github.com/planetscale/f1-championship-stats/blob/main/examples/cloudflare/src/index.ts#L12).

## Cron job
Every hour on Sundays a cron will run to sync data from the Ergast F1 API and store it in the PlanetScale database.

The cron schedule is defined in `wrangler.toml` and the code is [here](https://github.com/planetscale/f1-championship-stats/blob/main/examples/cloudflare/src/index.ts#L51). 

## Database Schema
Here is the schema used for this app.

```sql
CREATE TABLE `constructor_races` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `season` int NOT NULL,
  `round` int NOT NULL,
  `race_name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `season` (`season`, `round`, `race_name`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE `constructor_standings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `season` int NOT NULL,
  `round` int NOT NULL,
  `teamId` varchar(32) NOT NULL,
  `position` int NOT NULL,
  `wins` int NOT NULL,
  `points` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `season` (`season`, `round`, `teamId`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE `constructor_teams` (
  `id` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nationality` varchar(100) NOT NULL,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_0900_ai_ci;
```
