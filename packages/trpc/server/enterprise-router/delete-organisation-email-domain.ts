import { throwCommunityEditionUnavailable } from '@documenso/lib/server-only/community-edition';

import { authenticatedProcedure } from '../trpc';
import {
  ZDeleteOrganisationEmailDomainRequestSchema,
  ZDeleteOrganisationEmailDomainResponseSchema,
} from './delete-organisation-email-domain.types';

export const deleteOrganisationEmailDomainRoute = authenticatedProcedure
  .input(ZDeleteOrganisationEmailDomainRequestSchema)
  .output(ZDeleteOrganisationEmailDomainResponseSchema)
  .mutation(async ({ input, ctx }) => {
    const { emailDomainId } = input;

    ctx.logger.info({
      input: {
        emailDomainId,
      },
    });

    return throwCommunityEditionUnavailable('Custom email domains');
  });
