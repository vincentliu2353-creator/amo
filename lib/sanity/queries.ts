import groq from "groq";

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt,
    author->{
      name
    }
  }
`;

export const productsQuery = groq`
  *[_type == "product"] | order(featured desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    summary,
    highlight,
    leadTime,
    minOrderQty,
    tags,
    applications
  }
`;

export const caseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    sector,
    summary
  }
`;

