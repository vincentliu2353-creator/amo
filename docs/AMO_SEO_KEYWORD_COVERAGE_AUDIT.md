# AMO SEO Keyword Coverage Audit

Audit date: 2026-06-30  
Site: https://amolevitation.com  
Mode: Audit only. No site files were changed as part of this review.

## Scope

- Keyword master source located during audit: `/Users/qmbook/Desktop/AMO_SEO_Keyword_Bible_V1.xlsx`
- Primary worksheet used: `Keyword Matrix`
- Constraint note: the workbook still assumes new category pages and solution pages, but current AMO rules explicitly prohibit new category, solution, and OEM case pages. For that reason, the best available targets are existing core pages plus Blog.
- Source discrepancy: the request referenced about 31 clusters and about 310 keywords. The latest master file actually found during this audit contains 16 subclusters and 178 keywords. No newer AMO keyword bible was found in the repo or current attachments.

## Coverage Totals

- Fully covered: 5 clusters
- Partially covered: 10 clusters
- Not covered: 0 clusters
- Should not be covered yet: 1 cluster

## Summary Table

| Cluster | Priority | Coverage status | Best existing target URL | Missing content | Recommended next action | Risk level |
| --- | --- | --- | --- | --- | --- | --- |
| Commercial :: Manufacturer / Supplier | P0 | Fully covered | `/` | Minor stale industrial wording remains in unused or non-primary repo paths | leave for later | Low |
| Commercial :: OEM / ODM | P0 | Fully covered | `/oem-odm` | Could use more exact private-label wording, but the main cluster is already strong | leave for later | Low |
| Commercial :: Buyer Intent | P0 | Partially covered | `/rfq` | China, wholesale, bulk, and exact buyer-intent phrasing are still thin on core conversion pages | update existing core page | High |
| Products :: Floating Display | P0 | Partially covered | `/products` | No dedicated floating-display landing page, limited exact H1 support, weak perfume/watch/jewelry sub-intent coverage | update existing core page | High |
| Products :: Levitating Clock | P0/P1 | Partially covered | `/products` | Only light catalog support, no strong title/H1 focus, one live product is not enough to cover the cluster deeply | leave for later | Medium |
| Products :: Levitating Lamp | P0/P1 | Fully covered | `/products` | Could be reinforced with more lamp-specific blog support, but existing page and catalog coverage are solid | leave for later | Low |
| Products :: Art Objects / Sculpture | P1 | Partially covered | `/products` | Exact sculpture and floating-art-object phrasing is present only lightly across page copy and product helpers | update existing core page | Medium |
| Products :: Premium Gifts | P1 | Fully covered | `/products` | Some gift variants rely on blog support rather than core-page headings, but overall coverage is complete enough | leave for later | Low |
| Solutions :: Retail / Luxury Retail | P1 | Partially covered | `/blog/why-luxury-retail-stores-use-floating-product-displays` | Perfume, jewelry, and watch brand variations are not supported strongly enough in titles, H1s, or body copy | update existing blog | High |
| Solutions :: Exhibition / Trade Show | P1 | Partially covered | `/cases` | Trade-show intent is present, but there is no dedicated exhibition-focused article or stronger exact-match copy | create new blog article | Medium |
| Solutions :: Museum / Gallery | P1 | Fully covered | `/blog/museum-displays-creating-distance-focus-and-curiosity` | No major gap beyond normal incremental reinforcement | leave for later | Low |
| Solutions :: Hospitality / Hotel | P1 | Partially covered | `/cases` | Hotel lobby and hospitality-floating-display phrasing is present conceptually but not tightly targeted | create new blog article | Medium |
| Solutions :: Office / Corporate Space | P1 | Partially covered | `/cases` | Coverage is mostly indirect through use-case copy, llms files, and gifting context | leave for later | Medium |
| Technology :: Magnetic Levitation Technology | P1/P2 | Partially covered | `/blog/the-future-of-floating-objects-why-magnetic-levitation-is-changing-product-presentation` | No dedicated technology explainer page, limited exact heading support for the core technology terms | update existing blog | Medium |
| Long-tail :: High Conversion | P0/P1 | Partially covered | `/blog` | Several high-conversion variants still lack exact-match support, especially China, perfume, watch, jewelry, and custom-display-manufacturer terms | update existing blog | High |
| Avoid / Low Priority :: Too Broad | P2 | Should not be covered yet | N/A | Broad generic levitation terms are too diffuse to target as primaries | do not target | Low |

## Detailed Findings

### Commercial :: Manufacturer / Supplier

Priority: P0  
Target keyword examples: `magnetic levitation manufacturer`, `magnetic levitation supplier`, `magnetic levitation factory`, `magnetic levitation company`  
Current target URL: `/`  
Coverage status: Fully covered  
Where it appears: homepage metadata, homepage H1, homepage body copy, `/about` metadata and body, `/contact` metadata, Organization JSON-LD, WebSite JSON-LD, `llms.txt`, `llms-full.txt`, and internal links from homepage to `/products`, `/oem-odm`, and `/rfq`  
Missing elements: the core cluster is strong, but a stale non-primary footer path still uses older industrial positioning language in repo code  
Recommended action: leave for later

### Commercial :: OEM / ODM

Priority: P0  
Target keyword examples: `OEM magnetic levitation products`, `ODM magnetic levitation products`, `custom magnetic levitation products`, `magnetic levitation OEM manufacturer`  
Current target URL: `/oem-odm`  
Coverage status: Fully covered  
Where it appears: `/oem-odm` metadata, H1, process copy, FAQ content, internal links to `/rfq` and `/contact`, refreshed blog article `/blog/oem-magnetic-levitation-products-from-concept-to-production`, and supporting copy on `/rfq` and `/products`  
Missing elements: private-label phrasing is lighter than the workbook expects, but the main OEM and custom-manufacturing intent is well covered  
Recommended action: leave for later

### Commercial :: Buyer Intent

Priority: P0  
Target keyword examples: `magnetic levitation manufacturer China`, `magnetic levitation supplier China`, `magnetic levitation wholesale`, `request magnetic levitation quote`, `bulk magnetic levitation products`  
Current target URL: `/rfq`  
Coverage status: Partially covered  
Where it appears: `/rfq` metadata and H1, RFQ form copy, supplier-selection and sourcing blog articles, contact details that support Hong Kong and Shenzhen sourcing context, product detail pages with visible MOQ and lead-time fields  
Missing elements: exact China buyer-intent terms, wholesale and bulk phrasing, and stronger request-for-quote body copy are still limited on active conversion pages  
Recommended action: update existing core page

### Products :: Floating Display

Priority: P0  
Target keyword examples: `floating display`, `floating product display`, `magnetic levitation display`, `floating retail display`, `floating exhibition display`, `floating display manufacturer`  
Current target URL: `/products`  
Coverage status: Partially covered  
Where it appears: `/products` metadata and body copy, homepage metadata, `/cases` metadata and use-case sections, refreshed retail-display blog article, future-of-floating-objects blog article, product image alt helpers, Product JSON-LD on product detail pages, and internal links from homepage, blog, and OEM pages  
Missing elements: no dedicated floating-display landing page, the `/products` H1 is broader than the cluster, and several commercial variants such as `OEM floating display` and `floating exhibition display` are not supported strongly enough in visible copy  
Recommended action: update existing core page

### Products :: Levitating Clock

Priority: P0/P1  
Target keyword examples: `levitating clock`, `magnetic levitation clock`, `floating desk clock`, `OEM levitating clock`, `levitating clock manufacturer`  
Current target URL: `/products`  
Coverage status: Partially covered  
Where it appears: homepage category content, published product catalog support, product visual keyword helpers, cases copy mentioning floating clocks in office environments, and premium-gift context across product and blog copy  
Missing elements: only limited live catalog depth, no dedicated title or H1 focus on clocks, and no strong clock-specific article currently carries the cluster  
Recommended action: leave for later

### Products :: Levitating Lamp

Priority: P0/P1  
Target keyword examples: `levitating lamp`, `magnetic levitation lamp`, `floating lamp`, `levitating table lamp`, `OEM levitating lamp`  
Current target URL: `/products`  
Coverage status: Fully covered  
Where it appears: `/products` metadata title, homepage metadata, `/contact` and `/rfq` metadata support, `/products` body copy, live published lamp catalog, product detail pages, product image alt logic, Product JSON-LD, and supporting application copy across home, cases, and OEM sections  
Missing elements: lamp-specific editorial depth can still grow, but page, catalog, schema, and support signals already cover the cluster adequately  
Recommended action: leave for later

### Products :: Art Objects / Sculpture

Priority: P1  
Target keyword examples: `floating art object`, `levitating sculpture`, `magnetic levitation art`, `floating decorative object`, `floating installation art`  
Current target URL: `/products`  
Coverage status: Partially covered  
Where it appears: `/products` metadata description, homepage category sections for display art objects and custom floating installations, cases copy for hotel, office, and gift settings, product visual helpers, and llms content about display art objects  
Missing elements: sculpture and art-object keyword variants are present but not yet concentrated in titles, H1s, or a stronger dedicated article  
Recommended action: update existing core page

### Products :: Premium Gifts

Priority: P1  
Target keyword examples: `magnetic levitation gift`, `premium magnetic levitation gift`, `magnetic levitation corporate gifts`, `custom magnetic levitation gift`, `branded floating gift`  
Current target URL: `/products`  
Coverage status: Fully covered  
Where it appears: homepage metadata, `/products` metadata title and body copy, `/rfq` form project types, `/cases` gifting sections, refreshed corporate-gifts blog article, product image and application copy, and llms files  
Missing elements: some long-tail gift variants still depend on blog coverage more than core-page headings, but the cluster is materially covered already  
Recommended action: leave for later

### Solutions :: Retail / Luxury Retail

Priority: P1  
Target keyword examples: `floating retail display`, `luxury retail display`, `retail product presentation`, `floating display for perfume`, `floating display for jewelry`, `floating display for watches`  
Current target URL: `/blog/why-luxury-retail-stores-use-floating-product-displays`  
Coverage status: Partially covered  
Where it appears: refreshed luxury-retail blog article, `/cases` retail flagship sections, `/products` page copy, retail-focused case image alts, homepage retail scenario content, and retail-trends blog content  
Missing elements: perfume, jewelry, and watch variations remain weak in metadata, H1, and body concentration; watch-specific support is especially thin  
Recommended action: update existing blog

### Solutions :: Exhibition / Trade Show

Priority: P1  
Target keyword examples: `floating exhibition display`, `trade show floating display`, `levitating display for exhibitions`, `exhibition product presentation`  
Current target URL: `/cases`  
Coverage status: Partially covered  
Where it appears: `/cases` metadata and exhibition booth section, homepage exhibition scenario copy, `/products` metadata and body, case image alts, and related mentions in retail-trends content  
Missing elements: exact exhibition-focused title, H1, and body support is still too light for the full cluster, and no current article is dedicated to exhibition-display intent  
Recommended action: create new blog article

### Solutions :: Museum / Gallery

Priority: P1  
Target keyword examples: `floating museum display`, `magnetic levitation museum display`, `artifact display system`, `floating artifact display`, `floating display for galleries`  
Current target URL: `/blog/museum-displays-creating-distance-focus-and-curiosity`  
Coverage status: Fully covered  
Where it appears: refreshed museum blog metadata and intro paragraphs, internal links to `/cases`, `/products`, and `/contact`, `/cases` metadata and museum use-case blocks, museum-related image alts on cases and about pages, llms files, and Article plus Breadcrumb JSON-LD on the blog article  
Missing elements: no major gap beyond normal reinforcement work  
Recommended action: leave for later

### Solutions :: Hospitality / Hotel

Priority: P1  
Target keyword examples: `floating hotel display`, `hotel art installation`, `floating lobby installation`, `premium lobby art object`, `levitating decorative display`  
Current target URL: `/cases`  
Coverage status: Partially covered  
Where it appears: `/cases` metadata and hotel-lobby scenario, homepage hotel scenario, `/products` and `/about` body copy, hospitality-related image alts, OEM application content, and llms files  
Missing elements: the cluster is present conceptually but lacks stronger exact-match hospitality and hotel-lobby phrasing in titles, headings, and article copy  
Recommended action: create new blog article

### Solutions :: Office / Corporate Space

Priority: P1  
Target keyword examples: `floating office display`, `executive office display`, `premium office art object`, `levitating desk object`, `floating corporate display`  
Current target URL: `/cases`  
Coverage status: Partially covered  
Where it appears: homepage office scenario, `/cases` office and meeting-space use case, llms files, and premium-gifting context that overlaps with executive-space use  
Missing elements: office and corporate-space intent is not concentrated in metadata, headings, or a dedicated article, so current support is mostly indirect  
Recommended action: leave for later

### Technology :: Magnetic Levitation Technology

Priority: P1/P2  
Target keyword examples: `magnetic levitation technology`, `how magnetic levitation works`, `magnetic suspension technology`, `floating object technology`, `contactless display technology`  
Current target URL: `/blog/the-future-of-floating-objects-why-magnetic-levitation-is-changing-product-presentation`  
Coverage status: Partially covered  
Where it appears: future-of-floating-objects blog metadata and intro, homepage technology section, OEM page body copy, llms files, and supporting schema on article and product detail pages  
Missing elements: the exact technology cluster still lacks a stronger heading structure and a more explicit explainer treatment across active core pages  
Recommended action: update existing blog

### Long-tail :: High Conversion

Priority: P0/P1  
Target keyword examples: `custom magnetic levitation display manufacturer`, `magnetic levitation display manufacturer China`, `OEM floating product display supplier`, `floating display for luxury retail brands`, `floating display for jewelry stores`, `floating display for watch brands`  
Current target URL: `/blog`  
Coverage status: Partially covered  
Where it appears: refreshed OEM, supplier-selection, sourcing, retail, museum, gifting, trend, and display-technology blog articles; `/products`; `/oem-odm`; `/rfq`; `/cases`; and llms files  
Missing elements: several exact high-conversion variants are still absent or only lightly implied, especially `custom magnetic levitation display manufacturer`, `magnetic levitation display manufacturer China`, perfume/watch/jewelry brand variants, and stronger OEM floating-display phrasing  
Recommended action: update existing blog

### Avoid / Low Priority :: Too Broad

Priority: P2  
Target keyword examples: `magnetic levitation`, `levitation`, `magnet`, `floating`, `magnetic field`, `maglev`  
Current target URL: N/A  
Coverage status: Should not be covered yet  
Where it appears: broad generic terms naturally appear across current marketing, product, and technical copy  
Missing elements: none; these are too broad to pursue as primary targets under the current B2B strategy  
Recommended action: do not target

## Remaining P0 Keywords That Still Need Action

- `OEM floating display`
- `magnetic levitation supplier China`
- `magnetic levitation manufacturer China`
- `magnetic levitation display manufacturer China`
- `custom magnetic levitation display manufacturer`
- `floating display for perfume brands`
- `floating display for jewelry stores`
- `floating display for watch brands`
- `MOQ magnetic levitation products`

## Cross-Cutting Notes

- The keyword workbook still points many product and solution clusters to routes that AMO is no longer allowed to create. That structural gap is the main reason several otherwise relevant clusters remain only partially covered.
- Core public pages are aligned to the current AMO direction, but legacy industrial language still exists in repo-side or retired paths:
  - `components/sections/home-hero.tsx` still contains old industrial hero copy, but it is not the current homepage path.
  - `components/layout/site-footer.tsx` and `lib/site-config.ts` still reference industrial positioning and legacy categories such as `Planar Motors`, `Levitation Stages`, and `Transfer Modules`. The main public pages inspected during this audit mostly use `ApprovedHomeFooter`, so this is better described as stale repo leakage than the main live footer.
  - `data/products.ts` and `data/cases.ts` still contain industrial sample data.
  - legacy case detail pages under `/cases/[slug]` are still present but marked noindex and excluded from the sitemap.
- Live topical dilution still exists in published content:
  - published product data still includes a small legacy `Planar Motors` footprint
  - published blog content still includes industrial-era articles such as `/blog/how-to-spec-a-levitation-platform-for-oem-equipment` and `/blog/why-contactless-motion-matters-in-clean-manufacturing`

## Files Inspected

- Keyword source: `/Users/qmbook/Desktop/AMO_SEO_Keyword_Bible_V1.xlsx`
- Core routes: `app/page.tsx`, `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `app/cases/page.tsx`, `app/cases/[slug]/page.tsx`, `app/oem-odm/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/rfq/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Homepage and core page components: `components/home/home-page.tsx`, `components/home/home-hero.tsx`, `components/home/home-technical.tsx`, `components/products/products-intro.tsx`, `components/products/product-detail-experience.tsx`, `components/cases/cases-page-experience.tsx`, `components/oem/oem-odm-page-experience.tsx`, `components/about/about-page-experience.tsx`, `components/rfq/rfq-form.tsx`, `components/blog/blog-index.tsx`
- SEO and AI-readability helpers: `lib/seo.ts`, `lib/llms.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts`
- Image and product helpers: `components/cases/case-image-assets.ts`, `lib/products/product-visuals.ts`, `lib/products/product-image-selection.ts`, `lib/products/product-image-variants.ts`
- Legacy or dilution checks: `components/sections/home-hero.tsx`, `components/layout/site-footer.tsx`, `components/layout/inner-page-shell.tsx`, `components/layout/approved-home-footer.tsx`, `lib/site-config.ts`, `data/products.ts`, `data/cases.ts`
- Dynamic content and publishing context: `lib/supabase/products.ts`, `lib/supabase/blogs.ts`, `lib/blog-article-refresh.ts`, `scripts/import-amo-products-from-images.mjs`, `scripts/amo-blog-batch-data.mjs`, `scripts/publish-amo-blog-batch.mjs`
