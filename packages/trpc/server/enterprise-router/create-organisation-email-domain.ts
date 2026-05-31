import { throwCommunityEditionUnavailable } from '@documenso/lib/server-only/community-edition';

import { authenticatedProcedure } from '../trpc';
import {
  ZCreateOrganisationEmailDomainRequestSchema,
  ZCreateOrganisationEmailDomainResponseSchema,
} from './create-organisation-email-domain.types';

export const createOrganisationEmailDomainRoute = authenticatedProcedure
  .input(ZCreateOrganisationEmailDomainRequestSchema)
  .output(ZCreateOrganisationEmailDomainResponseSchema)
  .mutation(async ({ input, ctx }) => {
    const { organisationId, domain } = input;

    ctx.logger.info({
      input: {
        organisationId,
        domain,
      },
    });

    return throwCommunityEditionUnavailable('Custom email domains');
  });
