import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { emailStyles } from './template-styles';

export type TemplateConfirmationEmailProps = {
  confirmationLink: string;
  assetBaseUrl: string;
};

export const TemplateConfirmationEmail = ({
  confirmationLink,
  assetBaseUrl,
}: TemplateConfirmationEmailProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className={emailStyles.title}>
          <Trans>Welcome to Leuna!</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            Before you get started, please confirm your email address by clicking the button below:
          </Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button className={emailStyles.primaryButton} href={confirmationLink}>
            <Trans>Confirm email</Trans>
          </Button>
          <Text className={`${emailStyles.subtle} italic`}>
            <Trans>
              You can also copy and paste this link into your browser: {confirmationLink} (link
              expires in 1 hour)
            </Trans>
          </Text>
        </Section>
      </Section>
    </>
  );
};
