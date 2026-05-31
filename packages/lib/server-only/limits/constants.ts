import type { TLimitsSchema } from './schema';

export const UNRESTRICTED_LIMITS: TLimitsSchema = {
  documents: Infinity,
  recipients: Infinity,
  directTemplates: Infinity,
};

export const DEFAULT_MINIMUM_ENVELOPE_ITEM_COUNT = Number.MAX_SAFE_INTEGER;
