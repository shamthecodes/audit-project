"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeadCapture({ result, onSuccess }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          result,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      onSuccess();
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
            className="bg-gray-800 border-gray-700 text-white"
          />
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

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
      >
        {loading ? "Sending..." : "Send me the report"}
      </Button>

      <p className="text-gray-500 text-xs text-center">
        No spam. Your email is only used to send this report.
      </p>
    </form>
  );
}
