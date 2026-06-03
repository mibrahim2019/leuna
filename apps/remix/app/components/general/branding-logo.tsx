import { cn } from '@documenso/ui/lib/utils';

import { BrandingLogoIcon } from '~/components/general/branding-logo-icon';

export type BrandingLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export const BrandingLogo = ({ className, iconClassName, textClassName }: BrandingLogoProps) => (
  <span className={cn('inline-flex items-center gap-2', className)}>
    <BrandingLogoIcon className={cn('h-7 w-7 sm:h-8 sm:w-8', iconClassName)} />
    <span
      className={cn(
        'text-lg font-semibold tracking-tight text-foreground sm:text-xl',
        textClassName,
      )}
    >
      Leuna
    </span>
  </span>
);
