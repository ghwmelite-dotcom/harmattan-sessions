import { relativeDate, formatViews } from './format';

export interface CardVideo {
  id: string;
  title: string;
  publishedAt: string;
  views: number | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function cardHTML(v: CardVideo, now: number = Date.now()): string {
  const title = escapeHtml(v.title);
  const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const href = `https://www.youtube.com/watch?v=${v.id}`;
  const meta = escapeHtml([relativeDate(v.publishedAt, now), formatViews(v.views)].filter(Boolean).join(' · '));
  return (
    `<a class="vcard" href="${href}" target="_blank" rel="noopener" ` +
    `aria-label="Watch ${title} on YouTube (opens in a new tab)">` +
    `<span class="vcard-thumb"><img src="${thumb}" alt="${title}" loading="lazy" width="480" height="360" />` +
    `<span class="vcard-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none">` +
    `<circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.45)"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg></span></span>` +
    `<span class="vcard-title">${title}</span>` +
    `<span class="vcard-meta">${meta}</span>` +
    `</a>`
  );
}
