import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

import {
  NEXT_PUBLIC_SOURCE_CODE_REVISION,
  NEXT_PUBLIC_SOURCE_CODE_REVISION_URL,
  NEXT_PUBLIC_SOURCE_CODE_URL,
} from '@documenso/lib/constants/app';

import { appMetaTags } from '~/utils/meta';

export function meta() {
  return appMetaTags(msg`Open Source`);
}

export default function OpenSourcePage() {
  const sourceCodeUrl = NEXT_PUBLIC_SOURCE_CODE_URL();
  const revision = NEXT_PUBLIC_SOURCE_CODE_REVISION();
  const revisionUrl = NEXT_PUBLIC_SOURCE_CODE_REVISION_URL();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8">
      <div className="rounded-xl border bg-background p-6 md:p-8">
        <h1 className="text-3xl font-semibold">
          <Trans>Open Source</Trans>
        </h1>

        <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            <Trans>
              This deployment is provided as a modified fork of an AGPL-3.0 licensed project.
            </Trans>
          </p>

          <p>
            <Trans>
              The software is provided without warranty. See the GNU Affero General Public License
              for details.
            </Trans>
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-lg border bg-muted/40 p-4 text-sm">
          <div>
            <p className="font-medium text-foreground">
              <Trans>Source repository</Trans>
            </p>
            <a
              href={sourceCodeUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-primary underline-offset-2 hover:underline"
            >
              {sourceCodeUrl}
            </a>
          </div>

          <div>
            <p className="font-medium text-foreground">
              <Trans>Deployed revision</Trans>
            </p>

            {revisionUrl ? (
              <a
                href={revisionUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-primary underline-offset-2 hover:underline"
              >
                {revision}
              </a>
            ) : (
              <p className="break-all text-muted-foreground">{revision}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-foreground">
              <Trans>License</Trans>
            </p>
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              <Trans>GNU Affero General Public License v3.0</Trans>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
