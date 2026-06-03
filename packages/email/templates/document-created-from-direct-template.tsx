import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';

import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';

import { Button, Section, Text } from '../components';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type DocumentCompletedEmailTemplateProps = {
  recipientName?: string;
  recipientRole?: RecipientRole;
  documentLink?: string;
  documentName?: string;
  assetBaseUrl?: string;
};

export const DocumentCreatedFromDirectTemplateEmailTemplate = ({
  recipientName = 'John Doe',
  recipientRole = RecipientRole.SIGNER,
  documentLink = 'http://localhost:3000',
  documentName = ' Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
}: DocumentCompletedEmailTemplateProps) => {
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[recipientRole].actioned).toLowerCase();

  const previewText = msg`Document created from direct template`;

  return (
    <TemplateShell previewText={_(previewText)} assetBaseUrl={assetBaseUrl}>
      <Section>
        <Text className={emailStyles.title}>
          <Trans>
            {recipientName} {action} a document by using one of your direct links
          </Trans>
        </Text>

        <div className={emailStyles.pill}>{documentName}</div>

        <Section className="my-6 text-center">
          <Button className={emailStyles.primaryButton} href={documentLink}>
            <Trans>View document</Trans>
          </Button>
        </Section>
      </Section>
    </TemplateShell>
  );
};

export default DocumentCreatedFromDirectTemplateEmailTemplate;
