# AO Enterprises homepage

This is a static-exportable Next.js App Router project for AO Enterprises (Pty) Ltd. The homepage includes the ribbon studio, scroll film, service summaries and details, company documentation, leadership and procurement process. The contact section and `/contact/` page share the quote form.

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

The hero uses a raspberry ribbon image on a WebGL mesh. The bend is projected from fixed-length steps to retain the paper texture as the ribbon unfurls and returns. The isometric sequence animates the supplied four-object composition from a fixed camera angle and seeks through the video as the visitor scrolls. Reduced-motion and data-saving visitors get the poster. The standalone Facet study uses cursor-controlled glass shards and an accessible definitions view with an HTML fallback.

Vercel builds the homepage with `npm run build` and serves the static export from `out/`. The video uses HTTP byte ranges for responsive seeking.

## Demo content

The RFQ validates fields and optional attachments in the browser and displays a local preview. Official contact details, approved vision and mission statements, director headshots and biographies, verified documentation and a secure RFQ endpoint remain to be supplied.
