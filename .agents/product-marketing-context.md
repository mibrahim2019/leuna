# Product Marketing Context

*Last updated: 2026-04-21*

> **V1 draft** generated from sign.leuna.io homepage, in-repo docs (MANIFEST, ARCHITECTURE, compliance pages, embedding/policies), and industry research on DocuSign / Adobe Sign / Dropbox Sign. Review, correct, and fill gaps — especially Personas, Proof Points, and Goals.

---

## Product Overview

**One-liner:**
Leuna is the pay-once DocuSign alternative — an open-source e-signature platform with a lifetime license, so teams stop renting signatures and own the workflow forever.

**What it does:**
Upload a PDF, drop in fields, add recipients, and send it for a legally binding electronic signature. Recipients sign in the browser without an account; the final document is cryptographically sealed with a full audit trail. Teams get templates, an API, webhooks, Zapier, embedded signing, and compliance with eSIGN, UETA, and eIDAS — all under a one-time payment instead of per-user, per-envelope subscription fees.

**Product category:** Electronic signature / e-signature software (how buyers search: "DocuSign alternative", "e-sign software", "digital signature tool", "contract signing software").

**Product type:** B2B SaaS (cloud-hosted) with optional self-hosted Community Edition (AGPL-3.0) and commercial Enterprise Edition. Built on the open-source Documenso codebase.

**Business model:**
- **Lifetime Deal — $99** (headline offer): one-time payment, unlimited contracts for life, all future updates included. Anchored directly against competitors: "3 months of DocuSign = our lifetime price."
- Free tier (legacy / self-host): 5 documents per month, up to 10 recipients per document, API access.
- **Enterprise Edition**: commercial license for customers who need to integrate Leuna into proprietary products without AGPL-3.0 disclosure obligations.
- *Note:* Meta description still says "Pricing starts at $30/mo. forever!" — this reads stale against the $99 lifetime push. Worth aligning.

---

## Target Audience

**Target companies:**
- SMB and mid-market teams (5–200 employees) signing 20–500+ contracts per month.
- Agencies, consultancies, SaaS startups, professional services, real estate, e-commerce operators, and small legal/HR teams.
- Bootstrapped / profitable / founder-led companies watching SaaS spend.
- Secondary: developers and product teams that need to embed signing into their own apps.

**Decision-makers:**
- Founders / owners / CFOs (financial buyer — hates recurring SaaS bills).
- Revenue / Sales leaders (champion — wants faster close and visibility).
- Operations / RevOps / Legal Ops (admin — owns the signing workflow).
- CTO / Head of Engineering (for embedded / API use cases).

**Primary use case:**
Send contracts, proposals, NDAs, MSAs, offer letters, and vendor agreements for signature — without paying per user or per envelope every month.

**Jobs to be done:**
- **Close deals faster** — stop losing time on email-attachment signature chasing.
- **Kill a recurring SaaS bill** — replace DocuSign / Adobe Sign / Dropbox Sign with a one-time purchase.
- **Automate signing** inside existing workflows (CRM, Zapier, internal apps).
- **Stay compliant** with eSIGN, UETA, and eIDAS for legally binding US & EU signatures.
- **Own the infrastructure** — self-host, customize, and integrate without vendor lock-in.

**Use cases by department** (as featured on homepage):
- **Sales** — auto-detect signature fields in contracts, send MSAs/NDAs via shareable links, track deal stall without status-asking.
- **Customer Experience** — onboarding agreements, service sign-offs.
- **Procurement** — vendor agreements, purchase orders.
- **Human Resources** — offer letters, policy acknowledgments, onboarding docs.
- **Legal** — NDAs, amendments, counsel-reviewed templates.
- **Developers / Product** — embed signing into SaaS apps (Teams plan+), or embed document authoring (Enterprise/Platform add-on).

---

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---|---|---|---|
| **Founder / SMB Owner** (Financial Buyer) | Cashflow, SaaS sprawl, "buy-don't-rent" | Watching the monthly DocuSign bill climb every quarter as the team grows | One payment, done. 3–4 months of DocuSign pays for our whole lifetime. |
| **VP Sales / Sales Lead** (Champion) | Deal velocity, signed-this-week visibility, rep productivity | Deals stall in the signature step; reps spend minutes per send | Drop-in + auto-field-detect means seconds per send; shareable links close deals without chasing |
| **Ops / RevOps Manager** (User + Admin) | Workflow reliability, automation, integrations | Gluing CRM → signing → storage across tools | Zapier (6,000+ apps), native API, webhooks, templates — fits the stack they already have |
| **Legal / Compliance** (Technical Influencer) | Enforceability, audit trails, jurisdiction coverage | Vetting whether an e-sig tool is "actually" legally binding | eSIGN, UETA, eIDAS SES compliant; cryptographic sealing, timestamps, full audit trail |
| **Developer / Founder-Engineer** (Technical Buyer for embed use case) | Clean API, SDKs, self-hosting, embeddability | DocuSign API is expensive, rate-limited, and overkill | REST API + webhooks + React/TS/Python/Go SDKs + open source + embeddable UI |

---

## Problems & Pain Points

**Core problem:**
E-signature is a utility — teams use it every week, often every day. But incumbents charge like it's a premium SaaS: per-user, per-envelope, with annual commitments and surprise overages. A small team can easily burn $1,200–5,000/year on something that is, functionally, "send PDF, collect signature."

**Why alternatives fall short:**
- **DocuSign** — $15–$60/user/month with 100-envelope-per-user caps; essential features (authentication, integrations, branding) sit behind higher tiers; pricing scales brutally with team size.
- **Adobe Sign** — cheaper per seat than DocuSign but capped at 150 transactions/user/year on Teams; heavy Adobe ecosystem pull.
- **Dropbox Sign (HelloSign)** — simpler but limited on features; still subscription.
- **PandaDoc / SignNow / BoldSign** — all subscription-based, all per-user.
- **Documenso (OSS origin)** — beautiful UX and the codebase we build on, but cloud tier is monthly too.
- Across all: closed-source, vendor lock-in, slow to add what users actually ask for, and priced for enterprise procurement — not for the 10-person team just trying to close deals.

**What it costs them:**
- Money: $1,200–$20,000+/year in recurring fees that don't grow the business.
- Time: minutes per send × hundreds of sends = hours per rep per month.
- Velocity: deals stall in the signature step; reps email to ask "did you sign yet?"
- Autonomy: no way to customize, embed, or self-host without enterprise pricing.

**Emotional tension:**
Frustration at paying monthly for a commodity. Mild embarrassment at the size of the SaaS spreadsheet. Fear of another renewal hike. For developers: the conviction that "this should be a $99 tool, not a $600/month one."

---

## Competitive Landscape

**Direct competitors** (same solution, same problem):
- **DocuSign** — the default. Expensive, feature-complete, sales-heavy, surprise fees, envelope caps. We win on price ($99 lifetime vs ~$540/user/year Business Pro) and on simplicity.
- **Adobe Sign / Acrobat Sign** — bundled with Acrobat, cheaper than DocuSign, capped transactions. We win on flat pricing and no cap.
- **Dropbox Sign (HelloSign)** — simple, subscription. We win on pay-once and embeddability.
- **PandaDoc, SignNow, BoldSign, SignEasy, Signeasy, Yousign, GetAccept** — per-user subscriptions, feature-rich in proposal territory.

**Secondary competitors** (different solution, same problem):
- **DocuSeal, OpenSign, BoxyHQ, Documenso Cloud** — other open-source / self-host e-sig tools. We win on the lifetime pricing narrative and the productized workflow built on top.
- **Box Sign, Dropbox native signing, Notion signatures** — bundled-in signing from adjacent tools. We win on real compliance depth and API.

**Indirect competitors** (conflicting approach):
- **Email + scanned PDFs, print-sign-scan-send, wet signatures, in-person signing** — still the default for a surprising share of SMBs. We win on speed and legal clarity.
- **"We'll build it ourselves"** — engineering teams considering building signing in-house. We win on compliance, audit trail, and not reinventing PAdES.

---

## Differentiation

**Key differentiators:**
- **One-time lifetime payment ($99)** — no per-user, no per-envelope, no renewal. This is the headline.
- **Unlimited everything** — unlimited contracts, recipients, templates, users (within fair use).
- **Open signing infrastructure** — built on the open-source Documenso codebase; transparent, inspectable, self-hostable.
- **Auto-detect signature fields** — drop in a contract, it finds and assigns fields for you ("seconds, not minutes").
- **Shareable template links** — prospects sign on their own schedule, no email attachments.
- **Full API + SDKs + embedding** — TypeScript, Python, Go SDKs; React/Angular/Preact/Solid/Svelte embed SDKs.
- **Cryptographic sealing on every signature** — regardless of plan.
- **Legally binding in US & EU** — eSIGN, UETA, eIDAS SES compliant today; AES/QES on the roadmap.
- **Zapier + 6,000 apps**, webhooks, real-time alerts, complete audit trail.
- **Proudly transparent** — open-source core, public roadmap, published pricing.

**How we do it differently:**
We priced signing the way it *should* be priced — like a tool, not a subscription. And we built it on open source so customers can verify it, extend it, and never get held hostage by a vendor.

**Why that's better:**
- Predictable CFO math: one line item, once.
- Honest product: what you see is what you pay.
- No switching anxiety: self-host if we ever disappear.

**Why customers choose us:**
They've already paid for DocuSign / Adobe / Dropbox Sign at least once, and they're tired of doing it again next year. They want the same functionality with a sane bill.

---

## Objections

| Objection | Response |
|---|---|
| "Lifetime pricing sounds too good to be true — how are you sustainable?" | We're built on a robust open-source core and monetize Enterprise, Platform add-ons, and custom contracts. The $99 price is intentionally anchored to a single well-loved tier — not the whole product. |
| "Is a $99 tool actually legally binding?" | Every signature is cryptographically sealed, timestamped, and delivered with a full audit trail. Fully compliant with eSIGN, UETA, and eIDAS SES. Admissible in US and EU courts. |
| "Does it integrate with my CRM / stack?" | Native Zapier (6,000+ apps), full REST API, webhooks, embed SDKs. If it can call a URL, it can sign. |
| "What if you shut down?" | The code is open source (AGPL-3.0). You can self-host at any time and keep using it forever. |
| "DocuSign has X feature you don't" | We cover 90% of what real teams use every day — templates, roles, fields, audit trails, API, auth. We skip the procurement-driven bloat that inflates DocuSign's price tag. |
| "Can my enterprise actually use open source?" | Yes — via the Enterprise Edition (commercial license), which removes AGPL obligations for proprietary integrations. |
| "Is it really unlimited?" | Yes, within a fair-use policy — we won't hard-cap, but we'll ask enterprise-scale senders to move to a custom plan. |

**Anti-persona** (who is NOT a good fit):
- Fortune 500 enterprise procurement teams requiring SOC 2 Type II + ISO 27001 + a dedicated CSM + SLA — we're not there yet on the cloud side.
- Heavily regulated signing workflows that mandate eIDAS **QES** (qualified) today — AES/QES are on the roadmap, not shipping.
- Teams that want a bundled proposal / CPQ / CLM suite (they should look at PandaDoc / GetAccept / Ironclad).
- Signers who need in-person signing, notarization, or handwritten-pen-tablet workflows.

---

## Switching Dynamics

**Push** (what drives them away from current tool):
- Annual renewal hike on DocuSign / Adobe.
- Surprise overage charges for envelope limits.
- Adding another seat means another $15–$60/month forever.
- Feature they need is gated behind a higher tier.
- Procurement asked them to "cut SaaS spend by 30%."

**Pull** (what attracts them to us):
- "$99 for life" is a number you can decide on without a committee.
- Same functionality for daily use, a fraction of the lifetime cost.
- Open source = no vendor lock-in; self-host is always a backstop.
- Modern, clean UX that signers don't complain about.
- Developer-friendly API and embed SDKs.

**Habit** (what keeps them stuck):
- Templates and integrations already live in DocuSign.
- "It works, don't touch it" for legal/compliance.
- Other departments are already trained.
- Pre-paid annual contract they're mid-way through.

**Anxiety** (what worries them about switching):
- "Will signatures still hold up in court?" (Yes — eSIGN/UETA/eIDAS.)
- "Can I migrate my templates?" (Rebuild in-product; no one-click import yet.)
- "What if the team doesn't adopt it?" (UX is closer to Dropbox Sign / modern tools, not DocuSign circa 2012.)
- "What if the company folds?" (Open source. Self-host anytime.)

---

## Customer Language

**How they describe the problem** (verbatim-style, from the homepage and industry research):
- "Subscriptions add up faster than you know."
- "You only need signatures, not another subscription."
- "Why am I paying $540/year per rep to send a PDF?"
- "A lot of hidden fees that are actively hidden during the sales process."
- "We hit our envelope limit and got charged extra."

**How they describe the solution** (homepage voice):
- "Pay once. Send contracts for life."
- "Unlimited contracts for life. One payment."
- "Drop in your proposal. Walk away. It's ready to sign."
- "One template closes a hundred deals."
- "Every rep's pipeline, one signing workspace."
- "One payment. No limits."
- "Open signing infrastructure."

**Words to use:**
- Pay once, lifetime, forever, unlimited, own, one payment
- Open, open source, transparent, self-host
- Sealed, audit trail, legally binding, compliant
- Drop in, send, sign — short verbs
- "Your contracts", "your team", "your workflow" (second person, possessive)

**Words to avoid:**
- "Subscription," "SaaS," "monthly plan," "per user," "per envelope," "seat" (these are what we're against — only use them when naming the competitor's pricing)
- "Revolutionary," "game-changing," "cutting-edge," "best-in-class" (too SaaS-marketing)
- Emojis, exclamation-heavy copy, "we're excited to announce"
- "Envelopes" unless we're comparing — our unit is just "contracts" or "documents"

**Glossary:**

| Term | Meaning |
|---|---|
| **Contract / document** | A signable PDF — what DocuSign calls an "envelope." |
| **Template** | A reusable pre-configured document with predefined fields and roles. |
| **Direct link template** | An evergreen shareable URL — each completion generates a new signed document. |
| **Recipient role** | Signer, Approver, Viewer, Assistant, or CC. |
| **Field** | Signature, text, date, checkbox, dropdown placed on a document. |
| **Audit trail** | Time-stamped log of every action on a document. |
| **Sealing** | Cryptographic operation that locks a signed PDF against tampering. |
| **PAdES / PDF/A** | PDF digital signature and archival standards we comply with. |
| **eSIGN / UETA / eIDAS** | US federal, US state, and EU electronic-signature regulations we're compliant with. |
| **Community Edition** | AGPL-3.0 self-hosted version, free forever. |
| **Enterprise Edition** | Commercial license for proprietary integration. |
| **Lifetime Deal** | $99 one-time purchase for unlimited cloud access, forever. |

---

## Brand Voice

**Tone:**
Direct, confident, slightly anti-establishment. Not trying to sound "enterprise." Talking to a founder or ops lead like a peer who's sick of SaaS bills.

**Style:**
- Short sentences. Imperative verbs.
- Second person ("you", "your team").
- Pragmatic, never hype.
- Willing to name competitors by name when the comparison is the point.
- Specific numbers over vague claims ($99, 10x, 4 months, 6,000+ apps).
- No emojis. No exclamation overkill. No "game-changing."

**Personality (3–5 adjectives):**
Honest. Pragmatic. Transparent. Builder-friendly. A little contrarian.

Representative lines from the site:
> "You only need signatures, not another subscription."
> "Drop in your proposal. Walk away."
> "4 Months of Adobe Sign = Our Lifetime Price."
> "Pay once. Keep sending forever."

---

## Proof Points

**Metrics** *(verify before using):*
- 10x better signing experience *(current homepage claim — worth grounding in something concrete)*
- 6,000+ apps via Zapier
- 100% compliant with eSIGN, UETA, eIDAS
- $99 lifetime vs ~$180 (3 months DocuSign) / ~$100 (4 months Adobe Sign) / ~$100 (4 months Dropbox Sign)

**Customers:**
- *TODO — add logos, named customers, or testimonials. None visible on homepage yet.*

**Testimonials:**
- *TODO — no testimonials on homepage at research time. Prioritize collecting 3–5 before next big launch.*

**Value themes:**

| Theme | Proof |
|---|---|
| Pay once, own forever | $99 lifetime, unlimited contracts, future updates included |
| Faster to send | Auto-detect fields, drop-in preparation, shareable links |
| Full visibility | Audit trail, real-time alerts, pipeline view |
| Legally bulletproof | eSIGN / UETA / eIDAS, cryptographic sealing, timestamps |
| Fits your stack | Zapier, API, webhooks, embed SDKs, SSO |
| Open and transparent | Open-source core, self-host option, published roadmap |

---

## Goals

**Business goal:**
- *Hypothesized from the site:* drive volume on the $99 lifetime deal as the primary growth engine, with Enterprise/Platform upgrades as secondary revenue. **Confirm.**

**Conversion action:**
- Primary: "Get Lifetime Access — $99" / "Claim Your Lifetime Deal" (repeated across the homepage).
- Secondary: "Login" (returning users), developer docs exploration (future API/embed buyers).

**Current metrics:**
- *TODO — signups/month, LTD conversion rate, CAC, top-of-funnel traffic. Not available from public research.*

---

## Open questions for you (V1 review)

1. **Brand name resolution** — site says "Leuna"; in-repo docs (MANIFEST, ARCHITECTURE, CLA, AGENTS) say "Sign Leuna"; package.json is still `@documenso/*` and the developer docs API base is still `app.leuna.app`. Which is canonical for marketing?
2. **Pricing page is broken** (returns "Oops! Something went wrong") — is that known?
3. **Meta description still advertises "$30/mo forever"** but the whole homepage sells the $99 lifetime deal. Which offer is the current one?
4. **Enterprise + Platform plans** — what are their prices and positioning today? (Referenced in docs; not visible on the marketing site.)
5. **Target customer size** — mostly SMB / bootstrapped, or are you pursuing mid-market sales teams too?
6. **Proof points** — any named customers, case studies, or volume metrics we can cite?
7. **Primary business goal for 2026** — LTD volume, Enterprise conversions, developer ecosystem, or all three?
