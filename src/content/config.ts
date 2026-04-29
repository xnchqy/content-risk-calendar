import { defineCollection, z } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    background: z.string(),
    riskPoints: z.array(z.string()).default([]),
    guidance: z.string(),
  }),
});

const months = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.number(),
    month: z.number(),
    deepStrategy: z.string().optional(),
  }),
});

export const collections = { events, months };
