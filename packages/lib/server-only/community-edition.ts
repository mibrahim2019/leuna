import { AppError, AppErrorCode } from '../errors/app-error';

export const getCommunityEditionUnavailableMessage = (feature: string) =>
  `${feature} is not available in the community edition.`;

export const throwCommunityEditionUnavailable = (feature: string): never => {
  const message = getCommunityEditionUnavailableMessage(feature);

  throw new AppError(AppErrorCode.NOT_SETUP, {
    message,
    userMessage: message,
  });
};
