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

For the account `mittechandsolutions-crypto` and repository `Owais-Cafe`, the free website address is:

`https://mittechandsolutions-crypto.github.io/Owais-Cafe/`

The `/account/`, `/admin/`, and site assets are built to work under this project URL. A paid custom domain is not required. Google may take days or weeks to index a new site, and appearing in search results is not guaranteed; after deployment, the owner can use Google Search Console for free to request indexing.

## Secure owner dashboard and online orders

The owner dashboard is available at `/admin/`. It uses Supabase Authentication and Postgres row-level security; it is not the browser-only customer demo at `/account/`. Only a verified login for `mittechandsolutions@gmail.com` is authorized by the database policies. The owner creates and controls their own password through Supabase email verification; no password or service-role key belongs in this repository.

To connect a new Supabase project:

1. Create a Supabase project and open its **SQL Editor**.
2. Run `supabase/schema.sql` once in the new, empty project. It creates the menu, order tables, seed menu, row-level security policies, and server-verified order-total function.
3. In **Authentication → URL Configuration**, set the Site URL to `https://mittechandsolutions-crypto.github.io/Owais-Cafe/` and add `https://mittechandsolutions-crypto.github.io/Owais-Cafe/admin/` to the allowed redirect URLs. Keep email verification enabled.
4. Copy the project URL and its public **publishable** (or legacy `anon`) key from Supabase **Project Settings → API**. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are browser-visible public settings; never add a `service_role` or secret key.
5. Push to `main` or run the **Deploy to GitHub Pages** workflow. Once the deploy finishes, open `/admin/`, choose **First time? Set up owner account**, and create the password. Verify the email through the secure link sent to the owner inbox, then sign in.

For local development, copy `.env.example` to `.env.local` and fill in the same project URL and public key. `.env.local` is ignored by Git.

The owner can edit menu names, descriptions, prices, and availability. Public menu prices and website order totals come from the database; the database recalculates each order from current prices rather than trusting browser totals. Website checkout orders appear in `/admin/`, where the owner can update their status. Customers may continue to WhatsApp after submission to confirm the order. Calls, in-person orders, and WhatsApp conversations that do not use website checkout cannot be automatically tracked. The site does not take online payments.

## Owner updates

- Edit business details, reviews, and photography references in `src/data.js`. With Supabase configured, menu names, descriptions, availability, and PKR prices are managed in `/admin/`.
- Replace the royalty-free sample photography in `public/images/` with Owais Cafe’s real photos; keep the filenames or update the matching image fields in `src/data.js`.
- Verify the map pin and actual opening hours before publishing.
- Add the restaurant’s actual social profile URL in the footer when available.
- Customer accounts at `/account/` remain a browser-only demo; they do not provide secure online authentication or sync data across devices. They are separate from the owner dashboard.
