ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_organisationClaimId_fkey";
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organisationId_fkey";

DROP INDEX IF EXISTS "Organisation_customerId_key";
DROP INDEX IF EXISTS "Organisation_organisationClaimId_key";
DROP INDEX IF EXISTS "Subscription_organisationId_idx";
DROP INDEX IF EXISTS "Subscription_organisationId_key";

DROP TABLE "Subscription";
DROP TABLE "SubscriptionClaim";

ALTER TABLE "Organisation"
  DROP COLUMN "customerId",
  DROP COLUMN "organisationClaimId";

DROP TABLE "OrganisationClaim";
DROP TYPE "SubscriptionStatus";
