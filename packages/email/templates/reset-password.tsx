import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Link, Section, Text } from '../components';
import type { TemplateResetPasswordProps } from '../template-components/template-reset-password';
import { TemplateResetPassword } from '../template-components/template-reset-password';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type ResetPasswordTemplateProps = Partial<TemplateResetPasswordProps>;

export const ResetPasswordTemplate = ({
  userName = 'Lucas Smith',
  userEmail = 'lucas@leuna.app',
  assetBaseUrl = 'http://localhost:3002',
}: ResetPasswordTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Password Reset Successful`;

  return (
    <TemplateShell
      previewText={_(previewText)}
      assetBaseUrl={assetBaseUrl}
      isDocument={false}
      supplementaryContent={
        <Section>
          <Text className={emailStyles.bodyLeft}>
            <Trans>
              Hi, {userName}{' '}
              <Link className={emailStyles.mutedLink} href={`mailto:${userEmail}`}>
                ({userEmail})
              </Link>
            </Trans>
          </Text>

          <Text className={emailStyles.bodyLeft}>
            <Trans>
              We've changed your password as you asked. You can now sign in with your new password.
            </Trans>
          </Text>
          <Text className={emailStyles.bodyLeft}>
            <Trans>
              Didn't request a password change? We are here to help you secure your account, just{' '}
              <Link className={emailStyles.footerLink} href="mailto:hi@leuna.app">
                contact us
              </Link>
              .
            </Trans>
          </Text>
        </Section>
      }
    >
      <TemplateResetPassword
        userName={userName}
        userEmail={userEmail}
        assetBaseUrl={assetBaseUrl}
      />
    </TemplateShell>
  );
};

export default ResetPasswordTemplate;
