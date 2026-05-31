import { Trans } from '@lingui/react/macro';

import { env } from '@documenso/lib/utils/env';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { emailStyles } from './template-styles';

export interface TemplateResetPasswordProps {
  userName: string;
  userEmail: string;
  assetBaseUrl: string;
}

export const TemplateResetPassword = ({ assetBaseUrl }: TemplateResetPasswordProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className={emailStyles.title}>
          <Trans>Password updated!</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>Your password has been updated.</Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className={emailStyles.primaryButton}
            href={`${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signin`}
          >
            <Trans>Sign In</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateResetPassword;
