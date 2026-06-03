import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockExtractCookieFromHeaders,
  mockFindUnique,
  mockFormatDocumentsPath,
  mockGetOptionalSession,
  mockGetPolarCustomerAccessState,
  mockGetTeams,
} = vi.hoisted(() => ({
  mockExtractCookieFromHeaders: vi.fn(),
  mockFindUnique: vi.fn(),
  mockFormatDocumentsPath: vi.fn((teamUrl: string) => `/teams/${teamUrl}/documents`),
  mockGetOptionalSession: vi.fn(),
  mockGetPolarCustomerAccessState: vi.fn(),
  mockGetTeams: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}));

vi.mock('@documenso/auth/server/lib/utils/cookies', () => ({
  extractCookieFromHeaders: mockExtractCookieFromHeaders,
}));

vi.mock('@documenso/auth/server/lib/utils/get-session', () => ({
  getOptionalSession: mockGetOptionalSession,
}));

vi.mock('@documenso/lib/server-only/polar/customer', () => ({
  getPolarCustomerAccessState: mockGetPolarCustomerAccessState,
}));

vi.mock('@documenso/lib/server-only/team/get-teams', () => ({
  getTeams: mockGetTeams,
}));

vi.mock('@documenso/lib/utils/teams', () => ({
  formatDocumentsPath: mockFormatDocumentsPath,
}));

vi.mock('~/components/general/wordmark-logo', () => ({
  WordmarkLogo: vi.fn(),
}));

vi.mock('~/components/general/marketing-header', () => ({
  MarketingHeader: vi.fn(),
}));

vi.mock('~/utils/meta', () => ({
  appMetaTags: vi.fn(),
}));

import { loader } from './_index';
import type { Route } from './+types/_index';

const createLoaderArgs = (url: string): Route.LoaderArgs => ({
  request: new Request(url),
  params: {},
  context: {},
  unstable_pattern: '/',
});

describe('home loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockExtractCookieFromHeaders.mockReturnValue(undefined);
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
    mockGetTeams.mockResolvedValue([
      {
        url: 'alpha',
      },
    ]);
  });

  it('redirects authenticated users with access to their workspace', async () => {
    const response = await loader(createLoaderArgs('https://documenso.local/')).catch(
      (error) => error,
    );

    expect(mockGetTeams).toHaveBeenCalledWith({
      userId: 1,
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe('/teams/alpha/documents');
  });

  it('redirects authenticated users without access to checkout', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      grantedBenefits: [],
      hasProductAccess: false,
    });

    const response = await loader(createLoaderArgs('https://documenso.local/')).catch(
      (error) => error,
    );

    expect(mockGetTeams).not.toHaveBeenCalled();
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe('/purchase/lifetime');
  });
});
