# Operational Checklists — Asset Library

Run these checklists at the relevant moments. Each is a fast quality gate — if any item fails, stop and fix before proceeding.

## Pre-Upload QC Checklist (Run on Every Track Before Publishing)

Apply to every individual track AND every assembled compilation before it leaves your machine.

### Audio Quality
- [ ] Loudness measured at -14 LUFS ± 0.5 LUFS (use Audacity's Loudness Normalization)
- [ ] True peak below -1.0 dBFS (no clipping)
- [ ] No sudden volume jumps between sections / tracks in compilation
- [ ] First 30 seconds is the strongest moment of the track / compilation
- [ ] Final 5+ seconds gentle fade (especially sleep mixes)
- [ ] No silence gaps longer than 1.5 seconds anywhere
- [ ] Mono playback test passed (compatible with phone speakers)
- [ ] Headphone test passed — no harsh frequencies, no listening fatigue
- [ ] Bass test on real subwoofer / car (verify low end)

### Cultural / Brand Compliance
- [ ] Track contains at least ONE recognizable West African element (Law 1)
- [ ] Field recording layer present at -25 to -30dB (compilations only)
- [ ] Track fits within ONE of the 8 sounds (Law 3)
- [ ] Sonic identity test passed: would a Ghanaian listener recognize this as African music?

### File Hygiene
- [ ] Filename follows convention: `{slug}_master.wav` (e.g., `labadi-sunset_master.wav`)
- [ ] WAV master backed up to R2
- [ ] MP3 320kbps preview generated for web
- [ ] Suno generation ID recorded in tracking sheet
- [ ] Original prompt saved (you'll want it for similar future tracks)

### Metadata
- [ ] Title is final (no working titles)
- [ ] Genre is correctly assigned (one of the 8 sounds)
- [ ] BPM measured and recorded
- [ ] Duration noted (in seconds for D1)

**If even one item fails: do not upload. Fix or abandon.**

## Weekly Cadence Checklist (Run Every Monday)

Your standard production week sets up for Tuesday + Friday compilation drops.

### Monday — Plan + Generate
- [ ] Review last week's analytics (subs gained, watch hours, top videos)
- [ ] Identify which sound this week's compilations will feature
- [ ] Generate 16-24 raw Suno tracks (aim for 8-12 keepers after curation)
- [ ] Triage: rate each generation 1-5, keep only 4s and 5s
- [ ] Save raw winners to `/tracks/raw/YYYY-MM-DD/` with prompts

### Tuesday — Mix + Upload Compilation #1
- [ ] Select 6-10 tracks for Tuesday compilation
- [ ] Order tracks for emotional flow (mid → build → peak → wind down)
- [ ] Run mixing chain (HarmattanMaster macro)
- [ ] Layer field recording at -28dB
- [ ] Master compilation as one piece to -14 LUFS
- [ ] Generate chapter timestamps for description
- [ ] Render final visual (Veo/Grok loop)
- [ ] Create thumbnail (FLUX or Canva)
- [ ] Upload to YouTube with full SEO description template
- [ ] Schedule social posts (Instagram + TikTok + X)

### Wednesday — Shorts Day
- [ ] Generate 7 Shorts from existing catalog (one per day for the week)
- [ ] Use 30-60 second hooks from best tracks
- [ ] Add vertical visuals (9:16) — Grok generations or repurposed Veo loops
- [ ] Schedule via YouTube Studio (one per day)
- [ ] Cross-post to TikTok and Instagram Reels

### Thursday — Distribution + Submissions
- [ ] Upload week's best 2-3 tracks to DistroKid (for next-month release)
- [ ] Submit pending releases to DailyPlaylists (10+ playlists)
- [ ] Submit to 1-2 SubmitHub curators ($1-5 each)
- [ ] Update D1 catalog with new tracks + status
- [ ] Update submission tracker

### Friday — Compilation #2 + Newsletter
- [ ] Repeat Tuesday's compilation workflow for second drop of week
- [ ] Trigger newsletter (auto-cron) — verify it sent
- [ ] Post weekly community update on YouTube Community tab
- [ ] Engage with comments on the week's uploads

### Saturday — Field Recording (Bi-weekly)
- [ ] Visit a designated location with phone + windscreen
- [ ] Capture 10-15 minutes of clean ambience
- [ ] Edit cleanest 3-5 minutes
- [ ] Save to R2 with location + date metadata
- [ ] Add to field_recordings table in D1

### Sunday — Rest / Mega-mix (Bi-weekly)
- [ ] Either: rest day (recommended)
- [ ] Or: assemble a 2-3 hour mega-mix combining recent winners
- [ ] Always: no scrolling YouTube analytics (it's noise on weekends)

## Release-Day Checklist (Spotify / Apple / Tidal via DistroKid)

Run this 14 days before scheduled release date.

### T-14 Days
- [ ] WAV master uploaded to DistroKid
- [ ] Cover art at 3000×3000px uploaded
- [ ] Title finalized (matches across all platforms)
- [ ] Genre: select PRIMARY genre only
- [ ] Lyrics field: "Instrumental"
- [ ] Explicit: NO
- [ ] Release date set
- [ ] DistroKid distribution targets selected (Spotify, Apple, Tidal, Amazon, Deezer)
- [ ] Content ID enabled (YES — important for royalties)
- [ ] TikTok/Instagram licensing enabled

### T-7 Days
- [ ] Spotify for Artists "Pitch a Song" submitted with full description
- [ ] Pre-save link generated and shared on Instagram
- [ ] feature.fm smart link created
- [ ] YouTube companion content drafted (compilation including this track)
- [ ] Newsletter blurb written for release week

### Release Day (T-0)
- [ ] Verify track is live on Spotify (link works)
- [ ] Apple Music + Tidal + Amazon checked
- [ ] Update website mixes/tracks page in Keystatic
- [ ] Newsletter sent to subscribers
- [ ] Instagram post + Story
- [ ] TikTok with track snippet
- [ ] X (Twitter) announcement
- [ ] YouTube companion compilation goes live

### T+7 Days
- [ ] Submit to 10+ DailyPlaylists playlists
- [ ] Submit to 2-3 SubmitHub curators
- [ ] Email 3 press contacts (rotate through Tier 1 → Tier 2 list)
- [ ] Track analytics: streams, saves, playlist adds

### T+30 Days
- [ ] Performance review: was it editorially picked up? How many streams?
- [ ] Document learnings in `releases/YYYY-MM-DD-track-name.md`
- [ ] If high performer: amplify with paid ad budget ($20-50 IG/TikTok)
- [ ] If underperformer: add to a "Best Of" compilation in 60 days

## Monthly Analytics Audit Checklist (Run on 1st of Each Month)

This is your strategic checkpoint. Block 90 minutes for it.

### YouTube Metrics Review
- [ ] Subscriber count vs target (Phase 1: 250-500 by Day 90)
- [ ] Watch hours vs target (Phase 1: 1500-3000 by Day 90)
- [ ] Top 5 videos by watch time — what's working?
- [ ] Bottom 5 videos by retention — what's broken?
- [ ] Average view duration — trending up or down?
- [ ] CTR (impressions → clicks) — target >3%
- [ ] Subscriber-to-view ratio — target >0.5% per video
- [ ] Top 5 traffic sources

### Spotify / Streaming Metrics Review
- [ ] Monthly listeners (target trajectory)
- [ ] Stream count growth rate
- [ ] Top 5 tracks by streams
- [ ] Playlist placements gained / lost this month
- [ ] Saves-to-streams ratio (>8% = strong)
- [ ] Discover Weekly inclusions (qualitative — search your tracks)

### Revenue Check
- [ ] YouTube revenue (if monetized)
- [ ] Spotify / streaming royalties (from DistroKid dashboard)
- [ ] Bandcamp sales
- [ ] License sales (from website Stripe dashboard)
- [ ] Total month vs prior month — growth %

### Pipeline Health
- [ ] How many tracks generated this month?
- [ ] How many tracks released this month?
- [ ] How many submissions sent? Response rate?
- [ ] Newsletter subscriber count — growing?
- [ ] Social follower count across platforms

### Strategic Questions (Document Answers in `monthly-reports/YYYY-MM.md`)
1. What's the single best thing that happened?
2. What's the single biggest problem to solve?
3. What experiment should I run next month?
4. What should I STOP doing?
5. Am I on track for the phase's exit criteria?

### Action Items
- [ ] Update PRD with any strategic shifts identified
- [ ] Add new GitHub issues for experiments to run
- [ ] Close obsolete issues / archive completed epics
- [ ] Adjust upload cadence if burning out

## Submission Tracking Checklist (Maintain Continuously)

For every submission you send (playlist, award, press), record in D1 `submissions` table:

- [ ] Date submitted
- [ ] Target type (playlist | award | press)
- [ ] Target name
- [ ] Contact / submission method
- [ ] Track or mix submitted
- [ ] Initial response date (or "no response")
- [ ] Final outcome (accepted | rejected | no response after 30 days)
- [ ] Notes (specific feedback, contact information, follow-up plan)

### Submission Hygiene Rules
- [ ] Never spam — one submission per contact per release maximum
- [ ] Wait 30+ days before re-pitching same contact
- [ ] If accepted: send thank-you note within 24 hours
- [ ] If rejected: acknowledge politely, no argument
- [ ] If no response after 30 days: ONE polite check-in, then move on

## Quarterly Strategic Review (Run End of March, June, September, December)

Block 4 hours. Treat as a board meeting with yourself.

### Quarter Performance
- [ ] What were the exit criteria for this quarter? (From PRD Section 9)
- [ ] Were they met? Honestly.
- [ ] What unexpected things happened?
- [ ] What strategic assumption was wrong?

### Next Quarter Planning
- [ ] Update PRD with new targets
- [ ] Identify the THREE most important things to accomplish
- [ ] Decompose those into GitHub epics
- [ ] Block calendar time for high-leverage work
- [ ] Decide what to STOP doing

### Health Check
- [ ] Are you burning out? Be honest. Adjust cadence if needed.
- [ ] Is the music quality holding? Listen to your own work as a stranger would.
- [ ] Is the brand still distinct? Or drifting into generic AI music territory?
- [ ] What would a Ghanaian musician peer say if they listened to a week of your output?

### Award & Press Readiness
- [ ] Is press kit current?
- [ ] Are catalog metadata records complete?
- [ ] Any upcoming awards windows opening?
- [ ] Should you hire short-term PR help for a key release?

## Emergency Protocols

### YouTube Strike / Demonetization Notice
- [ ] Don't panic. Do not upload anything new for 48 hours.
- [ ] Read the specific policy citation carefully
- [ ] If it relates to AI content: gather evidence of transformative work (field recordings, mix sessions, etc.)
- [ ] Use the appeal flow within YouTube Studio
- [ ] If appeal denied: document for PRD risk register; adjust strategy
- [ ] Worst case scenario: Spotify/Apple are independent — channel isn't everything

### Suno Account Issue (Locked / Subscription Lapse)
- [ ] Your already-published Spotify catalog is SAFE (rights persist via DistroKid)
- [ ] Generate replacement prompts in alternative tools temporarily
- [ ] Investigate Suno API tier for redundancy

### Cloudflare Outage / Site Down
- [ ] Cloudflare's downtime is rare and short
- [ ] Status page: status.cloudflare.com
- [ ] If R2 audio downloads fail: customers get auto-extended grace
- [ ] No need to migrate — endure short outages

### Burnout
- [ ] Drop to ONE upload per week (not zero — algorithm punishes silence)
- [ ] Reuse back-catalog into new compilations (60% effort)
- [ ] Outsource one task (Shorts editing via Fiverr, ~$50/mo)
- [ ] Schedule mandatory recovery week per quarter

## Year-End Checklist (Run December 28-31)

- [ ] Compile "Year in Review" content (top 10 tracks, total streams, milestones)
- [ ] Create end-of-year compilation: "Harmattan Sessions: The Year"
- [ ] Send personalized thank-you message to top 20 supporters / playlist curators
- [ ] Audit Hodges & Co. Ltd financials for tax filing
- [ ] Back up entire `/home/claude/harmattan-sessions-project/` to R2 archive
- [ ] Set Year 2 strategic goals (write new PRD version)
- [ ] REST for one week before Year 2 begins

## The Single Most Important Habit

**Never skip the QC checklist before upload.** Everything else can slip occasionally. The QC checklist is the difference between a sustainable award-track brand and a flagged AI slop channel.

If you're tired, if it's late, if the deadline is looming — STILL run the QC. Upload tomorrow. The channel can wait 24 hours. It cannot recover from a wave of bad uploads.

Discipline at the gate. Trust the process. The catalog compounds.
