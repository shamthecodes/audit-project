"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export default function LeadCapture({ result, auditId, onSuccess }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate email
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("That email doesn't look right. Please check and try again.");
      return;
    }

    setLoading(true);

    try {
      // Save lead to backend (Supabase via Prisma)
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          result,
          auditId,
        }),
      });

      // Send email directly to user via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          to_name: company || "there",
          monthly_savings: result.totalMonthlySavings.toFixed(0),
          annual_savings: result.totalAnnualSavings.toFixed(0),
          current_spend: result.totalCurrentSpend.toFixed(0),
          tool_count: result.tools.length,
          use_case: result.useCase,
          show_credex: result.showCredex ? "true" : "false",
          audit_url: auditId
            ? `${window.location.origin}/audit/${auditId}`
            : window.location.origin,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Report sent! Check your inbox.");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong sending the email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`bg-gray-800 border-gray-700 text-white ${
              email && !validateEmail(email) ? "border-red-500" : ""
            }`}
          />
          {email && !validateEmail(email) && (
            <p className="text-red-400 text-xs">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Company (optional)</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Role (optional)</Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="CTO, Engineering Manager..."
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Sending your report...
          </span>
        ) : (
          "Send me the report"
        )}
      </Button>

      <p className="text-gray-500 text-xs text-center">
        No spam. One email with your audit report. Unsubscribe anytime.
      </p>
    </form>
  );
}
