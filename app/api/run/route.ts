import { generateText } from "ai";
import { getModel, getJudgeModel } from "@/lib/ai/providers";
import { generateTestCases } from "@/lib/ai/test-generator";
import { judgeOutput } from "@/lib/ai/judge";
import { DEFAULT_CRITERIA } from "@/lib/constants/criteria";

export const maxDuration = 120;

const BATCH_SIZE = 4;

export async function POST(req: Request) {
  const { systemPrompt, model: modelId, provider, criteria } = await req.json();
  const activeCriteria = criteria ?? DEFAULT_CRITERIA;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: Record<string, unknown>) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event, ...data })}\n\n`),
        );
      }

      try {
        send("status", { step: "generating-tests" });

        const generated = await generateTestCases(
          systemPrompt,
          "llama-3.3-70b-versatile",
          "groq",
          8,
        );

        const testCases = generated.map((tc, i) => ({
          id: `tc-${i}`,
          label: tc.label,
          input: tc.input,
          sort_order: i,
        }));

        send("test-cases", { testCases });
        send("status", { step: "running" });

        const processTestCase = async (tc: (typeof testCases)[number]) => {
          let modelOutput: string;
          let latencyMs = 0;

          try {
            const start = Date.now();
            const result = await generateText({
              model: getModel(modelId, provider),
              system: systemPrompt,
              prompt: tc.input,
            });
            latencyMs = Date.now() - start;
            modelOutput = result.text;
          } catch (err) {
            modelOutput = `[Error: ${err instanceof Error ? err.message : "Unknown"}]`;
          }

          send("model-output", {
            testCaseId: tc.id,
            output: modelOutput,
            latencyMs,
          });

          //judge is groq for now
          await Promise.all(
            activeCriteria.map(
              async (criterion: {
                key: string;
                label: string;
                description: string;
              }) => {
                try {
                  const result = await judgeOutput({
                    systemPrompt,
                    testInput: tc.input,
                    modelOutput,
                    criterionLabel: criterion.label,
                    criterionDescription: criterion.description,
                    judgeModelId: "llama-3.3-70b-versatile",
                    judgeProvider: "groq",
                  });
                  send("result", {
                    testCaseId: tc.id,
                    criterionKey: criterion.key,
                    ...result,
                  });
                } catch {
                  send("result", {
                    testCaseId: tc.id,
                    criterionKey: criterion.key,
                    score: 0,
                    reasoning: "Judge call failed",
                  });
                }
              },
            ),
          );
        };

        for (let i = 0; i < testCases.length; i += BATCH_SIZE) {
          const batch = testCases.slice(i, i + BATCH_SIZE);
          await Promise.all(batch.map(processTestCase));
        }

        send("complete", {});
      } catch (err) {
        send("error", {
          message: err instanceof Error ? err.message : "Execution failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
