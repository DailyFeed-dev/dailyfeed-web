<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## DailyFeed team rules

Follow these rules when writing code in this repository. Details: `README.md`, `CONTRIBUTING.md`, `src/lib/api/README.md`.

### Folder structure

- `src/app/`: route files only (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`). Do not create component folders (including `_components`) inside `app/`. Pages import and compose components.
- `src/components/common/`: shared presentational components (Button, Modal, Avatar, Badge, Input). They render props only: no API calls, no imports from domain folders.
- `src/components/layout/`: Header and other layout pieces.
- `src/components/<domain>/`: components for one domain (`chat`, `til`, `archive`, `notification`, `profile`, `auth`, `home`).
- `src/services/<domain>Service.ts`: API functions for a domain. Components call these instead of calling the API directly.
- `src/hooks/`: shared hooks. `src/types/`: shared types.
- Before creating a component, check `src/components/common/` for an existing one. When a component is needed by two or more domains, move it to `common/`.

### API

- Call the backend only through `api` from `@/lib/api` (it adds the token, refreshes on 401, and returns `data`). Do not use `fetch` directly for backend calls.
- Use generated types: `Schemas['PostResponse']` etc. from `@/lib/api`. Never edit `src/lib/api/schema.d.ts` by hand.

### Conventions

- PR titles and commits: `type: description` (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`). `style` means formatting only, not CSS changes.
- Formatting is handled by Prettier (single quotes, semicolons, 100 columns). Run `npm run lint` and `npm run build` before opening a PR.
- Never commit `.env.local` or secrets. Variables prefixed with `NEXT_PUBLIC_` are visible in the browser.
