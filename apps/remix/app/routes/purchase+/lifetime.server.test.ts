import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Outlet } from 'react-router';

import { POLAR_LIFETIME_SUCCESS_PATH } from '@documenso/lib/constants/polar';

const {
  logger,
  mockCreateLifetimeCheckout,
  mockExtractRequestMetadata,
  mockFindUnique,
  mockGetOptionalSession,
  mockGetPolarCustomerAccessState,
  mockUpdate,
} = vi.hoisted(() => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
  mockCreateLifetimeCheckout: vi.fn(),
  mockExtractRequestMetadata: vi.fn(),
  mockFindUnique: vi.fn(),
  mockGetOptionalSession: vi.fn(),
  mockGetPolarCustomerAccessState: vi.fn(),
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

vi.mock('@documenso/auth/server/lib/utils/get-session', () => ({
  getOptionalSession: mockGetOptionalSession,
}));

vi.mock('@documenso/lib/server-only/polar/checkout', () => ({
  createLifetimeCheckout: mockCreateLifetimeCheckout,
}));

vi.mock('@documenso/lib/server-only/polar/customer', () => ({
  getPolarCustomerAccessState: mockGetPolarCustomerAccessState,
}));

vi.mock('@documenso/lib/universal/extract-request-metadata', () => ({
  extractRequestMetadata: mockExtractRequestMetadata,
}));

vi.mock('@documenso/lib/utils/logger', () => ({
  logger,
}));

import PurchaseLifetimeRoute, { loader } from './lifetime';

describe('purchase lifetime loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockExtractRequestMetadata.mockReturnValue({
      ipAddress: '127.0.0.1',
    });
  });

  it('skips checkout creation for nested purchase routes', async () => {
    mockGetOptionalSession.mockResolvedValue({
      isAuthenticated: true,
      user: {
        id: 1,
      },
    });

    const result = await loader({
      request: new Request('https://documenso.local/purchase/lifetime/success'),
    });

    expect(result).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockGetPolarCustomerAccessState).not.toHaveBeenCalled();
    expect(mockCreateLifetimeCheckout).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Skipping lifetime checkout loader for nested purchase route',
        path: '/purchase/lifetime/success',
        userId: 1,
      }),
    );
  });

  it('creates a checkout for the purchase route when access is missing', async () => {
    mockGetOptionalSession.mockResolvedValue({
      isAuthenticated: true,
      user: {
        email: 'hello@example.com',
        id: 1,
        name: 'Hello',
      },
    });
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: '1',
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: 'polar-customer-123',
    });
    mockCreateLifetimeCheckout.mockResolvedValue({
      id: 'chk_123',
      url: 'https://sandbox.polar.sh/checkout/chk_123',
    });

    const response = await loader({
      request: new Request('https://documenso.local/purchase/lifetime'),
    }).catch((error) => error);

    expect(mockCreateLifetimeCheckout).toHaveBeenCalledWith({
      customerEmail: 'hello@example.com',
      customerIpAddress: '127.0.0.1',
      customerName: 'Hello',
      polarCustomerId: 'polar-customer-123',
      userId: 1,
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { polarCustomerId: 'polar-customer-123' },
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe('https://sandbox.polar.sh/checkout/chk_123');
  });

  it('redirects to success when access already exists', async () => {
    mockGetOptionalSession.mockResolvedValue({
      isAuthenticated: true,
      user: {
        email: 'hello@example.com',
        id: 1,
        name: 'Hello',
      },
    });
    mockFindUnique.mockResolvedValue({
      polarCustomerId: 'polar-customer-123',
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

    const response = await loader({
      request: new Request('https://documenso.local/purchase/lifetime'),
    }).catch((error) => error);

    expect(mockCreateLifetimeCheckout).not.toHaveBeenCalled();
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe(POLAR_LIFETIME_SUCCESS_PATH);
  });

  it('renders an outlet so nested purchase routes can mount', () => {
    const element = PurchaseLifetimeRoute();

    expect(element.type).toBe(Outlet);
  });
});
