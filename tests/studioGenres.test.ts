import { describe, it, expect } from 'vitest';
import { studioGenres, getStudioGenres, type StudioGenre } from '../src/data/studioGenres';

describe('studioGenres data', () => {
  it('has exactly six genres', () => {
    expect(studioGenres).toHaveLength(6);
  });

  it('exposes every required field on each genre', () => {
    for (const g of studioGenres as StudioGenre[]) {
      expect(g.name).toBeTruthy();
      expect(g.tempo).toMatch(/BPM/);
      expect(g.signature).toBeTruthy();
      expect(['Lyric · 4-pass', 'Instrumental']).toContain(g.path);
      expect(g.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(typeof g.order).toBe('number');
    }
  });

  it('has unique, contiguous order values 1..6', () => {
    const orders = studioGenres.map((g) => g.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('getStudioGenres returns them sorted by order', () => {
    const sorted = getStudioGenres();
    const orders = sorted.map((g) => g.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('includes the instrumental Afro-lofi path exactly once', () => {
    expect(studioGenres.filter((g) => g.path === 'Instrumental')).toHaveLength(1);
    expect(studioGenres.find((g) => g.path === 'Instrumental')?.name).toBe('Afro-lofi');
  });
});
