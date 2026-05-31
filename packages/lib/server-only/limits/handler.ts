import { getSession } from '@documenso/auth/server/lib/utils/get-session';
import { AppError } from '@documenso/lib/errors/app-error';

import { ERROR_CODES } from './errors';
import { getServerLimits } from './server';

export const limitsHandler = async (req: Request) => {
  try {
    const { user } = await getSession(req);

    const rawTeamId = req.headers.get('team-id');
    const teamId = rawTeamId ? Number.parseInt(rawTeamId, 10) : NaN;

    if (!Number.isFinite(teamId) || teamId <= 0) {
      throw new Error(ERROR_CODES.INVALID_TEAM_ID);
    }

    const limits = await getServerLimits({ userId: user.id, teamId });

    return Response.json(limits, {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    if (err instanceof AppError) {
      return Response.json(
        {
          error: err.userMessage ?? err.message ?? ERROR_CODES.UNKNOWN,
        },
        {
          status: err.statusCode ?? 500,
        },
      );
    }

    if (err instanceof Error) {
      const status = err.message === ERROR_CODES.INVALID_TEAM_ID ? 400 : 500;

      return Response.json(
        {
          error: err.message,
        },
        {
          status,
        },
      );
    }

    return Response.json(
      {
        error: ERROR_CODES.UNKNOWN,
      },
      {
        status: 500,
      },
    );
  }
};
