import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { formatTeamUrl } from '@documenso/lib/utils/teams';

import { Button, Link, Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type ConfirmTeamEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamName: string;
  teamUrl: string;
  token: string;
};

export const ConfirmTeamEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://leuna.app',
  teamName = 'Team Name',
  teamUrl = 'demo',
  token = '',
}: ConfirmTeamEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Accept team email request for ${teamName} on Leuna`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage
          className="mx-auto"
          assetBaseUrl={assetBaseUrl}
          staticAsset="mail-open.png"
        />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          <Trans>Verify your team email address</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            <span className="font-bold">{teamName}</span> has requested to use your email address
            for their team on Leuna.
          </Trans>
        </Text>

        <div className={emailStyles.pill}>{formatTeamUrl(teamUrl, baseUrl)}</div>

        <Section className="mt-6">
          <Text className={emailStyles.subtleLeft}>
            <Trans>
              By accepting this request, you will be granting <strong>{teamName}</strong> access to:
            </Trans>
          </Text>

          <ul className={emailStyles.bulletList}>
            <li>
              <Trans>View all documents sent to and from this email address</Trans>
            </li>
            <li className="mt-1">
              <Trans>Allow document recipients to reply directly to this email address</Trans>
            </li>
            <li className="mt-1">
              <Trans>Send documents on behalf of the team using the email address</Trans>
            </li>
          </ul>

          <Text className={emailStyles.subtleLeft}>
            <Trans>
              You can revoke access at any time in your team settings on Leuna{' '}
              <Link className={emailStyles.footerLink} href={`${baseUrl}/settings/teams`}>
                here
              </Link>
              .
            </Trans>
          </Text>
        </Section>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className={emailStyles.primaryButton}
            href={`${baseUrl}/team/verify/email/${token}`}
          >
            <Trans>Accept</Trans>
          </Button>
        </Section>

        <Text className={emailStyles.subtle}>
          <Trans>Link expires in 1 hour.</Trans>
        </Text>
      </Section>
    </TemplateShell>
  );
};

export default ConfirmTeamEmailTemplate;
