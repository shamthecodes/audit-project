export const PRICING_DATA = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { name: "Hobby", pricePerSeat: 0, maxSeats: 1 },
      pro: { name: "Pro", pricePerSeat: 20, maxSeats: 1 },
      business: { name: "Business", pricePerSeat: 40, maxSeats: null },
      enterprise: { name: "Enterprise", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://cursor.sh/pricing",
    verifiedDate: "2026-05-08",
  },

  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      individual: { name: "Individual", pricePerSeat: 10, maxSeats: 1 },
      business: { name: "Business", pricePerSeat: 19, maxSeats: null },
      enterprise: { name: "Enterprise", pricePerSeat: 39, maxSeats: null },
    },
    sourceUrl: "https://github.com/features/copilot#pricing",
    verifiedDate: "2026-05-08",
  },

  claude: {
    name: "Claude",
    plans: {
      free: { name: "Free", pricePerSeat: 0, maxSeats: 1 },
      pro: { name: "Pro", pricePerSeat: 20, maxSeats: 5 },
      max: { name: "Max", pricePerSeat: 100, maxSeats: 1 },
      team: { name: "Team", pricePerSeat: 30, minSeats: 5, maxSeats: null },
      enterprise: { name: "Enterprise", pricePerSeat: null, maxSeats: null },
      api: { name: "API Direct", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://www.anthropic.com/pricing",
    verifiedDate: "2026-05-08",
  },

  chatgpt: {
    name: "ChatGPT",
    plans: {
      free: { name: "Free", pricePerSeat: 0, maxSeats: 1 },
      plus: { name: "Plus", pricePerSeat: 20, maxSeats: 1 },
      team: { name: "Team", pricePerSeat: 30, minSeats: 2, maxSeats: null },
      enterprise: { name: "Enterprise", pricePerSeat: null, maxSeats: null },
      api: { name: "API Direct", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://openai.com/chatgpt/pricing",
    verifiedDate: "2026-05-08",
  },

  anthropic_api: {
    name: "Anthropic API",
    plans: {
      api: { name: "API Direct", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://www.anthropic.com/pricing",
    verifiedDate: "2026-05-08",
  },

  openai_api: {
    name: "OpenAI API",
    plans: {
      api: { name: "API Direct", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://openai.com/api/pricing",
    verifiedDate: "2026-05-08",
  },

  gemini: {
    name: "Gemini",
    plans: {
      free: { name: "Free", pricePerSeat: 0, maxSeats: 1 },
      pro: { name: "Gemini Advanced", pricePerSeat: 19.99, maxSeats: 1 },
      api: { name: "API Direct", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://one.google.com/about/plans",
    verifiedDate: "2026-05-08",
  },

  windsurf: {
    name: "Windsurf",
    plans: {
      free: { name: "Free", pricePerSeat: 0, maxSeats: 1 },
      pro: { name: "Pro", pricePerSeat: 15, maxSeats: 1 },
      team: { name: "Team", pricePerSeat: 35, maxSeats: null },
      enterprise: { name: "Enterprise", pricePerSeat: null, maxSeats: null },
    },
    sourceUrl: "https://windsurf.com/pricing",
    verifiedDate: "2026-05-08",
  },
};

export const USE_CASE_TOOL_FIT = {
  coding: ["cursor", "github_copilot", "windsurf", "claude", "chatgpt"],
  writing: ["claude", "chatgpt", "gemini"],
  data: ["chatgpt", "gemini", "claude", "openai_api"],
  research: ["claude", "chatgpt", "gemini", "anthropic_api"],
  mixed: ["claude", "chatgpt", "cursor", "gemini"],
};

export const ALTERNATIVES = {
  cursor: {
    coding: [
      {
        tool: "windsurf",
        plan: "pro",
        reason: "Similar AI coding features at $15/seat vs $20/seat",
      },
      {
        tool: "github_copilot",
        plan: "individual",
        reason: "Native IDE integration at $10/seat",
      },
    ],
  },
  github_copilot: {
    coding: [
      {
        tool: "cursor",
        plan: "pro",
        reason: "More powerful AI context at $20/seat",
      },
      {
        tool: "windsurf",
        plan: "pro",
        reason: "Similar capability at $15/seat",
      },
    ],
  },
  chatgpt: {
    writing: [
      {
        tool: "claude",
        plan: "pro",
        reason: "Better long-form writing at same price",
      },
    ],
    coding: [
      {
        tool: "cursor",
        plan: "pro",
        reason: "Purpose-built for coding workflows",
      },
    ],
  },
  claude: {
    coding: [
      {
        tool: "cursor",
        plan: "pro",
        reason: "Purpose-built coding IDE with AI built in",
      },
    ],
  },
};
