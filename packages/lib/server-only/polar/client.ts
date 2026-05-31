import { Polar } from '@polar-sh/sdk';

import { getPolarAccessToken, getPolarServer } from './constants';

export const polarClient = new Polar({
  accessToken: getPolarAccessToken(),
  server: getPolarServer(),
  timeoutMs: 10_000,
});
