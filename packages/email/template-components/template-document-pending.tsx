import { Trans } from '@lingui/react/macro';

import { Column, Img, Section, Text } from '../components';
import { cn, emailStyles } from './template-styles';

export interface TemplateDocumentPendingProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentPending = ({
  documentName,
  assetBaseUrl,
}: TemplateDocumentPendingProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <Section>
        <Section className="mb-4">
          <Column align="center">
            <Text className={cn(emailStyles.statusLabel, 'text-[#376aa3]')}>
              <Img
                src={getAssetUrl('/static/clock.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              <Trans>Waiting for others</Trans>
            </Text>
          </Column>
        </Section>

        <Text className={emailStyles.title}>
          <Trans>“{documentName}” has been signed</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            We're still waiting for other signers to sign this document.
            <br />
            We'll notify you as soon as it's ready.
          </Trans>
        </Text>
      </Section>
    </>
  );
};

export default TemplateDocumentPending;
