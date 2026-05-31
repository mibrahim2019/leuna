import { AppError } from '../../errors/app-error';
import {
  POLAR_EXTERNAL_CUSTOMER_ID_PREFIX,
  POLAR_NOT_CONFIGURED_ERROR_CODE,
} from '../../constants/polar';
import { env } from '../../utils/env';

export const POLAR_STATE_CACHE_TTL_MS = 30_000;

export const getPolarServer = () => {
  const server = env('POLAR_SERVER') ?? 'production';

  if (server !== 'production' && server !== 'sandbox') {
    throw new AppError(POLAR_NOT_CONFIGURED_ERROR_CODE, {
      message: `Invalid POLAR_SERVER value: ${server}`,
      userMessage: 'Polar is not configured correctly.',
      statusCode: 500,
    });
  }

  return server;
};

export const getPolarAccessToken = () => {
  const accessToken = env('POLAR_ACCESS_TOKEN');

  if (!accessToken) {
    throw new AppError(POLAR_NOT_CONFIGURED_ERROR_CODE, {
      message: 'Missing POLAR_ACCESS_TOKEN',
      userMessage: 'Polar is not configured correctly.',
      statusCode: 500,
    });
  }

  return accessToken;
};

export const getPolarLifetimeProductId = () => {
  const productId = env('POLAR_LIFETIME_PRODUCT_ID');

  if (!productId) {
    throw new AppError(POLAR_NOT_CONFIGURED_ERROR_CODE, {
      message: 'Missing POLAR_LIFETIME_PRODUCT_ID',
      userMessage: 'The lifetime checkout is not configured yet.',
      statusCode: 500,
    });
  }

  return productId;
};

export const getPolarAccessBenefitId = () => {
  const benefitId = env('POLAR_ACCESS_BENEFIT_ID');

  if (!benefitId) {
    throw new AppError(POLAR_NOT_CONFIGURED_ERROR_CODE, {
      message: 'Missing POLAR_ACCESS_BENEFIT_ID',
      userMessage: 'The lifetime access entitlement is not configured yet.',
      statusCode: 500,
    });
  }

  return benefitId;
};

export const getPolarExternalCustomerId = (userId: number) =>
  String(userId);

export const getPolarLegacyExternalCustomerId = (userId: number) =>
  `${POLAR_EXTERNAL_CUSTOMER_ID_PREFIX}${userId}`;
