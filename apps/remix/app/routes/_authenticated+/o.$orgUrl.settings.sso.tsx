import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { useCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';

import { CommunityEditionFeatureNotice } from '~/components/general/community-edition-feature-notice';
import { SettingsHeader } from '~/components/general/settings-header';
import { appMetaTags } from '~/utils/meta';

export function meta() {
  return appMetaTags(msg`Organisation SSO Portal`);
}

export default function OrganisationSettingSSOLoginPage() {
  const { t } = useLingui();
  const organisation = useCurrentOrganisation();

  return (
    <div className="max-w-2xl">
      <SettingsHeader
        title={t`Organisation SSO Portal`}
        subtitle={t`Organisation SSO is unavailable in the community edition.`}
      />

      <CommunityEditionFeatureNotice
        title={t`Unavailable in Community Edition`}
        description={t`Organisation SSO configuration and account linking require enterprise-only services that are disabled in this deployment.`}
        backHref={`/o/${organisation.url}/settings/general`}
      />
    </div>
  );
}
