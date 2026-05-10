# Metrics

## North Star Metric

**Audits completed per week**

This is the single most important number. An audit completed means a
user got real value from the tool. Everything else — leads,
consultations, Credex revenue — only happens after an audit is
completed. DAU is wrong for a tool people use once a quarter.
Email signups are wrong because we don't require them upfront.

## Three Input Metrics That Drive the North Star

**1. Landing page → audit start rate**
Are visitors actually engaging with the form?
Target: above 40%
How to measure: track first form field interaction as "audit_started" event

**2. Audit start → audit complete rate**
Are users finishing the form or dropping off?
Target: above 70%
How to measure: track form submit as "audit_completed" event

**3. Audit complete → email captured rate**
Are we converting value shown into leads?
Target: above 25%
How to measure: track successful email capture as "lead_captured" event

## What to Instrument First

In order of priority:

1. `audit_started` — first form field interaction
2. `audit_completed` — form submitted, results shown (include total_spend and tool_count)
3. `lead_captured` — email entered successfully (include savings amount and show_credex flag)
4. `share_copied` — shareable link copied
5. `shared_audit_viewed` — /audit/[id] page opened (viral coefficient)

These five events tell you the full funnel. Everything else is secondary.

## What Number Triggers a Pivot

If email capture rate stays below 10% after 200 completed audits,
the results page is not showing compelling enough value. Either:

- The savings numbers are too low (audit logic needs tuning)
- The results UI is not clear enough (redesign results page)
- Users don't trust the numbers (add source citations on hover)

That is the signal to stop distribution and fix the product first.

## Why Not DAU

This tool solves a problem people have once a quarter at most.
A startup reviews their AI tool spend when the bill arrives or
when someone asks "why are we paying this much." Optimizing for
DAU would mean building a different product entirely. The right
metric for a B2B audit tool at this stage is audit completions
and lead quality, not daily engagement.
