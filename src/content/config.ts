import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tratamientos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tratamientos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    serviceName: z.string(),
    city: z.string().default('Punto Fijo'),
    intro: z.string(),
    benefits: z.array(z.string()).default([]),
    duration: z.string().optional(),
    idealFor: z.string().optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
    lastReviewed: z.string(),
    imageAlt: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    pubDate: z.string(),
    lastReviewed: z.string(),
    tags: z.array(z.string()).default([]),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { tratamientos, blog };
