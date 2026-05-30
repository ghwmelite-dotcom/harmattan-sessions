# DistroKid + Payout Account Setup (Ghana)

The hard gate before any streaming single. Two things: (A) an account to **receive** royalties in USD, and (B) the DistroKid account itself. Do A first — it's the part that can stall.

---

## ⚠️ Read this first — the Ghana payout reality

DistroKid pays royalties out. The catch for Ghana:

- **PayPal does NOT work** — Ghanaian PayPal accounts can *send* but not *receive* money. So PayPal is out as a payout method.
- **You need a USD-capable receiving account.** Options, roughly in order of how reliable they are for Ghana creators today:
  1. **Payoneer** — long the standard for Ghanaian freelancers/creators. Gives you US/UK/EU "receiving account" details. ✅ Most proven.
  2. **Grey / Geegpay / Eversend** — newer African fintech apps that issue USD virtual accounts + cards. Increasingly popular with Ghanaian creators; faster KYC. ✅ Good modern option.
  3. **Wise** — excellent product, BUT *verify it accepts Ghana residents for receiving/holding USD* before relying on it. Historically Wise has limited Ghana to sending only. **Check this first** — don't assume.

> **Honest note:** I can't verify any provider's current Ghana policy from here. Pricing and country support change. Confirm on each provider's site before committing time. If Wise won't open a receiving account for Ghana, **Payoneer is the fallback** and pairs fine with DistroKid.

**Also check:** what payout methods DistroKid currently offers for your country (Settings → Bank/Money), and pick the account from above that matches. DistroKid commonly supports PayPal (no good for GH) and direct bank/wire/"Tipalti" style payouts — match your chosen account to what's available.

---

## PART A — Payout account ✅ DONE

**User has a GREY account** (USD virtual account — Ghana-friendly). This covers receiving DistroKid royalties. Use the Grey USD account details (or Grey virtual card) when connecting DistroKid's payout in Part B. Wise was NOT used — it restricts Ghana to send-only.

---

## PART B — DistroKid account

- [ ] Go to distrokid.com → choose the **Musician plan** (~$22.99/yr — *verify current price*; it's the unlimited-uploads tier you want)
- [ ] Pay the subscription with a card (Ghana Visa/Mastercard, or your Payoneer/Grey virtual USD card)
- [ ] **Artist name:** `Harmattan Sessions` (exact — this becomes your Spotify/Apple artist identity)
- [ ] **Label name:** leave blank (DistroKid acts as label) OR `Hodges & Co.`
- [ ] Settings → **Money/Bank:** connect the Part-A payout account
- [ ] Settings → confirm **legal name + country = Ghana** for tax/payout

---

## PART C — First release: Labadi Sunset · **RELEASE DATE FRI JUNE 12, 2026**

Single #1. Both assets READY ✅.

- [x] **Master:** `tmp/suno-session-1/keepers/afro-lofi/01-afro-lofi-labadi-sunset-v1-EXT.wav` (−14.2 LUFS, ready)
- [x] **Cover:** `C:\Users\USER\Downloads\Harmattan Single Covers\01-labadi-sunset-3000.png` (3000×3000, done)
- [ ] Title: `Labadi Sunset` · Release title: `Labadi Sunset` (single) · Artist: `Harmattan Sessions` (EXACT)
- [ ] **Genre:** primary Afrobeat (2nd Electronic, or blank)
- [ ] **Instrumental?:** Yes
- [ ] **Explicit:** No
- [ ] **Songwriter:** your legal name (first + last)
- [ ] **Release date:** **Friday 12 June 2026** (≥14 days out → Spotify editorial pitch window open)
- [ ] **Pre-save:** ENABLE
- [ ] **Stores:** all (Spotify, Apple, Tidal, Amazon, YouTube Music, etc.)
- [ ] Enable: **YouTube Content ID**, **Shazam**, **TikTok/IG licensing**
- [ ] **AI disclosure** in any songwriter/credits/notes field: "Composition AI-assisted; mixing, mastering, curation & field recording by [legal name], Accra."

### After upload submits → claim profiles + pitch
- [ ] Once release is "processing/live": claim **Spotify for Artists** + **Apple Music for Artists**
- [ ] Pitch **Labadi Sunset** via Spotify for Artists (do it ASAP after submit — needs ~7+ days before Jun 12)

**Spotify "Pitch a Song" — paste these:**
- Genres: Afrobeats · Instrumental · Chill
- Moods: Chill · Sunset · Focus
- Styles: Instrumental · Acoustic · Smooth
- Culture: African
- Description (≤500 chars):
```
"Labadi Sunset" is an Afro-Lofi instrumental from Harmattan Sessions, an independent project rooted in Accra, Ghana. It blends palmwine-highlife guitar phrasing with warm sub-bass and brushed shakers, layered over original field recordings captured in Greater Accra. Built for golden-hour focus and study. Composition AI-assisted; mixing, mastering, curation and field recording by Ozzy Hodges. Independent release, 2026 — curated chill from West Africa.
```

### Release-day (Jun 12)
- [ ] Grab Spotify URL → swap YouTube Short CTA "Full mix on YouTube" → "Full track on Spotify"
- [ ] Add Spotify link to site footer (`siteConfig.ts` platforms → replace Spotify `#`)
- [ ] Post the Labadi Sunset cover + Short across X/IG/TikTok with the streaming link

---

## After it's submitted

- [ ] Wait for it to reach "processing/live", then claim **Spotify for Artists** + **Apple Music for Artists** (verify ownership of the Harmattan Sessions profile)
- [ ] Within the 7–14 day pre-release window: **pitch Labadi Sunset** via Spotify for Artists (pitch text in `distrokid-release-plan.md`)
- [ ] On release day: grab the Spotify URL → **swap the YouTube Short CTA** from "Full mix on YouTube" to "Full track on Spotify", and add the link to the site footer (`siteConfig.ts` platforms → replace the Spotify `#`)

---

## What I can't do for you here

Signups, KYC, and banking are yours — they need your ID and decisions. What I CAN do once you're set up:
- Generate the distinct **Labadi Sunset cover** (Ideogram prompt is ready)
- Write the exact **Spotify pitch** filled in for the chosen release date
- Patch `siteConfig.ts` + the Short the day Spotify goes live
