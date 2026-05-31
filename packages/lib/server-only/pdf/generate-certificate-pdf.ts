import { PDF } from '@libpdf/core';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import type { DocumentMeta } from '@prisma/client';
import type { Envelope, Field, Recipient, Signature } from '@prisma/client';
import { FieldType } from '@prisma/client';

import { ZSupportedLanguageCodeSchema } from '../../constants/i18n';
import type { TDocumentAuditLogBaseSchema } from '../../types/document-audit-logs';
import { extractDocumentAuthMethods } from '../../utils/document-auth';
import { getTranslations } from '../../utils/i18n';
import { getDocumentCertificateAuditLogs } from '../document/get-document-certificate-audit-logs';
import { renderCertificate } from './render-certificate';

export type GenerateCertificatePdfOptions = {
  /**
   * Note: completedAt is not included since it's not real at this point in time.
   *
   * If we actually need it here in the future, we will need to preserve the
   * completedAt value and pass it to the final `envelope.update` function when
   * the document is initially sealed.
   */
  envelope: Omit<Envelope, 'completedAt'> & {
    documentMeta: DocumentMeta;
  };
  envelopeOwner: {
    name: string;
    email: string;
  };
  recipients: Recipient[];
  fields: (Pick<Field, 'id' | 'type' | 'secondaryId' | 'recipientId'> & {
    signature?: Pick<Signature, 'signatureImageAsBase64' | 'typedSignature'> | null;
  })[];
  language?: string;
  pageWidth: number;
  pageHeight: number;
};

type TCertificateAuditLog = TDocumentAuditLogBaseSchema & {
  type: string;
  data: {
    recipientId?: number | string | null;
    fieldSecurity?: {
      type?: string | null;
    } | null;
  };
};

export const generateCertificatePdf = async (options: GenerateCertificatePdfOptions) => {
  const { envelope, envelopeOwner, recipients, fields, language, pageWidth, pageHeight } = options;

  const documentLanguage = ZSupportedLanguageCodeSchema.parse(language);

  const [auditLogs, messages] = await Promise.all([
    getDocumentCertificateAuditLogs({
      envelopeId: envelope.id,
    }),
    getTranslations(documentLanguage),
  ]);

  i18n.loadAndActivate({
    locale: documentLanguage,
    messages,
  });

  const payload = {
    recipients: recipients.map((recipient) => {
      const recipientId = recipient.id;
      const emailSentLogs = auditLogs['EMAIL_SENT'] as TCertificateAuditLog[];
      const documentSentLogs = auditLogs['DOCUMENT_SENT'] as TCertificateAuditLog[];
      const documentOpenedLogs = auditLogs['DOCUMENT_OPENED'] as TCertificateAuditLog[];
      const documentRecipientCompletedLogs = auditLogs[
        'DOCUMENT_RECIPIENT_COMPLETED'
      ] as TCertificateAuditLog[];
      const documentRecipientRejectedLogs = auditLogs[
        'DOCUMENT_RECIPIENT_REJECTED'
      ] as TCertificateAuditLog[];
      const insertedFieldLogs = auditLogs.DOCUMENT_FIELD_INSERTED as TCertificateAuditLog[];

      const signatureField = fields.find(
        (field) => field.recipientId === recipient.id && field.type === FieldType.SIGNATURE,
      );

      const emailSent: TCertificateAuditLog | undefined = emailSentLogs.find(
        (log) =>
          log.type === 'EMAIL_SENT' && log.data.recipientId === recipientId,
      );

      const documentSent: TCertificateAuditLog | undefined = documentSentLogs.find(
        (log) => log.type === 'DOCUMENT_SENT',
      );

      const documentOpened: TCertificateAuditLog | undefined = documentOpenedLogs.find(
        (log) =>
          log.type === 'DOCUMENT_OPENED' && log.data.recipientId === recipientId,
      );

      const documentRecipientCompleted: TCertificateAuditLog | undefined =
        documentRecipientCompletedLogs.find(
          (log) =>
          log.type === 'DOCUMENT_RECIPIENT_COMPLETED' && log.data.recipientId === recipientId,
        );

      const documentRecipientRejected: TCertificateAuditLog | undefined =
        documentRecipientRejectedLogs.find(
          (log) =>
          log.type === 'DOCUMENT_RECIPIENT_REJECTED' && log.data.recipientId === recipientId,
        );

      const extractedAuthMethods = extractDocumentAuthMethods({
        documentAuth: envelope.authOptions,
        recipientAuth: recipient.authOptions,
      });

      const insertedAuditLogsWithFieldAuth = insertedFieldLogs.filter(
        (log) =>
          log.data.recipientId === recipient.id && log.data.fieldSecurity,
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const actionAuthMethod = insertedAuditLogsWithFieldAuth[0]?.data?.fieldSecurity?.type;

      let authLevel =
        actionAuthMethod === 'ACCOUNT'
          ? i18n._(msg`Account Re-Authentication`)
          : actionAuthMethod === 'TWO_FACTOR_AUTH'
            ? i18n._(msg`Two-Factor Re-Authentication`)
            : actionAuthMethod === 'PASSWORD'
              ? i18n._(msg`Password Re-Authentication`)
              : actionAuthMethod === 'PASSKEY'
                ? i18n._(msg`Passkey Re-Authentication`)
                : actionAuthMethod === 'EXPLICIT_NONE'
                  ? i18n._(msg`Email`)
                  : null;

      if (!authLevel) {
        const accessAuthMethod = extractedAuthMethods.derivedRecipientAccessAuth[0];

        authLevel =
          accessAuthMethod === 'ACCOUNT'
            ? i18n._(msg`Account Authentication`)
            : accessAuthMethod === 'TWO_FACTOR_AUTH'
              ? i18n._(msg`Two-Factor Authentication`)
              : i18n._(msg`Email`);
      }

      return {
        id: recipient.id,
        name: recipient.name,
        email: recipient.email,
        role: recipient.role,
        signingStatus: recipient.signingStatus,
        signatureField,
        rejectionReason: recipient.rejectionReason,
        authLevel,
        logs: {
          emailed: emailSent ?? null,
          sent: documentSent ?? null,
          opened: documentOpened ?? null,
          completed: documentRecipientCompleted ?? null,
          rejected: documentRecipientRejected ?? null,
        },
      };
    }),
    envelopeOwner,
    qrToken: envelope.qrToken,
    hidePoweredBy: true,
    pageWidth,
    pageHeight,
    i18n,
  };

  const certificatePages = await renderCertificate(payload);

  return await PDF.merge(certificatePages);
};
