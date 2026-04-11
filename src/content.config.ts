import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { VALID_TAGS } from "./data/tag-data";
import { authors } from "./data/author-data";

const authorKeys = Object.keys(authors) as [string, ...string[]];

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.enum(authorKeys),
    tags: z.array(z.enum(VALID_TAGS)).min(1),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    ogImage: z.string().optional(),
    readingTime: z.number().optional(),
    tldr: z.string(),
    keyTakeaways: z.array(z.string()).min(1),
    faqEntries: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blog };
