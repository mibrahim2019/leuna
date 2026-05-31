import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateRecipientExpiredProps } from '../template-components/template-recipient-expired';
import { TemplateRecipientExpired } from '../template-components/template-recipient-expired';
import { TemplateShell } from '../template-components/template-shell';

export type RecipientExpiredEmailTemplateProps = Partial<TemplateRecipientExpiredProps>;

export const RecipientExpiredTemplate = ({
  documentName = ' Pledge.pdf',
  recipientName = 'John Doe',
  recipientEmail = 'john@example.com',
  documentLink = 'https://leuna.app',
  assetBaseUrl = 'http://localhost:3002',
}: RecipientExpiredEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`The signing window for "${recipientName}" on document "${documentName}" has expired.`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateRecipientExpired
        documentName={documentName}
        recipientName={recipientName}
        recipientEmail={recipientEmail}
        documentLink={documentLink}
        assetBaseUrl={assetBaseUrl}
      />
    </TemplateShell>
  );
};

export default RecipientExpiredTemplate;
