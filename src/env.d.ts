/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

// Cloudflare env bindings (accessed via `import { env } from "cloudflare:workers"` in Astro 6)
interface Env {
  DB: D1Database;
  RL: KVNamespace;
}

type Runtime = import('@astrojs/cloudflare').Runtime;
declare namespace App {
  interface Locals extends Runtime {}
}
