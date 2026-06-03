import { Trans } from '@lingui/react/macro';

import { Button, Column, Img, Section, Text } from '../components';
import { cn, emailStyles } from './template-styles';

export interface TemplateDocumentCompletedProps {
  downloadLink: string;
  documentName: string;
  assetBaseUrl: string;
  customBody?: string;
}

export const TemplateDocumentCompleted = ({
  downloadLink,
  documentName,
  assetBaseUrl,
  customBody,
}: TemplateDocumentCompletedProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <Section>
        <Section className="mb-4">
          <Column align="center">
            <Text className={cn(emailStyles.statusLabel, 'text-[#4f8f2f]')}>
              <Img
                src={getAssetUrl('/static/completed.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
                alt=""
              />
              <Trans>Completed</Trans>
            </Text>
          </Column>
        </Section>

        <Text className={emailStyles.title}>
          {customBody || <Trans>“{documentName}” was signed by all signers</Trans>}
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>Continue by downloading the document.</Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button className={emailStyles.primaryButton} href={downloadLink}>
            <Trans>Download document</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentCompleted;
