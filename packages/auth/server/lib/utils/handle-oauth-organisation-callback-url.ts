import type { Context } from 'hono';

import { formatOrganisationLoginUrl } from '@documenso/lib/utils/organisation-authentication-portal';

type HandleOAuthOrganisationCallbackUrlOptions = {
  c: Context;
  orgUrl: string;
};

export const handleOAuthOrganisationCallbackUrl = async (
  options: HandleOAuthOrganisationCallbackUrlOptions,
) => {
  const { c, orgUrl } = options;

  return c.redirect(`${formatOrganisationLoginUrl(orgUrl)}?action=community-edition-unavailable`, 302);
};
