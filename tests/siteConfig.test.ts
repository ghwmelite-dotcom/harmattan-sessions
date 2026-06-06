import { describe, it, expect } from 'vitest';
import { siteConfig } from '../src/siteConfig';

describe('siteConfig.studioUrl', () => {
  it('is the same-domain studio subdomain over https', () => {
    expect(siteConfig.studioUrl).toBe('https://studio.ohwpstudios.org');
  });
});
