import { Trans } from '@lingui/react/macro';

import { Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';
import { emailStyles } from './template-styles';

export interface TemplateDocumentDeleteProps {
  reason: string;
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentDelete = ({
  reason,
  documentName,
  assetBaseUrl,
}: TemplateDocumentDeleteProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className={`${emailStyles.titleLeft} mt-6`}>
          <Trans>Your document has been deleted by an admin!</Trans>
        </Text>

        <Text className={emailStyles.bodyLeft}>
          <Trans>"{documentName}" has been deleted by an admin.</Trans>
        </Text>

        <Text className={emailStyles.bodyLeft}>
          <Trans>
            This document can not be recovered, if you would like to dispute the reason for future
            documents please contact support.
          </Trans>
        </Text>

        <Text className={emailStyles.subtleLeft}>
          <Trans>The reason provided for deletion is the following:</Trans>
        </Text>

        <Text className={`${emailStyles.bodyLeft} italic`}>{reason}</Text>
      </Section>
    </>
  );
};

export default TemplateDocumentDelete;
