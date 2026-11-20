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

The paper animation is built in `components/paper-scene.ts`. It advances the ribbon centreline in fixed-length steps, and uses two lit paper surfaces and locally generated paper grain. The homepage uses the supplied still for reduced-motion, data-saving and WebGL fallback. The About section's isometric diagram is original homepage artwork.

## Demo content

The service images are supplied illustrative placeholders. Replace them with approved images for a public launch. The RFQ validates fields and optional attachments in the browser and displays a local preview. Official contact details, documentary proof for any CIPC/SARS/CSD claims and a secure RFQ endpoint with attachment handling remain to be supplied.
