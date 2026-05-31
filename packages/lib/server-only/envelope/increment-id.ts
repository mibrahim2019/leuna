import { EnvelopeType } from '@prisma/client';

import { prisma } from '@documenso/prisma';

import { mapDocumentIdToSecondaryId, mapTemplateIdToSecondaryId } from '../../utils/envelope';

type CounterId = 'document' | 'template';

const getCounterSeedValue = async (counterId: CounterId) => {
  const envelopeType =
    counterId === 'document' ? EnvelopeType.DOCUMENT : EnvelopeType.TEMPLATE;
  const secondaryIdPattern = `^${counterId}_[0-9]+$`;

  const rows = await prisma.$queryRaw<Array<{ value: number | bigint | null }>>`
    SELECT MAX(CAST(substring("secondaryId" FROM '([0-9]+)$') AS INTEGER)) AS value
    FROM "Envelope"
    WHERE "type" = CAST(${envelopeType} AS "EnvelopeType")
      AND "secondaryId" ~ ${secondaryIdPattern}
  `;

  return Number(rows[0]?.value ?? 0);
};

const incrementCounter = async (counterId: CounterId) => {
  const seedValue = await getCounterSeedValue(counterId);

  return await prisma.counter.upsert({
    where: {
      id: counterId,
    },
    update: {
      value: {
        increment: 1,
      },
    },
    create: {
      id: counterId,
      value: seedValue + 1,
    },
  });
};

export const incrementDocumentId = async () => {
  const documentIdCounter = await incrementCounter('document');

  return {
    documentId: documentIdCounter.value,
    formattedDocumentId: mapDocumentIdToSecondaryId(documentIdCounter.value),
  };
};

export const incrementTemplateId = async () => {
  const templateIdCounter = await incrementCounter('template');

  return {
    templateId: templateIdCounter.value,
    formattedTemplateId: mapTemplateIdToSecondaryId(templateIdCounter.value),
  };
};
