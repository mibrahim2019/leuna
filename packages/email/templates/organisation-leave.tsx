import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type OrganisationLeaveEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  memberName: string;
  memberEmail: string;
  organisationName: string;
  organisationUrl: string;
};

export const OrganisationLeaveEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  memberName = 'John Doe',
  memberEmail = 'johndoe@leuna.app',
  organisationName = 'Organisation Name',
  organisationUrl = 'demo',
}: OrganisationLeaveEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`A member has left your organisation on Leuna`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage
          className="mx-auto"
          assetBaseUrl={assetBaseUrl}
          staticAsset="delete-user.png"
        />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          <Trans>A member has left your organisation {organisationName}</Trans>
        </Text>

        <div className={emailStyles.pill}>{memberName || memberEmail}</div>
      </Section>
    </TemplateShell>
  );
};

export default OrganisationLeaveEmailTemplate;
