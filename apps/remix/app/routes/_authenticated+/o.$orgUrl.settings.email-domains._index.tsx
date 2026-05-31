import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { useCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';

import { CommunityEditionFeatureNotice } from '~/components/general/community-edition-feature-notice';
import { SettingsHeader } from '~/components/general/settings-header';
import { appMetaTags } from '~/utils/meta';

export function meta() {
  return appMetaTags(msg`Email Domains`);
}

export default function OrganisationSettingsEmailDomains() {
  const { t } = useLingui();
  const organisation = useCurrentOrganisation();

  return (
    <div>
      <SettingsHeader
        title={t`Email Domains`}
        subtitle={t`Custom email domain management is unavailable in the community edition.`}
      />

      <CommunityEditionFeatureNotice
        title={t`Unavailable in Community Edition`}
        description={t`Custom email domain setup requires enterprise-only infrastructure that is not included in this deployment.`}
        backHref={`/o/${organisation.url}/settings/general`}
      />
    </div>
  );
}
