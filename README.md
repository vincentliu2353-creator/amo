# AMO Website

Initial scaffold for a B2B magnetic levitation product website built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and Sanity.

## Core Routes

- `/`
- `/products`
- `/products/[slug]`
- `/cases`
- `/cases/[slug]`
- `/oem-odm`
- `/about`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/rfq`
- `/favorites`
- `/admin/product-upload`

## Content + Data Layers

- `supabase/schema.sql`: relational schema for products, specs, FAQs, RFQs, and favorites
- `sanity/schemaTypes/*`: editorial content models for blog posts, case studies, products, and FAQs
- `data/*`: typed seed data used for the initial UI implementation

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

## Notes

- The repo currently ships with mock data for first-pass UI development.
- RFQ submission is designed to insert into Supabase once credentials are configured.
- Favorites are scaffolded for a local-first UX and can later be upgraded to authenticated Supabase persistence.
