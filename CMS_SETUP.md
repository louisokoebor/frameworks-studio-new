# TinaCMS setup

This project now reads the projects section from `content/projects/projects.json` and uses TinaCMS for editing.

## Local development

1. Create a `.env` file from `.env.example`.
2. Add your Tina Cloud credentials:
   - `TINA_CLIENT_ID`
   - `TINA_TOKEN`
3. Run:

```bash
npm run dev
```

This runs Tina and Vite together. The editor will be built to `/admin`.

## Vercel

Add the same environment variables in Vercel:

- `TINA_CLIENT_ID`
- `TINA_TOKEN`

When content is updated through Tina, changes are committed to GitHub and Vercel will redeploy from the repo.

## Content source

The source of truth for the projects section is:

- `content/projects/projects.json`

The frontend renderer lives in:

- `js/projects-render.js`
