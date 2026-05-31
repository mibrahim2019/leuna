import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

import { Button } from '@documenso/ui/primitives/button';

export type CommunityEditionUnavailableProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  backHref?: string;
  backLabel?: React.ReactNode;
};

export const CommunityEditionUnavailable = ({
  title,
  description,
  backHref,
  backLabel,
}: CommunityEditionUnavailableProps) => {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-background p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {backHref ? (
        <div className="mt-6">
          <Button asChild>
            <Link to={backHref}>{backLabel ?? <Trans>Go Back</Trans>}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
