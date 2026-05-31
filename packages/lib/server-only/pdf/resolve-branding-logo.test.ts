import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveBrandingLogoPath } from './resolve-branding-logo';

describe('resolveBrandingLogoPath', () => {
  it('resolves the packaged logo asset by default', () => {
    const logoPath = resolveBrandingLogoPath();

    expect(logoPath).toContain(path.join('packages', 'assets', 'logo.svg'));
  });

  it('falls back to the legacy public logo path when the package asset is unavailable', () => {
    const cwd = '/tmp/documenso-test';
    const fallbackPath = path.join(cwd, 'public/static/logo.png');

    const logoPath = resolveBrandingLogoPath({
      cwd,
      resolve: () => '/missing/packages/assets/logo.svg',
      existsSync: (candidatePath) => candidatePath === fallbackPath,
    });

    expect(logoPath).toBe(fallbackPath);
  });

  it('throws a descriptive error when neither asset exists', () => {
    const cwd = '/tmp/documenso-test';

    expect(() =>
      resolveBrandingLogoPath({
        cwd,
        resolve: () => '/missing/packages/assets/logo.svg',
        existsSync: () => false,
      }),
    ).toThrowError(
      `Unable to resolve branding logo asset. Attempted paths: /missing/packages/assets/logo.svg, ${path.join(cwd, 'public/static/logo.png')}`,
    );
  });
});
