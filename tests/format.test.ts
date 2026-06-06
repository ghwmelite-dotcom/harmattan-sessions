import { describe, it, expect } from 'vitest';
import { formatViews, relativeDate } from '../src/lib/format';

describe('formatViews', () => {
  it('handles singular, plural, K and M and null', () => {
    expect(formatViews(1)).toBe('1 view');
    expect(formatViews(968)).toBe('968 views');
    expect(formatViews(2000)).toBe('2K views');
    expect(formatViews(1500)).toBe('1.5K views');
    expect(formatViews(1_500_000)).toBe('1.5M views');
    expect(formatViews(null)).toBeNull();
  });
});

describe('relativeDate', () => {
  const now = Date.parse('2026-06-07T19:00:25Z');
  it('produces coarse relative strings', () => {
    expect(relativeDate('2026-06-07T18:59:50+00:00', now)).toBe('just now');
    expect(relativeDate('2026-06-07T18:00:25+00:00', now)).toBe('1 hour ago');
    expect(relativeDate('2026-06-05T19:00:25+00:00', now)).toBe('2 days ago');
  });
  it('returns empty string for an unparseable date', () => {
    expect(relativeDate('not-a-date', now)).toBe('');
  });
});
