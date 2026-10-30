# Nodal-dot Blog

This is my personal website and portfolio blog. It has both English and Russian content, a small custom design system, and a few interactive sections that I built by hand instead of dropping in a ready-made template.

## Links

- Site: `https://nodaldot.space/`
- Repository: `https://github.com/Nodal-dot/blog`

## What this project includes

- localized pages and blog posts
- MDX-based content
- post search and newest-first publication order
- custom page transitions
- interactive sections built with `Three.js` and `GSAP`
- centralized SEO metadata

## Stack

Current main dependencies:

- `next@16.2.4`
- `react@19.2.5`
- `react-dom@19.2.5`
- `typescript@5`
- `next-intl@4.3.4`
- `next-mdx-remote@6.0.0`
- `sass@1.89.2`
- `three@0.182.0`
- `gsap@3.13.0`
- `@gsap/react@2.1.2`
- `swiper@12.0.3`
- `gray-matter@4.0.3`
- `remark-gfm@4.0.1`
- `prismjs@1.30.0`

Development tools:

- `eslint@9.33.0`
- `prettier@3.6.2`
- `stylelint@16.23.1`
- `jest@30.0.5`
- `playwright@1.54.1`
- `storybook@9.0.18`

## Run locally

```bash
git clone https://github.com/Nodal-dot/blog.git
cd blog
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm lint:css
pnpm lint:css:fix
pnpm type-check
pnpm test
pnpm storybook
pnpm build-storybook
pnpm format
pnpm format:fix
pnpm fix:all
pnpm analyze
```

## Project structure

```text
src/
  app/       app router, layouts, metadata, providers
  widgets/   larger UI blocks
  sections/  page sections
  features/  interactive feature logic
  entities/  domain data and models
  shared/    UI kit, styles, utilities, i18n
content/
  posts/     localized MDX posts
public/
  assets/    icons, images, and static files
```

## Notes

- Content lives in `content/posts/{locale}`.
- Main SEO logic is defined in `src/app/[locale]/metadata.ts`.
- Routing and locale handling are built around `next-intl`.
- Most animations and interactive pieces were implemented manually for this project.
