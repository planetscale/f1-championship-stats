## local dev

Install wranger:
```
npm install -g wrangler
```

To run the app locally

```
wrangler dev
```

Once that starts, hit `l` to start `local mode`. Then to trigger the cron, you can run: `curl http://localhost:8787/cdn-cgi/mf/scheduled`
