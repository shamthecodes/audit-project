import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  let auditData = {};

  try {
    auditData = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const topTool = [...(auditData.tools || [])].sort(
      (a, b) => b.savings - a.savings,
    )[0];

    const prompt = `You are a financial advisor specializing in AI tool costs for startups.
Given this AI spend audit, write a concise 100-word personalized summary paragraph.

Tools audited: ${auditData.tools?.map((t) => t.toolName).join(", ")}
Total monthly spend: $${auditData.totalCurrentSpend}
Total monthly savings possible: $${auditData.totalMonthlySavings}
Team size: ${auditData.teamSize}
Primary use case: ${auditData.useCase}
Biggest saving opportunity: ${topTool?.toolName || "N/A"}

Write a friendly, specific, actionable paragraph. Mention the biggest saving opportunity by name.
No bullet points. Plain paragraph only. Max 100 words.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Gemini error:", error);

    const fallback = `Your team is spending $${auditData.totalCurrentSpend || "N/A"}/month on AI tools. Based on your usage patterns, there are meaningful optimization opportunities available. Review the recommendations below to capture potential savings and ensure each tool in your stack is earning its place.`;

    return NextResponse.json({ summary: fallback });
  }
}
