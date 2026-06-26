// model provider client factories for all supported backends
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { FALLBACK_TARGET_MODEL } from "@/lib/constants/models";

export function getModel(
  modelId: string,
  provider: string,
  overrideKey?: string,
) {
  if (provider === "openrouter") {
    const client = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: overrideKey ?? process.env.OPENROUTER_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "google") {
    const client = createGoogleGenerativeAI({
      apiKey: overrideKey ?? process.env.GOOGLE_AI_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "groq") {
    const client = createGroq({
      apiKey: overrideKey ?? process.env.GROQ_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "openai") {
    const client = createOpenAI({
      apiKey: overrideKey ?? process.env.OPENAI_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "anthropic") {
    const client = createAnthropic({
      apiKey: overrideKey ?? process.env.ANTHROPIC_API_KEY!,
    });
    return client(modelId);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export function getOpenRouterTargetWithFallback(
  modelId: string,
  overrideKey?: string,
) {
  const client = createOpenRouter({
    apiKey: overrideKey ?? process.env.OPENROUTER_API_KEY!,
  });
  const models =
    modelId === FALLBACK_TARGET_MODEL
      ? [modelId] // avoid self-fallback
      : [modelId, FALLBACK_TARGET_MODEL];
  return client(modelId, { extraBody: { models } });
}
