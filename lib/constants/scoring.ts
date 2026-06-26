// scoring thresholds, default model selections, and score utility functions
export const PASS_THRESHOLD = 7.0;
export const PASS_PERCENT = 70;
export const SCORE_MAX = 10;
export const JUDGE_MODEL = "deepseek/deepseek-v4-flash";
export const JUDGE_PROVIDER = "openrouter";
export const TEST_GEN_MODEL = "google/gemini-3.1-flash-lite";
export const TEST_GEN_PROVIDER = "openrouter";

export const JUDGE_MODEL_OPTIONS: { id: string; name: string; provider: string }[] = [
  { id: "deepseek/deepseek-v4-flash",    name: "DeepSeek V4 Flash",    provider: "openrouter" },
  { id: "google/gemini-3.1-flash-lite",  name: "Gemini 3.1 Flash-Lite", provider: "openrouter" },
  { id: "llama-3.3-70b-versatile",       name: "Llama 3.3 70B (Groq)",  provider: "groq" },
];

export const TEST_GEN_MODEL_OPTIONS: { id: string; name: string; provider: string }[] = [
  { id: "google/gemini-3.1-flash-lite",  name: "Gemini 3.1 Flash-Lite", provider: "openrouter" },
  { id: "deepseek/deepseek-v4-flash",    name: "DeepSeek V4 Flash",     provider: "openrouter" },
  { id: "llama-3.3-70b-versatile",       name: "Llama 3.3 70B (Groq)",  provider: "groq" },
];

// resolve judge option, fall back to default
export function resolveJudge(id: string): { id: string; provider: string } {
  const m = JUDGE_MODEL_OPTIONS.find((o) => o.id === id);
  return m ? { id: m.id, provider: m.provider } : { id: JUDGE_MODEL, provider: JUDGE_PROVIDER };
}

// resolve test generator option, fall back to default
export function resolveTestGen(id: string): { id: string; provider: string } {
  const m = TEST_GEN_MODEL_OPTIONS.find((o) => o.id === id);
  return m ? { id: m.id, provider: m.provider } : { id: TEST_GEN_MODEL, provider: TEST_GEN_PROVIDER };
}

// vendor family detection for same-family judge guard
export function modelVendor(id: string): string {
  const s = id.toLowerCase();
  if (s.includes("deepseek")) return "deepseek";
  if (s.includes("gemini") || s.includes("gemma") || s.includes("google")) return "google";
  if (s.includes("gpt-oss") || s.includes("gpt") || s.includes("openai") || s.includes("nemotron") || s.includes("nvidia")) return "openai-nvidia";
  if (s.includes("claude") || s.includes("anthropic")) return "anthropic";
  if (s.includes("llama") || s.includes("meta")) return "meta";
  if (s.includes("qwen")) return "qwen";
  if (s.includes("kimi") || s.includes("moonshot")) return "moonshot";
  if (s.includes("glm") || s.includes("z-ai")) return "zai";
  return s.split("/")[0] ?? s;
}

// pick a judge from a different vendor than the model under test
export function pickJudgeAvoidingFamily(requestedJudgeId: string, modelUnderTestId: string): { id: string; provider: string } {
  const requested = resolveJudge(requestedJudgeId);
  if (modelVendor(requested.id) !== modelVendor(modelUnderTestId)) return requested;
  const alt = JUDGE_MODEL_OPTIONS.find((o) => modelVendor(o.id) !== modelVendor(modelUnderTestId));
  return alt ? { id: alt.id, provider: alt.provider } : requested;
}

export function scoreClass(score: number): string {
  if (score >= 8) return "score-high";
  if (score >= 6) return "score-mid";
  return "score-low";
}

export function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 5) return "Adequate";
  if (score >= 3) return "Poor";
  return "Failing";
}

export function avgColor(avgPercent: number): string {
  if (avgPercent >= PASS_PERCENT) return "var(--success)";
  if (avgPercent >= 50) return "var(--warning)";
  return "var(--destructive)";
}
