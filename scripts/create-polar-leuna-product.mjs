import { Polar } from '@polar-sh/sdk';

const POLAR_ACCESS_TOKEN = 'polar_oat_lvysqay98njH1UmCasyszFoeDtMGmmrjAFCKz3Yubst';
const POLAR_SERVER = 'production';
const ORGANIZATION_ID = '326d3754-6e52-4479-9454-b40454488a19';
const ORGANIZATION_SLUG = 'leuna-sign';

const PRODUCT_NAME = 'E-signature Leuna';
const BENEFIT_DESCRIPTION = 'Lifetime E-signature Access';

const client = new Polar({
  accessToken: POLAR_ACCESS_TOKEN,
  server: POLAR_SERVER,
});

const createBenefit = async () => {
  return client.benefits.create({
    type: 'feature_flag',
    description: BENEFIT_DESCRIPTION,
    properties: {},
  });
};

const createProduct = async () => {
  return client.products.create({
    name: PRODUCT_NAME,
    description: null,
    visibility: 'public',
    prices: [
      {
        amountType: 'free',
        priceCurrency: 'usd',
      },
    ],
  });
};

const attachBenefitToProduct = async ({
  benefitId,
  productId,
}) => {
  return client.products.updateBenefits({
    id: productId,
    productBenefitsUpdate: {
      benefits: [benefitId],
    },
  });
};

const main = async () => {
  console.log(`Creating Polar resources in org ${ORGANIZATION_SLUG} (${ORGANIZATION_ID})`);

  const benefit = await createBenefit();
  console.log(`Created benefit: ${benefit.id}`);

  const product = await createProduct();
  console.log(`Created product: ${product.id}`);

  const updatedProduct = await attachBenefitToProduct({
    benefitId: benefit.id,
    productId: product.id,
  });

  console.log('Attached benefit to product.');
  console.log('');
  console.log('Copy these values into your app env:');
  console.log(`POLAR_SERVER="${POLAR_SERVER}"`);
  console.log(`POLAR_LIFETIME_PRODUCT_ID="${updatedProduct.id}"`);
  console.log(`POLAR_ACCESS_BENEFIT_ID="${benefit.id}"`);
  console.log('');
  console.log('Created resources:');
  console.log(
    JSON.stringify(
      {
        organizationId: ORGANIZATION_ID,
        organizationSlug: ORGANIZATION_SLUG,
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          visibility: updatedProduct.visibility,
          isRecurring: updatedProduct.isRecurring,
          prices: updatedProduct.prices,
          benefits: updatedProduct.benefits,
        },
        benefit: {
          id: benefit.id,
          type: benefit.type,
          description: benefit.description,
          properties: benefit.properties,
        },
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error('Polar product creation failed.');
  console.error(error);
  process.exit(1);
});
