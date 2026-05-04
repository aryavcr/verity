import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MODEL_OPTIONS } from '@/lib/constants';

export function getTargetModel(modelId: string) {
  const model = MODEL_OPTIONS.find((m) => m.id === modelId);
  if (!model) throw new Error(`Unknown model: ${modelId}`);

  switch (model.provider) {
    case 'openai':
      return new ChatOpenAI({
        modelName: model.id,
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

    case 'anthropic':
      return new ChatAnthropic({
        modelName: model.id,
        temperature: 0.7,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      });

    case 'google':
      return new ChatGoogleGenerativeAI(model.id, {
        temperature: 0.7,
      });

    default:
      throw new Error(`Unknown provider: ${model.provider}`);
  }
}

export function getJudgeModel() {
  return new ChatGoogleGenerativeAI(
    process.env.JUDGE_MODEL ?? 'gemini-2.0-flash',
    { temperature: 0.1 }
  );
}