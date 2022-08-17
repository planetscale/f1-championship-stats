# F1 Stats on Netlify Edge Functions

This is an example data source to retrive our dataset using Netlify Edge Functions.

## Notable things about Netlify

- Netlify uses Deno as a runtime, so `database-js` needs to be pulled from a CDN. This can be seen in [data.json.ts](netlify/edge-functions/data.json.ts)
- Netlify requires edge functions to exist under `netlify/edge-functions` subdirectory.

## Setup

1. Run `npm install`
2. Run `npm run dev` to start the app locally.
3. Run `npm run deploy` to deploy to Netlify.
4. Run `./node_modules/.bin/netlify env:set DATABASE_URL ...` to configure the database credential needed.

## Live endpoint

[https://f1-championship-stats.netlify.app/data.json](https://f1-championship-stats.netlify.app/data.json)
