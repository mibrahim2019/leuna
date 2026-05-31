import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

import { cn } from '@documenso/ui/lib/utils';

export type OpenSourceNoticeProps = {
  className?: string;
};

export const OpenSourceNotice = ({ className }: OpenSourceNoticeProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center border-t border-border/40 px-4 py-2',
        className,
      )}
    >
      <Link
        to="/open-source"
        className="text-[10px] leading-none text-muted-foreground transition-colors hover:text-foreground hover:underline"
      >
        <Trans>Source Code</Trans>
      </Link>
    </div>
  );
};
