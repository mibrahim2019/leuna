import { Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { emailStyles } from './template-styles';

export interface TemplateDocumentCancelProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  assetBaseUrl: string;
  cancellationReason?: string;
}

export const TemplateDocumentCancel = ({
  inviterName,
  documentName,
  assetBaseUrl,
  cancellationReason,
}: TemplateDocumentCancelProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className={emailStyles.title}>
          <Trans>
            {inviterName} has cancelled the document
            <br />"{documentName}"
          </Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>All signatures have been voided.</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>You don't need to sign it anymore.</Trans>
        </Text>

        {cancellationReason && (
          <Text className={emailStyles.body}>
            <Trans>Reason for cancellation: {cancellationReason}</Trans>
          </Text>
        )}
      </Section>
    </>
  );
};

export default TemplateDocumentCancel;
