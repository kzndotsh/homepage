# kzn.sh

Personal homepage for Logan (Charlotte, NC). Tailwind Plus Spotlight template, customized and forced dark.

## Commands

```bash
npm run dev            # Next.js dev server
npm run build          # next build
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run preview        # OpenNext local Workers preview
npm run deploy         # Alchemy production (Worker kzn-sh, domain kzn.sh)
npm run deploy:preview # Alchemy non-prod stage
npm run destroy        # tear down production stack
```

Package manager: **npm**. Node `>= 20.9`.

## Stack

- Next.js 16 App Router + React 19 + TypeScript (strict)
- Tailwind CSS v4 — theme tokens live in `src/styles/tailwind.css` (no `tailwind.config.js`)
- Headless UI v2
- Import alias `@/*` → `./src/*`

## Layout

```
├── alchemy.run.ts          # Cloudflare IaC (Alchemy 0.93 Nextjs resource)
├── open-next.config.ts     # OpenNext Cloudflare adapter
├── public/ikigai-wallpaper.png   # real Sway wallpaper from kzndotsh/dotfiles
├── public/skyline/charlotte.jpg  # CC BY 2.0 night photo (credit in CREDITS.txt and on the page)
└── src/
    ├── app/                # routes only: thin pages and API route handlers
    │   ├── page.tsx        # homepage: renders features/home/HomePage
    │   ├── api/            # /api and /api/v1/* endpoints
    │   ├── coffee/ humans.txt   # hidden easter eggs, not linked from the site
    │   ├── llms.txt/ llms-full.txt/ index.md/ resume.md/   # llms.txt index and Markdown twins of each page
    │   ├── robots.ts sitemap.ts
    │   └── demo/           # design explorations (kept until told otherwise)
    ├── features/           # one folder per domain; each owns its CSS module
    │   ├── home/           # HomePage (data + composition), hero, location, API, contact, nav/footer
    │   ├── booking/        # Cal.com live slots and in-page booking (server action), email fallback
    │   ├── work/           # projects, experience (timeline + accordion)
    │   ├── coding/         # GitHub activity (heatmap, feed)
    │   ├── music/          # playlists, Last.fm listening, charts, genre map
    │   ├── library/        # Hardcover books and Trakt watching
    │   ├── setup/          # dotfiles desktop sketch (fetch, palette, Waybar)
    │   └── skyline/        # WebGL canvas: the Charlotte night photo, dithered (4x4 Bayer, 2px), with twinkling stars
    │       └── {sections,components}/  *.ts (pure logic)  <feature>.module.css
    ├── components/         # ui/ (Panel, PanelHeader, StatRow + ui.module.css), HardcoverIcon
    ├── content/            # owned copy and facts: person, roles, projects, playlists (+ playlists-data), stacks, runs
    ├── config/             # fonts.ts (next/font), site.ts (canonical URL)
    ├── hooks/              # useNow, useElementSize
    ├── lib/                # integrations/ (server fetchers), llms/ (Markdown + llms.txt builders), cx, formatNumber, relativeTime
    └── styles/             # tokens.css (Tokyo Night), tailwind.css
```

Conventions:

- A feature section is a server component wrapped in `Panel`; interactive pieces
  are small client components in `components/`. Pure logic (layout math, date
  math, grouping) lives in plain `.ts` next to them so it stays testable.
- CSS Modules are per feature. A class used by more than one feature belongs in
  `components/ui/ui.module.css`. A selector must never reference classes from two
  modules, and rules in different modules must not fight over the same property
  on one element (module load order is not guaranteed).
- `llms.txt` follows llmstxt.org. Its pages and the Markdown twins (`/index.md`, `/resume.md`)
  are built from `src/content` by `lib/llms`, so they cannot drift from the site. A request
  with `Accept: text/markdown` to `/` or `/resume` is rewritten to the twin (`next.config.mjs`).
  Add a page to `llms.txt` and the sitemap when you add a route. Production code must not
  import from `src/app/demo`.
- Every integration in `lib/integrations` resolves to `null` on missing
  credentials or failure; sections render a fallback.
- Integration env vars: `GITHUB_TOKEN`, `LASTFM_TOKEN`, `SPOTIFY_CLIENT_ID`,
  `SPOTIFY_CLIENT_SECRET`, `HARDCOVER_TOKEN`, `CAL_TOKEN`, `TRAKT_CLIENT_ID` (+ optional
  `TRAKT_USERNAME`). Secrets are bound in `alchemy.run.ts`.

The site is a single page with its own anchor nav (`features/home/components/SiteNav.tsx`); the old multi-page site (About, Projects, Playlists, Uses, Stats, Fetch and the Spotlight chrome) was removed.
Playlist copy lives in `src/content/playlists-data.ts` (from the Sound Therapy Notion list) and is exposed by `src/content/playlists.ts`. The always-shuffle note (`playlistsIntro`) is part of the playlists section intro — keep it.

## Theme & content

- Forced dark: `html` has `className="dark …"`, `ThemeProvider` has `forcedTheme="dark"`. There is no theme toggle (it went with the old Header); do not add one unless asked.
- Tokens live in `src/styles/tokens.css`: the Tokyo Night palette (`--color-tn-*`, the only place hex codes live) and semantic aliases (`--color-page`, `--color-fg`, `--color-accent`, ...). Use the semantic ones in components.
- Avatar: `@/images/photos/avatar.png`. Do not replace with Spotlight dummy logos or Spencer Sharp copy.
- Resume (`src/content/roles.ts`, `public/files/resume.pdf`), projects and playlist copy are real content — preserve them.

## Code style

- TypeScript `.ts` / `.tsx` only under `src/` (`allowJs` is leftover; do not add JS).
- Prefer `const`. No `any`.
- Conventional commits: `type(scope): description` (lowercase, imperative).
- Do not commit unless asked.

## Deployment

- **IaC**: Alchemy **0.93** (`alchemy.run.ts`), `Nextjs` from `alchemy/cloudflare`. Not Alchemy v2 Effect API (`alchemy/Cloudflare`).
- **Runtime**: Cloudflare **Worker** `kzn-sh` via OpenNext. Domain `kzn.sh` is a Worker custom domain (`domains` in `alchemy.run.ts`).
- **Not Pages.** The old Pages project was `homepage` (`homepage-6e1.pages.dev`). Do not deploy with `next-on-pages`.
- **Auth**: `npx alchemy configure` then `npx alchemy login`. Wrangler OAuth is a different store and is **not** enough. Telemetry timeouts on login are noise.
- **State**: `.alchemy/` is gitignored (secrets). `wrangler.jsonc` is generated by Alchemy — gitignored; do not hand-edit as source of truth.
- First-time domain bind fails if `kzn.sh` still has Pages/DNS records Cloudflare considers “externally managed”. Remove the hostname from the Pages project first.

```bash
npx alchemy configure   # profile default, OAuth, account kzn.sh
npx alchemy login       # only after configure
npm run deploy
```
