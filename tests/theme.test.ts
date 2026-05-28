import { describe, it, expect } from 'vitest';
import { resolveTheme } from '../src/lib/theme-init';
describe('resolveTheme', () => {
  it('uses stored value when present', () => { expect(resolveTheme('light', true)).toBe('light'); expect(resolveTheme('dark', false)).toBe('dark'); });
  it('falls back to system light when no stored value', () => { expect(resolveTheme(null, true)).toBe('light'); });
  it('defaults to dark when no stored value and system not light', () => { expect(resolveTheme(null, false)).toBe('dark'); });
  it('ignores invalid stored values', () => { expect(resolveTheme('purple', false)).toBe('dark'); });
});
