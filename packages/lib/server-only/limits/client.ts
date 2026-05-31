import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

import { ZLimitsResponseSchema } from './schema';

export type GetLimitsOptions = {
  headers?: Record<string, string>;
  teamId: number;
};

export const getLimits = async ({ headers, teamId }: GetLimitsOptions) => {
  const requestHeaders = headers ?? {};

  const url = new URL('/api/limits', NEXT_PUBLIC_WEBAPP_URL());

  if (teamId) {
    requestHeaders['team-id'] = teamId.toString();
  }

  const response = await fetch(url, {
    headers: {
      ...requestHeaders,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch limits: ${response.status}`);
  }

  const data = await response.json();

  return ZLimitsResponseSchema.parse(data);
};
