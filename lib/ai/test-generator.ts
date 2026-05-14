/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText } from "ai";
import { getModel } from "./providers";

export type GeneratedTestCase = {
  label: string;
  input: string;
};

export async function generateTestCases(
  systemPrompt: string,
  modelId: string,
  provider: string,
  count = 8,
): Promise<GeneratedTestCase[]> {
  const { text } = await generateText({
    model: getModel(modelId, provider),
    prompt: `You are a test case generator for ai system prompts.

Given this system prompt:
"""
${systemPrompt}
"""

Generate exactly ${count} diverse test inputs = realistic user messages. Include a mix of typical, edge-case, complex, and adversarial inputs.

For each test case, provide:
- "label": a 2-word descriptive label (e.g. "Refund request", "Login issue", "Billing error")
- "input": the full realistic user message

Respond with ONLY a JSON array, no markdown, no explanation:
[{"label": "Short label", "input": "Full user message here"}, ...]`,
  });

  try {
    const cleaned = text.replace(/```json?\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, count).map((tc: any) => ({
        label: String(tc.label || "Test case").slice(0, 30),
        input: String(tc.input || tc.label || ""),
      }));
    }
  } catch {}

  //fallback
  return text
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((l) => l.length > 10)
    .slice(0, count)
    .map((input, i) => ({ label: `Test ${i + 1}`, input }));
}
