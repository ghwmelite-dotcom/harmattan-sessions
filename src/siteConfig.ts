export const siteConfig = {
  tagline: 'The sound of African evenings',
  email: 'harmattansessions@gmail.com',
  // HS Studios — the in-house studio. Canonical live-studio entry; every "Enter the Studio"
  // CTA links here. Same-domain family for a seamless crossing from the marketing site.
  studioUrl: 'https://studio.ohwpstudios.org',
  // Harmattan Sessions YouTube channel — source for the live mixes/now-playing sync.
  youtubeChannelId: 'UCPvNI44wmYxnCxVk_BJ1wvg',
  platforms: [
    { name: 'YouTube', url: 'https://www.youtube.com/@HarmattanSessions' }, { name: 'Spotify', url: '#' },
    { name: 'Apple Music', url: '#' }, { name: 'Tidal', url: '#' }, { name: 'Bandcamp', url: '#' },
  ],
  social: [
    { name: 'Instagram', url: '#' }, { name: 'TikTok', url: '#' },
  ],
} as const;
