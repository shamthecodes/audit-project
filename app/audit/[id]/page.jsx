import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// OG meta tags for link previews
export async function generateMetadata({ params }) {
  const audit = await getAudit(params.id);
  if (!audit) return { title: "Audit Not Found" };

  return {
    title: `AI Spend Audit — $${audit.totalMonthlySavings}/mo savings found`,
    description: `This team could save $${audit.totalMonthlySavings}/mo ($${audit.totalAnnualSavings}/yr) on AI tools. Run your free audit at SpendLens.`,
    openGraph: {
      title: `AI Spend Audit — $${audit.totalMonthlySavings}/mo savings found`,
      description: `This team could save $${audit.totalMonthlySavings}/mo on AI tools. Run your free audit.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/audit/${params.id}`,
      siteName: "SpendLens",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `AI Spend Audit — $${audit.totalMonthlySavings}/mo savings found`,
      description: `This team could save $${audit.totalMonthlySavings}/mo on AI tools. Run your free audit at SpendLens.`,
    },
  };
}

async function getAudit(id) {
  try {
    const audit = await prisma.audit.findUnique({
      where: { id, isPublic: true },
    });
    return audit;
  } catch {
    return null;
  }
}

function StatusIcon({ status }) {
  if (status === "optimal")
    return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  if (status === "overspending")
    return <XCircle className="w-4 h-4 text-red-400" />;
  return null;
}

function StatusBadge({ status }) {
  if (status === "optimal")
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        Optimal
      </Badge>
    );
  if (status === "warning")
    return (
      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
        Can Improve
      </Badge>
    );
  if (status === "overspending")
    return (
      <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
        Overspending
      </Badge>
    );
  return null;
}

export default async function SharedAuditPage({ params }) {
  const audit = await getAudit(params.id);

  if (!audit) notFound();

  const tools = audit.tools;
  const isGoodSavings = audit.totalMonthlySavings >= 100;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">
              S
            </div>
            <span className="font-semibold text-lg">SpendLens</span>
          </div>
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
          >
            Run your free audit →
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Shared badge */}
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500 text-sm">Shared audit report</span>
        </div>

        {/* Hero */}
        <Card
          className={`border-2 ${
            isGoodSavings
              ? "bg-emerald-950/40 border-emerald-500/30"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          <CardContent className="pt-8 pb-8 text-center">
            {isGoodSavings ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    Savings Found
                  </span>
                </div>
                <div className="text-6xl font-bold text-white mb-1">
                  ${audit.totalMonthlySavings.toFixed(0)}
                  <span className="text-2xl text-gray-400 font-normal">
                    /mo
                  </span>
                </div>
                <div className="text-emerald-400 text-xl font-semibold mb-2">
                  ${audit.totalAnnualSavings.toFixed(0)} saved per year
                </div>
                <p className="text-gray-400 text-sm">
                  Across {tools.length} tool{tools.length > 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">
                  Spending well
                </div>
                <p className="text-gray-400">
                  This team&apos;s AI tool spend looks optimized.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        {audit.summary && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                &quot;{audit.summary}&quot;
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tool breakdown — no emails shown, public safe */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">
            Tool-by-Tool Breakdown
          </h2>

          {tools.map((tool, index) => (
            <Card
              key={`${tool.toolKey}-${index}`}
              className="bg-gray-900 border-gray-800"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={tool.status} />
                    <CardTitle className="text-white text-base">
                      {tool.toolName}
                    </CardTitle>
                    <span className="text-gray-500 text-sm">
                      {tool.planName} · {tool.seats} seat
                      {tool.seats > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={tool.status} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {tool.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase text-gray-400">
                        {rec.type}
                      </span>
                      {rec.savings > 0 && (
                        <span className="text-emerald-400 text-sm font-semibold">
                          Save ${rec.savings.toFixed(0)}/mo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{rec.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA to run own audit */}
        <Card className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-emerald-500/30">
          <CardContent className="pt-6 pb-6 text-center">
            <h3 className="text-white font-bold text-xl mb-2">
              How does your AI spend compare?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Run your own free audit in 2 minutes. No signup required.
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Run My Free Audit →
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
