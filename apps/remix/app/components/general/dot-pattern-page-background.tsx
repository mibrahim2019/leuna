import type { ReactNode } from 'react';

import { cn } from '@documenso/ui/lib/utils';

type DotPatternPageBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export const DotPatternPageBackground = ({
  children,
  className,
}: DotPatternPageBackgroundProps) => {
  return (
    <div className={cn('relative min-h-screen overflow-hidden bg-[#fff]', className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#e8e8e8 1px, #FFFFFF 1px)',
          backgroundSize: '10px 10px',
        }}
        aria-hidden
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
