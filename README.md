# F1 Championship Stats
See how your favorite F1 team is progressing in the Constructors Championship. All data served from the Edge.

## How it works
All of the data for this application is returned from "the edge". This means the code is executing in the data center nearest to you, reducing the latency of the request.
Each of these workers connects to a PlanetScale database via [`@planetscale/database`](https://github.com/planetscale/database-js) and returns a JSON payload with F1 stats to render the page.
You can use these as examples for how to start using your PlanetScale database from an edge worker.

The frontend application is a Next.js app running on Vercel.

## Local development
To run the frontend (UI).

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Edge workers
To learn more about how to run each worker, visit the subdirectories for each.

- [Cloudflare](https://github.com/planetscale/f1-championship-stats/tree/main/workers/cloudflare)
- [Netlify](https://github.com/planetscale/f1-championship-stats/tree/main/workers/netlify)
- [Vercel](https://github.com/planetscale/f1-championship-stats/tree/main/workers/vercel)

