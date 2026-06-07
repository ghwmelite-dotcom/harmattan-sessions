import { describe, it, expect } from 'vitest';
import { toneConfig, TONE_CONFIG } from '../src/lib/fieldTones';

describe('toneConfig', () => {
  it('returns the matching config for each known tone', () => {
    for (const key of ['surf', 'hum', 'wind', 'street', 'rain'] as const) {
      expect(toneConfig(key)).toBe(TONE_CONFIG[key]);
    }
  });
  it('falls back to the wind config for unknown / empty keys', () => {
    expect(toneConfig('xyz')).toBe(TONE_CONFIG.wind);
    expect(toneConfig('')).toBe(TONE_CONFIG.wind);
  });
  it('every config has a filter, frequency and gain', () => {
    for (const cfg of Object.values(TONE_CONFIG)) {
      expect(typeof cfg.filter).toBe('string');
      expect(typeof cfg.freq).toBe('number');
      expect(typeof cfg.gain).toBe('number');
    }
  });
});
