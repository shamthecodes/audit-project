import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { aj } from "@/lib/arcjet";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  // Rate limiting
  const decision = await aj.protect(request, { requested: 1 });
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, companyName, role, result, auditId } = body;

    // Save lead to DB
    await prisma.lead.create({
      data: {
        email,
        companyName: companyName || null,
        role: role || null,
        teamSize: result?.teamSize?.toString() || null,
        auditId: auditId,
      },
    });

    // Send email via Resend
    await resend.emails.send({
      from: "SpendLens <onboarding@resend.dev>",
      to: email,
      subject: `Your AI Spend Audit — $${result.totalMonthlySavings}/mo in potential savings`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #10b981;">Your AI Spend Audit Report</h1>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin:0; font-size: 24px; font-weight: bold;">
              $${result.totalMonthlySavings}/mo potential savings
            </p>
            <p style="margin:4px 0 0; color: #6b7280;">
              $${result.totalAnnualSavings}/year if you act on all recommendations
            </p>
          </div>

          <h2>Tool Breakdown</h2>
          ${result.tools
            .map(
              (tool) => `
            <div style="border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin: 8px 0;">
              <strong>${tool.toolName}</strong> — ${tool.planName} — $${tool.currentMonthlySpend}/mo
              <p style="color: ${tool.status === "optimal" ? "#10b981" : "#f59e0b"}; margin: 4px 0 0;">
                ${tool.recommendations[0]?.message}
              </p>
            </div>
          `,
            )
            .join("")}

          ${
            result.showCredex
              ? `
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <strong>You qualify for a Credex consultation</strong>
              <p>With $${result.totalMonthlySavings}/mo in potential savings, Credex can help you access discounted AI credits.</p>
              <a href="https://credex.rocks" style="color: #10b981;">Book a free consultation →</a>
            </div>
          `
              : ""
          }

          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
            Powered by SpendLens — Free AI Spend Audits for Startups
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 },
    );
  }
}
