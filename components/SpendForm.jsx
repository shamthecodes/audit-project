"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

const TOOLS = [
  {
    key: "cursor",
    name: "Cursor",
    plans: ["hobby", "pro", "business", "enterprise"],
  },
  {
    key: "github_copilot",
    name: "GitHub Copilot",
    plans: ["individual", "business", "enterprise"],
  },
  {
    key: "claude",
    name: "Claude",
    plans: ["free", "pro", "max", "team", "enterprise", "api"],
  },
  {
    key: "chatgpt",
    name: "ChatGPT",
    plans: ["free", "plus", "team", "enterprise", "api"],
  },
  { key: "anthropic_api", name: "Anthropic API", plans: ["api"] },
  { key: "openai_api", name: "OpenAI API", plans: ["api"] },
  { key: "gemini", name: "Gemini", plans: ["free", "pro", "api"] },
  {
    key: "windsurf",
    name: "Windsurf",
    plans: ["free", "pro", "team", "enterprise"],
  },
];

const USE_CASES = [
  { value: "coding", label: "Coding / Engineering" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data / Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

const STORAGE_KEY = "spendlens_form_data";

const defaultTool = () => ({
  id: crypto.randomUUID(),
  toolKey: "cursor",
  planKey: "pro",
  seats: 1,
  monthlySpend: 20,
});

export default function SpendForm({ onSubmit, loading }) {
  const [tools, setTools] = useState([defaultTool()]);
  const [teamSize, setTeamSize] = useState("1");
  const [useCase, setUseCase] = useState("coding");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tools, teamSize, useCase }),
      );
    } catch (e) {}
  }, [tools, teamSize, useCase]);

  function addTool() {
    setTools((prev) => [...prev, defaultTool()]);
  }

  function removeTool(id) {
    if (tools.length === 1) {
      toast.error("You need at least one tool to run an audit.");
      return;
    }
    setTools((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTool(id, field, value) {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        if (field === "toolKey") {
          const toolDef = TOOLS.find((tl) => tl.key === value);
          updated.planKey = toolDef?.plans[0] || "pro";
        }
        return updated;
      }),
    );
  }

  function validate() {
    // Team size validation
    const teamSizeNum = parseInt(teamSize);
    if (!teamSize || isNaN(teamSizeNum) || teamSizeNum < 1) {
      toast.error("Team size must be at least 1.");
      return false;
    }
    if (teamSizeNum > 100000) {
      toast.error(
        "Team size looks too large. Please enter a realistic number.",
      );
      return false;
    }

    // Tool validation
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const toolName =
        TOOLS.find((t) => t.key === tool.toolKey)?.name || tool.toolKey;

      if (!tool.seats || tool.seats < 1 || isNaN(tool.seats)) {
        toast.error(`${toolName}: Seats must be at least 1.`);
        return false;
      }

      if (tool.seats > 100000) {
        toast.error(`${toolName}: Seat count looks too large.`);
        return false;
      }

      if (
        tool.monthlySpend === "" ||
        tool.monthlySpend === null ||
        isNaN(tool.monthlySpend)
      ) {
        toast.error(
          `${toolName}: Please enter your monthly spend. Use 0 if it's free.`,
        );
        return false;
      }

      if (tool.monthlySpend < 0) {
        toast.error(`${toolName}: Monthly spend cannot be negative.`);
        return false;
      }

      if (tool.monthlySpend > 1000000) {
        toast.error(
          `${toolName}: Monthly spend looks too large. Please check the number.`,
        );
        return false;
      }
    }

    // Duplicate tool check
    const toolKeys = tools.map((t) => t.toolKey);
    const duplicates = toolKeys.filter(
      (key, index) => toolKeys.indexOf(key) !== index,
    );
    if (duplicates.length > 0) {
      const dupName = TOOLS.find((t) => t.key === duplicates[0])?.name;
      toast.warning(
        `You've added ${dupName} twice. Remove the duplicate or keep both if you have separate accounts.`,
      );
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      tools: tools.map(({ id, ...rest }) => rest),
      teamSize: parseInt(teamSize),
      useCase,
    });
  }

  function getPlansForTool(toolKey) {
    return TOOLS.find((t) => t.key === toolKey)?.plans || [];
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Your Team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">
              Team Size <span className="text-red-400">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              max="100000"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="e.g. 5"
              className={`bg-gray-800 border-gray-700 text-white ${
                teamSize &&
                (isNaN(parseInt(teamSize)) || parseInt(teamSize) < 1)
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            {teamSize &&
              (isNaN(parseInt(teamSize)) || parseInt(teamSize) < 1) && (
                <p className="text-red-400 text-xs">Must be at least 1</p>
              )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Primary Use Case</Label>
            <Select value={useCase} onValueChange={setUseCase}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {USE_CASES.map((uc) => (
                  <SelectItem
                    key={uc.value}
                    value={uc.value}
                    className="text-white"
                  >
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <div className="space-y-3">
        <Label className="text-gray-300 text-sm font-medium">
          AI Tools You Pay For
        </Label>

        {tools.map((tool, index) => {
          const hasSpendError =
            tool.monthlySpend < 0 || isNaN(tool.monthlySpend);
          const hasSeatError = tool.seats < 1 || isNaN(tool.seats);

          return (
            <Card
              key={`${tool.toolKey}-${index}`}
              className="bg-gray-900 border-gray-800"
            >
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
                  {/* Tool */}
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">Tool</Label>
                    <Select
                      value={tool.toolKey}
                      onValueChange={(v) => updateTool(tool.id, "toolKey", v)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {TOOLS.map((t) => (
                          <SelectItem
                            key={t.key}
                            value={t.key}
                            className="text-white"
                          >
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Plan */}
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">Plan</Label>
                    <Select
                      value={tool.planKey}
                      onValueChange={(v) => updateTool(tool.id, "planKey", v)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {getPlansForTool(tool.toolKey).map((plan) => (
                          <SelectItem
                            key={plan}
                            value={plan}
                            className="text-white capitalize"
                          >
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seats */}
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">Seats</Label>
                    <Input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) =>
                        updateTool(
                          tool.id,
                          "seats",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className={`bg-gray-800 border-gray-700 text-white text-sm ${
                        hasSeatError ? "border-red-500" : ""
                      }`}
                    />
                    {hasSeatError && (
                      <p className="text-red-400 text-xs">Min 1 seat</p>
                    )}
                  </div>

                  {/* Monthly spend */}
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">
                      Monthly Spend ($)
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          min="0"
                          value={tool.monthlySpend}
                          onChange={(e) =>
                            updateTool(
                              tool.id,
                              "monthlySpend",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0"
                          className={`bg-gray-800 border-gray-700 text-white text-sm ${
                            hasSpendError ? "border-red-500" : ""
                          }`}
                        />
                        {hasSpendError && (
                          <p className="text-red-400 text-xs">
                            Cannot be negative
                          </p>
                        )}
                        {tool.monthlySpend === 0 && !hasSpendError && (
                          <p className="text-gray-500 text-xs">
                            Free plan entered
                          </p>
                        )}
                      </div>
                      {tools.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTool(tool.id)}
                          className="text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          onClick={addTool}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 w-full border border-dashed border-gray-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add another tool
        </Button>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-6 text-base"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Analyzing your spend...
          </span>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Run My Free Audit
          </>
        )}
      </Button>

      <p className="text-center text-gray-500 text-xs">
        No account needed. Your data stays in your browser until you choose to
        share it.
      </p>
    </form>
  );
}
