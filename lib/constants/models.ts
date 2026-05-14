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
    id: "tencent/hy3-preview:free",
    name: "Tencent Hy3 Preview",
    provider: "openrouter",
    contextWindow: 262000,
    free: true,
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super 120B",
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
    id: "minimax/minimax-m2.5:free",
    name: "MiniMax M2.5",
    provider: "openrouter",
    contextWindow: 197000,
    free: true,
  },
  {
    id: "poolside/laguna-m.1:free",
    name: "Laguna M.1",
    provider: "openrouter",
    contextWindow: 131000,
    free: true,
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
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    provider: "groq",
    contextWindow: 8192,
    free: true,
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    contextWindow: 32768,
    free: true,
  },

  //aistudio free
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "google",
    contextWindow: 1048576,
    free: true,
  },
];

export function getModelsByProvider(
  provider: "openrouter" | "google" | "groq",
) {
  return MODELS.filter((m) => m.provider === provider);
}

export function getModelById(id: string) {
  return MODELS.find((m) => m.id === id);
}
