import { MODELS, type ModelOption } from "./models";

// best & cheapest option
export const DEFAULT_IMPROVER_MODEL = "openai/gpt-oss-120b";
export const DEFAULT_IMPROVER_PROVIDER: "groq" | "openrouter" | "google" =
  "groq";

// other choices of models with proven rewrite quality
const RECOMMENDED_IDS = new Set<string>([
  "openai/gpt-oss-120b", // groq thus fast
  "llama-3.3-70b-versatile", // groq thus fast
  "deepseek/deepseek-v4-flash", // not fast but cheap
  "openai/gpt-oss-120b:free", // openrouter mirror
  "nvidia/nemotron-3-super-120b-a12b:free",
  "z-ai/glm-4.5-air:free",
  "gemini-2.5-flash",
  "gemini-3-flash",
]);

export function getImproverModels(): ModelOption[] {
  const recommended = MODELS.filter((m) => RECOMMENDED_IDS.has(m.id));
  const others = MODELS.filter((m) => !RECOMMENDED_IDS.has(m.id));
  return [...recommended, ...others];
}

export function isRecommendedImprover(modelId: string): boolean {
  return RECOMMENDED_IDS.has(modelId);
}
