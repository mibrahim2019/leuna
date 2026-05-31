import type { TCachedLicense } from '../../types/license';

declare global {
  // eslint-disable-next-line no-var
  var __documenso_license_client__: LicenseClient | undefined;
}

export class LicenseClient {
  private cachedLicense: TCachedLicense | null = null;

  private constructor() {}

  public static async start(): Promise<void> {
    if (globalThis.__documenso_license_client__) {
      return;
    }

    globalThis.__documenso_license_client__ = new LicenseClient();
  }

  public static getInstance(): LicenseClient | null {
    return globalThis.__documenso_license_client__ ?? null;
  }

  public async getCachedLicense(): Promise<TCachedLicense | null> {
    return this.cachedLicense;
  }

  public async resync(): Promise<void> {}
}
