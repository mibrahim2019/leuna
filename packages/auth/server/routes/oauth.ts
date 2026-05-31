import { sValidator } from '@hono/standard-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { getCommunityEditionUnavailableMessage } from '@documenso/lib/server-only/community-edition';

import { GoogleAuthOptions, MicrosoftAuthOptions, OidcAuthOptions } from '../config';
import { handleOAuthAuthorizeUrl } from '../lib/utils/handle-oauth-authorize-url';
import type { HonoAuthContext } from '../types/context';

const ZOAuthAuthorizeSchema = z.object({
  redirectPath: z.string().optional(),
});

export const oauthRoute = new Hono<HonoAuthContext>()
  /**
   * Google authorize endpoint.
   */
  .post('/authorize/google', sValidator('json', ZOAuthAuthorizeSchema), async (c) => {
    const { redirectPath } = c.req.valid('json');

    return handleOAuthAuthorizeUrl({
      c,
      clientOptions: GoogleAuthOptions,
      redirectPath,
    });
  })

  /**
   * Microsoft authorize endpoint.
   */
  .post('/authorize/microsoft', sValidator('json', ZOAuthAuthorizeSchema), async (c) => {
    const { redirectPath } = c.req.valid('json');

    return handleOAuthAuthorizeUrl({
      c,
      clientOptions: MicrosoftAuthOptions,
      redirectPath,
    });
  })

  /**
   * OIDC authorize endpoint.
   */
  .post('/authorize/oidc', sValidator('json', ZOAuthAuthorizeSchema), async (c) => {
    const { redirectPath } = c.req.valid('json');

    return handleOAuthAuthorizeUrl({
      c,
      clientOptions: OidcAuthOptions,
      redirectPath,
    });
  })
  /**
   * Organisation OIDC authorize endpoint.
   */
  .post('/authorize/oidc/org/:orgUrl', (c) => {
    const error = new AppError(AppErrorCode.NOT_SETUP, {
      message: getCommunityEditionUnavailableMessage('Organisation SSO'),
    });

    return c.json(AppError.toJSON(error), 400);
  });
