# Suno Session 2 — Generation Plan

**Why:** Session 1 = only **7 distinct compositions** (4 Afro-Lofi + 3 Afrobeats Rain) = exactly 7 monthly singles (Jun–Dec 2026). The engine runs dry after that, and 6 of the 8 sounds have **zero** released tracks. Session 2 refuels the singles pipeline AND opens the rest of the catalog.

**When:** generate by **~September 2026** — before the Dec single, leaving lead time to triage + mix. Don't wait until empty.

**Budget:** Suno Pro = 500 credits/mo, ~14 used. Plenty. A full session (~40 generations) is ~40–80 credits.

---

## What to generate (the 6 unopened sounds + Afro-Lofi depth)

All prompts already written in `suno-launch-prompts.md` — reuse them. Order by strategic value:

| Priority | Sound | Prompts (in suno-launch-prompts.md) | Why this order |
|----------|-------|--------------------------------------|----------------|
| 1 | **Highlife Chill** | #8 Palmwine Evening · #9 Osu After Rain · #10 Jamestown Lighthouse | The cultural moat + AFRIMA "Best Alternative" play. Highest award value. |
| 2 | **Amapiano Lounge** | #17 Slow Log Drums · #18 Accra Hotel Lobby · #19 Night Drive N1 | Most Spotify-editorial-ready genre right now (amapiano wave). |
| 3 | **Afro-Soul Sunset** | #14 Labone Dawn · #15 Tema Coastline · #16 Midnight in Accra | Mainstream-adjacent (Tems lane); broadest playlist reach. |
| 4 | **Ancestral Ambient** | #11 Sankofa · #12 Aburi Mountain | Meditation crossover; AFRIMA "Inspirational" angle. ⚠️ cultural caution. |
| 5 | **Coastal Afro-House** | #23 Senya Beach 5AM · #24 Spa at Senya | Wellness/yoga audience; Beatport-eligible. |
| 6 | **Afro-Jazz Lounge** | #21 Saxophone Over Korle Lagoon · #22 Sax & Salt | Premium/dinner niche; smaller but high-value. |
| 7 | **Afro-Lofi depth** | re-run #1–4 + new variations | Keeps the workhorse sound stocked for monthly cadence into 2027. |

> Each anchor visual already exists for all 8 sounds — so once a sound's tracks are picked, its single covers + YouTube scene are ready to build via the Style Reference workflow (`single-cover-prompts.md`).

---

## Targets & method

- **~40 generations**, expect **~45% keep-rate** → ~18 keepers (matches Session 1)
- Generate **2 takes per prompt minimum**, then EXTEND keepers (Session 1 pattern: short take → pick → EXT to ~4 min)
- **Triage immediately** against the Three Laws:
  - **Law 1** — every keeper must have a *recognizable* West African element (highlife guitar, log drums, talking drum, kora, etc.). Generic lofi with an African name = **veto**.
  - The genre-specific "Listen for:" notes in `suno-launch-prompts.md` are the QC checklist (palmwine guitar must not sound Caribbean; kora must not sound like a harp; etc.).
- Save keepers to `tmp/suno-session-2/keepers/{sound}/` (gitignored, like Session 1)
- Log LUFS per keeper at triage so streaming-readiness is known upfront

---

## After Session 2 → feeds three engines

1. **Singles** — each new composition is a future monthly single (extends the calendar into 2027 across all 8 sounds)
2. **YouTube long-form** — enough per sound to build a 25-min+ mix per sound (Highlife Chill Vol.1, Amapiano Lounge Vol.1, etc.)
3. **The "Vol.1 album"** — by year-end, one signature track per sound = the 8-track AFRIMA/Grammy-submission compilation (`award-criteria.md`)

---

## One honest constraint — field recordings per sound

Each new *sound* needs its own **field recording** for Law 2 (the moat). Bortianor street ambience works for Afro-Lofi/urban sounds. But:
- **Highlife / Afro-Jazz** → a bar, evening crickets, a Jamestown street
- **Coastal House** → ocean / Senya beach
- **Ancestral Ambient** → wind / Aburi hills
- **Volta Sleep** → river water

So Session 2 generation should pair with a **field-recording capture list** — gather 3–4 more Accra/Ghana ambiences while out. Without them, the new sounds can't pass Law 2 for monetized upload. Build that capture list alongside the generation session.
