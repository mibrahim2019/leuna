import { env } from '../utils/env';

/**
 * Custom organisation email senders (verified domains). Disabled in community edition.
 */
export const IS_CUSTOM_ORGANISATION_EMAIL_SENDER_ENABLED = false;

export const FROM_ADDRESS = env('NEXT_PRIVATE_SMTP_FROM_ADDRESS') || 'noreply@leuna.app';
export const FROM_NAME = env('NEXT_PRIVATE_SMTP_FROM_NAME') || 'Leuna';

/** Default platform sender when no organisation custom email is selected. */
export const LEUNA_DEFAULT_SENDER_EMAIL = {
  name: FROM_NAME,
  address: FROM_ADDRESS,
};

export const EMAIL_VERIFICATION_STATE = {
  NOT_FOUND: 'NOT_FOUND',
  VERIFIED: 'VERIFIED',
  EXPIRED: 'EXPIRED',
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
} as const;

export const USER_SIGNUP_VERIFICATION_TOKEN_IDENTIFIER = 'confirmation-email';
