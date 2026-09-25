# Limbus ID Creator — frontend

Next.js 16 (App Router) + React 19. See `NEXTJS_MIGRATION.md` for how the app is structured.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build (`.next/`) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |

## Environment (`.env`)

| Variable | Used by |
|---|---|
| `API_URL` | Server only — Server Components fetch posts/users from the backend directly |
| `NEXT_PUBLIC_SERVER_URL` | Browser — RTK Query base URL (`/API` is proxied by Netlify in production) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google login |
| `NEXT_PUBLIC_LOCAL_SAVE_MAX_LEN` | Max local saves in the creator |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry (client and server) |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Optional, build time: source map upload |

`NEXT_PUBLIC_*` values are inlined at build time, so changing them needs a rebuild.

## Deploying

Netlify detects Next.js and runs it with its Next.js runtime (`netlify.toml` only keeps the domain redirect and the `/API` proxy).
