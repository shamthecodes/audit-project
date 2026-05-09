"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Share2,
  Mail,
} from "lucide-react";
import LeadCapture from "@/components/LeadCapture";

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

function RecommendationTypeLabel({ type }) {
  const map = {
    overpaying: { label: "Overpaying", color: "text-red-400" },
    downgrade: { label: "Downgrade Available", color: "text-yellow-400" },
    switch: { label: "Better Alternative", color: "text-blue-400" },
    credits: { label: "Credits Opportunity", color: "text-purple-400" },
    optimal: { label: "Already Optimal", color: "text-emerald-400" },
  };
  const item = map[type] || { label: type, color: "text-gray-400" };
  return (
    <span className={`text-xs font-semibold uppercase ${item.color}`}>
      {item.label}
    </span>
  );
}

export default function AuditResults({ result, onReset, auditId }) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const isGoodSavings = result.totalMonthlySavings >= 100;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Run another audit
      </button>

      {/* AI Summary */}
      {result.summary && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              `&rdquo;`{result.summary}`&rdquo;`
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hero savings card */}
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
                ${result.totalMonthlySavings.toFixed(0)}
                <span className="text-2xl text-gray-400 font-normal">/mo</span>
              </div>
              <div className="text-emerald-400 text-xl font-semibold mb-2">
                ${result.totalAnnualSavings.toFixed(0)} saved per year
              </div>
              <p className="text-gray-400 text-sm">
                You&apos;re currently spending ${result.totalCurrentSpend}/mo
                across {result.tools.length} tool
                {result.tools.length > 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">
                You&apos;re spending well
              </div>
              <p className="text-gray-400">
                Your AI tool spend looks optimized for your team size and use
                case. Total spend: ${result.totalCurrentSpend}/mo
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Credex CTA for high savings */}
      {result.showCredex && (
        <Card className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-emerald-500/30">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-emerald-400 font-semibold text-sm mb-1">
                  Powered by Credex
                </div>
                <h3 className="text-white font-bold text-lg">
                  Capture even more savings with discounted AI credits
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Credex sources discounted Cursor, Claude, and ChatGPT credits
                  from companies that overforecast. Real discounts, same
                  products.
                </p>
              </div>
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shrink-0"
                onClick={() => setShowLeadCapture(true)}
              >
                Book a Credex Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per tool breakdown */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold text-lg">
          Tool-by-Tool Breakdown
        </h2>

        {result.tools.map((tool, index) => (
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
                  <span className="text-gray-400 text-sm">
                    ${tool.currentMonthlySpend}/mo
                  </span>
                  <StatusBadge status={tool.status} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              {tool.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <RecommendationTypeLabel type={rec.type} />
                    {rec.savings > 0 && (
                      <span className="text-emerald-400 text-sm font-semibold">
                        Save ${rec.savings.toFixed(0)}/mo
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{rec.message}</p>
                </div>
              ))}

              {tool.savings > 0 && (
                <div className="text-right text-xs text-gray-500">
                  Total potential saving on this tool: $
                  {tool.savings.toFixed(0)}/mo · $
                  {(tool.savings * 12).toFixed(0)}/yr
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead capture */}
      {!leadCaptured && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {!showLeadCapture ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold">
                    {isGoodSavings
                      ? "Get this report in your inbox"
                      : "Get notified when new optimizations apply to your stack"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Free. No spam. One email with your full audit report.
                  </p>
                </div>
                <Button
                  onClick={() => setShowLeadCapture(true)}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 shrink-0"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email me this report
                </Button>
              </div>
            ) : (
              <LeadCapture
                result={result}
                auditId={auditId}
                onSuccess={() => setLeadCaptured(true)}
              />
            )}
          </CardContent>
        </Card>
      )}

      {leadCaptured && (
        <Card className="bg-emerald-950/30 border-emerald-500/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Report sent!</p>
            <p className="text-gray-400 text-sm">
              Check your inbox for your full audit report.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Share */}
      {auditId && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/audit/${auditId}`,
              );
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Copy shareable link
          </Button>
        </div>
      )}
    </div>
  );
}
