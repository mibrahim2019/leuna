import type { HTMLAttributes } from 'react';

import { Trans } from '@lingui/react/macro';
import {
  BracesIcon,
  Globe2Icon,
  Lock,
  Settings2Icon,
  User,
  Users,
  WebhookIcon,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';

import { useSession } from '@documenso/lib/client-only/providers/session';
import { isPersonalLayout } from '@documenso/lib/utils/organisations';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

export type SettingsDesktopNavProps = HTMLAttributes<HTMLDivElement>;

export const SettingsDesktopNav = ({ className, ...props }: SettingsDesktopNavProps) => {
  const { pathname } = useLocation();

  const { organisations } = useSession();

  const isPersonalLayoutMode = isPersonalLayout(organisations);

  const getNavButtonClassName = (isActive: boolean) =>
    cn(
      'w-full justify-start bg-transparent hover:bg-muted/80',
      isActive && 'bg-muted shadow-sm hover:bg-muted',
    );

  return (
    <div
      className={cn(
        'flex flex-col gap-y-2 rounded-[2rem] border border-border bg-background p-3',
        className,
      )}
      {...props}
    >
      <Link className="w-full" to="/settings/profile">
        <Button
          variant="ghost"
          className={getNavButtonClassName(pathname?.startsWith('/settings/profile') ?? false)}
        >
          <User className="mr-2 h-5 w-5" />
          <Trans>Profile</Trans>
        </Button>
      </Link>

      {isPersonalLayoutMode && (
        <>
          <Link className="w-full" to="/settings/document">
            <Button variant="ghost" className={getNavButtonClassName(false)}>
              <Settings2Icon className="mr-2 h-5 w-5" />
              <Trans>Preferences</Trans>
            </Button>
          </Link>

          <Link className="w-full pl-8" to="/settings/document">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/document') ?? false)}
            >
              <Trans>Document</Trans>
            </Button>
          </Link>

          <Link className="w-full pl-8" to="/settings/branding">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/branding') ?? false)}
            >
              <Trans>Branding</Trans>
            </Button>
          </Link>

          <Link className="w-full pl-8" to="/settings/email">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/email') ?? false)}
            >
              <Trans>Email</Trans>
            </Button>
          </Link>

          <Link className="w-full" to="/settings/public-profile">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/public-profile') ?? false)}
            >
              <Globe2Icon className="mr-2 h-5 w-5" />
              <Trans>Public Profile</Trans>
            </Button>
          </Link>

          <Link className="w-full" to="/settings/tokens">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/tokens') ?? false)}
            >
              <BracesIcon className="mr-2 h-5 w-5" />
              <Trans>API Tokens</Trans>
            </Button>
          </Link>

          <Link className="w-full" to="/settings/webhooks">
            <Button
              variant="ghost"
              className={getNavButtonClassName(pathname?.startsWith('/settings/webhooks') ?? false)}
            >
              <WebhookIcon className="mr-2 h-5 w-5" />
              <Trans>Webhooks</Trans>
            </Button>
          </Link>
        </>
      )}

      <Link className="w-full" to="/settings/organisations">
        <Button
          variant="ghost"
          className={getNavButtonClassName(pathname?.startsWith('/settings/organisations') ?? false)}
        >
          <Users className="mr-2 h-5 w-5" />
          <Trans>Organisations</Trans>
        </Button>
      </Link>

      <Link className="w-full" to="/settings/security">
        <Button
          variant="ghost"
          className={getNavButtonClassName(pathname?.startsWith('/settings/security') ?? false)}
        >
          <Lock className="mr-2 h-5 w-5" />
          <Trans>Security</Trans>
        </Button>
      </Link>
    </div>
  );
};
