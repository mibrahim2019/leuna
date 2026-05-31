import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import TemplateImage from '../template-components/template-image';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

type OrganisationAccountLinkConfirmationTemplateProps = {
  type: 'create' | 'link';
  confirmationLink: string;
  organisationName: string;
  assetBaseUrl: string;
};

export const OrganisationAccountLinkConfirmationTemplate = ({
  type = 'link',
  confirmationLink = '<CONFIRMATION_LINK>',
  organisationName = '<ORGANISATION_NAME>',
  assetBaseUrl = 'http://localhost:3002',
}: OrganisationAccountLinkConfirmationTemplateProps) => {
  const { _ } = useLingui();

  const previewText =
    type === 'create'
      ? msg`A request has been made to create an account for you`
      : msg`A request has been made to link your Leuna account`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <Section>
        <TemplateImage
          className="mx-auto h-12 w-12"
          assetBaseUrl={assetBaseUrl}
          staticAsset="building-2.png"
        />
      </Section>

      <Section>
        <Text className={emailStyles.title}>
          {type === 'create' ? (
            <Trans>Account creation request</Trans>
          ) : (
            <Trans>Link your Leuna account</Trans>
          )}
        </Text>

        <Text className={emailStyles.bodyWide}>
          {type === 'create' ? (
            <Trans>
              <span className="font-bold">{organisationName}</span> has requested to create an
              account on your behalf.
            </Trans>
          ) : (
            <Trans>
              <span className="font-bold">{organisationName}</span> has requested to link your
              current Leuna account to their organisation.
            </Trans>
          )}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button className={emailStyles.primaryButton} href={confirmationLink}>
            <Trans>Review request</Trans>
          </Button>
        </Section>

        <Text className={emailStyles.subtle}>
          <Trans>Link expires in 30 minutes.</Trans>
        </Text>
      </Section>
    </TemplateShell>
  );
};

export default OrganisationAccountLinkConfirmationTemplate;
