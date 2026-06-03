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
      'overflow-hidden rounded-lg border border-border/50 bg-white shadow-lg shadow-black/5',
      className,
    )}
  >
    <div className="flex items-center gap-3 border-b border-border/50 bg-muted/40 px-4 py-3">
      <div className="flex shrink-0 gap-1.5" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-md border border-border/50 bg-white px-3 py-1.5">
        <span className="truncate text-xs text-muted-foreground">{url}</span>
      </div>
    </div>
    <div className="overflow-hidden">{children}</div>
  </div>
);
