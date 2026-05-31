import { ResourceNotFound } from '@polar-sh/sdk/models/errors/resourcenotfound.js';
import { ResponseValidationError } from '@polar-sh/sdk/models/errors/responsevalidationerror.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  logger,
  mockFindUnique,
  mockUpdate,
  mockGetExternal,
  mockGetPolarAccessBenefitId,
  mockGetPolarExternalCustomerId,
  mockGetPolarLegacyExternalCustomerId,
  mockGetState,
} = vi.hoisted(() => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockGetExternal: vi.fn(),
  mockGetPolarAccessBenefitId: vi.fn(() => 'benefit_access'),
  mockGetPolarExternalCustomerId: vi.fn((userId: number) => String(userId)),
  mockGetPolarLegacyExternalCustomerId: vi.fn((userId: number) => `documenso_user_${userId}`),
  mockGetState: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

vi.mock('../../utils/logger', () => ({
  logger,
}));

vi.mock('./client', () => ({
  polarClient: {
    customers: {
      getExternal: mockGetExternal,
      getState: mockGetState,
    },
  },
}));

vi.mock('./constants', () => ({
  POLAR_STATE_CACHE_TTL_MS: 30_000,
  getPolarAccessBenefitId: mockGetPolarAccessBenefitId,
  getPolarExternalCustomerId: mockGetPolarExternalCustomerId,
  getPolarLegacyExternalCustomerId: mockGetPolarLegacyExternalCustomerId,
}));

import { assertPolarProductAccess, getPolarCustomerAccessState } from './customer';

type CustomerStateCacheEntry = {
  expiresAt: number;
  value: Awaited<ReturnType<typeof getPolarCustomerAccessState>>;
};

const isCustomerStateCacheEntry = (value: unknown): value is CustomerStateCacheEntry =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'expiresAt' in value &&
      typeof value.expiresAt === 'number' &&
      'value' in value,
  );

const isCustomerStateCache = (value: unknown): value is Map<string, CustomerStateCacheEntry> =>
  value instanceof Map &&
  Array.from(value.values()).every((entry) => isCustomerStateCacheEntry(entry));

const getPolarCustomerAccessCache = () => {
  const cache = Reflect.get(globalThis, '__documenso_polar_customer_access_cache');

  return isCustomerStateCache(cache) ? cache : undefined;
};

const createHttpMeta = (statusCode: number, body: string) => {
  const request = new Request('https://api.polar.sh/v1/customers/external/1');
  const response = new Response(body, {
    headers: {
      'content-type': 'application/json',
    },
    status: statusCode,
  });

  return {
    body,
    request,
    response,
  };
};

const createResourceNotFoundError = () => {
  const httpMeta = createHttpMeta(404, JSON.stringify({ detail: 'Not found', error: 'ResourceNotFound' }));

  return new ResourceNotFound(
    {
      detail: 'Not found',
      error: 'ResourceNotFound',
    },
    httpMeta,
  );
};

const createResponseValidationError = ({
  body,
  rawMessage = body,
  rawValue,
  statusCode,
}: {
  body: string;
  rawMessage?: unknown;
  rawValue: unknown;
  statusCode: number;
}) => {
  const httpMeta = createHttpMeta(statusCode, body);

  return new ResponseValidationError('Response validation failed', {
    body: httpMeta.body,
    cause: new Error('Validation failed'),
    rawMessage,
    rawValue,
    request: httpMeta.request,
    response: httpMeta.response,
  });
};

const createCustomerState = (benefitIds: string[]) => ({
  grantedBenefits: benefitIds.map((benefitId) => ({
    benefitId,
  })),
});

describe('getPolarCustomerAccessState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockUpdate.mockResolvedValue(undefined);
    mockGetPolarAccessBenefitId.mockReturnValue('benefit_access');
    mockGetPolarExternalCustomerId.mockImplementation((userId: number) => String(userId));
    mockGetPolarLegacyExternalCustomerId.mockImplementation((userId: number) => `documenso_user_${userId}`);
    Reflect.set(globalThis, '__documenso_polar_customer_access_cache', undefined);
  });

  it('uses getState when polarCustomerId is provided', async () => {
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const result = await getPolarCustomerAccessState({
      userId: 1,
      polarCustomerId: 'polar-uuid-123',
    });

    expect(result).toMatchObject({
      externalCustomerId: '1',
      matchedExternalCustomerId: null,
      resolvedPolarCustomerId: 'polar-uuid-123',
      hasProductAccess: true,
    });
    expect(mockGetState).toHaveBeenCalledWith({ id: 'polar-uuid-123' });
    expect(mockGetExternal).not.toHaveBeenCalled();
  });

  it('finds a canonical external customer without the required sign benefit', async () => {
    mockGetExternal.mockResolvedValueOnce({ id: 'polar-customer-123' });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_other']));

    const result = await getPolarCustomerAccessState({ userId: 1 });

    expect(result).toMatchObject({
      externalCustomerId: '1',
      matchedExternalCustomerId: '1',
      resolvedPolarCustomerId: 'polar-customer-123',
      hasProductAccess: false,
    });
    expect(mockGetExternal).toHaveBeenCalledWith({ externalId: '1' });
    expect(mockGetState).toHaveBeenCalledWith({ id: 'polar-customer-123' });
  });

  it('finds a canonical external customer with the required sign benefit', async () => {
    mockGetExternal.mockResolvedValueOnce({ id: 'polar-customer-123' });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const result = await getPolarCustomerAccessState({ userId: 1 });

    expect(result).toMatchObject({
      externalCustomerId: '1',
      matchedExternalCustomerId: '1',
      resolvedPolarCustomerId: 'polar-customer-123',
      hasProductAccess: true,
    });
  });

  it('falls back to the legacy prefixed external ID when canonical lookup is missing', async () => {
    mockGetExternal
      .mockRejectedValueOnce(createResourceNotFoundError())
      .mockResolvedValueOnce({ id: 'polar-legacy-123' });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const result = await getPolarCustomerAccessState({ userId: 1 });

    expect(result).toMatchObject({
      externalCustomerId: '1',
      matchedExternalCustomerId: 'documenso_user_1',
      resolvedPolarCustomerId: 'polar-legacy-123',
      hasProductAccess: true,
    });
    expect(mockGetExternal).toHaveBeenNthCalledWith(1, { externalId: '1' });
    expect(mockGetExternal).toHaveBeenNthCalledWith(2, { externalId: 'documenso_user_1' });
  });

  it('treats missing canonical and legacy customers as no access', async () => {
    mockGetExternal
      .mockRejectedValueOnce(createResourceNotFoundError())
      .mockRejectedValueOnce(createResourceNotFoundError());

    const result = await getPolarCustomerAccessState({ userId: 1 });

    expect(result).toMatchObject({
      customerState: null,
      externalCustomerId: '1',
      matchedExternalCustomerId: null,
      grantedBenefits: [],
      hasProductAccess: false,
      resolvedPolarCustomerId: null,
    });
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Polar customer state not found, treating as no access',
        externalCustomerId: '1',
        legacyExternalCustomerId: 'documenso_user_1',
        userId: 1,
      }),
    );
  });

  it('serves stale cache when lookup fails after the cache expires', async () => {
    mockGetExternal.mockResolvedValueOnce({ id: 'polar-customer-123' });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const cachedResult = await getPolarCustomerAccessState({ userId: 1 });
    const cache = getPolarCustomerAccessCache();

    expect(cache?.has('1')).toBe(true);

    const cacheEntry = cache?.get('1');

    expect(cacheEntry).toBeDefined();

    if (!cacheEntry) {
      expect.unreachable('expected cached Polar state entry');
    }

    cacheEntry.expiresAt = Date.now() - 1;
    const legacyCacheEntry = cache?.get('documenso_user_1');
    const customerIdCacheEntry = cache?.get('polar-customer-123');

    if (legacyCacheEntry) {
      legacyCacheEntry.expiresAt = Date.now() - 1;
    }

    if (customerIdCacheEntry) {
      customerIdCacheEntry.expiresAt = Date.now() - 1;
    }

    mockGetExternal.mockImplementation(() => Promise.reject(new Error('Polar unavailable')));

    await expect(getPolarCustomerAccessState({ userId: 1 })).resolves.toEqual(cachedResult);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        externalCustomerId: '1',
        msg: 'Serving stale Polar customer access cache after lookup failure',
      }),
    );
  });

  it('skips a cached no-access result when skipCache is requested', async () => {
    let shouldResolveCanonicalCustomer = false;

    mockGetExternal.mockImplementation(({ externalId }: { externalId: string }) => {
      if (externalId === '1' && shouldResolveCanonicalCustomer) {
        return Promise.resolve({ id: 'polar-customer-123' });
      }

      return Promise.reject(createResourceNotFoundError());
    });

    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const initialResult = await getPolarCustomerAccessState({ userId: 1 });
    shouldResolveCanonicalCustomer = true;
    const refreshedResult = await getPolarCustomerAccessState({
      userId: 1,
      skipCache: true,
    });

    expect(initialResult.hasProductAccess).toBe(false);
    expect(refreshedResult).toMatchObject({
      hasProductAccess: true,
      matchedExternalCustomerId: '1',
      resolvedPolarCustomerId: 'polar-customer-123',
    });
    expect(mockGetExternal).toHaveBeenCalledTimes(3);
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Skipping Polar customer access cache for fresh lookup',
        externalCustomerId: '1',
      }),
    );
  });

  it('throws POLAR_UNAVAILABLE for non-404 ResponseValidationError instances', async () => {
    mockGetExternal.mockImplementation(() =>
      Promise.reject(
        createResponseValidationError({
          body: JSON.stringify({ detail: 'Server error', error: 'InternalError' }),
          rawValue: {
            detail: 'Server error',
            error: 'InternalError',
          },
          statusCode: 500,
        }),
      ),
    );

    await expect(getPolarCustomerAccessState({ userId: 1 })).rejects.toMatchObject({
      code: 'POLAR_UNAVAILABLE',
      statusCode: 503,
    });
  });
});

describe('assertPolarProductAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockResolvedValue({
      polarCustomerId: null,
    });
    mockUpdate.mockResolvedValue(undefined);
    mockGetPolarAccessBenefitId.mockReturnValue('benefit_access');
    mockGetPolarExternalCustomerId.mockImplementation((userId: number) => String(userId));
    mockGetPolarLegacyExternalCustomerId.mockImplementation((userId: number) => `documenso_user_${userId}`);
    Reflect.set(globalThis, '__documenso_polar_customer_access_cache', undefined);
  });

  it('uses the stored Polar customer ID when one exists', async () => {
    mockFindUnique.mockResolvedValue({
      polarCustomerId: 'polar-customer-123',
    });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const result = await assertPolarProductAccess({ userId: 1 });

    expect(result).toMatchObject({
      hasProductAccess: true,
      resolvedPolarCustomerId: 'polar-customer-123',
    });
    expect(mockGetState).toHaveBeenCalledWith({ id: 'polar-customer-123' });
    expect(mockGetExternal).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('persists a resolved Polar customer ID discovered during access checks', async () => {
    mockGetExternal.mockResolvedValueOnce({ id: 'polar-customer-123' });
    mockGetState.mockResolvedValueOnce(createCustomerState(['benefit_access']));

    const result = await assertPolarProductAccess({ userId: 1 });

    expect(result).toMatchObject({
      hasProductAccess: true,
      matchedExternalCustomerId: '1',
      resolvedPolarCustomerId: 'polar-customer-123',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        polarCustomerId: 'polar-customer-123',
      },
    });
  });
});
