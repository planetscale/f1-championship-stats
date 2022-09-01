## Edge function examples

Each of these edge functions connects to a PlanetScale database via our serverless driver, [`@planetscale/database`](https://github.com/planetscale/database-js), and returns a JSON payload with F1 stats to render the page.

To learn more about how to run each function, visit the subdirectories for each:

- [Cloudflare](https://github.com/planetscale/f1-championship-stats/tree/main/examples/cloudflare)
- [Fastly](https://github.com/planetscale/f1-championship-stats/tree/main/examples/fastly)
- [Netlify](https://github.com/planetscale/f1-championship-stats/tree/main/examples/netlify)
- [Vercel](https://github.com/planetscale/f1-championship-stats/tree/main/examples/vercel)

## PlanetScale Database Schema
Here is the schema used for this app. See the [Cloudflare function](https://github.com/planetscale/f1-championship-stats/tree/main/examples/cloudflare)  for how we populate it with data.

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
