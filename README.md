# Owais Cafe | Grill | Fast Food

A responsive, single-page restaurant site built with Vite, React, GSAP, Lenis and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL (normally `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Free hosting on GitHub Pages

This project is configured to deploy automatically to GitHub Pages. Push the project to a GitHub repository's `main` branch; the included workflow builds the site and publishes `dist`. In the repository, open **Settings → Pages** and set the build source to **GitHub Actions**.

For the account `mittechandsolutions-crypto` and repository `owais-cafe`, the free website address will be:

`https://mittechandsolutions-crypto.github.io/Owais-Cafe/`

The `/account/` page and site assets are built to work under this project URL. A paid custom domain is not required. Google may take days or weeks to index a new site, and appearing in search results is not guaranteed; after deployment, the owner can use Google Search Console for free to request indexing.

## Owner updates

- Edit business details, dish names, descriptions, categories, and sample PKR prices in `src/data.js`.
- Replace the royalty-free sample photography in `public/images/` with Owais Cafe’s real photos; keep the filenames or update the matching image fields in `src/data.js`.
- Verify the map pin, actual opening hours, menu prices, and current availability before publishing. Menu prices shown are illustrative.
- Add the restaurant’s actual social profile URL in the footer when available.
- Customer accounts are a browser-only demo; they do not provide secure online authentication or sync data across devices. Orders placed on WhatsApp are not saved to the site.
