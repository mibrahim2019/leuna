import { Outlet, redirect, redirectDocument } from 'react-router';

import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import {
  POLAR_LIFETIME_PURCHASE_PATH,
  POLAR_LIFETIME_SIGNUP_PATH,
  POLAR_LIFETIME_SUCCESS_PATH,
} from '@documenso/lib/constants/polar';
import { AppError } from '@documenso/lib/errors/app-error';
import { createLifetimeCheckout } from '@documenso/lib/server-only/polar/checkout';
import { getPolarCustomerAccessState } from '@documenso/lib/server-only/polar/customer';
import { extractRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';
import { logger } from '@documenso/lib/utils/logger';
import { prisma } from '@documenso/prisma';

export async function loader({ request }: { request: Request }) {
  const session = await getOptionalSession(request);
  const path = new URL(request.url).pathname;

  if (path !== POLAR_LIFETIME_PURCHASE_PATH) {
    logger.info({
      msg: 'Skipping lifetime checkout loader for nested purchase route',
      path,
      userId: session.isAuthenticated ? session.user.id : null,
    });

    return null;
  }

  if (!session.isAuthenticated) {
    throw redirect(POLAR_LIFETIME_SIGNUP_PATH);
  }

  logger.info({
    msg: 'Entered lifetime purchase loader',
    path,
    userId: session.user.id,
  });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { polarCustomerId: true },
    });
    const storedPolarCustomerId = user?.polarCustomerId ?? null;

    const accessState = await getPolarCustomerAccessState({
      userId: session.user.id,
      polarCustomerId: storedPolarCustomerId,
    });

    const resolvedPolarCustomerId = accessState.resolvedPolarCustomerId ?? storedPolarCustomerId;

    if (resolvedPolarCustomerId && resolvedPolarCustomerId !== storedPolarCustomerId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          polarCustomerId: resolvedPolarCustomerId,
        },
      });
    }

    logger.info({
      msg: 'Resolved Polar customer access state in lifetime purchase loader',
      path,
      userId: session.user.id,
      hasProductAccess: accessState.hasProductAccess,
      grantedBenefitCount: accessState.grantedBenefits.length,
      matchedExternalCustomerId: accessState.matchedExternalCustomerId,
      resolvedPolarCustomerId,
    });

    if (accessState.hasProductAccess) {
      throw redirect(POLAR_LIFETIME_SUCCESS_PATH);
    }

    const requestMetadata = extractRequestMetadata(request);

    logger.info({
      msg: 'Starting lifetime checkout creation',
      path,
      userId: session.user.id,
      hasCustomerIpAddress: Boolean(requestMetadata.ipAddress),
    });

    const checkout = await createLifetimeCheckout({
      userId: session.user.id,
      customerEmail: session.user.email,
      customerName: session.user.name ?? undefined,
      customerIpAddress: requestMetadata.ipAddress,
      polarCustomerId: resolvedPolarCustomerId,
    });

    logger.info({
      msg: 'Lifetime checkout created successfully',
      path,
      userId: session.user.id,
      hasCheckoutId: Boolean(checkout.id),
      hasCheckoutUrl: Boolean(checkout.url),
      checkoutUrlHost: new URL(checkout.url).host,
    });

    throw redirectDocument(checkout.url);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    const parsedError = AppError.parseError(error);

    logger.error({
      msg: 'Lifetime purchase loader failed',
      path,
      userId: session.user.id,
      errorCode: parsedError.code,
      errorMessage: parsedError.message,
      errorUserMessage: parsedError.userMessage,
      errorStatusCode: parsedError.statusCode,
    });

    throw error;
  }
}

export default function PurchaseLifetimeRoute() {
  return <Outlet />;
}
