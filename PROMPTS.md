# LLM Prompts

## Tool Used

Gemini 1.5 Flash via Google Generative AI SDK

## Where It's Used

One place only — generating the 100-word personalized summary
on the audit results page. The audit math itself uses hardcoded
rules, not AI.

## The Full Prompt

You are a financial advisor specializing in AI tool costs for startups.
Given this AI spend audit, write a concise 100-word personalized
summary paragraph.
Tools audited: {tool names joined by comma}
Total monthly spend: ${totalCurrentSpend}
Total monthly savings possible: ${totalMonthlySavings}
Team size: {teamSize}
Primary use case: {useCase}
Biggest saving opportunity: {tool with highest savings}
Write a friendly, specific, actionable paragraph.
Mention the biggest saving opportunity by name.
No bullet points. Plain paragraph only. Max 100 words.
