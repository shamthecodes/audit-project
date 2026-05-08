import {
  PRICING_DATA,
  USE_CASE_TOOL_FIT,
  ALTERNATIVES,
} from "./pricing-data.js";

// ── helpers ──────────────────────────────────────────────────────────────────

function getExpectedMonthlySpend(toolKey, planKey, seats) {
  const tool = PRICING_DATA[toolKey];
  if (!tool) return null;
  const plan = tool.plans[planKey];
  if (!plan || plan.pricePerSeat === null) return null;
  return plan.pricePerSeat * seats;
}

function isPlanOverkillForSeats(toolKey, planKey, seats) {
  // Team plans need min 5 seats at Claude, min 2 at ChatGPT
  // If user has fewer seats than the plan is designed for, it's overkill
  if (planKey === "team" && seats < 5) return true;
  if (planKey === "business" && seats === 1) return true;
  return false;
}

function getCheaperSamePlan(toolKey, planKey, seats) {
  const tool = PRICING_DATA[toolKey];
  if (!tool) return null;

  const currentPlan = tool.plans[planKey];
  if (!currentPlan || currentPlan.pricePerSeat === null) return null;

  const planOrder = [
    "free",
    "hobby",
    "individual",
    "pro",
    "business",
    "team",
    "enterprise",
    "api",
  ];

  const currentIndex = planOrder.indexOf(planKey);
  if (currentIndex <= 0) return null;

  // Only suggest downgrade if seats fit in a cheaper plan
  for (let i = currentIndex - 1; i >= 0; i--) {
    const cheaperPlanKey = planOrder[i];
    const cheaperPlan = tool.plans[cheaperPlanKey];
    if (!cheaperPlan) continue;
    if (cheaperPlan.pricePerSeat === null) continue;

    // Skip if seats exceed max allowed for cheaper plan
    if (cheaperPlan.maxSeats !== null && seats > cheaperPlan.maxSeats) continue;

    // Only suggest if saving is meaningful (>$5/mo)
    const saving =
      (currentPlan.pricePerSeat - cheaperPlan.pricePerSeat) * seats;
    if (saving <= 5) continue;

    return {
      planKey: cheaperPlanKey,
      plan: cheaperPlan,
      monthlySavings: saving,
    };
  }

  return null;
}

function isToolFitForUseCase(toolKey, useCase) {
  const fitTools = USE_CASE_TOOL_FIT[useCase] || USE_CASE_TOOL_FIT.mixed;
  return fitTools.includes(toolKey);
}

function getAlternatives(toolKey, useCase) {
  const alts = ALTERNATIVES[toolKey];
  if (!alts) return [];
  return alts[useCase] || alts.mixed || [];
}

// ── main audit function ───────────────────────────────────────────────────────

export function runAudit(inputs) {
  const results = [];
  let totalMonthlySavings = 0;

  for (const entry of inputs.tools) {
    const { toolKey, planKey, seats, monthlySpend } = entry;
    const toolData = PRICING_DATA[toolKey];

    if (!toolData) continue;

    const currentPlan = toolData.plans[planKey];

    const toolResult = {
      toolKey,
      toolName: toolData.name,
      planKey,
      planName: currentPlan?.name || planKey,
      seats,
      currentMonthlySpend: monthlySpend,
      recommendations: [],
      savings: 0,
      status: "optimal",
    };

    const expectedSpend = getExpectedMonthlySpend(toolKey, planKey, seats);

    // ── Check 1: Overpaying vs official price ──
    // Only flag if they are paying MORE than official price
    if (
      expectedSpend !== null &&
      monthlySpend > expectedSpend &&
      monthlySpend - expectedSpend > 5
    ) {
      const overage = monthlySpend - expectedSpend;
      toolResult.recommendations.push({
        type: "overpaying",
        message: `You're paying $${monthlySpend}/mo but the official price for ${seats} seat(s) on ${currentPlan?.name} is $${expectedSpend}/mo. Check your billing — you may be on an old plan.`,
        savings: overage,
      });
      toolResult.savings += overage;
      toolResult.status = "overspending";
    }

    // ── Check 2: Plan overkill for team size ──
    if (isPlanOverkillForSeats(toolKey, planKey, seats)) {
      const cheaper = getCheaperSamePlan(toolKey, planKey, seats);
      if (cheaper) {
        toolResult.recommendations.push({
          type: "downgrade",
          message: `${toolData.name} ${currentPlan?.name} plan is designed for larger teams. With only ${seats} user(s), downgrade to ${cheaper.plan.name} and save $${cheaper.monthlySavings.toFixed(0)}/mo.`,
          savings: cheaper.monthlySavings,
        });
        toolResult.savings += cheaper.monthlySavings;
        toolResult.status = "warning";
      } else {
        // No cheaper plan found but still overkill — flag it
        toolResult.recommendations.push({
          type: "downgrade",
          message: `${toolData.name} ${currentPlan?.name} plan is designed for larger teams. Consider a lower tier plan for ${seats} user(s).`,
          savings: 0,
        });
        toolResult.status = "warning";
      }
    }

    // ── Check 3: API high spend ──
    if (planKey === "api" && monthlySpend > 200) {
      const potentialSaving = monthlySpend * 0.2;
      toolResult.recommendations.push({
        type: "credits",
        message: `At $${monthlySpend}/mo on ${toolData.name} API, discounted AI credits could save you ~$${potentialSaving.toFixed(0)}/mo (est. 20%).`,
        savings: potentialSaving,
      });
      toolResult.savings += potentialSaving;
      toolResult.status = "warning";
    }

    // ── Check 4: Poor fit for use case ──
    if (!isToolFitForUseCase(toolKey, inputs.useCase)) {
      const alts = getAlternatives(toolKey, inputs.useCase);
      if (alts.length > 0) {
        const alt = alts[0];
        const altTool = PRICING_DATA[alt.tool];
        const altPlan = altTool?.plans[alt.plan];
        const altCost = altPlan?.pricePerSeat
          ? altPlan.pricePerSeat * seats
          : 0;
        const potentialSaving = monthlySpend - altCost;

        toolResult.recommendations.push({
          type: "switch",
          message: `For ${inputs.useCase} workflows, ${altTool?.name} ${altPlan?.name} fits better. ${alt.reason}. Est. saving: $${Math.max(0, potentialSaving).toFixed(0)}/mo.`,
          savings: Math.max(0, potentialSaving),
        });

        if (potentialSaving > 0) {
          toolResult.savings += potentialSaving;
          toolResult.status = "warning";
        }
      }
    }

    // ── No issues found ──
    if (toolResult.recommendations.length === 0) {
      toolResult.recommendations.push({
        type: "optimal",
        message: `You're on the right plan for your usage. No changes needed.`,
        savings: 0,
      });
      toolResult.status = "optimal";
    }

    totalMonthlySavings += toolResult.savings;
    results.push(toolResult);
  }

  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = inputs.tools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0,
  );

  return {
    tools: results,
    totalCurrentSpend: parseFloat(totalCurrentSpend.toFixed(2)),
    totalMonthlySavings: parseFloat(totalMonthlySavings.toFixed(2)),
    totalAnnualSavings: parseFloat(totalAnnualSavings.toFixed(2)),
    teamSize: inputs.teamSize,
    useCase: inputs.useCase,
    showCredex: totalMonthlySavings > 500,
    isOptimal: totalMonthlySavings < 100,
  };
}
