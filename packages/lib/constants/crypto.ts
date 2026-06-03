import { env } from '../utils/env';

export const LEUNA_ENCRYPTION_KEY = env('NEXT_PRIVATE_ENCRYPTION_KEY');

export const LEUNA_ENCRYPTION_SECONDARY_KEY = env('NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY');

// if (typeof window === 'undefined') {
//   if (!LEUNA_ENCRYPTION_KEY || !LEUNA_ENCRYPTION_SECONDARY_KEY) {
//     throw new Error('Missing LEUNA_ENCRYPTION_KEY or LEUNA_ENCRYPTION_SECONDARY_KEY keys');
//   }

//   if (LEUNA_ENCRYPTION_KEY === LEUNA_ENCRYPTION_SECONDARY_KEY) {
//     throw new Error(
//       'LEUNA_ENCRYPTION_KEY and LEUNA_ENCRYPTION_SECONDARY_KEY cannot be equal',
//     );
//   }
// }

// if (LEUNA_ENCRYPTION_KEY === 'CAFEBABE') {
//   console.warn('*********************************************************************');
//   console.warn('*');
//   console.warn('*');
//   console.warn('Please change the encryption key from the default value of "CAFEBABE"');
//   console.warn('*');
//   console.warn('*');
//   console.warn('*********************************************************************');
// }
