import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCollection } from 'astro:content';
export const prerender = false;
export const GET: APIRoute = async () => {
  const cached = await env.RL.get('nowplaying');
  if (cached) return new Response(cached, { headers: { 'content-type': 'application/json' } });
  const mixes = (await getCollection('mixes')).filter((m) => m.data.isPublished)
    .sort((a, b) => +b.data.releasedAt - +a.data.releasedAt);
  const label = mixes[0]?.data.title ?? 'Labadi Sunset · Afro-Lofi';
  const body = JSON.stringify({ nowPlaying: label });
  await env.RL.put('nowplaying', body, { expirationTtl: 300 });
  return new Response(body, { headers: { 'content-type': 'application/json' } });
};
