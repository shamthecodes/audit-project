# Architecture

## System Diagram

```mermaid
graph TD
    A[User fills form] -->|Submit| B[runAudit runs in browser]
    B -->|No savings found| C[Show optimal state]
    B -->|Savings found| D[POST to /api/summary]
    D -->|Gemini 1.5 Flash| E[100-word summary back]
    E --> F[POST to /api/audit]
    F -->|Prisma| G[(Supabase Postgres)]
    G -->|Returns UUID| H[Show results page]
    H -->|User enters email| I[POST to /api/capture]
    I -->|Save Lead| G
    I -->|Resend| J[Email sent]
    H -->|Copy link| K[/audit/UUID public page]
    K -->|Server fetch| G
```

## How a User Input Becomes an Audit Result

1. User fills the SpendForm — picks tool, plan, number of seats, what they actually pay per month
2. They hit submit — `runAudit()` runs immediately in the browser, no API call needed
3. For each tool the engine checks: are they paying more than official price, is the plan too big for their seat count, is there a cheaper plan that fits, is the tool a poor fit for their use case
4. The result object goes to `/api/summary` — Gemini writes a 100-word paragraph about the biggest saving opportunity
5. The full result plus summary goes to `/api/audit` — saved to Supabase, returns a UUID
6. Results render on screen
7. If the user wants the report by email, they enter their address — `/api/capture` saves the lead and fires a Resend email
8. The shareable link is `/audit/[UUID]` — loads from Supabase server-side, strips any personal details, shows only tools and savings

## Why This Stack

- **Next.js 15 App Router** — server components on the shared audit page means the page is fast and crawlable without extra API calls. API routes in the same repo means one deploy, no separate backend.
- **Tailwind + shadcn/ui** — I needed a professional looking UI fast. Tailwind handles spacing and color, shadcn gives me accessible components I didn't have to build from scratch.
- **Supabase** — free managed Postgres. I didn't want to spend time on database infrastructure for a 6-day build.
- **Prisma** — the schema.prisma file acts as living documentation of the data model. Anyone reading the repo understands the structure immediately.
- **Gemini 1.5 Flash** — free tier, fast, no credit card. Good enough for 100-word summaries. Falls back to a template if the API fails.
- **Resend** — cleanest email API I've used. Three lines to send an email.
- **Arcjet** — rate limiting and bot detection without touching the frontend.

## Known Limitation — Email Delivery

Resend's free tier restricts outbound email to your own verified address when using the `audit-email@resend.dev` sender domain. The email integration is fully built and working — leads are stored in Supabase and emails are triggered correctly (visible in Resend logs). In production this would use a verified custom domain so reports reach any user inbox. I documented this rather than hiding it because it's an infrastructure limitation, not a code failure.

## What Would Change at 10k Audits Per Day

- Move Gemini summary to a background queue so the results page doesn't wait on the API
- Add Redis caching for audit results — most tool combinations repeat
- Index the audits table on createdAt for any analytics queries
- Upgrade Supabase from free to Pro for higher connection limits
- Add Cloudflare in front of Vercel for edge caching on shared audit pages
