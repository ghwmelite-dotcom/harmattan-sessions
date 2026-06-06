export interface Video {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  views: number | null;
  isShort: boolean;
}

export const NOW_PLAYING_DEFAULT = 'Labadi Sunset · Afro-Lofi';

export function feedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&'); // ampersand last so it doesn't double-decode
}

const SHORTS_RE = /#shorts?\b/i;

function field(block: string, re: RegExp): string | null {
  const m = block.match(re);
  return m ? m[1] : null;
}

export function parseYouTubeFeed(xml: string): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: Video[] = [];
  for (const e of entries) {
    const id = field(e, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const rawTitle = field(e, /<title>([\s\S]*?)<\/title>/);
    if (!id || rawTitle == null) continue;
    const viewsStr = field(e, /<media:statistics views="(\d+)"/);
    const description = field(e, /<media:description>([\s\S]*?)<\/media:description>/) ?? '';
    videos.push({
      id,
      title: decodeEntities(rawTitle).trim(),
      url: `https://www.youtube.com/watch?v=${id}`,
      publishedAt: field(e, /<published>([^<]+)<\/published>/) ?? '',
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      views: viewsStr ? Number(viewsStr) : null,
      isShort: SHORTS_RE.test(rawTitle) || SHORTS_RE.test(description),
    });
  }
  videos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return videos;
}

export function tracksOnly(videos: Video[]): Video[] {
  return videos.filter((v) => !v.isShort);
}

export function pickNowPlaying(videos: Video[]): string {
  const t = tracksOnly(videos)[0];
  return t ? t.title : NOW_PLAYING_DEFAULT;
}

export async function fetchUploads(fetchImpl: typeof fetch, channelId: string): Promise<Video[]> {
  const res = await fetchImpl(feedUrl(channelId), {
    headers: { 'user-agent': 'HarmattanSessions/1.0 (+https://hs.ohwpstudios.org)' },
  });
  if (!res.ok) throw new Error(`YouTube feed HTTP ${res.status}`);
  return parseYouTubeFeed(await res.text());
}
