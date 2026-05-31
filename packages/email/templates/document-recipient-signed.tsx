import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { TemplateDocumentRecipientSigned } from '../template-components/template-document-recipient-signed';
import { TemplateShell } from '../template-components/template-shell';

export interface DocumentRecipientSignedEmailTemplateProps {
  documentName?: string;
  recipientName?: string;
  recipientEmail?: string;
  assetBaseUrl?: string;
}

export const DocumentRecipientSignedEmailTemplate = ({
  documentName = ' Pledge.pdf',
  recipientName = 'John Doe',
  recipientEmail = 'lucas@leuna.app',
  assetBaseUrl = 'http://localhost:3002',
}: DocumentRecipientSignedEmailTemplateProps) => {
  const { _ } = useLingui();

  const recipientReference = recipientName || recipientEmail;

  const previewText = msg`${recipientReference} has signed ${documentName}`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentRecipientSigned
        documentName={documentName}
        recipientName={recipientName}
        recipientEmail={recipientEmail}
        assetBaseUrl={assetBaseUrl}
      />
    </TemplateShell>
  );
};

export default DocumentRecipientSignedEmailTemplate;
