import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const sounds = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sounds' }),
  schema: z.object({
    name: z.string(), bpmRange: z.string(), mood: z.string(),
    order: z.number(), chipFrom: z.string(), chipTo: z.string(), blurb: z.string().optional(),
  }),
});

const fieldRecordings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/field-recordings' }),
  schema: z.object({
    location: z.string(), description: z.string(), order: z.number(),
    x: z.number(), y: z.number(),
    tone: z.enum(['surf', 'hum', 'wind', 'street', 'rain']),
    audio: z.string().optional(),
  }),
});

export const collections = { sounds, 'field-recordings': fieldRecordings };
