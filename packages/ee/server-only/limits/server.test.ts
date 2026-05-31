import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockFindUnique,
  mockUpdate,
  mockFindFirst,
  mockGetPolarCustomerAccessState,
} = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockFindFirst: vi.fn(),
  mockGetPolarCustomerAccessState: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
    organisation: {
      findFirst: mockFindFirst,
    },
  },
}));

vi.mock('@documenso/lib/server-only/polar/customer', () => ({
  getPolarCustomerAccessState: mockGetPolarCustomerAccessState,
}));

import { DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT, UNRESTRICTED_LIMITS } from './constants';
import { getServerLimits } from './server';

describe('getServerLimits', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockUpdate.mockResolvedValue(undefined);
    mockFindFirst.mockResolvedValue({
      id: 1,
    });
    mockGetPolarCustomerAccessState.mockResolvedValue({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: '1',
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: null,
    });
  });

  it('persists a resolved Polar customer ID discovered during limits lookup', async () => {
    mockGetPolarCustomerAccessState.mockResolvedValueOnce({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: 'documenso_user_1',
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: 'polar-customer-123',
    });

    const result = await getServerLimits({
      userId: 1,
      teamId: 123,
    });

    expect(mockGetPolarCustomerAccessState).toHaveBeenCalledWith({
      userId: 1,
      polarCustomerId: null,
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { polarCustomerId: 'polar-customer-123' },
    });
    expect(result).toEqual({
      quota: {
        documents: 0,
        recipients: UNRESTRICTED_LIMITS.recipients,
        directTemplates: 0,
      },
      remaining: {
        documents: 0,
        recipients: UNRESTRICTED_LIMITS.recipients,
        directTemplates: 0,
      },
      hasProductAccess: false,
      maximumEnvelopeItemCount: DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT,
    });
  });

  it('does not rewrite the user when the stored Polar customer ID is already current', async () => {
    mockFindUnique.mockResolvedValueOnce({
      polarCustomerId: 'polar-customer-123',
    });
    mockGetPolarCustomerAccessState.mockResolvedValueOnce({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: null,
      grantedBenefits: [{ benefitId: 'benefit_access' }],
      hasProductAccess: true,
      resolvedPolarCustomerId: 'polar-customer-123',
    });

    const result = await getServerLimits({
      userId: 1,
      teamId: 123,
    });

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({
      quota: UNRESTRICTED_LIMITS,
      remaining: UNRESTRICTED_LIMITS,
      hasProductAccess: true,
      maximumEnvelopeItemCount: DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT,
    });
  });
});
