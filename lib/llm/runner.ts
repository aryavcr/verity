import { getTargetModel } from './providers';
import { scoreTestCase } from './judge';
import { TestCase, EvalScores, JudgeReasoning } from '@/lib/types';
import { CONCURRENCY_LIMIT } from '@/lib/constants';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

//defined types

export interface TestCaseResult {
  testCaseId: string;
  modelOutput: string;
  scores: EvalScores;
  reasoning: JudgeReasoning;
}

export interface TestCaseError {
  testCaseId: string;
  error: string;
}

//realtime updating runner which streams results as they come in

export async function runEval(
  promptTemplate: string,
  modelId: string,
  testCases: TestCase[],
  onResult: (result: TestCaseResult) => void,
  onError: (error: TestCaseError) => void,
): Promise<void> {
  const model = getTargetModel(modelId);

  const tasks = testCases.map((testCase) => async () => {
    try {
      const output = await runWithRetry(async () => {
        const response = await model.invoke([
          new SystemMessage(promptTemplate),
          new HumanMessage(testCase.input),
        ]);
        return extractModelOutput(response);
      });

      const { scores, reasoning } = await scoreTestCase(
        {
          input: testCase.input,
          referenceAnswer: testCase.referenceAnswer,
        },
        output
      );

      onResult({
        testCaseId: testCase.id,
        modelOutput: output,
        scores,
        reasoning,
      });
    } catch (err) {
      onError({
        testCaseId: testCase.id,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  await runWithConcurrency(tasks, CONCURRENCY_LIMIT);
}

async function runWithConcurrency(
  tasks: (() => Promise<void>)[],
  concurrency: number
): Promise<void> {
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const p: Promise<void> = task().finally(() => {
      executing.delete(p);
    });
    executing.add(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }

    await sleep(13000);
  }

  await Promise.all(executing);
}

async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await sleep(13000);
      return runWithRetry(fn, retries - 1);
    }
    throw err;
  }
}

// final extracted output from model response 

function extractModelOutput(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'content' in response
  ) {
    const content = (response as { content: unknown }).content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      const first = content[0];
      if (first && typeof first === 'object' && 'text' in first) {
        return String((first as { text: unknown }).text);
      }
    }
  }
  return String(response);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}