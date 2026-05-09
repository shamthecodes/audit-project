// @ts-nocheck
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
  {
    key: "anthropic_api",
    name: "Anthropic API",
    plans: ["api"],
  },
  {
    key: "openai_api",
    name: "OpenAI API",
    plans: ["api"],
  },
  {
    key: "gemini",
    name: "Gemini",
    plans: ["free", "pro", "api"],
  },
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
  function getInitialData() {
    if (typeof window === "undefined") {
      return {
        tools: [defaultTool()],
        teamSize: "1",
        useCase: "coding",
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        return {
          tools: parsed.tools || [defaultTool()],
          teamSize: parsed.teamSize || "1",
          useCase: parsed.useCase || "coding",
        };
      }
    } catch (e) {
      // ignore
    }

    return {
      tools: [defaultTool()],
      teamSize: "1",
      useCase: "coding",
    };
  }

  const initialData = getInitialData();

  const [tools, setTools] = useState(initialData.tools);
  const [teamSize, setTeamSize] = useState(initialData.teamSize);
  const [useCase, setUseCase] = useState(initialData.useCase);

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tools, teamSize, useCase }),
      );
    } catch (e) {
      // ignore
    }
  }, [tools, teamSize, useCase]);

  function addTool() {
    setTools((prev) => [...prev, defaultTool()]);
  }

  function removeTool(id) {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTool(id, field, value) {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        // Auto-reset plan when tool changes
        if (field === "toolKey") {
          const toolDef = TOOLS.find((tl) => tl.key === value);
          updated.planKey = toolDef?.plans[0] || "pro";
        }
        return updated;
      }),
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
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
            <Label className="text-gray-300">Team Size</Label>
            <Input
              type="number"
              min="1"
              max="10000"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
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

        {tools.map((tool, index) => (
          <Card key={tool.id} className="bg-gray-900 border-gray-800">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
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
                    className="bg-gray-800 border-gray-700 text-white text-sm"
                  />
                </div>

                {/* Monthly spend */}
                <div className="space-y-1">
                  <Label className="text-gray-400 text-xs">
                    Monthly Spend ($)
                  </Label>
                  <div className="flex gap-2">
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
                      className="bg-gray-800 border-gray-700 text-white text-sm"
                    />
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
        ))}

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
          "Analyzing..."
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Run My Free Audit
          </>
        )}
      </Button>
    </form>
  );
}
