import type { ReactNode } from 'react';

import { Body, Container, Head, Hr, Html, Img, Preview, Section } from '../components';
import { useBranding } from '../providers/branding';
import { TemplateFooter } from './template-footer';
import TemplateImage from './template-image';
import { cn, emailStyles } from './template-styles';

export type TemplateShellProps = {
  assetBaseUrl?: string;
  previewText: string | string[];
  children: ReactNode;
  supplementaryContent?: ReactNode;
  isDocument?: boolean;
  cardClassName?: string;
  contentClassName?: string;
};

export const TemplateShell = ({
  assetBaseUrl = 'http://localhost:3002',
  previewText,
  children,
  supplementaryContent,
  isDocument = true,
  cardClassName,
  contentClassName,
}: TemplateShellProps) => {
  const branding = useBranding();

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body className={emailStyles.page}>
        <Section className={emailStyles.pageSection}>
          <Container className={cn(emailStyles.card, cardClassName)}>
            <Section className={emailStyles.cardHeader}>
              {branding.brandingEnabled && branding.brandingLogo ? (
                <Img src={branding.brandingLogo} alt="Branding Logo" className={emailStyles.logo} />
              ) : (
                <TemplateImage
                  assetBaseUrl={assetBaseUrl}
                  className={emailStyles.logo}
                  staticAsset="logo.png"
                />
              )}
            </Section>

            <Section className={cn(emailStyles.content, contentClassName)}>
              {children}
            </Section>
          </Container>

          {supplementaryContent ? (
            <Container className={emailStyles.supplemental}>{supplementaryContent}</Container>
          ) : null}

          <Hr className={emailStyles.divider} />

          <Container className="mx-auto max-w-2xl">
            <TemplateFooter isDocument={isDocument} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};
