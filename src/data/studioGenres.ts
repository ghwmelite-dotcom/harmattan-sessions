// Single source of truth for the six HS Studios genres shown on the marketing site.
// Mirrors the studio's packages/shared genre configs (kept in sync by hand — see
// docs/superpowers/specs/2026-06-06-hs-studios-connection-design.md §8).

export type StudioPath = 'Lyric · 4-pass' | 'Instrumental';

export interface StudioGenre {
  name: string;
  tempo: string;       // e.g. "108 BPM"
  signature: string;   // sonic fingerprint, one line
  path: StudioPath;
  accent: string;      // hex — the only place a literal color is allowed (it's data)
  order: number;
}

export const studioGenres: StudioGenre[] = [
  { name: 'Afrobeats',       tempo: '108 BPM', path: 'Lyric · 4-pass', accent: '#1D9E75', order: 1, signature: 'Log drum, syncopated bass, vocal chops' },
  { name: 'Amapiano',        tempo: '113 BPM', path: 'Lyric · 4-pass', accent: '#6C4FD6', order: 2, signature: 'Log drum bass, jazzy piano, deep house groove' },
  { name: 'Dancehall',       tempo: '98 BPM',  path: 'Lyric · 4-pass', accent: '#E8B04B', order: 3, signature: 'Riddim, heavy sub bass, patois bounce' },
  { name: 'Alté',            tempo: '100 BPM', path: 'Lyric · 4-pass', accent: '#8A6D4A', order: 4, signature: 'Dreamy synths, mellow, experimental R&B' },
  { name: 'Highlife Fusion', tempo: '110 BPM', path: 'Lyric · 4-pass', accent: '#C96E3F', order: 5, signature: 'Palm-wine guitar, horns, talking drum' },
  { name: 'Afro-lofi',       tempo: '82 BPM',  path: 'Instrumental',   accent: '#7A5230', order: 6, signature: 'Kalimba, tape warmth, vinyl crackle — no vocals' },
];

export function getStudioGenres(): StudioGenre[] {
  return [...studioGenres].sort((a, b) => a.order - b.order);
}
