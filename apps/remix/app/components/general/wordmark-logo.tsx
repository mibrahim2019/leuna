import type { ImgHTMLAttributes } from 'react';

import wordmarkDark from '@documenso/assets/wordmark-dark.png';
import wordmarkLight from '@documenso/assets/wordmark.png';
import { cn } from '@documenso/ui/lib/utils';

export type WordmarkLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  /**
   * Which lockup to render:
   * - `auto` (default): black "leuna" on light surfaces, swapping to the white
   *   variant in dark mode. Use on theme-aware surfaces (`bg-background` etc).
   * - `light`: always the black-text lockup. Use on surfaces that stay white in
   *   every theme (app + marketing headers, PDF certificate/audit-log).
   * - `dark`: always the white-text lockup. Use on dark surfaces regardless of
   *   theme (e.g. the near-black "Powered by" badge).
   */
  variant?: 'auto' | 'light' | 'dark';
};

/**
 * The Leuna brand lockup (mark + wordmark) rendered from the brand asset rather
 * than live text.
 */
export const WordmarkLogo = ({ className, variant = 'auto', ...props }: WordmarkLogoProps) => {
  if (variant === 'light') {
    return (
      <img src={wordmarkLight} alt="Leuna" className={cn('h-7 w-auto', className)} {...props} />
    );
  }

  if (variant === 'dark') {
    return (
      <img src={wordmarkDark} alt="Leuna" className={cn('h-7 w-auto', className)} {...props} />
    );
  }

  return (
    <>
      <img
        src={wordmarkLight}
        alt="Leuna"
        className={cn('h-7 w-auto dark:hidden', className)}
        {...props}
      />
      <img
        src={wordmarkDark}
        alt=""
        aria-hidden="true"
        className={cn('hidden h-7 w-auto dark:block', className)}
        {...props}
      />
    </>
  );
};
