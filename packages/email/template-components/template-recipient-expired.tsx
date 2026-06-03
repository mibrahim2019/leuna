import { Trans } from '@lingui/react/macro';

import { Button, Section, Text } from '../components';
import { emailStyles } from './template-styles';

export type TemplateRecipientExpiredProps = {
  documentName: string;
  recipientName: string;
  recipientEmail: string;
  documentLink: string;
  assetBaseUrl: string;
};

export const TemplateRecipientExpired = ({
  documentName,
  recipientName,
  recipientEmail,
  documentLink,
  assetBaseUrl,
}: TemplateRecipientExpiredProps) => {
  const displayName = recipientName || recipientEmail;

  return (
    <>
      <Section>
        <Text className={emailStyles.title}>
          <Trans>
            Signing window expired for "{displayName}" on "{documentName}"
          </Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            The signing window for {displayName} on document "{documentName}" has expired. You can
            resend the document to extend their deadline or cancel the document.
          </Trans>
        </Text>

        <Section className="my-4 text-center">
          <Button className={emailStyles.primaryButton} href={documentLink}>
            <Trans>View Document</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateRecipientExpired;
