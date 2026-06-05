import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudyType = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "sector", title: "Sector", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
});

