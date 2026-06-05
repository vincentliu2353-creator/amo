# AMO Design System

## Protected Homepage

The homepage is a protected standalone landing page.
It keeps its own approved header, footer, pacing, and storytelling behavior.
Inner-page shared chrome must not be pushed onto `/`.

## Layout Architecture

- Homepage `/` uses dedicated home-only header and footer.
- Non-home marketing and catalog pages use shared `SiteHeader` and `SiteFooter`.
- Shared inner-page chrome can be mounted directly with `InnerPageShell` on non-home routes.
- Admin pages can reuse the inner-page shell while preserving admin logic and workflows.

## Brand Positioning

AMO presents as a premium magnetic levitation manufacturer for serious B2B buyers.
The brand should feel technically credible, visually controlled, and commercially mature.
The design language must communicate engineered precision before it communicates marketing energy.

## Visual Keywords

- Black futuristic minimalism
- Premium industrial design
- Soft optical glow
- Metallic restraint
- Cinematic rhythm
- Calm precision
- High-trust B2B clarity

## Typography Scale

### Font Roles

- Display: `Space Grotesk`
- Body: `Manrope`

### Usage

- `Hero / Page H1`: `text-4xl` to `text-6xl`, `font-display`, `font-semibold`, tight tracking
- `Section H2`: `text-3xl` to `text-5xl`, `font-display`, `font-semibold`
- `Card H3`: `text-2xl` to `text-3xl`, `font-display`, `font-semibold`
- `Body Large`: `text-base`, `leading-8`
- `Body Standard`: `text-sm`, `leading-7`
- `Meta / Labels`: `text-[10px]` to `text-[11px]`, uppercase, tracked

### Rules

- Headlines are concise and visually dense.
- Body copy uses generous line height and restrained width.
- Uppercase labels are for navigation, metadata, and small technical framing only.

## Color Tokens

### Core Tokens

- `--background`: `#050608`
- `--foreground`: `#f3f6fb`
- `--amo-surface`: `#0a0d12`
- `--amo-surface-elevated`: `#111722`
- `--amo-border`: `rgba(255,255,255,0.10)`
- `--amo-copy`: `#c5ceda`
- `--amo-copy-muted`: `#8d99aa`
- `--amo-accent`: `#a6e8ff`

### Usage

- Backgrounds stay near-black.
- Accent color is a cool optical cyan, never loud neon.
- Copy uses off-white and steel-blue neutrals, not pure gray.

## Background / Glow Rules

### Page Canvas

- `radial-gradient(circle at top, rgba(166,232,255,0.08), transparent 24%)`
- `linear-gradient(180deg, #030405 0%, #06090f 46%, #030405 100%)`

### Hero / Feature Surface

- `radial-gradient(circle at top left, rgba(166,232,255,0.14), transparent 30%)`
- `linear-gradient(155deg, rgba(255,255,255,0.06), rgba(7,10,16,0.94) 72%)`

### Standard Surface

- `radial-gradient(circle at top right, rgba(166,232,255,0.08), transparent 24%)`
- `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(7,10,16,0.90))`

### Metallic CTA

- `linear-gradient(180deg, rgba(248,250,252,0.98), rgba(208,216,226,0.90))`

- Use glow as atmosphere, not decoration.
- Primary glow color is the AMO optical cyan at very low opacity.
- Standard card shadow: deep black depth plus a faint inner highlight.
- Header, footer, and hero cards may carry one concentrated blur bloom.
- Never stack multiple colorful glows on one surface.

## Section Spacing

- Header offset under fixed nav: `pt-28 / pt-32 / pt-36`
- Standard page bottom padding: `pb-16 / pb-20 / pb-24`
- Section padding: `py-14 / py-20 / py-24`
- Card padding: `p-5`, `p-6`, `p-8`
- Grid gaps: default `gap-6`, large content grids `gap-8`
- Copy width: keep descriptive text near `max-w-3xl`

### Rhythm

- Lead with one strong surface.
- Follow with one clear content grid.
- Avoid stacking too many similar panels without spacing resets.

## Button Styles

### Primary

- Metallic light fill
- Dark text
- Rounded full pill
- Slight lift on hover
- Reserved for main CTA such as `Get Quote`

### Secondary

- Dark glass surface
- White text
- Fine white border
- Used for secondary navigation and supporting actions

### Ghost

- Transparent by default
- Text-led utility action
- Only used where visual weight must stay low

## Card Styles

### Hero Card

- Stronger radial glow
- Higher contrast gradient
- Used for page intros, critical summaries, and CTA blocks

### Default Card

- Subtle glow
- Soft metallic top highlight
- Used for product, blog, and case cards

### Subtle Card

- Lowest contrast surface
- Used for supporting content, specs, FAQs, and loading states

### Rules

- Rounded corners are generous: around `2rem`
- Borders stay thin and pale
- Hover motion is small and deliberate
- Avoid flat gray rectangles

## Navigation Rules

- Homepage navigation is separate and protected.
- Navigation is fixed at the top of the viewport.
- Shell uses black translucent glass with heavy blur.
- Brand mark is text-first: `AMO` plus a restrained descriptor.
- Main links: `Products`, `Cases`, `OEM & ODM`, `Blog`, `About`, `Contact`
- `Get Quote` is the only primary CTA in the nav.
- Active routes use a filled glass state with subtle glow.
- Hover states brighten gently; no loud underline or colorful sweep.
- Mobile nav expands as a dark card stack, not a generic SaaS drawer.

## Footer Rules

- Homepage footer is separate and protected.
- Footer is compact, premium, and B2B.
- Lead with positioning statement and contact coordinates.
- Include product categories, OEM / ODM routes, and a direct contact CTA.
- Background uses a restrained radial glow over black.
- Social areas stay placeholder-grade unless real channels are approved.
- Never turn the footer into a crowded ecommerce sitemap wall.

## Motion Rules

- Motion is slow, quiet, and sparse.
- Hover transitions should feel like pressure changes, not bounce.
- Use float, drift, or pulse only in the homepage storytelling layers.
- Content pages should rely mostly on opacity, border, and shadow transitions.
- Respect `prefers-reduced-motion`.

## Responsive Rules

- Fixed navigation must preserve comfortable horizontal breathing room on mobile.
- Inner-page content widths narrow progressively from `wide` to `content` shells.
- Cards may stack earlier rather than compressing into dense multi-column layouts.
- Footer columns collapse into readable vertical groups before text gets cramped.
- Mobile menus should feel like glass panels, not generic app drawers.

## Product Image Presentation Rules

- Product presentation should feel staged, architectural, and high-value.
- Favor dark framed environments with a single focal glow.
- Keep generous negative space around the product object.
- Use grids, rings, or thin guide lines to imply precision.
- Avoid busy backgrounds, loud gradients, or marketplace-style thumbnails.
- If a real product image is missing, use a premium abstract presentation frame rather than a cheap placeholder box.

## Page Layout Rules

- Use a shared `PageShell` for all non-homepage routes.
- Start each page with one clear intro surface.
- Keep content inside a controlled max width.
- Use consistent spacing under the fixed navigation.
- Prefer one or two grid structures per page rather than many small layout shifts.
- Preserve the homepage as the visual reference point; extend it rather than replacing it.

## Do / Don’t

### Do

- Use black glass surfaces with restrained cyan light
- Keep typography clean, spacious, and technically confident
- Make CTA hierarchy obvious
- Let pages breathe with large margins and simple section order
- Reuse the shared button, card, heading, and shell components

### Don’t

- Don’t introduce colorful startup gradients
- Don’t use cheap ecommerce badges, ribbons, or dense icon clutter
- Don’t over-animate cards or navigation
- Don’t flatten pages into plain dark boxes with no depth
- Don’t break the homepage direction with unrelated visual themes
