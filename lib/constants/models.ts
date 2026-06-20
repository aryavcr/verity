export type ModelOption = {
  id: string;
  name: string;
  provider: "openrouter" | "google" | "groq";
  contextWindow: number;
  free: boolean;
};

export const MODELS: ModelOption[] = [
  //openrouter(only free for now)
  {
    id: "openrouter/free",
    name: "Auto (Free Router)",
    provider: "openrouter",
    contextWindow: 200000,
    free: true,
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super 120B",
    provider: "openrouter",
    contextWindow: 1000000,
    free: true,
  },
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "Nemotron 3 Nano 30B",
    provider: "openrouter",
    contextWindow: 256000,
    free: true,
  },
  {
    id: "poolside/laguna-m.1:free",
    name: "Laguna M.1 (Code)",
    provider: "openrouter",
    contextWindow: 262000,
    free: true,
  },
  {
    id: "poolside/laguna-xs.2:free",
    name: "Laguna XS.2",
    provider: "openrouter",
    contextWindow: 262000,
    free: true,
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "GPT-OSS 120B",
    provider: "openrouter",
    contextWindow: 131000,
    free: true,
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT-OSS 20B",
    provider: "openrouter",
    contextWindow: 131000,
    free: true,
  },
  {
    id: "z-ai/glm-4.5-air:free",
    name: "GLM 4.5 Air",
    provider: "openrouter",
    contextWindow: 131000,
    free: true,
  },
  {
    id: "moonshotai/kimi-k2.6:free",
    name: "Kimi K2.6",
    provider: "openrouter",
    contextWindow: 262000,
    free: true,
  },
  {
    id: "google/gemma-4-31b-it:free",
    name: "Gemma 4 31B",
    provider: "openrouter",
    contextWindow: 262000,
    free: true,
  },
  {
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "openrouter",
    contextWindow: 1000000,
    free: false,
  },

  //groq free tier
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    contextWindow: 131072,
    free: true,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    provider: "groq",
    contextWindow: 131072,
    free: true,
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B (Groq)",
    provider: "groq",
    contextWindow: 131072,
    free: true,
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT-OSS 20B (Groq)",
    provider: "groq",
    contextWindow: 131072,
    free: true,
  },
  {
    id: "groq/compound",
    name: "Groq Compound",
    provider: "groq",
    contextWindow: 131072,
    free: true,
  },

  //aistudio free
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
];

export const FALLBACK_TARGET_MODEL = "mistralai/ministral-8b-2512";

export function getModelsByProvider(
  provider: "openrouter" | "google" | "groq",
) {
  return MODELS.filter((m) => m.provider === provider);
}

export function getModelById(id: string) {
  return MODELS.find((m) => m.id === id);
}
