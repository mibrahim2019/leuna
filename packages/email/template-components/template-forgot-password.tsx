import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { emailStyles } from './template-styles';

export type TemplateForgotPasswordProps = {
  resetPasswordLink: string;
  assetBaseUrl: string;
};

export const TemplateForgotPassword = ({
  resetPasswordLink,
  assetBaseUrl,
}: TemplateForgotPasswordProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className={emailStyles.title}>
          <Trans>Forgot your password?</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>That's okay, it happens! Click the button below to reset your password.</Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button className={emailStyles.primaryButton} href={resetPasswordLink}>
            <Trans>Reset Password</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateForgotPassword;
