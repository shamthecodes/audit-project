# Tests

## How to Run

```bash
npm run test
```

Expected output:

## Test File Location

`__tests__/audit-engine.test.js`

## What Each Test Covers

**Test 1 — Optimal plan returns zero savings**
Cursor Pro, 1 seat, paying exact official price of $20/mo.
Engine should find no savings and mark as optimal.
This ensures we don't manufacture fake savings.

**Test 2 — Team plan overkill for small team**
Claude Team plan with only 2 seats. Minimum is 5 seats.
Engine should flag this as overkill and recommend downgrade.
Verifies the isPlanOverkillForSeats logic works correctly.

**Test 3 — Detects overpaying vs official price**
GitHub Copilot Individual official price is $10/mo.
User enters $20/mo spend. Engine should flag the $10 overage.
Verifies the overpaying check works with real pricing data.

**Test 4 — Annual savings equals 12x monthly**
Simple math integrity check. If monthly savings is $X,
annual must be exactly $X times 12. No rounding errors.

**Test 5 — showCredex triggers above $500/mo savings**
Multiple tools all overpaying significantly.
Total savings must exceed $500 and showCredex must be true.
Verifies the Credex CTA logic works correctly.

**Test 6 — Multiple tools sum savings correctly**
Two tools entered, both with some savings.
Verifies the total is a number and both tools appear in results.
Checks the accumulation logic across multiple tools.

## Why Only Audit Engine Tests

The audit engine is the most critical and complex part of the
codebase. It contains all the pricing logic that needs to be
defensible. UI components and API routes are better tested
manually for a project of this scope and timeline.

The 6 tests cover the main paths through the engine:
optimal state, overkill detection, overpaying detection,
math integrity, threshold logic, and multi-tool handling.
