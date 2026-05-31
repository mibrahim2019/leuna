import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import type { CustomerStateBenefitGrant } from '@polar-sh/sdk/models/components/customerstatebenefitgrant.js';
import { ResourceNotFound } from '@polar-sh/sdk/models/errors/resourcenotfound.js';
import { ResponseValidationError } from '@polar-sh/sdk/models/errors/responsevalidationerror.js';

import { prisma } from '@documenso/prisma';

import { POLAR_ACCESS_REQUIRED_ERROR_CODE, POLAR_UNAVAILABLE_ERROR_CODE } from '../../constants/polar';
import { AppError } from '../../errors/app-error';
import { logger } from '../../utils/logger';
import { polarClient } from './client';
import {
  getPolarAccessBenefitId,
  getPolarExternalCustomerId,
  getPolarLegacyExternalCustomerId,
  POLAR_STATE_CACHE_TTL_MS,
} from './constants';

type PolarCustomerAccessState = {
  customerState: CustomerState | null;
  externalCustomerId: string;
  matchedExternalCustomerId: string | null;
  grantedBenefits: CustomerStateBenefitGrant[];
  hasProductAccess: boolean;
  resolvedPolarCustomerId: string | null;
};

type PolarCustomerAccessCacheEntry = {
  expiresAt: number;
  value: PolarCustomerAccessState;
};

declare global {
  // eslint-disable-next-line no-var
  var __documenso_polar_customer_access_cache: Map<string, PolarCustomerAccessCacheEntry> | undefined;
}

const getPolarCustomerAccessCache = () => {
  if (!globalThis.__documenso_polar_customer_access_cache) {
    globalThis.__documenso_polar_customer_access_cache = new Map();
  }

  return globalThis.__documenso_polar_customer_access_cache;
};

const getUniqueCacheKeys = (cacheKeys: Array<string | null | undefined>) =>
  Array.from(new Set(cacheKeys.filter((cacheKey): cacheKey is string => Boolean(cacheKey))));

const cachePolarCustomerAccessState = (
  cacheKeys: Array<string | null | undefined>,
  value: PolarCustomerAccessState,
) => {
  const uniqueCacheKeys = getUniqueCacheKeys(cacheKeys);

  for (const cacheKey of uniqueCacheKeys) {
    getPolarCustomerAccessCache().set(cacheKey, {
      expiresAt: Date.now() + POLAR_STATE_CACHE_TTL_MS,
      value,
    });
  }
};

const getCachedPolarCustomerAccessState = (
  cacheKeys: Array<string | null | undefined>,
  {
    allowExpired = false,
  }: {
    allowExpired?: boolean;
  } = {},
) => {
  const uniqueCacheKeys = getUniqueCacheKeys(cacheKeys);

  for (const cacheKey of uniqueCacheKeys) {
    const entry = getPolarCustomerAccessCache().get(cacheKey);

    if (!entry) {
      continue;
    }

    if (!allowExpired && entry.expiresAt <= Date.now()) {
      continue;
    }

    return entry.value;
  }

  return null;
};

const parsePolarErrorPayload = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'string') {
    try {
      return parsePolarErrorPayload(JSON.parse(value));
    } catch {
      return null;
    }
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return Object.fromEntries(Object.entries(value));
};

const isPolarResourceNotFoundPayload = (value: unknown) => {
  const payload = parsePolarErrorPayload(value);

  return payload?.error === 'ResourceNotFound';
};

const isPolarCustomerMissingError = (error: unknown) => {
  if (error instanceof ResourceNotFound) {
    return true;
  }

  if (!(error instanceof ResponseValidationError) || error.statusCode !== 404) {
    return false;
  }

  return [error.body, error.rawValue, error.rawMessage].some(isPolarResourceNotFoundPayload);
};

const normalizePolarCustomerAccessState = ({
  customerState,
  externalCustomerId,
  matchedExternalCustomerId = null,
  resolvedPolarCustomerId = null,
}: {
  customerState: CustomerState | null;
  externalCustomerId: string;
  matchedExternalCustomerId?: string | null;
  resolvedPolarCustomerId?: string | null;
}): PolarCustomerAccessState => {
  const grantedBenefits = customerState?.grantedBenefits ?? [];
  const accessBenefitId = getPolarAccessBenefitId();

  return {
    customerState,
    externalCustomerId,
    matchedExternalCustomerId,
    grantedBenefits,
    hasProductAccess: grantedBenefits.some((benefitGrant) => benefitGrant.benefitId === accessBenefitId),
    resolvedPolarCustomerId,
  };
};

const getPolarErrorLogContext = (error: unknown) => {
  if (!(error instanceof Error)) {
    return {
      errorValue: error,
    };
  }

  const response =
    'response' in error && error.response && typeof error.response === 'object'
      ? error.response
      : undefined;

  return {
    errorName: error.name,
    errorMessage: error.message,
    errorStatusCode: 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined,
    errorDetails: 'details' in error ? error.details : undefined,
    errorBody: 'body' in error ? error.body : undefined,
    responseStatus: response && 'status' in response && typeof response.status === 'number' ? response.status : undefined,
    responseStatusText:
      response && 'statusText' in response && typeof response.statusText === 'string'
        ? response.statusText
        : undefined,
    responseBody: response && 'body' in response ? response.body : undefined,
  };
};

export const getPolarCustomerAccessState = async ({
  userId,
  polarCustomerId,
  skipCache = false,
}: {
  userId: number;
  polarCustomerId?: string | null;
  skipCache?: boolean;
}): Promise<PolarCustomerAccessState> => {
  const externalCustomerId = getPolarExternalCustomerId(userId);
  const legacyExternalCustomerId = getPolarLegacyExternalCustomerId(userId);
  const cacheKeys = [
    polarCustomerId ?? null,
    externalCustomerId,
    legacyExternalCustomerId,
  ];

  logger.info({
    msg: 'Starting Polar customer access lookup',
    userId,
    externalCustomerId,
    legacyExternalCustomerId,
    polarCustomerId: polarCustomerId ?? null,
    skipCache,
  });

  const cachedState = skipCache ? null : getCachedPolarCustomerAccessState(cacheKeys);

  if (skipCache) {
    logger.info({
      msg: 'Skipping Polar customer access cache for fresh lookup',
      userId,
      externalCustomerId,
      legacyExternalCustomerId,
      polarCustomerId: polarCustomerId ?? null,
    });
  }

  if (cachedState) {
    logger.info({
      msg: 'Polar customer access cache hit',
      userId,
      externalCustomerId,
      legacyExternalCustomerId,
      hasProductAccess: cachedState.hasProductAccess,
      grantedBenefitCount: cachedState.grantedBenefits.length,
      matchedExternalCustomerId: cachedState.matchedExternalCustomerId,
      resolvedPolarCustomerId: cachedState.resolvedPolarCustomerId,
    });

    return cachedState;
  }

  logger.info({
    msg: 'Polar customer access cache miss',
    userId,
    externalCustomerId,
    legacyExternalCustomerId,
  });

  try {
    const resolveByPolarCustomerId = async (customerId: string) => {
      try {
        const customerState = await polarClient.customers.getState({
          id: customerId,
        });

        return normalizePolarCustomerAccessState({
          customerState,
          externalCustomerId,
          resolvedPolarCustomerId: customerId,
        });
      } catch (error) {
        if (!isPolarCustomerMissingError(error)) {
          throw error;
        }

        logger.info({
          msg: 'Stored Polar customer ID not found, falling back to external customer IDs',
          userId,
          externalCustomerId,
          legacyExternalCustomerId,
          polarCustomerId: customerId,
        });

        return null;
      }
    };

    const resolveByExternalCustomerId = async (candidateExternalCustomerId: string) => {
      try {
        const customer = await polarClient.customers.getExternal({
          externalId: candidateExternalCustomerId,
        });
        const resolvedPolarCustomerId = customer.id;
        const customerState = await polarClient.customers.getState({
          id: resolvedPolarCustomerId,
        });

        return normalizePolarCustomerAccessState({
          customerState,
          externalCustomerId,
          matchedExternalCustomerId: candidateExternalCustomerId,
          resolvedPolarCustomerId,
        });
      } catch (error) {
        if (!isPolarCustomerMissingError(error)) {
          throw error;
        }

        return null;
      }
    };

    const normalizedState =
      (polarCustomerId ? await resolveByPolarCustomerId(polarCustomerId) : null) ??
      (await resolveByExternalCustomerId(externalCustomerId)) ??
      (legacyExternalCustomerId !== externalCustomerId
        ? await resolveByExternalCustomerId(legacyExternalCustomerId)
        : null) ??
      normalizePolarCustomerAccessState({
        customerState: null,
        externalCustomerId,
      });

    cachePolarCustomerAccessState(
      [
        polarCustomerId ?? null,
        externalCustomerId,
        legacyExternalCustomerId,
        normalizedState.resolvedPolarCustomerId,
        normalizedState.matchedExternalCustomerId,
      ],
      normalizedState,
    );

    if (normalizedState.hasProductAccess) {
      logger.info({
        msg: 'Polar customer state fetched successfully',
        userId,
        externalCustomerId,
        legacyExternalCustomerId,
        hasProductAccess: normalizedState.hasProductAccess,
        grantedBenefitCount: normalizedState.grantedBenefits.length,
        matchedExternalCustomerId: normalizedState.matchedExternalCustomerId,
        resolvedPolarCustomerId: normalizedState.resolvedPolarCustomerId,
      });
    } else {
      logger.info({
        msg: normalizedState.customerState
          ? 'Polar customer state fetched without required access benefit'
          : 'Polar customer state not found, treating as no access',
        userId,
        externalCustomerId,
        legacyExternalCustomerId,
        hasProductAccess: normalizedState.hasProductAccess,
        grantedBenefitCount: normalizedState.grantedBenefits.length,
        matchedExternalCustomerId: normalizedState.matchedExternalCustomerId,
        resolvedPolarCustomerId: normalizedState.resolvedPolarCustomerId,
        requiredBenefitId: getPolarAccessBenefitId(),
        grantedBenefitIds: normalizedState.grantedBenefits.map(
          (benefitGrant) => benefitGrant.benefitId,
        ),
      });
    }

    return normalizedState;
  } catch (error) {
    logger.error({
      msg: 'Polar customer state lookup failed',
      userId,
      externalCustomerId,
      legacyExternalCustomerId,
      polarCustomerId: polarCustomerId ?? null,
      ...getPolarErrorLogContext(error),
    });

    const staleCachedState = getCachedPolarCustomerAccessState(cacheKeys, {
      allowExpired: true,
    });

    if (staleCachedState) {
      logger.warn({
        msg: 'Serving stale Polar customer access cache after lookup failure',
        userId,
        externalCustomerId,
        hasProductAccess: staleCachedState.hasProductAccess,
        grantedBenefitCount: staleCachedState.grantedBenefits.length,
      });

      return staleCachedState;
    }

    logger.error({
      msg: 'No stale Polar customer access cache available, throwing POLAR_UNAVAILABLE',
      userId,
      externalCustomerId,
    });

    throw new AppError(POLAR_UNAVAILABLE_ERROR_CODE, {
      message: `Failed to fetch Polar customer state for ${externalCustomerId}`,
      userMessage: 'We could not verify your purchase access right now. Please try again in a moment.',
      statusCode: 503,
    });
  }
};

export const assertPolarProductAccess = async ({ userId }: { userId: number }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { polarCustomerId: true },
  });
  const storedPolarCustomerId = user?.polarCustomerId ?? null;

  const accessState = await getPolarCustomerAccessState({
    userId,
    polarCustomerId: storedPolarCustomerId,
  });

  if (
    accessState.resolvedPolarCustomerId &&
    accessState.resolvedPolarCustomerId !== storedPolarCustomerId
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        polarCustomerId: accessState.resolvedPolarCustomerId,
      },
    });
  }

  if (!accessState.hasProductAccess) {
    throw new AppError(POLAR_ACCESS_REQUIRED_ERROR_CODE, {
      message: `Polar access required for user ${userId}`,
      userMessage: 'Lifetime access is required before you can create or send documents.',
      statusCode: 402,
    });
  }

  return accessState;
};
