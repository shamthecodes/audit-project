# Pricing Data Sources

Every number in the audit engine traces to an official vendor
pricing page. All prices verified during submission week.

## Cursor

- Hobby: $0/month
  https://cursor.sh/pricing — verified 2026-05-08
- Pro: $20/user/month
  https://cursor.sh/pricing — verified 2026-05-08
- Business: $40/user/month
  https://cursor.sh/pricing — verified 2026-05-08
- Enterprise: custom pricing
  https://cursor.sh/pricing — verified 2026-05-08

## GitHub Copilot

- Individual: $10/user/month
  https://github.com/features/copilot#pricing — verified 2026-05-08
- Business: $19/user/month
  https://github.com/features/copilot#pricing — verified 2026-05-08
- Enterprise: $39/user/month
  https://github.com/features/copilot#pricing — verified 2026-05-08

## Claude (Anthropic)

- Free: $0
  https://www.anthropic.com/pricing — verified 2026-05-08
- Pro: $20/user/month
  https://www.anthropic.com/pricing — verified 2026-05-08
- Max: $100/user/month
  https://www.anthropic.com/pricing — verified 2026-05-08
- Team: $30/user/month (minimum 5 seats)
  https://www.anthropic.com/pricing — verified 2026-05-08
- Enterprise: custom pricing
  https://www.anthropic.com/pricing — verified 2026-05-08

## ChatGPT (OpenAI)

- Free: $0
  https://openai.com/chatgpt/pricing — verified 2026-05-08
- Plus: $20/user/month
  https://openai.com/chatgpt/pricing — verified 2026-05-08
- Team: $30/user/month (minimum 2 seats)
  https://openai.com/chatgpt/pricing — verified 2026-05-08
- Enterprise: custom pricing
  https://openai.com/chatgpt/pricing — verified 2026-05-08

## Anthropic API

- Pay as you go — no fixed seat price
  https://www.anthropic.com/pricing — verified 2026-05-08
- Claude 3.5 Sonnet: $3/million input tokens, $15/million output tokens
  https://www.anthropic.com/pricing — verified 2026-05-08

## OpenAI API

- Pay as you go — no fixed seat price
  https://openai.com/api/pricing — verified 2026-05-08
- GPT-4o: $2.50/million input tokens, $10/million output tokens
  https://openai.com/api/pricing — verified 2026-05-08

## Gemini (Google)

- Free: $0
  https://one.google.com/about/plans — verified 2026-05-08
- Gemini Advanced: $19.99/user/month
  https://one.google.com/about/plans — verified 2026-05-08
- API: pay as you go
  https://ai.google.dev/pricing — verified 2026-05-08

## Windsurf (Codeium)

- Free: $0
  https://windsurf.com/pricing — verified 2026-05-08
- Pro: $15/user/month
  https://windsurf.com/pricing — verified 2026-05-08
- Team: $35/user/month
  https://windsurf.com/pricing — verified 2026-05-08
- Enterprise: custom pricing
  https://windsurf.com/pricing — verified 2026-05-08

## Audit Engine Rules Based on This Data

1. If user pays more than official price by more than $5 — flag as overpaying
2. If user is on Team plan with fewer than 5 seats — flag as overkill
3. If user is on Business plan with 1 seat — flag as overkill
4. If user is on API with spend over $200/mo — flag credits opportunity at 20% saving estimate
5. If tool does not fit primary use case — suggest better alternative with cost comparison

All rules are hardcoded. AI is not used for audit logic because
the recommendations need to be verifiable by a finance person.
