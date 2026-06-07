import { describe, it, expect } from 'vitest';
import { clampVolume } from '../src/lib/player';

describe('clampVolume', () => {
  it('clamps to the 0..1 range', () => {
    expect(clampVolume(0.7)).toBe(0.7);
    expect(clampVolume(1.5)).toBe(1);
    expect(clampVolume(-0.2)).toBe(0);
    expect(clampVolume(0)).toBe(0);
    expect(clampVolume(1)).toBe(1);
  });
  it('returns 0 for non-finite input', () => {
    expect(clampVolume(NaN)).toBe(0);
    expect(clampVolume(Infinity)).toBe(1);
  });
});
