import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateDocumentCancelProps } from '../template-components/template-document-cancel';
import { TemplateDocumentCancel } from '../template-components/template-document-cancel';
import { TemplateShell } from '../template-components/template-shell';

export type DocumentCancelEmailTemplateProps = Partial<TemplateDocumentCancelProps>;

export const DocumentCancelTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@leuna.app',
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  cancellationReason,
}: DocumentCancelEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`${inviterName} has cancelled the document ${documentName}, you don't need to sign it anymore.`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentCancel
        inviterName={inviterName}
        inviterEmail={inviterEmail}
        documentName={documentName}
        assetBaseUrl={assetBaseUrl}
        cancellationReason={cancellationReason}
      />
    </TemplateShell>
  );
};

export default DocumentCancelTemplate;
