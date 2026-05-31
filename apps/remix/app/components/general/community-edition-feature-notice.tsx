import type { ReactNode } from 'react';

import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

import { Alert, AlertDescription, AlertTitle } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';

type CommunityEditionFeatureNoticeProps = {
  title: ReactNode;
  description: ReactNode;
  backHref?: string;
};

export const CommunityEditionFeatureNotice = ({
  title,
  description,
  backHref,
}: CommunityEditionFeatureNoticeProps) => {
  return (
    <Alert className="mt-8 max-w-2xl" variant="neutral">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">{description}</AlertDescription>

      {backHref ? (
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to={backHref}>
              <Trans>Go Back</Trans>
            </Link>
          </Button>
        </div>
      ) : null}
    </Alert>
  );
};
