import { redirect } from 'react-router';

import { prisma } from '@documenso/prisma';

import { POLAR_LIFETIME_PURCHASE_PATH } from '@documenso/lib/constants/polar';
import { getPolarCustomerAccessState } from '@documenso/lib/server-only/polar/customer';

const POLAR_GATED_PATHS = new Set(['/', '/dashboard', '/inbox']);

const isTeamWorkspacePath = (pathname: string) => {
  return /^\/t\/[^/]+(?:\/(?:(documents|templates)(?:\/.*)?))?$/.test(pathname);
};

const isOrganisationWorkspacePath = (pathname: string) => {
  return /^\/o\/[^/]+$/.test(pathname);
};

export const isPolarAccessRequiredPath = (pathname: string) => {
  return (
    POLAR_GATED_PATHS.has(pathname) ||
    isTeamWorkspacePath(pathname) ||
    isOrganisationWorkspacePath(pathname)
  );
};

export const requirePolarAccessForRoute = async ({
  request,
  userId,
}: {
  request: Request;
  userId: number;
}) => {
  const { pathname } = new URL(request.url);

  if (!isPolarAccessRequiredPath(pathname)) {
    return;
  }

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
    throw redirect(POLAR_LIFETIME_PURCHASE_PATH);
  }
};
