import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import {
  TemplateDocumentDelete,
  type TemplateDocumentDeleteProps,
} from '../template-components/template-document-super-delete';
import { TemplateShell } from '../template-components/template-shell';

export type DocumentDeleteEmailTemplateProps = Partial<TemplateDocumentDeleteProps>;

export const DocumentSuperDeleteEmailTemplate = ({
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  reason = 'Unknown',
}: DocumentDeleteEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`An admin has deleted your document "${documentName}".`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentDelete
        reason={reason}
        documentName={documentName}
        assetBaseUrl={assetBaseUrl}
      />
    </TemplateShell>
  );
};

export default DocumentSuperDeleteEmailTemplate;
