import { z } from 'zod';

export const ZOrganisationFeatureFlagsSchema = z.object({
  allowCustomBranding: z.boolean().optional(),
  hidePoweredBy: z.boolean().optional(),
  unlimitedDocuments: z.boolean().optional(),
  emailDomains: z.boolean().optional(),
  embedAuthoring: z.boolean().optional(),
  embedAuthoringWhiteLabel: z.boolean().optional(),
  embedSigning: z.boolean().optional(),
  embedSigningWhiteLabel: z.boolean().optional(),
  cfr21: z.boolean().optional(),
  hipaa: z.boolean().optional(),
  authenticationPortal: z.boolean().optional(),
  allowLegacyEnvelopes: z.boolean().optional(),
});

export type TOrganisationFeatureFlags = z.infer<typeof ZOrganisationFeatureFlagsSchema>;
