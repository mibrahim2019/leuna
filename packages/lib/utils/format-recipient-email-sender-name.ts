import { FROM_ADDRESS, FROM_NAME } from '../constants/email';

const getPlatformViaLabel = () => {
  const atIndex = FROM_ADDRESS.indexOf('@');

  if (atIndex >= 0) {
    return FROM_ADDRESS.slice(atIndex + 1);
  }

  return 'leuna.app';
};

/**
 * Formats the SMTP From display name for recipient-facing emails sent on behalf of a user.
 *
 * Examples:
 * - "John Henley via leuna.app"
 * - "John via leuna.app" (single name token)
 * - "Leuna" (no user name on file)
 */
export const formatRecipientEmailSenderName = (userName: string | null | undefined): string => {
  const viaLabel = getPlatformViaLabel();
  const trimmed = userName?.trim();

  if (!trimmed) {
    return FROM_NAME;
  }

  const nameParts = trimmed.split(/\s+/).filter(Boolean);
  const displayName = nameParts.length > 1 ? nameParts.join(' ') : nameParts[0];

  if (!displayName) {
    return FROM_NAME;
  }

  return `${displayName} via ${viaLabel}`;
};
