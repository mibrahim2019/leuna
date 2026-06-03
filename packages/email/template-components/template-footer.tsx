import { Section, Text } from '../components';
import { useBranding } from '../providers/branding';
import { emailStyles } from './template-styles';

export type TemplateFooterProps = {
  isDocument?: boolean;
};

export const TemplateFooter = (_props: TemplateFooterProps) => {
  const branding = useBranding();

  if (!branding.brandingEnabled || !branding.brandingCompanyDetails) {
    return null;
  }

  return (
    <Section>
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
    </Section>
  );
};

export default TemplateFooter;
