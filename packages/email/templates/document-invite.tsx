import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import type { RecipientRole } from '@prisma/client';
import { OrganisationType } from '@prisma/client';

import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';

import { Link, Section, Text } from '../components';
import { TemplateCustomMessageBody } from '../template-components/template-custom-message-body';
import type { TemplateDocumentInviteProps } from '../template-components/template-document-invite';
import { TemplateDocumentInvite } from '../template-components/template-document-invite';
import { TemplateShell } from '../template-components/template-shell';
import { emailStyles } from '../template-components/template-styles';

export type DocumentInviteEmailTemplateProps = Partial<TemplateDocumentInviteProps> & {
  customBody?: string;
  role: RecipientRole;
  selfSigner?: boolean;
  teamName?: string;
  teamEmail?: string;
  includeSenderDetails?: boolean;
  organisationType?: OrganisationType;
};

export const DocumentInviteEmailTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@leuna.app',
  documentName = ' Pledge.pdf',
  signDocumentLink = 'https://leuna.app',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
  role,
  selfSigner = false,
  teamName = '',
  includeSenderDetails,
  organisationType,
}: DocumentInviteEmailTemplateProps) => {
  const { _ } = useLingui();

  const action = _(RECIPIENT_ROLES_DESCRIPTION[role].actionVerb).toLowerCase();

  let previewText = msg`${inviterName} has invited you to ${action} ${documentName}`;

  if (organisationType === OrganisationType.ORGANISATION) {
    previewText = includeSenderDetails
      ? msg`${inviterName} on behalf of "${teamName}" has invited you to ${action} ${documentName}`
      : msg`${teamName} has invited you to ${action} ${documentName}`;
  }

  if (selfSigner) {
    previewText = msg`Please ${action} your document ${documentName}`;
  }

  return (
    <TemplateShell
      previewText={_(previewText)}
      assetBaseUrl={assetBaseUrl}
      supplementaryContent={
        <Section>
          {organisationType === OrganisationType.PERSONAL && (
            <Text className={emailStyles.bodyLeft}>
              <Trans>
                {inviterName}{' '}
                <Link className={emailStyles.mutedLink} href="mailto:{inviterEmail}">
                  ({inviterEmail})
                </Link>
              </Trans>
            </Text>
          )}

          {customBody ? (
            <TemplateCustomMessageBody text={customBody} />
          ) : (
            <Text className={emailStyles.bodyLeft}>
              <Trans>
                {inviterName} has invited you to {action} the document "{documentName}".
              </Trans>
            </Text>
          )}
        </Section>
      }
    >
      <TemplateDocumentInvite
        inviterName={inviterName}
        inviterEmail={inviterEmail}
        documentName={documentName}
        signDocumentLink={signDocumentLink}
        assetBaseUrl={assetBaseUrl}
        role={role}
        selfSigner={selfSigner}
        organisationType={organisationType}
        teamName={teamName}
        includeSenderDetails={includeSenderDetails}
      />
    </TemplateShell>
  );
};

export default DocumentInviteEmailTemplate;
