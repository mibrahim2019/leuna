import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link, Outlet, useLoaderData } from 'react-router';

import { getSession } from '@documenso/auth/server/lib/utils/get-session';
import {
  DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT,
  UNRESTRICTED_LIMITS,
} from '@documenso/lib/server-only/limits/constants';
import { LimitsProvider } from '@documenso/lib/server-only/limits/provider/client';
import { getServerLimits } from '@documenso/lib/server-only/limits/server';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-team';
import { TrpcProvider } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';

import { GenericErrorLayout } from '~/components/general/generic-error-layout';
import { useOptionalCurrentTeam } from '~/providers/team';

import type { Route } from './+types/_layout';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { user } = await getSession(request);

  try {
    const team = await getTeamByUrl({
      userId: user.id,
      teamUrl: params.teamUrl,
    });

    return {
      limits: await getServerLimits({
        userId: user.id,
        teamId: team.id,
      }),
    };
  } catch (err) {
    const error = AppError.parseError(err);

    if (error.code === AppErrorCode.NOT_FOUND) {
      return {
        limits: undefined,
      };
    }

    throw err;
  }
}

export default function Layout() {
  const { limits } = useLoaderData<typeof loader>();
  const team = useOptionalCurrentTeam();

  if (!team) {
    return (
      <GenericErrorLayout
        errorCode={404}
        errorCodeMap={{
          404: {
            heading: msg`Team not found`,
            subHeading: msg`404 Team not found`,
            message: msg`The team you are looking for may have been removed, renamed or may have never existed.`,
          },
        }}
        primaryButton={
          <Button asChild>
            <Link to="/settings/teams">
              <Trans>View teams</Trans>
            </Link>
          </Button>
        }
      ></GenericErrorLayout>
    );
  }

  const trpcHeaders = {
    'x-team-Id': team.id.toString(),
  };

  // Note: We use a key to force a re-render if the team context changes.
  // This is required otherwise you would see the wrong page content.
  return (
    <div key={team.url}>
      <TrpcProvider headers={trpcHeaders}>
        <LimitsProvider
          initialValue={
            limits ?? {
              quota: UNRESTRICTED_LIMITS,
              remaining: UNRESTRICTED_LIMITS,
              hasProductAccess: true,
              maximumEnvelopeItemCount: DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT,
            }
          }
          teamId={team.id}
        >
          <Outlet />
        </LimitsProvider>
      </TrpcProvider>
    </div>
  );
}
