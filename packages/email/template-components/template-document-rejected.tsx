import { Trans } from '@lingui/react/macro';

import { Button, Heading, Section, Text } from '../components';
import { emailStyles } from './template-styles';

export interface TemplateDocumentRejectedProps {
  documentName: string;
  recipientName: string;
  rejectionReason?: string;
  documentUrl: string;
}

export function TemplateDocumentRejected({
  documentName,
  recipientName: signerName,
  rejectionReason,
  documentUrl,
}: TemplateDocumentRejectedProps) {
  return (
    <div className="mt-4">
      <Heading className={emailStyles.heading}>
        <Trans>Document Rejected</Trans>
      </Heading>

      <Text className={emailStyles.bodyLeft}>
        <Trans>
          {signerName} has rejected the document "{documentName}".
        </Trans>
      </Text>

      {rejectionReason && (
        <Text className={emailStyles.subtleLeft}>
          <Trans>Reason for rejection: {rejectionReason}</Trans>
        </Text>
      )}

      <Text className={emailStyles.bodyLeft}>
        <Trans>You can view the document and its status by clicking the button below.</Trans>
      </Text>

      <Section className="mt-8 text-center">
        <Button href={documentUrl} className={emailStyles.primaryButton}>
          <Trans>View Document</Trans>
        </Button>
      </Section>
    </div>
  );
}
