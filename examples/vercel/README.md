# F1 Stats on Vercel Edge Functions

This is an example data source to retrieve our dataset using Vercel Edge Functions.

## Notable things about Vercel Edge Functions

- Vercel requires functions to be nested under `/api/` which ends up being a part of the URL.

## Setup

1. Run `npm install`
2. Run `npm run deploy` to deploy to Vercel, there is no way to run locally.
3. Configure a `DATABASE_URL` environment variable in Vercel for the application to use.

## Live endpoint

[https://f1-championship-stats-workers.preview.planetscale.com/api/data.json](https://f1-championship-stats-workers.preview.planetscale.com/api/data.json)
