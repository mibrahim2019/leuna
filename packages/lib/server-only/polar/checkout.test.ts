import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockGetPolarExternalCustomerId,
  mockGetPolarLifetimeProductId,
  mockCreate,
  mockWebappUrl,
} = vi.hoisted(() => ({
  mockGetPolarExternalCustomerId: vi.fn((userId: number) => String(userId)),
  mockGetPolarLifetimeProductId: vi.fn(() => 'product_123'),
  mockCreate: vi.fn(),
  mockWebappUrl: vi.fn(() => 'https://sign.leuna.local'),
}));

vi.mock('../../constants/app', () => ({
  NEXT_PUBLIC_WEBAPP_URL: mockWebappUrl,
}));

vi.mock('./client', () => ({
  polarClient: {
    checkouts: {
      create: mockCreate,
    },
  },
}));

vi.mock('./constants', () => ({
  getPolarExternalCustomerId: mockGetPolarExternalCustomerId,
  getPolarLifetimeProductId: mockGetPolarLifetimeProductId,
}));

import { createLifetimeCheckout } from './checkout';

describe('createLifetimeCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({
      id: 'chk_123',
      url: 'https://sandbox.polar.sh/checkout/chk_123',
    });
  });

  it('uses customerId when a Polar customer UUID is already known', async () => {
    await createLifetimeCheckout({
      customerEmail: 'hello@example.com',
      customerIpAddress: '127.0.0.1',
      customerName: 'Hello',
      polarCustomerId: 'polar-customer-123',
      userId: 1,
    });

    expect(mockCreate).toHaveBeenCalledWith({
      allowDiscountCodes: true,
      customerEmail: 'hello@example.com',
      customerId: 'polar-customer-123',
      customerIpAddress: '127.0.0.1',
      customerMetadata: {
        app: 'sign',
        documensoUserId: 1,
        productScope: 'sign.leuna.io',
      },
      customerName: 'Hello',
      externalCustomerId: null,
      metadata: {
        app: 'sign',
        productScope: 'sign.leuna.io',
        source: 'documenso_lifetime_checkout',
        userId: 1,
      },
      products: ['product_123'],
      returnUrl: 'https://sign.leuna.local/offer',
      successUrl: 'https://sign.leuna.local/purchase/lifetime/success?checkout_id={CHECKOUT_ID}',
    });
  });

  it('uses the canonical externalCustomerId when no Polar customer UUID is stored', async () => {
    await createLifetimeCheckout({
      customerEmail: 'hello@example.com',
      customerName: 'Hello',
      userId: 1,
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: null,
        externalCustomerId: '1',
        customerMetadata: {
          app: 'sign',
          documensoUserId: 1,
          productScope: 'sign.leuna.io',
        },
        metadata: {
          app: 'sign',
          productScope: 'sign.leuna.io',
          source: 'documenso_lifetime_checkout',
          userId: 1,
        },
      }),
    );
  });
});
