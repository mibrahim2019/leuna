import type { Checkout } from '@polar-sh/sdk/models/components/checkout.js';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import {
  POLAR_LIFETIME_SUCCESS_PATH,
  POLAR_NOT_CONFIGURED_ERROR_CODE,
} from '../../constants/polar';
import { AppError } from '../../errors/app-error';
import { polarClient } from './client';
import { getPolarExternalCustomerId, getPolarLifetimeProductId } from './constants';

export type CreateLifetimeCheckoutOptions = {
  customerEmail: string;
  customerIpAddress?: string | null;
  customerName?: string | null;
  polarCustomerId?: string | null;
  userId: number;
};

export const createLifetimeCheckout = async ({
  customerEmail,
  customerIpAddress,
  customerName,
  polarCustomerId,
  userId,
}: CreateLifetimeCheckoutOptions): Promise<Checkout> => {
  const checkout = await polarClient.checkouts.create({
    allowDiscountCodes: true,
    customerEmail,
    customerIpAddress: customerIpAddress ?? null,
    customerMetadata: {
      app: 'sign',
      documensoUserId: userId,
      productScope: 'sign.leuna.io',
    },
    customerName: customerName ?? null,
    customerId: polarCustomerId ?? null,
    externalCustomerId: polarCustomerId ? null : getPolarExternalCustomerId(userId),
    metadata: {
      app: 'sign',
      productScope: 'sign.leuna.io',
      source: 'documenso_lifetime_checkout',
      userId,
    },
    products: [getPolarLifetimeProductId()],
    returnUrl: `${NEXT_PUBLIC_WEBAPP_URL()}/offer`,
    successUrl: `${NEXT_PUBLIC_WEBAPP_URL()}${POLAR_LIFETIME_SUCCESS_PATH}?checkout_id={CHECKOUT_ID}`,
  });

  if (!checkout.url) {
    throw new AppError(POLAR_NOT_CONFIGURED_ERROR_CODE, {
      message: 'Polar checkout did not return a hosted checkout URL',
      userMessage: 'We could not start checkout right now. Please try again.',
      statusCode: 500,
    });
  }

  return checkout;
};
