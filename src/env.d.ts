/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

// Astro 6 + @astrojs/cloudflare v13: `Astro.locals.runtime.env` was removed.
// Access bindings via `import { env } from "cloudflare:workers"`.
// Augmenting Cloudflare.Env types that `env` import for the whole project.
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    RL: KVNamespace;
  }
}

// Ambient declaration for Cloudflare Workers virtual module.
// The @astrojs/cloudflare adapter provides this at runtime; we declare
// it here so TypeScript resolves `import { env } from "cloudflare:workers"`.
declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}
