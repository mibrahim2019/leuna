import { throwCommunityEditionUnavailable } from '@documenso/lib/server-only/community-edition';

import { adminProcedure } from '../trpc';
import {
  ZReregisterEmailDomainRequestSchema,
  ZReregisterEmailDomainResponseSchema,
} from './reregister-email-domain.types';

export const reregisterEmailDomainRoute = adminProcedure
  .input(ZReregisterEmailDomainRequestSchema)
  .output(ZReregisterEmailDomainResponseSchema)
  .mutation(async ({ input, ctx }) => {
    const { emailDomainId } = input;

    ctx.logger.info({
      input: {
        emailDomainId,
      },
    });

    return throwCommunityEditionUnavailable('Custom email domain re-registration');
  });
