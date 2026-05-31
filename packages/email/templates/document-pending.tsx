import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateDocumentPendingProps } from '../template-components/template-document-pending';
import { TemplateDocumentPending } from '../template-components/template-document-pending';
import { TemplateShell } from '../template-components/template-shell';

export type DocumentPendingEmailTemplateProps = Partial<TemplateDocumentPendingProps>;

export const DocumentPendingEmailTemplate = ({
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
}: DocumentPendingEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Pending Document`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentPending documentName={documentName} assetBaseUrl={assetBaseUrl} />
    </TemplateShell>
  );
};

export default DocumentPendingEmailTemplate;
