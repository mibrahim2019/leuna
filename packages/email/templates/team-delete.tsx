import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { formatTeamUrl } from '@documenso/lib/utils/teams';

import { Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type TeamDeleteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamUrl: string;
};

export const TeamDeleteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  teamUrl = 'demo',
}: TeamDeleteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`A team you were a part of has been deleted`;

  const title = msg`A team you were a part of has been deleted`;

  const description = msg`The following team has been deleted. You will no longer be able to access this team and its documents`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage
          className="mx-auto"
          assetBaseUrl={assetBaseUrl}
          staticAsset="delete-team.png"
        />
      </Section>

      <Section>
        <Text className={emailStyles.title}>{_(title)}</Text>

        <Text className={emailStyles.bodyWide}>{_(description)}</Text>

        <div className={emailStyles.pill}>{formatTeamUrl(teamUrl, baseUrl)}</div>
      </Section>
    </TemplateShell>
  );
};

export default TeamDeleteEmailTemplate;
