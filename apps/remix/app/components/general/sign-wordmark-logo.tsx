import type { HTMLAttributes } from 'react';

import logoIcon from '@documenso/assets/logo.svg';
import { cn } from '@documenso/ui/lib/utils';

export type SignWordmarkLogoProps = HTMLAttributes<HTMLSpanElement> & {
  leunaClassName?: string;
  signClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
};

export const SignWordmarkLogo = ({
  className,
  style,
  leunaClassName,
  signClassName,
  iconWrapperClassName,
  iconClassName,
  ...props
}: SignWordmarkLogoProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-2.5 align-middle font-sans text-7xl font-semibold leading-none tracking-tight text-foreground',
      className,
    )}
    style={{ ...style }}
    {...props}
  >
    <span
      className={cn(
        'flex h-[1.05em] w-[1.05em] flex-shrink-0 items-center justify-center rounded-none border-0 bg-transparent shadow-none',
        iconWrapperClassName,
      )}
    >
      <img
        src={logoIcon}
        alt=""
        aria-hidden="true"
        className={cn('h-[0.78em] w-auto rotate-0', iconClassName)}
      />
    </span>

    <span className="inline-flex items-baseline whitespace-nowrap">
      <span className={cn('font-semibold tracking-[-0.04em] text-current', leunaClassName)}>
        Leun
      </span>
      <span className={cn('font-semibold tracking-[-0.04em] text-[#2563eb]', signClassName)}>
        a
      </span>
    </span>
  </span>
);
