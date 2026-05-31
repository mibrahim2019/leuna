import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Section, Text } from '../components';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export interface BulkSendCompleteEmailProps {
  userName: string;
  templateName: string;
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  errors: string[];
  assetBaseUrl?: string;
}

export const BulkSendCompleteEmail = ({
  userName,
  templateName,
  totalProcessed,
  successCount,
  failedCount,
  errors,
}: BulkSendCompleteEmailProps) => {
  const { _ } = useLingui();

  return (
    <TemplateShell
      previewText={_(msg`Bulk send operation complete for template "${templateName}"`)}
      isDocument={false}
    >
      <Section>
        <Text className={emailStyles.bodyLeft}>
          <Trans>Hi {userName},</Trans>
        </Text>

        <Text className={emailStyles.bodyLeft}>
          <Trans>Your bulk send operation for template "{templateName}" has completed.</Trans>
        </Text>

        <Text className={emailStyles.titleLeft}>
          <Trans>Summary</Trans>
        </Text>

        <ul className={emailStyles.bulletList}>
          <li>
            <Trans>Total rows processed: {totalProcessed}</Trans>
          </li>
          <li className="mt-1">
            <Trans>Successfully created: {successCount}</Trans>
          </li>
          <li className="mt-1">
            <Trans>Failed: {failedCount}</Trans>
          </li>
        </ul>

        {failedCount > 0 && (
          <Section className="mt-4">
            <Text className={emailStyles.titleLeft}>
              <Trans>The following errors occurred:</Trans>
            </Text>

            <ul className={emailStyles.bulletList}>
              {errors.map((error, index) => (
                <li key={index} className={emailStyles.errorItem}>
                  {error}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Text className={emailStyles.bodyLeft}>
          <Trans>
            You can view the created documents in your dashboard under the "Documents created from
            template" section.
          </Trans>
        </Text>
      </Section>
    </TemplateShell>
  );
};
