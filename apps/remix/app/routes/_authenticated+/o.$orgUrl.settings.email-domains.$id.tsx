import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { useCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';
import { CommunityEditionFeatureNotice } from '~/components/general/community-edition-feature-notice';
import { SettingsHeader } from '~/components/general/settings-header';

import type { Route } from './+types/o.$orgUrl.settings.email-domains.$id';

export default function OrganisationEmailDomainSettingsPage({ params }: Route.ComponentProps) {
  const { t } = useLingui();
  const organisation = useCurrentOrganisation();
  const emailDomainId = params.id;

  return (
    <div>
      <SettingsHeader
        title={t`Email Domain Settings`}
        subtitle={t`Custom email domain management is unavailable in the community edition.`}
      />

      <CommunityEditionFeatureNotice
        title={t`Unavailable in Community Edition`}
        description={t`Custom email domain "${emailDomainId}" cannot be managed in this deployment because email-domain provisioning is disabled.`}
        backHref={`/o/${organisation.url}/settings/general`}
      />
    </div>
  );
}
