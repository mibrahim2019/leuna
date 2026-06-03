/** Matches DotPatternPageBackground on sign-in / sign-up. */
export const emailDotPatternBackground = {
  backgroundColor: '#FFFFFF',
  backgroundImage: 'radial-gradient(#e8e8e8 1px, #FFFFFF 1px)',
  backgroundSize: '10px 10px',
} as const;

export const emailStyles = {
  page: 'mx-auto my-auto bg-white font-sans text-[#111827]',
  pageSection: 'bg-white px-4 py-10 text-[#111827]',
  card: 'mx-auto mt-8 max-w-2xl rounded-[24px] border border-solid border-[#e5e7eb] bg-white px-8 py-8 shadow-sm',
  cardHeader: 'mb-8 border-0 border-b border-solid border-[#eceff1] pb-6',
  content: '',
  logo: 'h-7 w-auto',
  divider: 'mx-auto mt-10 max-w-2xl border-solid border-[#d1d5db]',
  supplemental:
    'mx-auto mt-6 max-w-2xl rounded-[24px] border border-solid border-[#e5e7eb] bg-white px-8 py-6 shadow-sm',
  title:
    'mx-auto mb-0 max-w-[88%] text-center text-[30px] font-semibold leading-[38px] text-[#111827]',
  titleLeft: 'mb-0 text-left text-2xl font-semibold leading-8 text-[#111827]',
  heading: 'mb-4 text-center text-[32px] font-semibold text-[#111827]',
  body: 'my-2 text-center text-base leading-7 text-[#4b5563]',
  bodyWide: 'mx-auto my-2 max-w-[88%] text-center text-base leading-7 text-[#4b5563]',
  bodyLeft: 'my-2 text-left text-base leading-7 text-[#4b5563]',
  subtle: 'mt-2 text-center text-sm leading-6 text-[#6b7280]',
  subtleLeft: 'mt-2 text-left text-sm leading-6 text-[#6b7280]',
  pill: 'mx-auto my-4 w-fit rounded-full border border-solid border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2 text-sm font-medium text-[#111827]',
  primaryButton:
    'inline-flex items-center justify-center rounded-xl bg-[#111111] px-6 py-3 text-center text-sm font-semibold text-white no-underline',
  secondaryButton:
    'inline-flex items-center justify-center rounded-xl border border-solid border-[#d1d5db] bg-white px-6 py-3 text-center text-sm font-semibold text-[#111827] no-underline',
  statusLabel:
    'inline-flex items-center rounded-full border border-solid border-[#d1fae5] bg-[#f0fdf4] px-4 py-2 text-base font-semibold',
  codePanel: 'mt-6 rounded-2xl border border-solid border-[#e5e7eb] bg-[#f9fafb] p-6 text-center',
  codeLabel: 'mb-2 text-sm font-medium text-[#6b7280]',
  codeValue: 'text-2xl font-bold tracking-[0.3em] text-[#111827]',
  footerText: 'my-6 text-sm leading-6 text-[#6b7280]',
  footerLink: 'font-medium text-[#111827] underline',
  mutedLink: 'font-normal text-[#6b7280] underline',
  bulletList: 'my-2 ml-4 list-inside list-disc text-sm leading-6 text-[#4b5563]',
  errorItem: 'mt-1 text-sm leading-6 text-destructive',
} as const;

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');
