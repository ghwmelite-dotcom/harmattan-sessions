# last30days — REFERENCE DOCS ONLY (not an installed/runnable skill)

⚠️ **This is documentation only.** The actual `last30days` skill (github.com/mvanhorn/last30days-skill, MIT) is **NOT installed** here — none of its Python pipeline, scripts, or the SessionStart hook are present. These markdown files are kept purely as reference so the *capability and method* are on hand.

## Why docs-only (deliberate decision, 2026-05-31)
Audited the real repo. It's legitimate (MIT, ~66 Python files, no obfuscation/exfil), BUT two behaviors made a full install undesirable:
1. **Reads & decrypts browser cookies** (`chrome_cookies.py`) to scrape X/socials as the logged-in user.
2. **Installs a `SessionStart` hook** (`check-config.sh`) that auto-runs every session.
Neither is malicious, but both are standing/automatic behaviors we chose not to adopt.

## What it does (for reference)
Aggregates the last 30 days of activity on any topic across Reddit, X, YouTube, TikTok, Hacker News, GitHub, Polymarket, Bluesky, etc., ranked by real engagement. Useful for: competitor/trend research (other Afro-lofi channels, what's resonating in lofi/Afrobeats), brand-mention monitoring, finding playlist curators.

## If a real research need comes up
Don't auto-install the plugin. Instead, run the **specific** script deliberately and one-off (free no-key sources only: Reddit, Hacker News, GitHub, Polymarket). The how-to is in `references/setup.md` + `references/sources.md`. Treat any browser-cookie or paid-API step as an explicit, separate decision.

Files: `SKILL-reference.md` (the original skill doc) + `references/` (sources, output-format, setup, troubleshooting).
