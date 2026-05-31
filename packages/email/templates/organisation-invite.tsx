import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type OrganisationInviteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  senderName: string;
  organisationName: string;
  token: string;
};

export const OrganisationInviteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  senderName = 'John Doe',
  organisationName = 'Organisation Name',
  token = '',
}: OrganisationInviteEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Accept invitation to join an organisation on Leuna`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage className="mx-auto" assetBaseUrl={assetBaseUrl} staticAsset="add-user.png" />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          <Trans>Join {organisationName} on Leuna</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>You have been invited to join the following organisation</Trans>
        </Text>

        <div className={emailStyles.pill}>{organisationName}</div>

        <Text className={emailStyles.body}>
          <Trans>
            by <span className="font-semibold text-[#141414]">{senderName}</span>
          </Trans>
        </Text>

        <Section className="mb-6 mt-6 text-center">
          <Button
            className={emailStyles.primaryButton}
            href={`${baseUrl}/organisation/invite/${token}`}
          >
            <Trans>Accept</Trans>
          </Button>
          <Button
            className={`${emailStyles.secondaryButton} ml-4`}
            href={`${baseUrl}/organisation/decline/${token}`}
          >
            <Trans>Decline</Trans>
          </Button>
        </Section>
      </Section>
    </TemplateShell>
  );
};

export default OrganisationInviteEmailTemplate;
