import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { TemplateDocumentRejectionConfirmed } from '../template-components/template-document-rejection-confirmed';
import { TemplateShell } from '../template-components/template-shell';

export type DocumentRejectionConfirmedEmailProps = {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason: string;
  assetBaseUrl?: string;
};

export function DocumentRejectionConfirmedEmail({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
  assetBaseUrl = 'http://localhost:3002',
}: DocumentRejectionConfirmedEmailProps) {
  const { _ } = useLingui();

  const previewText = _(msg`You have rejected the document '${documentName}'`);

  return (
    <TemplateShell previewText={previewText} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentRejectionConfirmed
        recipientName={recipientName}
        documentName={documentName}
        documentOwnerName={documentOwnerName}
        reason={reason}
      />
    </TemplateShell>
  );
}

export default DocumentRejectionConfirmedEmail;
