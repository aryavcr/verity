// USD per 1,000,000 tokens. Unknown models contribute 0 cost (cost is shown only when known — honest).
type Price = { in: number; out: number };

export const MODEL_PRICING: Record<string, Price> = {
  "llama-3.3-70b-versatile": { in: 0.59, out: 0.79 },
  "gemini-2.5-flash": { in: 0, out: 0 },
  "deepseek/deepseek-v4-flash": { in: 0.09, out: 0.18 },
  "deepseek-v4-flash": { in: 0.09, out: 0.18 },
  "google/gemini-3.1-flash-lite": { in: 0.1, out: 0.4 },
  "gemini-3.1-flash-lite": { in: 0.1, out: 0.4 },
  "mistralai/ministral-8b-2512": { in: 0.1, out: 0.1 },
  "ministral-8b-2512": { in: 0.1, out: 0.1 },
};

export function costUsd(modelId: string, inT: number, outT: number): number {
  const p =
    MODEL_PRICING[modelId] ??
    MODEL_PRICING[modelId.split("/").pop()?.replace(":free", "") ?? ""];
  if (!p) return 0;
  return (inT / 1_000_000) * p.in + (outT / 1_000_000) * p.out;
}
