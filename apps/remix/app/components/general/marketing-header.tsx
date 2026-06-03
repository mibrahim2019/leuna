import type { ReactNode } from 'react';

import { Trans } from '@lingui/react/macro';
import { MenuIcon } from 'lucide-react';
import { Link } from 'react-router';

import { POLAR_LIFETIME_SIGNUP_PATH } from '@documenso/lib/constants/polar';
import { Button } from '@documenso/ui/primitives/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@documenso/ui/primitives/sheet';

import { BrandingLogoIcon } from '~/components/general/branding-logo-icon';

const MARKETING_NAV_ITEMS = [
  { href: '/#use-cases', label: <Trans>Use Cases</Trans> },
  { href: '/#integrations', label: <Trans>Integrations</Trans> },
  { href: '/#security', label: <Trans>Security</Trans> },
  { href: '/#pricing', label: <Trans>Pricing</Trans> },
] as const;

export type MarketingHeaderProps = {
  ctaLabel: ReactNode;
};

export const MarketingHeader = ({ ctaLabel }: MarketingHeaderProps) => (
  <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white">
    <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8">
      <Link to="/" className="shrink-0" aria-label="Leuna home">
        <BrandingLogoIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      </Link>

      <nav
        aria-label="Main"
        className="hidden items-center gap-6 text-sm font-medium text-black lg:flex"
      >
        {MARKETING_NAV_ITEMS.map(({ href, label }) => (
          <Link key={href} to={href} className="transition-colors hover:text-foreground">
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 text-sm font-medium text-black lg:flex">
        <Button
          asChild
          variant="outline"
          className="h-9 border-black bg-white px-4 text-sm text-black hover:bg-muted"
        >
          <Link to="/signin">
            <Trans>Login</Trans>
          </Link>
        </Button>
        <Button asChild className="h-9 px-4 text-sm">
          <Link to={POLAR_LIFETIME_SIGNUP_PATH}>{ctaLabel}</Link>
        </Button>
      </div>

      <div className="flex lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-12 shrink-0 border-border/50 bg-background p-0 text-foreground hover:bg-muted"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-5 w-5 text-foreground" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent
            position="right"
            className="flex w-full !max-w-sm flex-col gap-6 border-l border-border/50"
          >
            <SheetTitle className="sr-only">
              <Trans>Navigation menu</Trans>
            </SheetTitle>
            <nav aria-label="Main" className="flex flex-col gap-1 border-b border-border/50 pb-6">
              {MARKETING_NAV_ITEMS.map(({ href, label }) => (
                <SheetClose key={href} asChild>
                  <Link
                    to={href}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-black bg-white text-black hover:bg-muted"
                >
                  <Link to="/signin">
                    <Trans>Login</Trans>
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link to={POLAR_LIFETIME_SIGNUP_PATH}>{ctaLabel}</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
);
