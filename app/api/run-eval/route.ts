import { generateTestCases } from '@/lib/llm/judge';
import { runEval } from '@/lib/llm/runner';
import { computeColumnAverages, computeOverallScore } from '@/lib/scoring';
import { TestCase, EvalScores, JudgeReasoning } from '@/lib/types';

export async function POST(req: Request) {
  const { promptTemplate, modelId } = await req.json();

  if (!promptTemplate || !modelId) {
    return Response.json(
      { error: 'promptTemplate and modelId are required' },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {

      // ── Helper to push SSE events ──────────────────────────────────────
      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        // ── Step 1: Generate test cases ──────────────────────────────────
        send('status', { message: 'Generating test cases...' });

        const rawCases = await generateTestCases(promptTemplate.trim());

        const testCases: TestCase[] = rawCases.map((tc, i) => ({
          id: `tc-${Date.now()}-${i}`,
          name: tc.name,
          input: tc.input,
          referenceAnswer: tc.referenceAnswer,
          status: 'pending',
        }));

        send('test-cases-ready', { testCases });

        // ── Step 2: Run evals with concurrency ───────────────────────────
        send('status', { message: 'Running evaluations...' });

        const completedScores: EvalScores[] = [];

        await runEval(
          promptTemplate,
          modelId,
          testCases,

          // onResult — fires as each test case completes
          (result) => {
            completedScores.push(result.scores);
            send('test-case-scored', {
              testCaseId: result.testCaseId,
              modelOutput: result.modelOutput,
              scores: result.scores,
              reasoning: result.reasoning,
            });
          },

          // onError — fires if a test case fails after retry
          (error) => {
            send('test-case-error', {
              testCaseId: error.testCaseId,
              error: error.error,
            });
          }
        );

        // ── Step 3: Compute final aggregates ─────────────────────────────
        const overallScore = computeOverallScore(completedScores);
        const columnAverages = computeColumnAverages(completedScores);

        send('run-complete', {
          overallScore,
          columnAverages,
          runId: `run-${Date.now()}`,
          timestamp: new Date().toISOString(),
          model: modelId,
        });

      } catch (err) {
        console.error('[run-eval]', err);
        send('run-error', {
          error: err instanceof Error ? err.message : 'Something went wrong',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}