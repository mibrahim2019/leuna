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
      'overflow-hidden rounded-md border border-border/40 bg-white shadow-sm shadow-black/5',
      className,
    )}
  >
    <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-2.5 py-1.5 sm:px-3">
      <div className="flex shrink-0 gap-1" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
      </div>
      <div className="mx-auto flex w-full max-w-xs items-center justify-center rounded border border-border/40 bg-white px-2 py-0.5 sm:max-w-sm">
        <span className="truncate text-[10px] leading-none text-muted-foreground sm:text-[11px]">
          {url}
        </span>
      </div>
    </div>
    <div className="overflow-hidden">{children}</div>
  </div>
);
