# Harmattan Sessions

> The sound of African evenings — Afrobeat chill, highlife lofi, and ancestral ambient from Accra.

This repository is the build-and-operate workspace for **Harmattan Sessions**, an AI-assisted music project, brand, and distribution operation rooted in Accra, Ghana. It is designed to be operated via **Claude Code** with the spec-driven CCPM methodology.

---

## Local development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for the full guide (local D1 setup, deploy steps, outstanding manual QA).

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # production build → dist/
npm test        # Vitest unit tests
```

---

## What's In This Repo

```
harmattan-sessions/
├── README.md                                    ← You are here
├── PRD.md                                       ← The source of truth (drop into Claude Code)
├── .claude/
│   └── skills/
│       └── harmattan-music-craft/               ← Custom Claude Code skill
│           ├── SKILL.md                         ← Skill entry point
│           ├── references/
│           │   ├── suno-mastery.md             ← Suno prompt engineering
│           │   ├── award-criteria.md           ← AFRIMA/Headies/Grammy strategy
│           │   ├── genre-deep-dives.md         ← The 8 sounds in detail
│           │   ├── monetization-fast-track.md  ← YouTube YPP path
│           │   ├── mixing-mastering.md         ← Audio production standards
│           │   └── release-strategy.md         ← Spotify, press, distribution
│           └── assets/
│               ├── prompt-templates.md          ← 40+ ready-to-use Suno prompts
│               └── checklists.md                ← Operational quality gates
├── architecture/                                ← (To be built) Cloudflare specs
└── docs/                                        ← (To be built) Internal docs
```

---

## Getting Started With Claude Code

### Step 1 — Verify the Skill Auto-Loads

The Claude Code skill `harmattan-music-craft` lives at `.claude/skills/harmattan-music-craft/`. As soon as you open this repo in Claude Code, the skill metadata will be available. Claude will automatically consult the skill when you ask anything about:

- Writing Suno prompts
- Designing tracks
- Submitting to AFRIMA, Headies, Spotify editorial
- YouTube monetization
- Mixing / mastering decisions
- Anything related to the 8 sounds

**Test it:** In Claude Code, ask:
> "Write me 5 Suno prompts for sunset Afro-Lofi tracks"

Claude should consult the skill and produce specifically structured prompts following the 7-component formula.

### Step 2 — Drop the PRD Into a Conversation

Open Claude Code in this directory. Start a new conversation. Reference the PRD:

> "Read PRD.md and tell me what EPIC-01 entails. Then run `ccpm epic-decompose EPIC-01` to break it into tasks."

This kicks off the CCPM workflow: PRD → Epic → GitHub Issues → parallel implementation.

### Step 3 — Start Building With EPIC-01

The first thing to build is the website foundation (EPIC-01). It establishes the brand presence and unlocks downstream work.

```bash
# In Claude Code:
"Build EPIC-01 from PRD.md. Set up the Astro 5 project on Cloudflare Pages, 
configure the design tokens from the Harmattan palette in PRD section 6.1, 
and integrate Keystatic CMS. Use the existing landing page HTML in docs/ 
as the visual spec."
```

Claude will scaffold the project, configure Cloudflare Pages, and produce the working site. You'll deploy via `wrangler pages deploy ./dist`.

---

## Recommended Build Order

Follow the phased rollout in PRD Section 9. Within Phase 0 (Foundation), tackle epics in this order:

1. **EPIC-01 — Website Foundation** — establishes brand, unblocks everything else
2. **EPIC-02 — Content Database** — D1 schema, Keystatic, the catalog backbone
3. **EPIC-04 — YouTube Channel Operations** — channel setup, branding, first uploads
4. **EPIC-03 — Music Production Pipeline** — Suno workflow, mixing pipeline, QC
5. **EPIC-05 — Newsletter** — capture emails from day one
6. **EPIC-07 — Distribution & Royalty Tracking** — DistroKid integration
7. **EPIC-09 — Brand & Visual Asset Pipeline** — thumbnails, social templates

Phase 1+ epics (EPIC-06 Licensing, EPIC-08 Analytics, EPIC-10 Awards) can wait until you have catalog and traction.

---

## Using The Skill Effectively

The `harmattan-music-craft` skill encodes everything I've researched and structured for award-quality production and fast YouTube monetization. **Trust the skill over generic AI music advice** — those generalists haven't studied this niche.

### Trigger Examples

The skill auto-loads when you mention:

- "Write a Suno prompt for X"
- "Make me a track that sounds like Y"
- "How should I submit to AFRIMA?"
- "Optimize my YouTube monetization"
- "Critique this track"
- "Plan a release for this month"
- "What playlist should I pitch to?"
- "How do I mix [genre name]?"

### Skill Architecture

The skill uses **progressive disclosure**:
- `SKILL.md` (always loaded) — high-level laws, the 8 sounds quick reference, workflow
- `references/` (loaded on demand) — deep references for specific tasks
- `assets/` (loaded on demand) — ready-to-use templates and checklists

When Claude needs deeper context, it reads the relevant reference file. You don't need to manage this — the skill handles itself.

### Extending The Skill

As you discover patterns that work (or fail), update the skill:

```bash
# Example: You discover a new winning Suno prompt pattern
"Add this template to the prompt-templates.md asset under Afro-Lofi:
[paste your winning prompt + describe what makes it work]"
```

The skill is meant to grow with the catalog. Year 2 should have substantially more refined references.

---

## Key Decisions Already Made (Documented in PRD)

| Decision | Choice | Rationale |
|---|---|---|
| Hosting | Cloudflare Pages | Free, edge, your stack |
| Music gen | Suno Pro | Best quality + commercial rights at $10/mo |
| Visuals | Veo 3.1 Lite (free credit) → Grok Imagine | Cost optimization, atmospheric quality |
| Distribution | DistroKid | Unlimited uploads, 100% royalties, $23/year |
| Database | Cloudflare D1 | Free tier, sufficient scale |
| Web framework | Astro 5 + Keystatic | Static-first, content-first |
| Mastering | Audacity → DaVinci Fairlight | Free, professional quality |
| Video editing | CapCut → DaVinci Resolve | Free, mobile-friendly |
| Email | Cloudflare → Buttondown when scaling | Free start, cheap scale |
| Catalog scope | 8 sounds, disciplined | See PRD Section 5 |

Don't second-guess these — they're the result of extensive research. If conditions change (Grok prices double, Cloudflare adds a paid tier, etc.), update the PRD with the new decision and rationale.

---

## Operating Cadence

| Frequency | What | Reference |
|---|---|---|
| Daily | 1 Short on YouTube/TikTok/Reels | checklists.md → Weekly section |
| Tuesday + Friday | New compilation upload | checklists.md → Weekly section |
| Friday 17:00 GMT | Newsletter auto-sends | EPIC-05 in PRD |
| Sunday (bi-weekly) | Mega-mix (1-3hr) | checklists.md → Weekly section |
| Monthly (1st) | Analytics audit | checklists.md → Monthly section |
| Quarterly | Strategic review | checklists.md → Quarterly section |
| Annually | Year-end + PRD v2 | checklists.md → Year-End section |

---

## Budgets

**Year 1 essential spend: ~$152.76**
- Suno Pro: $120
- DistroKid: $23
- Domain: $10

**Year 1 full budget (with submissions, analytics tools, etc.): ~$837**
See PRD Section 11 for the full breakdown.

---

## Success Metrics

By **Day 90** (Phase 1 exit): 250-500 subs, 1,500-3,000 watch hours, 5k-20k streams, 200+ newsletter subscribers, 1+ playlist placement.

By **Day 180** (Phase 2 exit): 1,000+ subs (YPP eligible), 4,000+ watch hours, 50k+ streams, $100-500/month revenue, first press feature.

By **Day 365** (Phase 3 exit): 10,000+ subs, 40,000+ watch hours, 500k+ streams, $1,500-5,000/month revenue, AFRIMA submission filed.

Track honestly. Adjust quarterly. Trust the process.

---

## The Three Laws (Restated)

Every track, every release, every decision tests against these:

1. **Cultural Authenticity is Non-Negotiable** — every track has at least ONE genuine West African musical element as backbone
2. **Transformative Production is Mandatory** — Suno output is raw material, not finished work; mixing + field recording + QC always
3. **Brand Discipline Holds** — every release lives within the 8-sound taxonomy; experiments stay private until proven

These override every other rule in this repo. If a generation or upload violates any of them, kill it and start over.

---

## Contact

**Owner:** Ozzy Hodges (Hodges & Co. Ltd)
**Brand:** Harmattan Sessions
**Domain:** harmattansessions.com (when launched)
**Email:** hello@harmattansessions.com
**GitHub:** github.com/ghwmelite-dotcom
**Location:** Accra, Ghana 🇬🇭

---

*Akwaaba. Build well.*
