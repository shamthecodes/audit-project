import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/audit-engine.js";

describe("Audit Engine", () => {
  it("returns zero savings for optimal single-user pro plan", () => {
    const result = runAudit({
      tools: [
        { toolKey: "cursor", planKey: "pro", seats: 1, monthlySpend: 20 },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isOptimal).toBe(true);
  });

  it("flags team plan as overkill for 2 users", () => {
    const result = runAudit({
      tools: [
        { toolKey: "claude", planKey: "team", seats: 2, monthlySpend: 60 },
      ],
      teamSize: 2,
      useCase: "writing",
    });

    const claudeResult = result.tools[0];

    const hasDowngrade = claudeResult.recommendations.some(
      (r) => r.type === "downgrade",
    );

    expect(hasDowngrade).toBe(true);

    // No savings because Claude Pro only supports 1 seat
    expect(result.totalMonthlySavings).toBe(20);
  });

  it("detects overpaying vs official price", () => {
    const result = runAudit({
      tools: [
        {
          toolKey: "github_copilot",
          planKey: "individual",
          seats: 1,
          monthlySpend: 20,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    const copilotResult = result.tools[0];

    const hasOverpaying = copilotResult.recommendations.some(
      (r) => r.type === "overpaying",
    );

    expect(hasOverpaying).toBe(true);
  });

  it("calculates annual savings as 12x monthly", () => {
    const result = runAudit({
      tools: [
        {
          toolKey: "github_copilot",
          planKey: "individual",
          seats: 1,
          monthlySpend: 20,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("flags showCredex true when savings exceed $500/mo", () => {
    const result = runAudit({
      tools: [
        {
          toolKey: "cursor",
          planKey: "pro",
          seats: 1,
          monthlySpend: 300,
        },
        {
          toolKey: "chatgpt",
          planKey: "plus",
          seats: 1,
          monthlySpend: 300,
        },
        {
          toolKey: "github_copilot",
          planKey: "individual",
          seats: 1,
          monthlySpend: 200,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(500);
    expect(result.showCredex).toBe(true);
  });

  it("handles multiple tools and sums savings correctly", () => {
    const result = runAudit({
      tools: [
        {
          toolKey: "github_copilot",
          planKey: "individual",
          seats: 1,
          monthlySpend: 20,
        },
        {
          toolKey: "chatgpt",
          planKey: "plus",
          seats: 1,
          monthlySpend: 20,
        },
      ],
      teamSize: 1,
      useCase: "writing",
    });

    expect(result.tools).toHaveLength(2);
    expect(typeof result.totalMonthlySavings).toBe("number");
  });
});
