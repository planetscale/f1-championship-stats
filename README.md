# F1 Championship Stats 🏎 
See how your favorite F1 team is progressing in the Constructors Championship using the PlanetScale serverless driver for JavaScript and edge functions.

<img width="1279" alt="CleanShot 2022-08-17 at 14 03 04@2x" src="https://user-images.githubusercontent.com/1648941/185232983-d27c0dd8-a070-4c16-9fc8-440acd9dfc63.png">

## How it works
All of the data for this application is returned through edge functions from various providers (Cloudflare Workers, Vercel Edge Functions, Netlify Edge Functions). Read more about the benefits of the PlanetScale serverless driver for JavaScript and the next generation of PlanetScale infrastruction in [our latest blog post](https://planetscale.com/blog/introducing-planetscale-serverless-driver-for-javascript). 

Each of these edge functions connects to a PlanetScale database via our serverless driver, [`@planetscale/database`](https://github.com/planetscale/database-js), and returns a JSON payload with F1 stats to render the page.

You can use these as examples for how to start using your PlanetScale database from an edge function.

The frontend application is a Next.js app running on Vercel.

## Local development
To run the frontend (UI).

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Edge functions
To learn more about how to run each function, visit the subdirectories for each:

- [Cloudflare](https://github.com/planetscale/f1-championship-stats/tree/main/examples/cloudflare)
- [Vercel](https://github.com/planetscale/f1-championship-stats/tree/main/examples/vercel)
- [Netlify](https://github.com/planetscale/f1-championship-stats/tree/main/examples/netlify)

## License

The project is available as open source under the terms of the [Apache-2.0 license](https://github.com/planetscale/f1-championship-stats/blob/main/LICENSE).
