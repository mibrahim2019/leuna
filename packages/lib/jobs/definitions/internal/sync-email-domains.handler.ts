import { getCommunityEditionUnavailableMessage } from '../../../server-only/community-edition';

import type { JobRunIO } from '../../client/_internal/job';
import type { TSyncEmailDomainsJobDefinition } from './sync-email-domains';

export const run = async ({ io }: { payload: TSyncEmailDomainsJobDefinition; io: JobRunIO }) => {
  io.logger.info(getCommunityEditionUnavailableMessage('Custom email domain sync'));
};
