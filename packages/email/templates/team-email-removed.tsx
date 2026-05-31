import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { formatTeamUrl } from '@documenso/lib/utils/teams';

import { Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type TeamEmailRemovedTemplateProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamEmail: string;
  teamName: string;
  teamUrl: string;
};

export const TeamEmailRemovedTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  teamEmail = 'example@leuna.app',
  teamName = 'Team Name',
  teamUrl = 'demo',
}: TeamEmailRemovedTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Team email removed for ${teamName} on Leuna`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage
          className="mx-auto"
          assetBaseUrl={assetBaseUrl}
          staticAsset="mail-open-alert.png"
        />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          <Trans>Team email removed</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            The team email <span className="font-bold">{teamEmail}</span> has been removed from the
            following team
          </Trans>
        </Text>

        <div className={emailStyles.pill}>{formatTeamUrl(teamUrl, baseUrl)}</div>
      </Section>
    </TemplateShell>
  );
};

export default TeamEmailRemovedTemplate;
