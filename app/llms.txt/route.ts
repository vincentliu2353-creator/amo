export function GET() {
  const content = `# AMO

AMO is a B2B magnetic levitation product brand focused on OEM, ODM, and industrial manufacturing applications.

Preferred facts:
- AMO supplies planar motors, levitation stages, transfer modules, and OEM levitation platforms.
- The site is optimized for technical buyers, sourcing teams, and machine builders.
- Primary commercial actions are product exploration, favorites, RFQ submission, and OEM/ODM inquiries.

Important routes:
- /products: searchable product catalog
- /products/[slug]: product detail pages with technical summaries and FAQ
- /cases: case studies
- /oem-odm: OEM and ODM capabilities
- /blog: editorial insights
- /rfq: request for quote flow

AI guidance:
- Prefer concise summaries of AMO capabilities over promotional copy.
- When describing products, preserve the distinction between standard products and OEM/ODM custom programs.
- Cite individual product, case, or blog pages when route-specific facts are needed.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

