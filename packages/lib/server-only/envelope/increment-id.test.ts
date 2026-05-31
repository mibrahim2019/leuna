import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockQueryRaw, mockUpsert } = vi.hoisted(() => ({
  mockQueryRaw: vi.fn(),
  mockUpsert: vi.fn(),
}));

vi.mock('@documenso/prisma', () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
    counter: {
      upsert: mockUpsert,
    },
  },
}));

import { incrementDocumentId, incrementTemplateId } from './increment-id';

describe('incrementDocumentId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('increments the document counter from the current counter value', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ value: 41 }]);
    mockUpsert.mockResolvedValueOnce({ id: 'document', value: 42 });

    await expect(incrementDocumentId()).resolves.toEqual({
      documentId: 42,
      formattedDocumentId: 'document_42',
    });

    expect(mockUpsert).toHaveBeenCalledWith({
      where: {
        id: 'document',
      },
      update: {
        value: {
          increment: 1,
        },
      },
      create: {
        id: 'document',
        value: 42,
      },
    });
  });

  it('initializes a missing document counter from zero when no envelopes exist', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ value: null }]);
    mockUpsert.mockResolvedValueOnce({ id: 'document', value: 1 });

    await expect(incrementDocumentId()).resolves.toEqual({
      documentId: 1,
      formattedDocumentId: 'document_1',
    });
  });
});

describe('incrementTemplateId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries template envelopes before upserting the template counter', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ value: 7 }]);
    mockUpsert.mockResolvedValueOnce({ id: 'template', value: 8 });

    await expect(incrementTemplateId()).resolves.toEqual({
      templateId: 8,
      formattedTemplateId: 'template_8',
    });

    expect(mockUpsert).toHaveBeenCalledWith({
      where: {
        id: 'template',
      },
      update: {
        value: {
          increment: 1,
        },
      },
      create: {
        id: 'template',
        value: 8,
      },
    });
  });
});
