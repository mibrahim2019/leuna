import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import type { TemplateDocumentCompletedProps } from '../template-components/template-document-completed';
import { TemplateDocumentCompleted } from '../template-components/template-document-completed';
import { TemplateShell } from '../template-components/template-shell';

export type DocumentCompletedEmailTemplateProps = Partial<TemplateDocumentCompletedProps> & {
  customBody?: string;
};

export const DocumentCompletedEmailTemplate = ({
  downloadLink = 'https://leuna.app',
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
}: DocumentCompletedEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Completed Document`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <TemplateDocumentCompleted
        downloadLink={downloadLink}
        documentName={documentName}
        assetBaseUrl={assetBaseUrl}
        customBody={customBody}
      />
    </TemplateShell>
  );
};

export default DocumentCompletedEmailTemplate;
