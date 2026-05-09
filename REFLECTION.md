# Reflection

## 1. Hardest Bug — Prisma EPERM on Windows

The hardest bug was `EPERM: operation not permitted` when running `npx prisma generate` on Windows. The error was: `rename query_engine-windows.dll.node.tmp -> query_engine-windows.dll.node`.

**Hypotheses I formed:**

- File permissions issue with the project folder
- Antivirus blocking the file rename
- Dev server holding a lock on the DLL file

**What I tried:**

- Running PowerShell as administrator — did not fix it
- Deleting node_modules and reinstalling — did not fix it
- Checking antivirus exclusions — no obvious block

**What worked:**
Stopping the dev server completely with `Ctrl+C` and then running `taskkill /F /IM node.exe` to kill all Node processes. The dev server was holding an open file handle on the query engine DLL, preventing Prisma from replacing it during generation. Once all Node processes were killed, `prisma generate` ran successfully.

---

## 2. A Decision I Reversed

I initially planned to use hCaptcha for abuse protection because the assignment mentioned it explicitly. Mid-week I switched to Arcjet.

**Why I reversed it:**
hCaptcha requires a frontend widget that interrupts the form UX — users have to solve a visual puzzle before submitting. For a tool where the value proposition is "instant audit in 2 minutes," adding friction at the form level felt wrong. Arcjet provides rate limiting and bot detection entirely server-side with no frontend widget, keeping the form clean. The assignment says "document your choice and why" — so switching and documenting was the right call.

---

## 3. What I Would Build in Week 2

- **PDF export** of the full audit report — the assignment lists this as a bonus and it's the most requested feature after email
- **Benchmark mode** — "your AI spend per developer is $X, companies your size average $Y" — requires collecting aggregate data from audits
- **Embeddable widget** — a `<script>` tag bloggers and newsletters could drop in, turning every SpendLens mention into a distribution channel
- **Custom domain for Resend** — fix the email delivery limitation so reports reach any inbox
- **Referral codes** — share the tool, both parties get a perk, drives viral growth

---

## 4. How I Used AI Tools

**Tools used:** Claude (primary), Gemini (in-product for audit summaries)

**What I used Claude for:**

- Generating boilerplate component structure
- Debugging the Prisma EPERM error
- Writing the email HTML template
- Drafting the GTM and ECONOMICS markdown files

**What I did not trust AI with:**

- The audit engine logic — this needed to be defensible to a finance person. I wrote every rule manually and verified each one against official pricing pages. AI-generated audit logic would be unverifiable.
- The pricing data — every number was manually verified against official vendor URLs. AI pricing knowledge is stale.
- The test cases — I wrote these myself to ensure they actually caught real bugs, not just passed trivially.

**One time AI was wrong:**
Claude initially suggested using Inngest for background job processing for the Gemini summary generation. It described Inngest as "simple to set up in 10 minutes." In practice, Inngest requires a separate hosted endpoint, webhook configuration, and a running Inngest dev server. For a 6-day assignment this was unnecessary complexity. I caught this by reading the Inngest docs directly and decided a simple async API route was sufficient.

---

## 5. Self-Rating

| Dimension                | Rating | Reason                                                                           |
| ------------------------ | ------ | -------------------------------------------------------------------------------- |
| Discipline               | 7/10   | Started Day 1, committed daily, but Days 3-5 entries need more depth             |
| Code quality             | 7/10   | Clean component structure, good separation of concerns, but no TypeScript        |
| Design sense             | 8/10   | Dark theme with clear visual hierarchy, results page is screenshot-worthy        |
| Problem solving          | 8/10   | Debugged Prisma, Resend, hydration issues systematically                         |
| Entrepreneurial thinking | 7/10   | GTM and ECONOMICS are specific and realistic, user interviews are the weak point |
