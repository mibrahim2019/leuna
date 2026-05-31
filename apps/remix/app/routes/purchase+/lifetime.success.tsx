import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { Link, redirect, useLoaderData, useNavigate, useRevalidator } from 'react-router';

import { useSession } from '@documenso/lib/client-only/providers/session';
import { prisma } from '@documenso/prisma';

import { extractCookieFromHeaders } from '@documenso/auth/server/lib/utils/cookies';
import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import {
  POLAR_LIFETIME_PURCHASE_PATH,
  POLAR_LIFETIME_SUCCESS_PATH,
} from '@documenso/lib/constants/polar';
import { getPolarCustomerAccessState } from '@documenso/lib/server-only/polar/customer';
import { polarClient } from '@documenso/lib/server-only/polar/client';
import { getTeams } from '@documenso/lib/server-only/team/get-teams';
import { logger } from '@documenso/lib/utils/logger';
import { formatDocumentsPath } from '@documenso/lib/utils/teams';
import { ZTeamUrlSchema } from '@documenso/trpc/server/team-router/schema';
import { Button } from '@documenso/ui/primitives/button';

import { appMetaTags } from '~/utils/meta';

const AUTO_REFRESH_LIMIT = 6;
const AUTO_REFRESH_INTERVAL_MS = 2000;
export const AUTO_CONTINUE_DELAY_MS = 1500;

const getErrorLogContext = (error: unknown) => {
  if (!(error instanceof Error)) {
    return {
      errorValue: error,
    };
  }

  return {
    errorMessage: error.message,
    errorName: error.name,
    errorStack: error.stack,
  };
};

export function meta() {
  return appMetaTags(msg`Lifetime Access`);
}

export async function loader({ request }: { request: Request }) {
  const session = await getOptionalSession(request);
  const url = new URL(request.url);
  const path = url.pathname;
  const checkoutId = url.searchParams.get('checkout_id');
  const returnTo = `${POLAR_LIFETIME_SUCCESS_PATH}${url.search}`;

  logger.info({
    msg: 'Entered lifetime purchase success loader',
    path,
    checkoutId,
    hasCheckoutId: Boolean(checkoutId),
    isAuthenticated: session.isAuthenticated,
    userId: session.isAuthenticated ? session.user.id : null,
  });

  if (!session.isAuthenticated) {
    throw redirect(`/signin?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { polarCustomerId: true },
  });

  let polarCustomerId = existingUser?.polarCustomerId ?? null;
  let didPerformCheckoutLookup = false;
  let didPersistPolarCustomerId = false;

  if (checkoutId) {
    didPerformCheckoutLookup = true;

    try {
      logger.info({
        msg: 'Fetching Polar checkout during lifetime success verification',
        path,
        userId: session.user.id,
        checkoutId,
        hasExistingPolarCustomerId: Boolean(polarCustomerId),
      });

      const checkout = await polarClient.checkouts.get({ id: checkoutId });
      const checkoutCustomerId = checkout.customerId ?? null;

      logger.info({
        msg: 'Fetched Polar checkout during lifetime success verification',
        path,
        userId: session.user.id,
        checkoutId,
        hasCheckoutCustomerId: Boolean(checkoutCustomerId),
        checkoutCustomerId,
      });

      if (checkoutCustomerId && checkoutCustomerId !== polarCustomerId) {
        polarCustomerId = checkoutCustomerId;

        await prisma.user.update({
          where: { id: session.user.id },
          data: { polarCustomerId },
        });

        didPersistPolarCustomerId = true;
      }

      logger.info({
        msg: 'Resolved Polar customer ID during lifetime success verification',
        path,
        userId: session.user.id,
        checkoutId,
        polarCustomerId,
        didPersistPolarCustomerId,
      });
    } catch (error) {
      logger.warn({
        msg: 'Failed to fetch Polar checkout during lifetime success verification',
        path,
        userId: session.user.id,
        checkoutId,
        ...getErrorLogContext(error),
      });

      logger.info({
        msg: 'Continuing lifetime success verification without Polar checkout details',
        path,
        userId: session.user.id,
        checkoutId,
        polarCustomerId,
      });
    }
  } else {
    logger.info({
      msg: 'No checkout ID present during lifetime success verification',
      path,
      userId: session.user.id,
      polarCustomerId,
    });
  }

  const [accessState, teams] = await Promise.all([
    getPolarCustomerAccessState({
      userId: session.user.id,
      polarCustomerId,
      skipCache: Boolean(checkoutId),
    }),
    getTeams({
      userId: session.user.id,
    }),
  ]);

  if (
    accessState.resolvedPolarCustomerId &&
    accessState.resolvedPolarCustomerId !== polarCustomerId
  ) {
    polarCustomerId = accessState.resolvedPolarCustomerId;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { polarCustomerId },
    });

    didPersistPolarCustomerId = true;
  }

  const teamUrlCookie = extractCookieFromHeaders('preferred-team-url', request.headers);
  const preferredTeam =
    teamUrlCookie && ZTeamUrlSchema.safeParse(teamUrlCookie).success
      ? teams.find((team) => team.url === teamUrlCookie)
      : undefined;
  const defaultTeam = preferredTeam ?? teams[0];
  const continuePath = defaultTeam ? formatDocumentsPath(defaultTeam.url) : '/inbox';

  logger.info({
    msg: 'Resolved lifetime purchase success access state',
    path,
    userId: session.user.id,
    checkoutId,
    didPerformCheckoutLookup,
    didPersistPolarCustomerId,
    hasProductAccess: accessState.hasProductAccess,
    grantedBenefitCount: accessState.grantedBenefits.length,
    matchedExternalCustomerId: accessState.matchedExternalCustomerId,
    resolvedPolarCustomerId: accessState.resolvedPolarCustomerId,
    continuePath,
  });

  return {
    checkoutId,
    continuePath,
    hasProductAccess: accessState.hasProductAccess,
  };
}

export default function PurchaseLifetimeSuccessRoute() {
  const { checkoutId, continuePath, hasProductAccess } = useLoaderData<typeof loader>();
  const { refreshSession } = useSession();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [autoRefreshCount, setAutoRefreshCount] = useState(0);

  useEffect(() => {
    if (!checkoutId || hasProductAccess) {
      return;
    }

    if (autoRefreshCount >= AUTO_REFRESH_LIMIT || revalidator.state !== 'idle') {
      return;
    }

    const timeout = globalThis.setTimeout(() => {
      setAutoRefreshCount((currentCount) => currentCount + 1);
      revalidator.revalidate();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => globalThis.clearTimeout(timeout);
  }, [autoRefreshCount, checkoutId, hasProductAccess, revalidator]);

  useEffect(() => {
    if (!checkoutId || hasProductAccess) {
      setAutoRefreshCount(0);
    }
  }, [checkoutId, hasProductAccess]);

  useEffect(() => {
    if (!hasProductAccess) {
      return;
    }

    let isCancelled = false;
    let timeout: ReturnType<typeof globalThis.setTimeout> | undefined;

    void (async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error('[PurchaseLifetimeSuccessRoute] Failed to refresh session', error);
      }

      if (isCancelled) {
        return;
      }

      timeout = globalThis.setTimeout(() => {
        navigate(continuePath, { replace: true });
      }, AUTO_CONTINUE_DELAY_MS);
    })();

    return () => {
      isCancelled = true;

      if (timeout) {
        globalThis.clearTimeout(timeout);
      }
    };
  }, [continuePath, hasProductAccess, navigate, refreshSession]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <Trans>Lifetime Access</Trans>
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {hasProductAccess ? (
            <Trans>Your access is active.</Trans>
          ) : (
            <Trans>We are still verifying your purchase.</Trans>
          )}
        </h1>

        <p className="mt-4 text-base text-muted-foreground">
          {hasProductAccess ? (
            <Trans>
              Your Leuna account now has the lifetime access benefit. We are refreshing your
              access and taking you to your workspace now.
            </Trans>
          ) : checkoutId ? (
            <Trans>
              Checkout finished, but Polar has not returned the benefit grant yet. Refresh access
              below in a moment or restart checkout if needed.
            </Trans>
          ) : (
            <Trans>
              We could not confirm a completed checkout yet. Refresh access below or start checkout
              again.
            </Trans>
          )}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {hasProductAccess ? (
            <Button asChild size="lg">
              <Link to={continuePath}>
                <Trans>Continue to Workspace</Trans>
              </Link>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="lg"
                onClick={() => revalidator.revalidate()}
                disabled={revalidator.state !== 'idle'}
              >
                {revalidator.state === 'idle' ? (
                  <Trans>Refresh Access</Trans>
                ) : (
                  <Trans>Refreshing...</Trans>
                )}
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                  <Trans>Claim Lifetime Access</Trans>
                </Link>
              </Button>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
