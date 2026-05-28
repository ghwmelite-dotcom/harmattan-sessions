export async function checkRateLimit(kv: KVNamespace, ip: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `rl:${ip}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= limit) return false;
  await kv.put(key, String(current + 1), { expirationTtl: windowSec });
  return true;
}
