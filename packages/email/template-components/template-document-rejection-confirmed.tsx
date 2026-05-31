import { Trans } from '@lingui/react/macro';

import { Container, Heading, Section, Text } from '../components';
import { emailStyles } from './template-styles';

interface TemplateDocumentRejectionConfirmedProps {
  recipientName: string;
  documentName: string;
  documentOwnerName: string;
  reason?: string;
}

export function TemplateDocumentRejectionConfirmed({
  recipientName,
  documentName,
  documentOwnerName,
  reason,
}: TemplateDocumentRejectionConfirmedProps) {
  return (
    <Container>
      <Section>
        <Heading className={emailStyles.heading}>
          <Trans>Rejection Confirmed</Trans>
        </Heading>

        <Text className={emailStyles.bodyLeft}>
          <Trans>
            This email confirms that you have rejected the document{' '}
            <strong className="font-bold">"{documentName}"</strong> sent by {documentOwnerName}.
          </Trans>
        </Text>

        {reason && (
          <Text className={emailStyles.subtleLeft}>
            <Trans>Rejection reason: {reason}</Trans>
          </Text>
        )}

        <Text className={emailStyles.bodyLeft}>
          <Trans>
            The document owner has been notified of this rejection. No further action is required
            from you at this time. The document owner may contact you with any questions regarding
            this rejection.
          </Trans>
        </Text>
      </Section>
    </Container>
  );
}
