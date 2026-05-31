import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateConfirmationEmailProps } from '../template-components/template-confirmation-email';
import { TemplateConfirmationEmail } from '../template-components/template-confirmation-email';
import { TemplateShell } from '../template-components/template-shell';

export const ConfirmEmailTemplate = ({
  confirmationLink,
  assetBaseUrl = 'http://localhost:3002',
}: TemplateConfirmationEmailProps) => {
  const { _ } = useLingui();

  const previewText = msg`Please confirm your email address`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl} isDocument={false}>
      <TemplateConfirmationEmail confirmationLink={confirmationLink} assetBaseUrl={assetBaseUrl} />
    </TemplateShell>
  );
};

export default ConfirmEmailTemplate;
