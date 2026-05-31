import { Trans } from '@lingui/react/macro';

import { env } from '@documenso/lib/utils/env';

import { Button, Column, Img, Link, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { cn, emailStyles } from './template-styles';

export interface TemplateDocumentSelfSignedProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentSelfSigned = ({
  documentName,
  assetBaseUrl,
}: TemplateDocumentSelfSignedProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  const signUpUrl = `${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signup`;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Section>
          <Column align="center">
            <Text className={cn(emailStyles.statusLabel, 'text-[#4f8f2f]')}>
              <Img
                src={getAssetUrl('/static/completed.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              <Trans>Completed</Trans>
            </Text>
          </Column>
        </Section>

        <Text className={`${emailStyles.title} mt-6`}>
          <Trans>You have signed “{documentName}”</Trans>
        </Text>

        <Text className={emailStyles.bodyWide}>
          <Trans>
            Create a{' '}
            <Link
              href={signUpUrl}
              target="_blank"
              className={`${emailStyles.footerLink} whitespace-nowrap`}
            >
              free account
            </Link>{' '}
            to access your signed documents at any time.
          </Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button href={signUpUrl} className={`${emailStyles.secondaryButton} mr-4`}>
            <Img
              src={getAssetUrl('/static/user-plus.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            <Trans>Create account</Trans>
          </Button>

          <Button className={emailStyles.secondaryButton} href="https://leuna.app">
            <Img
              src={getAssetUrl('/static/review.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            <Trans>Learn more</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentSelfSigned;
