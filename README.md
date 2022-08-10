## local dev

Install wranger:

```
npm install -g wrangler
```

To run the app locally you'll need to create credentials for your PlanetScale database and set them as secrets.

Set your PSCALE credential secrets.

```
wrangler secret put PSCALE_USERNAME
wrangler secret put PSCALE_PASSWORD
wrangler secret put PSCALE_HOST
```

```
wrangler dev
```

Once that starts, hit `l` to start `local mode`. Then to trigger the cron, you can run: `curl http://localhost:8787/cdn-cgi/mf/scheduled`

## Production (CloudFlare)

```
wrangler publish
```
