export const siteConfig = {
  tagline: 'The sound of African evenings',
  email: 'harmattansessions@gmail.com',
  // HS Studios — the in-house studio. Canonical live-studio entry; every "Enter the Studio"
  // CTA links here. Same-domain family for a seamless crossing from the marketing site.
  studioUrl: 'https://studio.ohwpstudios.org',
  // Harmattan Sessions YouTube channel — source for the live mixes/now-playing sync.
  youtubeChannelId: 'UCPvNI44wmYxnCxVk_BJ1wvg',
  // Ambient "tap to listen" player — same-origin loop + the bar's display label.
  audio: { src: '/audio/generational-rhythm-vol-i.mp3', label: 'Generational_Rhythm_Vol_I' },
  platforms: [
    { name: 'YouTube', url: 'https://www.youtube.com/@HarmattanSessions' }, { name: 'Spotify', url: '#' },
    { name: 'Apple Music', url: '#' }, { name: 'Tidal', url: '#' }, { name: 'Bandcamp', url: '#' },
  ],
  social: [
    { name: 'Instagram', url: '#' }, { name: 'TikTok', url: '#' },
  ],
} as const;
