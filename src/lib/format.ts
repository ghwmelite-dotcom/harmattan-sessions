export function formatViews(n: number | null): string | null {
  if (n == null) return null;
  if (n < 1000) return `${n} view${n === 1 ? '' : 's'}`;
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K views`;
  }
  const m = n / 1_000_000;
  return `${m % 1 === 0 ? m : m.toFixed(1)}M views`;
}

export function relativeDate(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const s = Math.max(0, Math.floor((now - then) / 1000));
  const DAY = 86400;
  if (s < 60) return 'just now';
  if (s < 3600) { const m = Math.floor(s / 60); return `${m} minute${m === 1 ? '' : 's'} ago`; }
  if (s < DAY) { const h = Math.floor(s / 3600); return `${h} hour${h === 1 ? '' : 's'} ago`; }
  if (s < DAY * 7) { const d = Math.floor(s / DAY); return `${d} day${d === 1 ? '' : 's'} ago`; }
  if (s < DAY * 30) { const w = Math.floor(s / (DAY * 7)); return `${w} week${w === 1 ? '' : 's'} ago`; }
  if (s < DAY * 365) { const mo = Math.floor(s / (DAY * 30)); return `${mo} month${mo === 1 ? '' : 's'} ago`; }
  const y = Math.floor(s / (DAY * 365)); return `${y} year${y === 1 ? '' : 's'} ago`;
}
