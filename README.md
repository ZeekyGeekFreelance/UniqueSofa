# Sofa Catalog Design

A cleaned single-app React + Vite project for Unique Sofa World Furniture.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` runs TypeScript checks and creates a production build.
- `npm run preview` serves the production build locally.
- `npm run sanity:dev` runs Sanity Studio.
- `npm run sanity:build` builds Sanity Studio.

## CMS Setup

1. Copy `.env.example` to `.env`.
2. Fill `VITE_SANITY_PROJECT_ID` (and optional dataset/api version overrides).
3. Run `npm run sanity:dev` to manage content.

## Project Structure

- `src/` application code, pages, shared data, and UI components.
- `src/cms/` Sanity runtime config, query cache, centralized content provider, and mappers.
- `src/sanity/schemaTypes/` modular Sanity schema definitions.
- `public/catalogue/` exported catalogue page images and the PDF brochure.
- `public/` static assets such as the favicon and opengraph image.

## Notes

The previous AI-generated workspace included unused monorepo packages, API scaffolding, duplicate UI files, and sandbox artifacts. The repo now contains only the website, its shared data, and public assets required by the React app.
