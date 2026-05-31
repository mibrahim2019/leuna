import { throwCommunityEditionUnavailable } from '@documenso/lib/server-only/community-edition';

import { authenticatedProcedure } from '../trpc';
import {
  ZVerifyOrganisationEmailDomainRequestSchema,
  ZVerifyOrganisationEmailDomainResponseSchema,
} from './verify-organisation-email-domain.types';

export const verifyOrganisationEmailDomainRoute = authenticatedProcedure
  .input(ZVerifyOrganisationEmailDomainRequestSchema)
  .output(ZVerifyOrganisationEmailDomainResponseSchema)
  .mutation(async ({ input, ctx }) => {
    const { organisationId, emailDomainId } = input;

    ctx.logger.info({
      input: {
        organisationId,
        emailDomainId,
      },
    });

    return throwCommunityEditionUnavailable('Custom email domains');
  });
