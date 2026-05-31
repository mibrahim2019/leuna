import type { ReactNode } from 'react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  logger,
  mockCheckoutsGet,
  mockExtractCookieFromHeaders,
  mockFindUnique,
  mockFormatDocumentsPath,
  mockGetOptionalSession,
  mockGetPolarCustomerAccessState,
  mockGetTeams,
  mockUpdate,
} = vi.hoisted(() => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  },
  mockCheckoutsGet: vi.fn(),
  mockExtractCookieFromHeaders: vi.fn(),
  mockFindUnique: vi.fn(),
  mockFormatDocumentsPath: vi.fn((teamUrl: string) => `/teams/${teamUrl}/documents`),
  mockGetOptionalSession: vi.fn(),
  mockGetPolarCustomerAccessState: vi.fn(),
  mockGetTeams: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      update: mockUpdate,
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

vi.mock('@documenso/lib/server-only/polar/client', () => ({
  polarClient: {
    checkouts: {
      get: mockCheckoutsGet,
    },
  },
}));

vi.mock('@documenso/lib/server-only/team/get-teams', () => ({
  getTeams: mockGetTeams,
}));

vi.mock('@documenso/lib/utils/logger', () => ({
  logger,
}));

vi.mock('@documenso/lib/utils/teams', () => ({
  formatDocumentsPath: mockFormatDocumentsPath,
}));

vi.mock('@documenso/ui/primitives/button', () => ({
  Button: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('~/utils/meta', () => ({
  appMetaTags: vi.fn(),
}));

import { loader } from './lifetime.success';

describe('purchase lifetime success loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockExtractCookieFromHeaders.mockReturnValue(undefined);
    mockGetOptionalSession.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: 1,
      },
    });
    mockGetTeams.mockResolvedValue([
      {
        url: 'alpha',
      },
    ]);
  });

  it('updates the stored Polar customer ID and refreshes access after checkout', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockCheckoutsGet.mockResolvedValue({
      customerId: 'polar-customer-123',
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: null,
      grantedBenefits: [
        {
          benefitId: 'benefit_access',
        },
      ],
      hasProductAccess: true,
      resolvedPolarCustomerId: 'polar-customer-123',
    });

    const result = await loader({
      request: new Request('https://documenso.local/purchase/lifetime/success?checkout_id=chk_123'),
    });

    expect(mockCheckoutsGet).toHaveBeenCalledWith({
      id: 'chk_123',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { polarCustomerId: 'polar-customer-123' },
    });
    expect(mockGetPolarCustomerAccessState).toHaveBeenCalledWith({
      userId: 1,
      polarCustomerId: 'polar-customer-123',
      skipCache: true,
    });
    expect(result).toEqual({
      checkoutId: 'chk_123',
      continuePath: '/teams/alpha/documents',
      hasProductAccess: true,
    });
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Resolved lifetime purchase success access state',
        hasProductAccess: true,
        grantedBenefitCount: 1,
      }),
    );
  });

  it('logs a warning and returns a recoverable pending state when checkout lookup fails', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockCheckoutsGet.mockRejectedValue(new Error('Polar unavailable'));
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: null,
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: null,
    });

    const result = await loader({
      request: new Request('https://documenso.local/purchase/lifetime/success?checkout_id=chk_999'),
    });

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockGetPolarCustomerAccessState).toHaveBeenCalledWith({
      userId: 1,
      polarCustomerId: null,
      skipCache: true,
    });
    expect(result).toEqual({
      checkoutId: 'chk_999',
      continuePath: '/teams/alpha/documents',
      hasProductAccess: false,
    });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Failed to fetch Polar checkout during lifetime success verification',
        checkoutId: 'chk_999',
        userId: 1,
      }),
    );
  });

  it('persists a resolved Polar customer ID when access lookup finds an existing customer', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockCheckoutsGet.mockRejectedValue(new Error('Polar unavailable'));
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: 'documenso_user_1',
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: 'polar-customer-legacy',
    });

    const result = await loader({
      request: new Request('https://documenso.local/purchase/lifetime/success?checkout_id=chk_999'),
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { polarCustomerId: 'polar-customer-legacy' },
    });
    expect(result).toEqual({
      checkoutId: 'chk_999',
      continuePath: '/teams/alpha/documents',
      hasProductAccess: false,
    });
  });
});
