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

const mixes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc,json}', base: './src/content/mixes' }),
  schema: ({ image }) => z.object({
    title: z.string(), primaryGenre: z.string(), durationSeconds: z.number().optional(),
    youtubeVideoId: z.string().optional(), spotifyPlaylistId: z.string().optional(),
    bandcampUrl: z.string().optional(), thumbnail: image().optional(),
    releasedAt: z.coerce.date(), isPublished: z.boolean().default(false),
  }),
});

const fieldRecordings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/field-recordings' }),
  schema: z.object({ location: z.string(), description: z.string(), order: z.number() }),
});

export const collections = { sounds, mixes, 'field-recordings': fieldRecordings };
