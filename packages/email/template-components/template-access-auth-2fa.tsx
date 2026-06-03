import { Plural, Trans } from '@lingui/react/macro';

import { Heading, Section, Text } from '../components';
import { emailStyles } from './template-styles';

export type TemplateAccessAuth2FAProps = {
  documentTitle: string;
  code: string;
  userEmail: string;
  userName: string;
  expiresInMinutes: number;
};

export const TemplateAccessAuth2FA = ({
  documentTitle,
  code,
  userName,
  expiresInMinutes,
}: TemplateAccessAuth2FAProps) => {
  return (
    <div>
      <Section className="mt-8">
        <Heading className={emailStyles.title}>
          <Trans>Verification Code Required</Trans>
        </Heading>

        <Text className={emailStyles.body}>
          <Trans>
            Hi {userName}, you need to enter a verification code to complete the document "
            {documentTitle}".
          </Trans>
        </Text>

        <Section className={emailStyles.codePanel}>
          <Text className={emailStyles.codeLabel}>
            <Trans>Your verification code:</Trans>
          </Text>
          <Text className={emailStyles.codeValue}>{code}</Text>
        </Section>

        <Text className={emailStyles.subtle}>
          <Plural
            value={expiresInMinutes}
            one="This code will expire in # minute."
            other="This code will expire in # minutes."
          />
        </Text>

        <Text className={emailStyles.subtle}>
          <Trans>
            If you didn't request this verification code, you can safely ignore this email.
          </Trans>
        </Text>
      </Section>
    </div>
  );
};
