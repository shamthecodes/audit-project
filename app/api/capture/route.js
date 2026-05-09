import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, companyName, role, result, auditId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Save lead to Supabase
    let leadData = {
      email,
      companyName: companyName || null,
      role: role || null,
      teamSize: result?.teamSize?.toString() || null,
    };

    if (auditId) {
      const auditExists = await prisma.audit.findUnique({
        where: { id: auditId },
      });
      if (auditExists) {
        leadData.auditId = auditId;
      }
    }

    if (leadData.auditId) {
      await prisma.lead.create({ data: leadData });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "SpendLens <audit-email@resend.dev>",
      to: ["shamthebussiness@gmail.com"], // your verified email
      replyTo: email, // user's email in reply-to
      subject: `AI Spend Audit for ${email} — $${result?.totalMonthlySavings || 0}/mo savings`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #10b981;">AI Spend Audit Report</h1>
          
          <p><strong>Requested by:</strong> ${email}</p>
          ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ""}
          ${role ? `<p><strong>Role:</strong> ${role}</p>` : ""}

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin:0; font-size: 28px; font-weight: bold; color: #065f46;">
              $${result?.totalMonthlySavings || 0}/mo potential savings
            </p>
            <p style="margin:4px 0 0; color: #6b7280;">
              $${result?.totalAnnualSavings || 0}/year
            </p>
          </div>

          <h2>Tool Breakdown</h2>
          ${(result?.tools || [])
            .map(
              (tool) => `
            <div style="border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin: 8px 0;">
              <strong>${tool.toolName}</strong> — ${tool.planName} — $${tool.currentMonthlySpend}/mo
              <p style="color: ${tool.status === "optimal" ? "#10b981" : "#f59e0b"}; margin: 4px 0 0; font-size: 14px;">
                ${tool.recommendations[0]?.message || ""}
              </p>
              ${tool.savings > 0 ? `<p style="color: #10b981; font-weight: bold; margin: 4px 0 0;">Save $${tool.savings.toFixed(0)}/mo</p>` : ""}
            </div>
          `,
            )
            .join("")}

          ${
            result?.showCredex
              ? `
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <strong>Qualifies for Credex consultation</strong>
              <p>$${result.totalMonthlySavings}/mo in savings — Credex can help capture more through discounted credits.</p>
              <a href="https://credex.rocks" style="color: #10b981;">credex.rocks →</a>
            </div>
          `
              : ""
          }

          ${auditId ? `<p><a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}">View shareable audit →</a></p>` : ""}

          <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
            Powered by SpendLens
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture error:", error.message);
    return NextResponse.json(
      { error: "Failed to capture lead", detail: error.message },
      { status: 500 },
    );
  }
}
