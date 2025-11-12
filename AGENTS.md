# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`. Author docs in `src/content/docs` (one Markdown/MDX file per route with frontmatter), shared Astro pages in `src/pages`, and reusable images or diagrams in `src/assets`. Static files such as favicons or robots.txt belong in `public/`. Build output is emitted to `dist/`. Key configs stay at the root: `astro.config.mjs` for integration wiring, `tsconfig.json` for TypeScript paths, and `package.json` for scripts and dependencies.

## Homepage Implementation
The landing page (`src/pages/index.astro`) is a thin wrapper around `src/layouts/HomeLayout.astro`, which ships a legecy HTML/CSS/JS page rather than Astro’s component primitives. `HomeLayout` outputs the full document structure, imports legacy styles from `public/assets/css/` and pulls in jQuery 2.2.4 plus Skel scripts, `init.js`, and a custom `public/assets/js/releases.js`. That script hits the GitHub Releases API, caches responses in `localStorage`, and swaps download links, channel toggles, and distro instructions on the page. Any visual or behavioral tweaks to the homepage typically require editing `index.astro` for content blocks, `HomeLayout.astro` for layout and includes, and the assets under `public/assets/` for styling or client-side behavior.

## Build, Test, and Development Commands
- `npm install`: bootstrap dependencies once per environment.
- `npm run dev`: launch Astro’s dev server on `http://localhost:4321` with hot reload.
- `npm run build`: run `astro check` plus a production build into `dist/`; fails on type or content schema issues.
- `npm run preview`: serve the build locally; use before shipping to verify redirects and assets.
- `npm run astro <subcommand>`: access the Astro CLI (e.g., `npm run astro add @astrojs/mdx`).

## Coding Style & Naming Conventions
Use TypeScript and Astro components with 2-space indentation and single quotes in JSX-like props. Name components with `PascalCase.astro`, utility modules in `src/pages` or `src/content/docs` should use `kebab-case`. Keep Markdown frontmatter minimal (`title`, `description`, `sidebar`), and prefer relative asset imports from `@assets`. Run `astro check` (or `npm run build`) after large edits to enforce schema consistency.

## Testing Guidelines
There is no standalone test runner; rely on `astro check` for type/content validation and `npm run build` for integration coverage. When adding interactive components, create a minimal reproduction page under `src/pages/playgrounds` (gitignored if temporary) and remove it before committing. Document expected behavior in the PR so reviewers can reproduce locally.
