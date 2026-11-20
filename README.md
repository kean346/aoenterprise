# AO Enterprises homepage

This is a single-page, static-exportable Next.js App Router project for AO Enterprises (Pty) Ltd. The homepage includes the hero, services, About, procurement process, documentation, RFQ preview and footer.

## Local development

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Open the URL printed by Next.js for development. The production build writes a static site to `out/`. Serve that directory with a static web server.

The hero uses an original AO ribbon image on a WebGL mesh. The bend is projected from fixed-length steps to retain the paper texture as the ribbon unfurls and returns. The isometric sequence animates the supplied four-object composition and seeks through the video as the visitor scrolls. Reduced-motion and data-saving visitors get the poster. The standalone Facet study uses cursor-controlled glass shards and an accessible definitions view with an HTML fallback.

Vercel builds the homepage with `npm run build` and serves the static export from `out/`. The video uses HTTP byte ranges for responsive seeking.

## Demo content

The service images are supplied illustrative placeholders. Replace them with approved images for a public launch. The RFQ validates fields and optional attachments in the browser and displays a local preview. Official contact details, documentary proof for any CIPC/SARS/CSD claims and a secure RFQ endpoint with attachment handling remain to be supplied.
