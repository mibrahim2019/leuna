import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const PACKAGE_LOGO_SPECIFIER = '@documenso/assets/logo.svg';

type ResolveBrandingLogoPathOptions = {
  cwd?: string;
  existsSync?: typeof fs.existsSync;
  resolve?: (specifier: string) => string;
};

export const resolveBrandingLogoPath = ({
  cwd = process.cwd(),
  existsSync = fs.existsSync,
  resolve = require.resolve,
}: ResolveBrandingLogoPathOptions = {}) => {
  let packageLogoPath: string | null = null;

  try {
    packageLogoPath = resolve(PACKAGE_LOGO_SPECIFIER);
  } catch {
    packageLogoPath = null;
  }

  const fallbackLogoPath = path.join(cwd, 'public/static/logo.png');

  if (packageLogoPath && existsSync(packageLogoPath)) {
    return packageLogoPath;
  }

  if (existsSync(fallbackLogoPath)) {
    return fallbackLogoPath;
  }

  throw new Error(
    `Unable to resolve branding logo asset. Attempted paths: ${packageLogoPath ?? `${PACKAGE_LOGO_SPECIFIER} (Node resolution failed)`}, ${fallbackLogoPath}`,
  );
};

export const readBrandingLogo = () => fs.readFileSync(resolveBrandingLogoPath());
