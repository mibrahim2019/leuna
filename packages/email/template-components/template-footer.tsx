import { Trans } from '@lingui/react/macro';

import { Link, Section, Text } from '../components';
import { useBranding } from '../providers/branding';
import { emailStyles } from './template-styles';

export type TemplateFooterProps = {
  isDocument?: boolean;
};

export const TemplateFooter = ({ isDocument = true }: TemplateFooterProps) => {
  const branding = useBranding();

  return (
    <Section>
      {isDocument && !branding.brandingHidePoweredBy && (
        <Text className={emailStyles.footerText}>
          <Trans>
            This document was sent using{' '}
            <Link className={emailStyles.footerLink} href="https://leuna.app">
              Leuna
            </Link>
            .
          </Trans>
        </Text>
      )}

      {branding.brandingEnabled && branding.brandingCompanyDetails && (
        <Text className={emailStyles.footerText}>
          {branding.brandingCompanyDetails.split('\n').map((line, idx) => {
            return (
              <>
                {idx > 0 && <br />}
                {line}
              </>
            );
          })}
        </Text>
      )}

      {!branding.brandingEnabled && (
        <Text className={emailStyles.footerText}>
          <Link className={emailStyles.footerLink} href="https://leuna.app">
            Leuna
          </Link>
        </Text>
      )}
    </Section>
  );
};

export default TemplateFooter;
