import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/ratelimit';
function fakeKV() {
  const store = new Map<string, string>();
  return { store,
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => { store.set(k, v); },
  } as any;
}
describe('checkRateLimit', () => {
  it('allows under the limit and blocks at the limit', async () => {
    const kv = fakeKV();
    for (let i = 0; i < 5; i++) expect(await checkRateLimit(kv, '1.1.1.1', 5, 3600)).toBe(true);
    expect(await checkRateLimit(kv, '1.1.1.1', 5, 3600)).toBe(false);
  });
  it('separates keys by ip', async () => {
    const kv = fakeKV();
    expect(await checkRateLimit(kv, 'a', 1, 3600)).toBe(true);
    expect(await checkRateLimit(kv, 'b', 1, 3600)).toBe(true);
  });
});
