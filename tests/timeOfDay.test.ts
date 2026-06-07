import { describe, it, expect } from 'vitest';
import { phaseForHour, resolveTod, nextSetting, todInitScript } from '../src/lib/timeOfDay';

describe('phaseForHour', () => {
  it('maps each hour bucket and its boundaries', () => {
    expect(phaseForHour(4)).toBe('night');
    expect(phaseForHour(5)).toBe('dawn');
    expect(phaseForHour(8)).toBe('dawn');
    expect(phaseForHour(9)).toBe('day');
    expect(phaseForHour(16)).toBe('day');
    expect(phaseForHour(17)).toBe('dusk');
    expect(phaseForHour(20)).toBe('dusk');
    expect(phaseForHour(21)).toBe('night');
    expect(phaseForHour(0)).toBe('night');
    expect(phaseForHour(23)).toBe('night');
  });
});

describe('resolveTod', () => {
  it('returns an explicit stored phase unchanged', () => {
    expect(resolveTod('dusk', 10)).toBe('dusk');
    expect(resolveTod('night', 12)).toBe('night');
  });
  it('computes from the hour for auto / null / garbage', () => {
    expect(resolveTod('auto', 7)).toBe('dawn');
    expect(resolveTod(null, 23)).toBe('night');
    expect(resolveTod('not-a-phase', 12)).toBe('day');
  });
});

describe('nextSetting', () => {
  it('cycles auto -> dawn -> day -> dusk -> night -> auto', () => {
    expect(nextSetting('auto')).toBe('dawn');
    expect(nextSetting('dawn')).toBe('day');
    expect(nextSetting('day')).toBe('dusk');
    expect(nextSetting('dusk')).toBe('night');
    expect(nextSetting('night')).toBe('auto');
  });
  it('resets unknown values to auto', () => {
    expect(nextSetting('whatever' as never)).toBe('auto');
  });
});

describe('todInitScript', () => {
  it('references the data-tod attribute and the hs-tod storage key', () => {
    expect(todInitScript).toContain('data-tod');
    expect(todInitScript).toContain('hs-tod');
  });

  it('inline hour thresholds match phaseForHour for every hour (no drift)', () => {
    // Extract the inline `function(h){…}` phase expression and evaluate it against phaseForHour,
    // so the duplicated thresholds in the render-blocking string can never silently diverge.
    const m = todInitScript.match(/function\(h\)\{return ([\s\S]+?)\}\)/);
    expect(m).not.toBeNull();
    const inlinePhase = new Function('h', `return ${m![1]}`) as (h: number) => string;
    for (let h = 0; h < 24; h++) {
      expect(inlinePhase(h)).toBe(phaseForHour(h));
    }
  });
});
