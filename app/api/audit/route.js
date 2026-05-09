import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aj } from "@/lib/arcjet";

export async function POST(request) {
  // Rate limiting
  const decision = await aj.protect(request, { requested: 1 });
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      tools,
      totalMonthlySavings,
      totalAnnualSavings,
      totalCurrentSpend,
      teamSize,
      useCase,
    } = body;

    const audit = await prisma.audit.create({
      data: {
        tools: tools,
        totalMonthlySavings,
        totalAnnualSavings,
        isPublic: true,
      },
    });

    return NextResponse.json({ id: audit.id });
  } catch (error) {
    console.error("Audit save error:", error);
    return NextResponse.json(
      { error: "Failed to save audit" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    const audit = await prisma.audit.findUnique({ where: { id } });
    if (!audit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(audit);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch audit" },
      { status: 500 },
    );
  }
}
