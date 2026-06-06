import { describe, it, expect } from 'vitest';
import { cardHTML } from '../src/lib/videoCard';

const NOW = Date.parse('2026-06-07T19:00:25Z');

describe('cardHTML', () => {
  const base = { id: 'aaa1', title: 'Tom & Jerry', publishedAt: '2026-06-05T19:00:25+00:00', views: 968 };

  it('links to YouTube in a new tab with the derived thumbnail', () => {
    const h = cardHTML(base, NOW);
    expect(h).toContain('href="https://www.youtube.com/watch?v=aaa1"');
    expect(h).toContain('target="_blank"');
    expect(h).toContain('rel="noopener"');
    expect(h).toContain('https://i.ytimg.com/vi/aaa1/hqdefault.jpg');
  });
  it('escapes the title to prevent markup injection', () => {
    const h = cardHTML({ ...base, title: '<script>x</script> & "q"' }, NOW);
    expect(h).toContain('&lt;script&gt;x&lt;/script&gt; &amp; &quot;q&quot;');
    expect(h).not.toContain('<script>x</script>');
  });
  it('builds a meta line with relative date and views', () => {
    expect(cardHTML(base, NOW)).toContain('2 days ago · 968 views');
  });
  it('omits views when null', () => {
    const h = cardHTML({ ...base, views: null }, NOW);
    expect(h).toContain('2 days ago');
    expect(h).not.toContain('·');
  });
});
