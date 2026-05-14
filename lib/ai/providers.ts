import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";

export function getModel(modelId: string, provider: string) {
  if (provider === "openrouter") {
    const client = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "google") {
    const client = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    });
    return client(modelId);
  }

  if (provider === "groq") {
    const client = createGroq({
      apiKey: process.env.GROQ_API_KEY!,
    });
    return client(modelId);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

//groq for now, need to change to some paid option after deploying
export function getJudgeModel() {
  const client = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
  });
  return client("llama-3.3-70b-versatile");
}
