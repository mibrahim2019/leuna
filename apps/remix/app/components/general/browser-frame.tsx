import type { ReactNode } from 'react';

import { cn } from '@documenso/ui/lib/utils';

export type BrowserFrameProps = {
  children: ReactNode;
  className?: string;
  url?: string;
};

export const BrowserFrame = ({ children, className, url = 'leuna.app' }: BrowserFrameProps) => (
  <div
    className={cn(
      'overflow-hidden rounded-lg border border-border/50 bg-white shadow-md shadow-black/5',
      className,
    )}
  >
    <div className="flex items-center gap-2.5 border-b border-border/50 bg-muted/35 px-3 py-2 sm:px-4">
      <div className="flex shrink-0 gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
      </div>
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-md border border-border/50 bg-white px-2.5 py-1">
        <span className="truncate text-[11px] text-muted-foreground sm:text-xs">{url}</span>
      </div>
    </div>
    <div className="overflow-hidden">{children}</div>
  </div>
);
