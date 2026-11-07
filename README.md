# kzn.sh

My personal site: [kzn.sh](https://kzn.sh). One page with my work, what I'm listening to and reading, live code activity, my dotfiles setup, a resume, and a way to book a call. Most of it is real data pulled from the services I use.

It is a single-page site, forced dark, in the Tokyo Night palette.

## What's on it

- **Hero** with a dithered WebGL skyline of Charlotte (a baked still shows first, then the live canvas fades in) and a local-time card.
- **Projects** with featured work and a drifting strip of the rest.
- **Playlists and listening** from Spotify and Last.fm: now playing, rankings, a genre map.
- **Books and watching** from Hardcover and Trakt.
- **Code activity** from GitHub: a contribution heatmap and a feed of recent commits.
- **Setup**: my NixOS and Sway dotfiles drawn as a desktop sketch.
- **Resume**: a collapsible experience list and a PDF.
- **Schedule a call**: live slots from Cal.com booked in the page, with an email fallback.
- **An API** (`/api/v1/*`), a **command palette** (`⌘K`, `Ctrl+K` or `/`), an `llms.txt`, and a few hidden easter eggs.

## Stack

|  |  |
| --- | --- |
| Framework | Next.js 16 (App Router) and React 19, strict TypeScript |
| Styling | Tailwind CSS v4 for tokens, CSS Modules per feature, Headless UI |
| Tooling | oxlint (type-aware) and oxfmt via Ultracite presets, knip, lefthook |
| Hosting | A Cloudflare Worker through [OpenNext](https://opennext.js.org/cloudflare) |
| Infrastructure | [Alchemy](https://alchemy.run) 0.94 (`alchemy.run.ts`) |
| Storage | R2 for the incremental cache and the data snapshots, a Durable Object queue for revalidation |
| Images | The Workers `IMAGES` binding behind `/_next/image` |

## Getting started

Needs Node `>= 20.9` and npm.

```bash
npm install
cp .env.example .env         # then fill in what you have
npm run dev                  # http://127.0.0.1:3001
```

Every integration is optional. With no token its section shows a fallback instead of breaking.

### Environment

| Variable | For |
| --- | --- |
| `GITHUB_TOKEN` | Contribution calendar and private activity (falls back to public data) |
| `LASTFM_TOKEN` | Scrobbles, charts, genres |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Playlist stats |
| `HARDCOVER_TOKEN` | Books |
| `TRAKT_CLIENT_ID`, `TRAKT_USERNAME` | Watching |
| `CAL_TOKEN` | Live booking slots |
| `ALCHEMY_PASSWORD` | Deploys only. Encrypts the secrets Alchemy stores; keep it |

### Scripts

```bash
npm run dev             # dev server
npm run build           # next build
npm run lint            # oxlint
npm run format          # oxfmt
npm run check           # lint, format check and typecheck
npm run knip            # unused files, exports and dependencies
npm run typecheck       # tsc --noEmit
npm run preview         # build with OpenNext and preview locally on Workers
npm run deploy          # production: Worker kzn-sh on kzn.sh
npm run deploy:preview  # a separate preview stage
npm run destroy         # tear down production
```

## Project layout

```
alchemy.run.ts        Cloudflare infrastructure (Worker, R2, images, secrets, domain)
open-next.config.ts   OpenNext adapter: R2 cache plus the revalidation queue
scripts/              skyline-placeholder.mjs bakes the dither stills from the live canvas
public/               skyline textures and stills, wallpaper, resume PDF
src/
  app/                Routes only: the page, /api/v1/*, llms.txt, Markdown twins, sitemap
  features/           One folder per section, each with its own CSS module
                      (home, work, music, library, coding, setup, booking, skyline, resume)
  components/         Shared UI: Panel, ScrollRow and friends
  content/            Owned copy and facts: person, roles, projects, playlists
  lib/                integrations/ (server fetchers), snapshots/, llms/ (Markdown builders)
  styles/             tokens.css (Tokyo Night palette), tailwind.css
```

## How it works

**The homepage is static.** It is rendered once and served from the cache, then revalidated in the background. Nothing in its render path may be dynamic. A `no-store` fetch or `cookies()` would turn it into a render on every request.

**Snapshots keep it under Cloudflare's request limit.** On the Workers Free plan one invocation can make only about 50 outgoing requests, and fetching every integration takes far more. So the page never fetches in its own render. Each source (GitHub, Spotify, Last.fm, Hardcover, Trakt, Cal.com) is stored as a JSON snapshot in R2 and read with `snapshot(name)`. When one goes stale, a call to the Worker's own service binding refreshes it in a separate invocation with a fresh budget. A failed refresh never overwrites the last good data. The code is in `src/lib/snapshots`.

**Graceful by default.** Every integration resolves to `null` on a missing token or a failure, and its section renders a fallback.

**Machine-readable too.** `llms.txt` follows [llmstxt.org](https://llmstxt.org). `/index.md` and `/resume.md` are Markdown twins built from `src/content`, and a request with `Accept: text/markdown` is rewritten to them, so they cannot drift from the site.

## Deploying

Auth is Alchemy's, not Wrangler's. Once:

```bash
npx alchemy configure
npx alchemy login
```

Then `npm run deploy`. The scripts load `.env` so the tokens and `ALCHEMY_PASSWORD` get bound as Worker secrets; without it none are bound. The first request after a deploy takes several seconds while the snapshots fill, so open the site once afterwards.

Pushing to `main` does not deploy. `wrangler.jsonc` and `.alchemy/` are generated and gitignored.

More detail on conventions, versions that must move together, and deploy pitfalls is in [`AGENTS.md`](./AGENTS.md).

## Credits

- Skyline photo: [Nan Palmero](https://commons.wikimedia.org/wiki/File:Charlotte_night_skyline_2016.jpg), CC BY 2.0.

## License

[MIT](./LICENSE). The skyline photo keeps its own CC BY 2.0 license.
