import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type OrganisationJoinEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  memberName: string;
  memberEmail: string;
  organisationName: string;
  organisationUrl: string;
};

export const OrganisationJoinEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  memberName = 'John Doe',
  memberEmail = 'johndoe@leuna.app',
  organisationName = 'Organisation Name',
  organisationUrl = 'demo',
}: OrganisationJoinEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`A member has joined your organisation on Leuna`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage className="mx-auto" assetBaseUrl={assetBaseUrl} staticAsset="add-user.png" />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          <Trans>A new member has joined your organisation {organisationName}</Trans>
        </Text>

        <div className={emailStyles.pill}>{memberName || memberEmail}</div>
      </Section>
    </TemplateShell>
  );
};

export default OrganisationJoinEmailTemplate;
