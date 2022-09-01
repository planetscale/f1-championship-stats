# F1 Stats on Fastly Compute@Edge

This is an example data source to retrieve our dataset using Fastly Compute@Edge.

## Notable things about Fastly Compute@Edge

- Fastly Compute@Edge runs WebAssembly, which means any language that can compile to WebAssembly could be used.
- We are using their [JavaScript SDK](https://github.com/fastly/js-compute-runtime/) which is based on SpiderMonkey (the JavaScript engine used in Firefox).
- We are using a Fastly Edge Dictionary to store the PlanetScale database credentials.

## Setup

1. Run `npm install`
2. Run `npm run dev` to start the app locally.
3. Run `npm run deploy` to deploy to Fastly.
4. Visit your Fastly Service on `https://manage.fastly.com` to configure the database credentials.
