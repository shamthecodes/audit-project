# Reflection

## 1. Hardest Bug — Prisma EPERM on Windows

The hardest bug was getting `npx prisma generate` to run on Windows.
The exact error was:
EPERM: operation not permitted, rename
'query_engine-windows.dll.node.tmp2980'
-> 'query_engine-windows.dll.node'

**Hypotheses I formed:**

- File permission issue with the project folder
- Antivirus blocking the rename operation
- Something else holding a lock on the DLL

**What I tried:**

- Running PowerShell as administrator — did not fix it
- Deleting node_modules and reinstalling — did not fix it
- Checking Windows Defender exclusions — no obvious block

**What worked:**
The dev server was holding an open file handle on the Prisma
query engine DLL. Stopping the dev server with Ctrl+C and then
running `taskkill /F /IM node.exe` killed all Node processes.
After that prisma generate ran immediately with no error.

The lesson: on Windows, always stop all Node processes before
running prisma generate. Added this to ARCHITECTURE.md as a note.

---

## 2. A Decision I Reversed Mid-Week

I initially planned to use hCaptcha for abuse protection because
the assignment mentioned it explicitly as an option.

Mid-week I switched to Arcjet.

**Why I reversed it:**
hCaptcha requires a visual puzzle widget on the form. For a tool
where the value proposition is "instant audit in 2 minutes,"
adding a puzzle before the user even sees results felt like the
wrong trade-off. I read the Arcjet docs and realized it does
rate limiting and bot detection entirely server-side with no
frontend impact whatsoever. The form stays clean. The protection
is actually stronger because it works on every API route, not
just the form submit.

The assignment says "document your choice and why" — switching
and explaining the reasoning is better than using hCaptcha just
because it was mentioned.

---

## 3. What I Would Build in Week 2

**PDF export** — the assignment lists this as a bonus feature.
A downloadable PDF of the full audit report is the most natural
next step. Users want to share it with their CFO or team.

**Benchmark mode** — "your AI spend per developer is $X,
companies your size average $Y." This requires collecting
aggregate data across audits which I now have the infrastructure
for via Supabase.

**Embeddable widget** — a script tag bloggers and newsletter
writers could drop in. Every SpendLens mention becomes a
distribution channel if the tool is embeddable.

**Custom domain for email** — verify a domain with Resend so
audit reports go directly to any user inbox instead of the
operator inbox.

**Referral codes** — share the tool, both parties get a perk.
The shareable URL is already built, adding a referral parameter
is a small addition with significant viral impact.

---

## 4. How I Used AI Tools

**Tool used:** Claude (primary throughout the week)

**What I used it for:**

- Generating component boilerplate (SpendForm, AuditResults,
  LeadCapture structure)
- Debugging the Prisma EPERM error on Windows
- Writing the HTML email template for Resend
- Drafting the GTM, ECONOMICS, and ARCHITECTURE markdown files
- Explaining Arcjet SDK usage

**What I did not trust AI with:**

- The audit engine logic — every rule needed to be defensible
  to a finance person. I wrote each check manually and verified
  against official pricing pages. AI pricing knowledge is stale
  and unverifiable.
- The pricing data — every number was manually checked against
  official vendor URLs on the day of submission.
- The test cases — I wrote these myself to ensure they caught
  real bugs, not just passed trivially.

**One specific time AI was wrong:**
Claude suggested using Inngest for background job processing
for the Gemini summary generation, describing it as "simple
to set up in 10 minutes." I read the Inngest docs directly and
found it requires a separate hosted endpoint, webhook
configuration, and a running Inngest dev server locally.
For a 6-day assignment this was unnecessary complexity. I caught
this by reading the actual documentation before implementing
anything. A simple async API route was sufficient.

---

## 5. Self-Rating

| Dimension                | Rating | Reason                                                                                           |
| ------------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| Discipline               | 7/10   | Started Day 1, committed every day, but could have gone deeper on DEVLOG entries                 |
| Code quality             | 7/10   | Clean component structure, good separation of concerns, would add TypeScript in week 2           |
| Design sense             | 8/10   | Dark theme with clear visual hierarchy, results page is screenshot-worthy, mobile responsive     |
| Problem solving          | 8/10   | Debugged Prisma, Resend, hydration issues systematically — formed hypotheses before trying fixes |
| Entrepreneurial thinking | 7/10   | GTM and ECONOMICS are specific and realistic, user interviews were the weakest part of the week  |
