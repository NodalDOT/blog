# NodalDOT Blog

This is my personal website and portfolio blog. It has both English and Russian content, a small custom design system, and a few interactive sections that I built by hand instead of dropping in a ready-made template.

## Links

- Site: `https://nodaldot.space/`
- Repository: `https://github.com/NodalDOT/blog`

## What this project includes

- localized pages and blog posts
- MDX-based content
- post search and newest-first publication order
- custom page transitions
- interactive sections built with `GSAP`
- centralized SEO metadata

## Stack

Current main dependencies:

- `next@16.4.6`
- `react@19.3.1`
- `react-dom@19.3.1`
- `typescript@6.0.3`
- `next-intl@4.15.1`
- `@next/mdx@16.4.6`
- `sass@1.108.2`
- `gsap@3.15.1`
- `@gsap/react@2.1.2`
- `swiper@14.4.0`
- `remark-gfm@4.0.1`
- `prismjs@1.30.0`

Development tools:

- `eslint@9.39.5`
- `prettier@3.10.1`
- `stylelint@17.16.0`
- `jest@30.5.2`

## Run locally

```bash
git clone https://github.com/NodalDOT/blog.git
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
