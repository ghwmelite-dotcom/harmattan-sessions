import { describe, it, expect } from 'vitest';
import { siteConfig } from '../src/siteConfig';

describe('siteConfig.studioUrl', () => {
  it('is the same-domain studio subdomain over https', () => {
    expect(siteConfig.studioUrl).toBe('https://studio.ohwpstudios.org');
  });

  it('exposes the YouTube channel id for feed sync', () => {
    expect(siteConfig.youtubeChannelId).toBe('UCPvNI44wmYxnCxVk_BJ1wvg');
  });
});
