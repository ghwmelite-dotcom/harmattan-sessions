/**
 * Newsletter endpoint tests.
 *
 * Integration cases (invalid email → 400, valid → 200 + persisted, honeypot → 200)
 * require @cloudflare/vitest-pool-workers with a miniflare D1 that has the
 * migration applied. These require the provisioned/migrated D1 (owner/CI step)
 * and are skipped here to keep the plain-vitest node suite green.
 *
 * The branching logic (validation, honeypot, rate-limit) is fully covered by
 * the unit tests in validation.test.ts and ratelimit.test.ts.
 * The persistence path is a single prepared statement in src/lib/db.ts.
 */
import { describe, it, expect } from 'vitest';

describe('newsletter endpoint (unit-level smoke)', () => {
  it('imports the validation module without throwing', async () => {
    const { isValidEmail } = await import('../src/lib/validation');
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('imports the ratelimit module without throwing', async () => {
    const { checkRateLimit } = await import('../src/lib/ratelimit');
    expect(typeof checkRateLimit).toBe('function');
  });

  it('imports the db module without throwing', async () => {
    const { upsertSubscriber } = await import('../src/lib/db');
    expect(typeof upsertSubscriber).toBe('function');
  });

  it('imports the email module without throwing', async () => {
    const { sendConfirmation } = await import('../src/lib/email');
    expect(typeof sendConfirmation).toBe('function');
  });

  // Integration: requires @cloudflare/vitest-pool-workers + provisioned D1 (owner/CI)
  it.skip('POST /api/newsletter with invalid email returns 400', async () => {
    // Requires miniflare D1 with migrations applied via defineWorkersConfig pool.
  });

  it.skip('POST /api/newsletter with valid email returns 200 and persists row', async () => {
    // Requires miniflare D1 with migrations applied via defineWorkersConfig pool.
  });

  it.skip('POST /api/newsletter with honeypot filled returns 200', async () => {
    // Requires miniflare D1 with migrations applied via defineWorkersConfig pool.
  });
});
