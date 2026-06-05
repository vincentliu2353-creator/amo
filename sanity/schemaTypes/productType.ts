import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Planar Motor", "Levitation Stage", "Transfer Module", "OEM Platform"],
      },
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "highlight", title: "Highlight", type: "string" }),
    defineField({ name: "leadTime", title: "Lead time", type: "string" }),
    defineField({ name: "minOrderQty", title: "Minimum order quantity", type: "string" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
});

