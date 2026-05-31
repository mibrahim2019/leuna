import { throwCommunityEditionUnavailable } from '@documenso/lib/server-only/community-edition';

import { procedure } from '../trpc';
import {
  ZLinkOrganisationAccountRequestSchema,
  ZLinkOrganisationAccountResponseSchema,
} from './link-organisation-account.types';

/**
 * Unauthenicated procedure, do not copy paste.
 */
export const linkOrganisationAccountRoute = procedure
  .input(ZLinkOrganisationAccountRequestSchema)
  .output(ZLinkOrganisationAccountResponseSchema)
  .mutation(async () => {
    return throwCommunityEditionUnavailable('Organisation SSO');
  });
