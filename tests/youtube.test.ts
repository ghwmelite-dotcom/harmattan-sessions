import { describe, it, expect } from 'vitest';
import { parseYouTubeFeed, tracksOnly, pickNowPlaying, fetchUploads, NOW_PLAYING_DEFAULT } from '../src/lib/youtube';

const FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Harmattan Sessions</title>
 <entry>
  <id>yt:video:aaa1</id><yt:videoId>aaa1</yt:videoId>
  <title>Tom &amp; Jerry Lofi</title>
  <published>2026-06-05T19:00:25+00:00</published>
  <media:group>
   <media:description>chill beats #lofi</media:description>
   <media:community><media:statistics views="968"/></media:community>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:bbb2</id><yt:videoId>bbb2</yt:videoId>
  <title>Quick Vibe #Shorts</title>
  <published>2026-06-04T19:00:25+00:00</published>
  <media:group>
   <media:description>a short</media:description>
   <media:community><media:statistics views="50"/></media:community>
  </media:group>
 </entry>
 <entry>
  <id>yt:video:ccc3</id><yt:videoId>ccc3</yt:videoId>
  <title>Osu Rooftop</title>
  <published>2026-06-03T19:00:25+00:00</published>
  <media:group><media:description>no stats here</media:description></media:group>
 </entry>
 <entry>
  <title>Broken entry with no videoId</title>
 </entry>
</feed>`;

describe('parseYouTubeFeed', () => {
  it('parses valid entries, skips ones missing a videoId', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(v.map((x) => x.id)).toEqual(['aaa1', 'bbb2', 'ccc3']);
  });
  it('decodes title entities and derives url + thumbnail from id', () => {
    const [first] = parseYouTubeFeed(FIXTURE);
    expect(first.title).toBe('Tom & Jerry Lofi');
    expect(first.url).toBe('https://www.youtube.com/watch?v=aaa1');
    expect(first.thumbnail).toBe('https://i.ytimg.com/vi/aaa1/hqdefault.jpg');
    expect(first.views).toBe(968);
  });
  it('flags Shorts by hashtag and yields null views when absent', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(v.find((x) => x.id === 'bbb2')!.isShort).toBe(true);
    expect(v.find((x) => x.id === 'aaa1')!.isShort).toBe(false);
    expect(v.find((x) => x.id === 'ccc3')!.views).toBeNull();
  });
  it('sorts newest first', () => {
    expect(parseYouTubeFeed(FIXTURE).map((x) => x.id)).toEqual(['aaa1', 'bbb2', 'ccc3']);
  });
});

describe('tracksOnly + pickNowPlaying', () => {
  it('excludes Shorts and picks the newest track title', () => {
    const v = parseYouTubeFeed(FIXTURE);
    expect(tracksOnly(v).map((x) => x.id)).toEqual(['aaa1', 'ccc3']);
    expect(pickNowPlaying(v)).toBe('Tom & Jerry Lofi');
  });
  it('falls back to the default when there are no tracks', () => {
    expect(pickNowPlaying([])).toBe(NOW_PLAYING_DEFAULT);
  });
});

describe('fetchUploads', () => {
  it('fetches the feed url and parses it', async () => {
    const fake = (async (url: string) => {
      expect(url).toContain('channel_id=UC_test');
      return { ok: true, text: async () => FIXTURE } as Response;
    }) as unknown as typeof fetch;
    const v = await fetchUploads(fake, 'UC_test');
    expect(v[0].id).toBe('aaa1');
  });
  it('throws on a non-ok response', async () => {
    const fake = (async () => ({ ok: false, status: 503 } as Response)) as unknown as typeof fetch;
    await expect(fetchUploads(fake, 'UC_test')).rejects.toThrow('503');
  });
});
