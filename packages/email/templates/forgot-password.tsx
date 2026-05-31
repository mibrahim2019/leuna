import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateForgotPasswordProps } from '../template-components/template-forgot-password';
import { TemplateForgotPassword } from '../template-components/template-forgot-password';
import { TemplateShell } from '../template-components/template-shell';

export type ForgotPasswordTemplateProps = Partial<TemplateForgotPasswordProps>;

export const ForgotPasswordTemplate = ({
  resetPasswordLink = 'https://leuna.app',
  assetBaseUrl = 'http://localhost:3002',
}: ForgotPasswordTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Password Reset Requested`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateForgotPassword resetPasswordLink={resetPasswordLink} assetBaseUrl={assetBaseUrl} />
    </TemplateShell>
  );
};

export default ForgotPasswordTemplate;
