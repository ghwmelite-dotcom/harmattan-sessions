import { describe, it, expect } from 'vitest';
import { isValidEmail, normalizeEmail } from '../src/lib/validation';
describe('isValidEmail', () => {
  it('accepts a normal address', () => { expect(isValidEmail('a@b.com')).toBe(true); });
  it('rejects missing @', () => { expect(isValidEmail('ab.com')).toBe(false); });
  it('rejects empty / spaces', () => { expect(isValidEmail('')).toBe(false); expect(isValidEmail('a b@c.com')).toBe(false); });
  it('rejects over-long input', () => { expect(isValidEmail('x'.repeat(255) + '@b.com')).toBe(false); });
});
describe('normalizeEmail', () => {
  it('lowercases and trims', () => { expect(normalizeEmail('  A@B.COM ')).toBe('a@b.com'); });
});
