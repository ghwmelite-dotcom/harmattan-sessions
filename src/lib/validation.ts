const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function normalizeEmail(input: string): string { return input.trim().toLowerCase(); }
export function isValidEmail(input: string): boolean {
  const e = normalizeEmail(input);
  return e.length > 0 && e.length <= 254 && EMAIL_RE.test(e);
}
