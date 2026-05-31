import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link, redirect } from 'react-router';

import adobeSignLogo from '@documenso/assets/adobe-sign.png';
import docusignLogo from '@documenso/assets/docusign.png';
import dropboxSignLogo from '@documenso/assets/dropbox-sign.webp';
import { extractCookieFromHeaders } from '@documenso/auth/server/lib/utils/cookies';
import { getOptionalSession } from '@documenso/auth/server/lib/utils/get-session';
import { POLAR_LIFETIME_PURCHASE_PATH } from '@documenso/lib/constants/polar';
import { getTeams } from '@documenso/lib/server-only/team/get-teams';
import { formatDocumentsPath } from '@documenso/lib/utils/teams';
import { ZTeamUrlSchema } from '@documenso/trpc/server/team-router/schema';
import { cn } from '@documenso/ui/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@documenso/ui/primitives/accordion';
import { Button } from '@documenso/ui/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@documenso/ui/primitives/card';

import { MarketingHeader } from '~/components/general/marketing-header';
import { SignWordmarkLogo } from '~/components/general/sign-wordmark-logo';
import { appMetaTags } from '~/utils/meta';

import { requirePolarAccessForRoute } from '../utils/polar-auth-gate.server';
import type { Route } from './+types/_index';

const BUILT_FOR_AUDIENCES = [
  { id: 'agencies', label: <Trans>Agencies</Trans> },
  { id: 'small-businesses', label: <Trans>Small businesses</Trans> },
  { id: 'freelancers', label: <Trans>Freelancers</Trans> },
  { id: 'founders', label: <Trans>Founders</Trans> },
  { id: 'consultants', label: <Trans>Consultants</Trans> },
] as const;

const FEATURED_ON_LOGOS = [
  { src: '/static/featured/capterra-dark.svg', alt: 'Capterra' },
  { src: '/static/featured/g2.svg', alt: 'G2' },
  { src: '/static/featured/producthunt.svg', alt: 'Product Hunt' },
  { src: '/static/featured/Trustpilot-light.svg', alt: 'Trustpilot' },
] as const;

const LIFETIME_DEAL_PRICE = '$99';

const COMPETITOR_PRICING = [
  {
    id: 'adobe-sign',
    logo: adobeSignLogo,
    name: <Trans>Adobe Sign</Trans>,
    monthsToReachLifetimeDeal: <Trans>4 Months of Adobe Sign = Our Lifetime Price</Trans>,
  },
  {
    id: 'dropbox-sign',
    logo: dropboxSignLogo,
    name: <Trans>Dropbox Sign</Trans>,
    monthsToReachLifetimeDeal: <Trans>4 Months of Dropbox Sign = Our Lifetime Price</Trans>,
  },
  {
    id: 'docusign',
    logo: docusignLogo,
    name: <Trans>DocuSign</Trans>,
    monthsToReachLifetimeDeal: <Trans>3 Months of DocuSign = Our Lifetime Price</Trans>,
  },
] as const;

const TESTIMONIALS = [
  {
    id: 'northstar-labs',
    quoteHighlightClass: 'bg-[#EEC643]/45',
    quote: <Trans>"We cut our contract turnaround from days to minutes"</Trans>,
    person: <Trans>Omar</Trans>,
    company: <Trans>Blitz Creed</Trans>,
  },
] as const;
const FAQ_ITEMS = [
  {
    id: 'what-is-included',
    question: <Trans>What is included in the lifetime deal?</Trans>,
    answer: (
      <Trans>
        The lifetime deal includes access to the core Leuna signing workflows, reusable
        templates, team collaboration features, custom branding controls.
      </Trans>
    ),
  },
  {
    id: 'how-fast-can-we-start',
    question: <Trans>How quickly can our team get started?</Trans>,
    answer: (
      <Trans>
        Most teams can start sending documents the same day by setting up their workspace, uploading
        a document, and creating their first signing flow in just a few minutes.
      </Trans>
    ),
  },
  {
    id: 'does-it-work-for-teams',
    question: <Trans>Is Leuna built for individual users or teams?</Trans>,
    answer: (
      <Trans>
        It supports both, but the workflows on this page are designed for teams that need shared
        visibility, reusable processes, and a faster path from draft to signature.
      </Trans>
    ),
  },
  {
    id: 'can-we-scale-later',
    question: <Trans>Can we scale our workflows as we grow?</Trans>,
    answer: (
      <Trans>
        Yes. You can start with simple signing flows and expand into more repeatable templates,
        approvals, and collaboration as your volume and process maturity increase.
      </Trans>
    ),
  },
] as const;
const SECURITY_ITEMS = [
  {
    id: 'audit-trail',
    title: <Trans>Complete audit trail</Trans>,
    description: <Trans>Time-stamped logs for a secure, end-to-end chain of evidence.</Trans>,
  },
  {
    id: 'signer-authentication',
    title: <Trans>Multi-layer signer authentication</Trans>,
    description: (
      <Trans>Verify identities instantly with 2FA, OTPs, and custom access controls.</Trans>
    ),
  },
  {
    id: 'legal-compliance',
    title: <Trans>Legally binding (US &amp; EU)</Trans>,
    description: <Trans>100% compliant with eSIGN, UETA, and eIDAS regulations.</Trans>,
  },
] as const;

const INTEGRATIONS = [
  {
    id: 'zapier',
    name: <Trans>Zapier</Trans>,
    description: <Trans>Automate signing across 6,000+ apps with zero code.</Trans>,
  },
  {
    id: 'api-access',
    name: <Trans>API access</Trans>,
    description: <Trans>Embed seamless signing directly into your product.</Trans>,
  },
  {
    id: 'webhooks',
    name: <Trans>Webhooks</Trans>,
    description: <Trans>Trigger instant workflows with real-time document alerts.</Trans>,
  },
  {
    id: 'email',
    name: <Trans>Email notifications</Trans>,
    description: <Trans>Automate reliable updates from send to sign.</Trans>,
  },
] as const;

export function meta() {
  return appMetaTags(msg`Home`);
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getOptionalSession(request);

  if (session.isAuthenticated) {
    await requirePolarAccessForRoute({
      request,
      userId: session.user.id,
    });

    const teamUrlCookie = extractCookieFromHeaders('preferred-team-url', request.headers);

    // const referrer = request.headers.get('referer');
    // let isReferrerFromTeamUrl = false;

    // if (referrer) {
    //   const referrerUrl = new URL(referrer);

    //   if (referrerUrl.pathname.startsWith('/t/')) {
    //     isReferrerFromTeamUrl = true;
    //   }
    // }

    const preferredTeamUrl =
      teamUrlCookie && ZTeamUrlSchema.safeParse(teamUrlCookie).success ? teamUrlCookie : undefined;

    // // Early return for no preferred team.
    // if (!preferredTeamUrl || isReferrerFromTeamUrl) {
    //   throw redirect('/inbox');
    // }

    const teams = await getTeams({ userId: session.user.id });

    let currentTeam = teams.find((team) => team.url === preferredTeamUrl);

    if (!currentTeam && teams.length === 1) {
      currentTeam = teams[0];
    }

    if (!currentTeam) {
      throw redirect('/inbox');
    }

    throw redirect(formatDocumentsPath(currentTeam.url));
  }

  return {};
}

export default function Home() {
  return (
    <main className="home-page dark-mode-disabled relative min-h-screen overflow-x-hidden bg-[#f7f7f5]">
      <MarketingHeader ctaLabel={<Trans>Get Lifetime Access</Trans>} />

      <div className="mx-auto w-full max-w-screen-xl px-4 pb-4 pt-1 md:px-8 md:pb-6 md:pt-2 lg:px-12 lg:pb-8 lg:pt-2">
        <div className="relative flex flex-col">
          <div className="mt-2 bg-[#f7f7f5] px-4 py-3 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
              {FEATURED_ON_LOGOS.map(({ src, alt }) => (
                <img
                  key={src}
                  src={src}
                  alt={alt}
                  className="h-7 w-auto max-w-[7.5rem] object-contain object-center md:h-8 md:max-w-[9rem]"
                />
              ))}
            </div>
          </div>

          <div className="w-full py-2 md:py-4 lg:py-5">
            <div className="w-full">
              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-8">
                <div className="w-full min-w-0">
                  <p className="text-sm font-medium text-black">
                    <Trans>Pay once only.</Trans>
                  </p>

                  <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                    <Trans>You only need signatures, not another subscription.</Trans>
                  </h1>

                  <p className="mt-3 text-base text-black md:text-lg">
                    <Trans>
                      Pay once for Leuna and keep sending contracts without another
                      monthly bill
                    </Trans>
                  </p>

                  <div className="mt-6">
                    <Button asChild size="lg">
                      <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                        <Trans>Get Lifetime Access - $99</Trans>
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                      <Trans>Built for</Trans>
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {BUILT_FOR_AUDIENCES.map((audience) => (
                        <div
                          key={audience.id}
                          className="whitespace-nowrap rounded-md border border-border/50 bg-white px-2.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-foreground md:px-3"
                        >
                          {audience.label}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 md:pt-4">
                      {TESTIMONIALS.map((testimonial) => (
                        <div key={testimonial.id} className="w-full">
                          <blockquote className="text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                            <span>
                              <span
                                className={cn(
                                  'rounded-sm px-1.5 py-0.5 [box-decoration-break:clone]',
                                  testimonial.quoteHighlightClass,
                                )}
                              >
                                {testimonial.quote}
                              </span>
                            </span>

                            <span className="ml-3 inline text-base font-medium tracking-normal text-muted-foreground md:text-lg">
                              {testimonial.person} @{testimonial.company}
                            </span>
                          </blockquote>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Card className="w-full rounded-md border border-border/50 bg-white shadow-none lg:ml-auto lg:max-w-xl">
                  <CardContent className="flex h-full flex-col p-5 md:p-7">
                    <div className="mx-auto w-fit rounded-full border border-border/50 bg-muted px-4 py-1 text-sm font-medium text-black">
                      <Trans>Lifetime Deal</Trans>
                    </div>

                    <CardTitle className="mt-4 text-center text-2xl md:text-3xl">
                      <Trans>Pay once and use Forever</Trans>
                    </CardTitle>

                    <div className="mt-4 text-center text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                      <Trans>{LIFETIME_DEAL_PRICE}</Trans>{' '}
                    </div>

                    <div className="mt-5 text-left text-black">
                      <ul className="divide-y text-sm">
                        <li className="py-2.5">
                          <Trans>Unlimited Contracts</Trans>
                        </li>
                        <li className="py-2.5">
                          <Trans>Reusable Templates</Trans>
                        </li>
                        <li className="py-2.5">
                          <Trans>Team Collaboration</Trans>
                        </li>
                        <li className="py-2.5">
                          <Trans>Custom Branding Controls</Trans>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-5 flex justify-center">
                      <Button asChild size="lg">
                        <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                          <Trans>Claim Your Lifetime Deal</Trans>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="w-full border-b border-border/50" aria-hidden />

          <section id="cost-comparison" className="border-border">
            <div className="m-8 grid grid-cols-1 gap-10 py-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
              <div className="lg:pr-6">
                <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  <Trans>Subscriptions add up faster than you know.</Trans>
                </h2>
              </div>

              <div className="space-y-4 lg:pl-6">
                {COMPETITOR_PRICING.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex items-center gap-4 border-b border-black/10 pb-4 last:border-b-0"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-black/10 p-2.5">
                      <img
                        src={competitor.logo}
                        alt=""
                        className="h-full w-full object-contain"
                        aria-hidden
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-black/70">
                        {competitor.name}
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-7 text-foreground md:text-xl">
                        {competitor.monthsToReachLifetimeDeal}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                      <Trans>Get Lifetime Access - $99</Trans>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section id="integrations" className="border-border py-6 md:py-8">
            <div className="w-full">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                <Trans>Integrations</Trans>
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                <Trans>Connect to the tools you already use.</Trans>
              </h2>
            </div>

            <div className="mt-3 w-full border-b border-border/50" aria-hidden />

            <div className="mt-3 w-full">
              <p className="text-base text-black md:text-lg">
                <Trans>
                  Leuna fits into your existing workflow — from no-code automation with
                  Zapier to full API access for teams building signing into their own products.
                </Trans>
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <Card
                  key={integration.id}
                  className="flex h-full flex-col rounded-2xl border border-border/50 bg-white shadow-none"
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="-mx-6 mt-3 border-b border-border/50" aria-hidden />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-sm leading-6 text-black">
                      {integration.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button asChild size="lg">
                <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                  <Trans>Get Lifetime Access</Trans>
                </Link>
              </Button>
            </div>
          </section>

          <section id="security" className="border-border py-6 md:py-8">
            <div className="w-full">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                <Trans>Security &amp; Compliance</Trans>
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                <Trans>Built to be trusted with your most important documents.</Trans>
              </h2>
            </div>

            <div className="mt-3 w-full border-b border-border/50" aria-hidden />

            <div className="mt-3 w-full">
              <p className="text-base text-black md:text-lg">
                <Trans>
                  Every signature on Leuna is cryptographically sealed, timestamped, and
                  backed by a complete audit trail. Legally binding in the US and EU — and so you
                  can verify exactly how it works.
                </Trans>
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SECURITY_ITEMS.map((item) => (
                <Card
                  key={item.id}
                  className="flex h-full flex-col rounded-2xl border border-border/50 bg-white shadow-none"
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="-mx-6 mt-3 border-b border-border/50" aria-hidden />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-sm leading-6 text-black">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button asChild size="lg">
                <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                  <Trans>Get Lifetime Access</Trans>
                </Link>
              </Button>
            </div>
          </section>

          <section id="pricing" className="border-border py-6 md:py-8">
            <div className="w-full text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                <Trans>Pricing</Trans>
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                <Trans>Unlimited contracts for life. One payment.</Trans>
              </h2>
            </div>

            <div className="mt-3 w-full border-b border-border/50" aria-hidden />

            <div className="mt-3 w-full text-center">
              <p className="text-base text-black md:text-lg">
                <Trans>
                  Get the signing workflow you need without turning contracts into another monthly
                  expense line.
                </Trans>
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card className="w-full rounded-md border border-border/50 bg-white shadow-none">
                <CardContent className="flex h-full flex-col p-5 md:p-7">
                  <div className="mx-auto w-fit rounded-full border border-border/50 bg-muted px-4 py-1 text-sm font-medium text-black">
                    <Trans>Lifetime Deal</Trans>
                  </div>

                  <CardTitle className="mt-5 text-center text-2xl md:text-3xl">
                    <Trans>Get Lifetime Access</Trans>
                  </CardTitle>

                  <div className="-mx-5 mt-5 border-b border-border/50 md:-mx-7" aria-hidden />

                  <div className="mt-5 text-center text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                    <Trans>{LIFETIME_DEAL_PRICE}</Trans>{' '}
                    <span className="text-base font-medium text-black md:text-lg">
                      <Trans>one-time payment</Trans>
                    </span>
                  </div>

                  <CardDescription className="mt-3 text-center text-base leading-7 text-black">
                    <Trans>
                      Pay once for the contracts, templates, collaboration, and future product
                      updates your team keeps using.
                    </Trans>
                  </CardDescription>

                  <div className="mt-5 text-left text-black">
                    <div className="text-sm font-medium">
                      <Trans>Includes:</Trans>
                    </div>

                    <ul className="mt-2 divide-y text-sm">
                      <li className="py-2.5">
                        <Trans>Unlimited contracts for life</Trans>
                      </li>
                      <li className="py-2.5">
                        <Trans>Reusable templates</Trans>
                      </li>
                      <li className="py-2.5">
                        <Trans>Team collaboration</Trans>
                      </li>
                      <li className="py-2.5">
                        <Trans>Custom branding controls</Trans>
                      </li>
                      <li className="py-2.5">
                        <Trans>Embedded signing workflows</Trans>
                      </li>
                    </ul>
                  </div>

                  <div className="flex-1" />

                  <p className="mt-6 text-center text-sm text-black">
                    <Trans>Pay once. Keep sending forever.</Trans>
                  </p>

                  <div className="mt-3 flex justify-center">
                    <Button asChild size="lg">
                      <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                        <Trans>Get Lifetime Access</Trans>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex h-full flex-col rounded-2xl border-0 bg-transparent shadow-none">
                <CardContent className="flex h-full flex-col justify-center p-6 md:p-7">
                  <blockquote className="max-w-full text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                    <span className="rounded-sm bg-[#EEC643]/45 px-1.5 py-0.5 [box-decoration-break:clone]">
                      <Trans>
                        "Finally, don&apos;t have to keep paying month on month just to send
                        contracts."
                      </Trans>
                    </span>
                  </blockquote>

                  <div className="mt-8 border-t border-border/50 pt-4">
                    <p className="text-sm font-semibold text-foreground">
                      <Trans>Liban I.</Trans>
                    </p>
                    <p className="text-sm text-black">
                      <Trans>Founder, AdCraftery </Trans>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="border-border">
            <div className="w-full rounded-3xl border border-border/50 bg-white px-6 py-8 text-center md:px-10 md:py-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                <Trans>Ready to Start?</Trans>
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                <Trans>Pay once. Send contracts for life.</Trans>
              </h2>

              <div className="-mx-6 mt-3 border-b border-border/50 md:-mx-10" aria-hidden />

              <p className="mt-3 w-full text-base text-black md:text-lg">
                <Trans>
                  If signatures are the thing you need, buy the signing workflow once and stop
                  paying for it every month after that.
                </Trans>
              </p>

              <div className="mt-6 flex justify-center">
                <Button asChild size="lg">
                  <Link to={POLAR_LIFETIME_PURCHASE_PATH}>
                    <Trans>Get Access Now</Trans>
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="border-border py-6 md:py-8">
            <div className="w-full">
              <div className="w-full text-center">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
                  <Trans>FAQ</Trans>
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  <Trans>Questions teams usually ask before they start signing.</Trans>
                </h2>
              </div>

              <div className="mt-3 w-full border-b border-border/50" aria-hidden />

              <div className="mt-3 w-full text-center">
                <p className="text-base text-black md:text-lg">
                  <Trans>
                    A few quick answers to help you understand what is included and how Leuna
                    Sign fits into your signing workflow.
                  </Trans>
                </p>
              </div>

              <Card className="mx-auto mt-8 max-w-3xl rounded-md border border-border/50 bg-white shadow-none">
                <CardContent className="p-6 md:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ_ITEMS.map((faqItem) => (
                      <AccordionItem key={faqItem.id} value={faqItem.id} className="border-border">
                        <AccordionTrigger className="text-left text-base text-foreground hover:no-underline">
                          {faqItem.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base leading-7 text-black">
                          {faqItem.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-border/50 bg-white px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex" aria-label="Leuna home">
                <SignWordmarkLogo className="text-4xl text-foreground" />
              </Link>
              <p className="mt-3 text-sm text-black">
                <Trans> e-signing. One payment. No limits.</Trans>
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                <Trans>Product</Trans>
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black">
                <li>
                  <a href="#integrations" className="transition-colors hover:text-foreground">
                    <Trans>Integrations</Trans>
                  </a>
                </li>
                <li>
                  <a href="#security" className="transition-colors hover:text-foreground">
                    <Trans>Security</Trans>
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors hover:text-foreground">
                    <Trans>Pricing</Trans>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                <Trans>Legal</Trans>
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black">
                <li>
                  <Link to="/privacy" className="transition-colors hover:text-foreground">
                    <Trans>Privacy Policy</Trans>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-colors hover:text-foreground">
                    <Trans>Terms of Service</Trans>
                  </Link>
                </li>
                <li>
                  <a href="#security" className="transition-colors hover:text-foreground">
                    <Trans>Security</Trans>
                  </a>
                </li>
                <li>
                  <Link to="/open-source" className="text-[10px] transition-colors hover:text-foreground">
                    <Trans>Source Code</Trans>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-5 md:flex-row">
            <p className="text-sm text-black">
              <Trans>© {new Date().getFullYear()} Leuna. All rights reserved.</Trans>
            </p>
            <p className="text-sm text-black">
              <Trans>. Proudly transparent.</Trans>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
