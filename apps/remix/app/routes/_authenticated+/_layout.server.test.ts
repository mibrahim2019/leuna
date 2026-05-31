import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockFindUnique,
  mockGetOptionalSession,
  mockGetPolarCustomerAccessState,
  mockGetSiteSettings,
} = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockGetOptionalSession: vi.fn(),
  mockGetPolarCustomerAccessState: vi.fn(),
  mockGetSiteSettings: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}));

vi.mock('@documenso/auth/server/lib/utils/get-session', () => ({
  getOptionalSession: mockGetOptionalSession,
}));

vi.mock('@documenso/lib/server-only/polar/customer', () => ({
  getPolarCustomerAccessState: mockGetPolarCustomerAccessState,
}));

vi.mock('@documenso/lib/server-only/site-settings/get-site-settings', () => ({
  getSiteSettings: mockGetSiteSettings,
}));

vi.mock('~/components/general/app-banner', () => ({
  AppBanner: vi.fn(),
}));

vi.mock('~/components/general/app-header', () => ({
  Header: vi.fn(),
}));

vi.mock('~/components/general/generic-error-layout', () => ({
  GenericErrorLayout: vi.fn(),
}));

vi.mock('~/components/general/verify-email-banner', () => ({
  VerifyEmailBanner: vi.fn(),
}));

vi.mock('~/providers/team', () => ({
  TeamProvider: vi.fn(),
}));

import { loader } from './_layout';
import type { Route } from './+types/_layout';

const createLoaderArgs = (url: string): Route.LoaderArgs => ({
  request: new Request(url),
  params: {},
  context: {},
  unstable_pattern: '/_authenticated',
});

describe('authenticated layout loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUnique.mockResolvedValue({
      polarCustomerId: 'polar-customer-123',
    });
    mockGetOptionalSession.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: 1,
      },
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      grantedBenefits: [
        {
          benefitId: 'benefit_access',
        },
      ],
      hasProductAccess: true,
    });
    mockGetSiteSettings.mockResolvedValue([
      {
        id: 'banner',
      },
    ]);
  });

  it('loads workspace routes when the user has access', async () => {
    const result = await loader(createLoaderArgs('https://documenso.local/dashboard'));

    expect(mockGetPolarCustomerAccessState).toHaveBeenCalledWith({
      userId: 1,
      polarCustomerId: 'polar-customer-123',
    });
    expect(result).toEqual({
      banner: undefined,
    });
  });

  it('redirects workspace routes to checkout when access is missing', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      grantedBenefits: [],
      hasProductAccess: false,
    });

    const response = await loader(createLoaderArgs('https://documenso.local/dashboard')).catch(
      (error) => error,
    );

    expect(mockGetSiteSettings).not.toHaveBeenCalled();
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe('/purchase/lifetime');
  });

  it('keeps settings routes reachable without forcing checkout', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      grantedBenefits: [],
      hasProductAccess: false,
    });

    const result = await loader(createLoaderArgs('https://documenso.local/settings/profile'));

    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockGetPolarCustomerAccessState).not.toHaveBeenCalled();
    expect(result).toEqual({
      banner: undefined,
    });
  });
});
