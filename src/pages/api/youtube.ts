import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { fetchUploads, tracksOnly, pickNowPlaying, NOW_PLAYING_DEFAULT } from '../../lib/youtube';
import { siteConfig } from '../../siteConfig';

export const prerender = false;
const KEY = 'yt:uploads';
const JSON_HEADERS = { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' };

export const GET: APIRoute = async () => {
  const cached = await env.RL.get(KEY);
  if (cached) return new Response(cached, { headers: JSON_HEADERS });

  let body: string;
  try {
    const all = await fetchUploads(fetch, siteConfig.youtubeChannelId);
    const videos = tracksOnly(all).slice(0, 15).map((v) => ({
      id: v.id, title: v.title, publishedAt: v.publishedAt, views: v.views,
    }));
    body = JSON.stringify({ videos, nowPlaying: pickNowPlaying(all) });
    await env.RL.put(KEY, body, { expirationTtl: 1800 });
  } catch {
    body = JSON.stringify({ videos: [], nowPlaying: NOW_PLAYING_DEFAULT });
  }
  return new Response(body, { headers: JSON_HEADERS });
};
