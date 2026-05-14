import { generateText } from "ai";
import { getModel } from "./providers";

export async function judgeOutput(params: {
  systemPrompt: string;
  testInput: string;
  modelOutput: string;
  criterionLabel: string;
  criterionDescription: string;
  judgeModelId: string;
  judgeProvider: string;
}): Promise<{ score: number; reasoning: string }> {
  const { text } = await generateText({
    model: getModel(params.judgeModelId, params.judgeProvider),
    prompt: `You are an expert evaluator.

## System Prompt
${params.systemPrompt}

## Test Input
${params.testInput}

## Model Output
${params.modelOutput}

## Criterion
**${params.criterionLabel}**: ${params.criterionDescription}

Score 1-5. Respond with ONLY JSON, no markdown:
{"score": <number>, "reasoning": "<1-2 sentences>"}`,
  });

  try {
    const cleaned = text.replace(/```json?\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      score: Math.max(1, Math.min(5, Number(parsed.score) || 3)),
      reasoning: String(parsed.reasoning || "No reasoning"),
    };
  } catch {
    return { score: 3, reasoning: "Failed to parse judge response" };
  }
}
