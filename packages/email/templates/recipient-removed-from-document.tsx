import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import type { TemplateDocumentCancelProps } from '../template-components/template-document-cancel';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type DocumentCancelEmailTemplateProps = Partial<TemplateDocumentCancelProps>;

export const RecipientRemovedFromDocumentTemplate = ({
  inviterName = 'Lucas Smith',
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
}: DocumentCancelEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`${inviterName} has removed you from the document ${documentName}.`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <Section>
        <Text className={emailStyles.title}>
          <Trans>
            {inviterName} has removed you from the document
            <br />"{documentName}"
          </Trans>
        </Text>
      </Section>
    </TemplateShell>
  );
};

export default RecipientRemovedFromDocumentTemplate;
