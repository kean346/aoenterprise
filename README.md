# AO Enterprises website

A static Next.js site for AO Enterprises (Pty) Ltd. The homepage opens with Supply in Motion, a four-chapter scroll story adapted from the Tidewell design brief. Services, procurement, leadership and company documentation follow the story. The homepage and `/contact/` share the quote form.

## Local development

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Vercel serves the production export from `out/`. The motion engine uses scroll position and `requestAnimationFrame`. Story images retain the brief's remote URLs and sprite crops. Inter is served locally with its license. Reduced-motion visitors see the still artwork, readable text and standard document flow.

## Client information and quote requests

The RFQ validates fields and optional attachments in the browser and displays a local preview. Official contact details, approved vision and mission statements, director headshots and biographies, verified credentials and a secure RFQ endpoint remain to be supplied.
