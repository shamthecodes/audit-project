"use client";

import { useState, useEffect } from "react";
import SpendForm from "@/components/SpendForm";
import AuditResults from "@/components/AuditResults";
import { runAudit } from "@/lib/audit-engine";

export default function Home() {
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedAuditId, setSavedAuditId] = useState(null);

  async function handleAudit(formData) {
    setLoading(true);

    // Run audit locally
    const result = runAudit(formData);

    try {
      // Save to Supabase and get ID
      const saveRes = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const { id } = await saveRes.json();
      setSavedAuditId(id);

      // Get Gemini summary
      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const { summary } = await summaryRes.json();

      setAuditResult({ ...result, summary });
    } catch (error) {
      // Still show results even if API fails
      setAuditResult(result);
    }

    setLoading(false);
  }

  function handleReset() {
    setAuditResult(null);
    setSavedAuditId(null);
  }

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
          <span className="text-gray-400 text-sm">Free AI Spend Audit</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!auditResult ? (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Free — No signup required
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Are you overpaying for
                <span className="text-emerald-400"> AI tools?</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Enter what your team pays for AI tools today. Get an instant
                audit showing exactly where you&apos;re overspending and how to
                fix it.
              </p>
            </div>

            {/* Form */}
            <SpendForm onSubmit={handleAudit} loading={loading} />

            {/* Social proof */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              Used by 200+ startup founders and engineering managers
            </div>
          </>
        ) : (
          <AuditResults
            result={auditResult}
            onReset={handleReset}
            auditId={savedAuditId}
          />
        )}
      </div>
    </main>
  );
}
