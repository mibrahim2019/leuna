import type { ReactNode } from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  loaderData,
  mockNavigate,
  mockRefreshSession,
  mockRevalidate,
  mockUseLoaderData,
  mockUseNavigate,
  mockUseRevalidator,
} = vi.hoisted(() => ({
  loaderData: {
    checkoutId: 'chk_123',
    continuePath: '/teams/alpha/documents',
    hasProductAccess: false,
  },
  mockNavigate: vi.fn(),
  mockRefreshSession: vi.fn(),
  mockRevalidate: vi.fn(),
  mockUseLoaderData: vi.fn(),
  mockUseNavigate: vi.fn(),
  mockUseRevalidator: vi.fn(),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      effect();
    },
    useState: <T,>(initialValue: T | (() => T)) => [
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
      vi.fn(),
    ],
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => ({ children, to }),
    useLoaderData: mockUseLoaderData,
    useNavigate: mockUseNavigate,
    useRevalidator: mockUseRevalidator,
  };
});

vi.mock('@documenso/lib/client-only/providers/session', () => ({
  useSession: () => ({
    refreshSession: mockRefreshSession,
  }),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@documenso/auth/server/lib/utils/cookies', () => ({
  extractCookieFromHeaders: vi.fn(),
}));

vi.mock('@documenso/auth/server/lib/utils/get-session', () => ({
  getOptionalSession: vi.fn(),
}));

vi.mock('@documenso/lib/server-only/polar/customer', () => ({
  getPolarCustomerAccessState: vi.fn(),
}));

vi.mock('@documenso/lib/server-only/polar/client', () => ({
  polarClient: {
    checkouts: {
      get: vi.fn(),
    },
  },
}));

vi.mock('@documenso/lib/server-only/team/get-teams', () => ({
  getTeams: vi.fn(),
}));

vi.mock('@documenso/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@documenso/lib/utils/teams', () => ({
  formatDocumentsPath: vi.fn(),
}));

vi.mock('@documenso/ui/primitives/button', () => ({
  Button: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@lingui/react/macro', () => ({
  Trans: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('~/utils/meta', () => ({
  appMetaTags: vi.fn(),
}));

import PurchaseLifetimeSuccessRoute, { AUTO_CONTINUE_DELAY_MS } from './lifetime.success';

const collectText = (node: unknown): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (!node || typeof node !== 'object') {
    return '';
  }

  if ('props' in node) {
    return collectText((node as { props?: { children?: unknown } }).props?.children);
  }

  if (Array.isArray(node)) {
    return node.map((item) => collectText(item)).join(' ');
  }

  return '';
};

describe('purchase lifetime success route component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    loaderData.checkoutId = 'chk_123';
    loaderData.continuePath = '/teams/alpha/documents';
    loaderData.hasProductAccess = false;

    mockUseLoaderData.mockImplementation(() => loaderData);
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseRevalidator.mockReturnValue({
      state: 'idle',
      revalidate: mockRevalidate,
    });
    mockRefreshSession.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows the pending state and retries access verification', () => {
    const element = PurchaseLifetimeSuccessRoute();

    expect(collectText(element)).toContain('We are still verifying your purchase.');
    expect(collectText(element)).toContain('Refresh Access');

    vi.advanceTimersByTime(2000);

    expect(mockRevalidate).toHaveBeenCalledTimes(1);
    expect(mockRefreshSession).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('refreshes the session and auto-continues when access is active', async () => {
    loaderData.hasProductAccess = true;

    const element = PurchaseLifetimeSuccessRoute();

    expect(collectText(element)).toContain('Your access is active.');
    expect(collectText(element)).toContain('taking you to your workspace now');

    await Promise.resolve();
    await Promise.resolve();

    expect(mockRefreshSession).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(AUTO_CONTINUE_DELAY_MS);

    expect(mockNavigate).toHaveBeenCalledWith('/teams/alpha/documents', { replace: true });
  });

  it('still auto-continues when refreshing the session fails', async () => {
    loaderData.hasProductAccess = true;
    mockRefreshSession.mockRejectedValue(new Error('network'));

    PurchaseLifetimeSuccessRoute();

    await Promise.resolve();
    await Promise.resolve();

    await vi.advanceTimersByTimeAsync(AUTO_CONTINUE_DELAY_MS);

    expect(mockRefreshSession).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/teams/alpha/documents', { replace: true });
  });
});
