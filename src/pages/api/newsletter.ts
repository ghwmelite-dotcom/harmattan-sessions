import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { isValidEmail, normalizeEmail } from '../../lib/validation';
import { checkRateLimit } from '../../lib/ratelimit';
import { upsertSubscriber } from '../../lib/db';
import { sendConfirmation } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ok = () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), { status: 400 }); }

  if (typeof body.website === 'string' && body.website.length > 0) return ok(); // honeypot
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  const source = typeof body.source === 'string' ? body.source : 'unknown';
  if (!isValidEmail(email)) return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400, headers: { 'content-type': 'application/json' } });

  const allowed = await checkRateLimit(env.RL, clientAddress ?? 'unknown', 5, 3600);
  if (!allowed) return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429, headers: { 'content-type': 'application/json' } });

  const token = crypto.randomUUID();
  await upsertSubscriber(env.DB, email, source, token);
  await sendConfirmation({ email, token });
  return ok();
};
