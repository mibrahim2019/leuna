import { Trans } from '@lingui/react/macro';
import { Outlet } from 'react-router';

import { MarketingHeader } from '~/components/general/marketing-header';

export default function Layout() {
  return (
    <main className="dashboard-area dark-mode-disabled relative min-h-screen overflow-hidden bg-[#f7f7f5]">
      <MarketingHeader ctaLabel={<Trans>Claim Lifetime Access</Trans>} />

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
        <div className="relative flex w-full flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
