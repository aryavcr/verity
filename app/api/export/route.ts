import { EvalRun } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { evalRun }: { evalRun: EvalRun } = await req.json();

    if (!evalRun) {
      return Response.json(
        { error: 'evalRun is required' },
        { status: 400 }
      );
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      run: {
        id: evalRun.id,
        timestamp: evalRun.timestamp,
        model: evalRun.model,
        overallScore: evalRun.overallScore,
        columnAverages: evalRun.columnAverages,
        promptTemplate: evalRun.promptTemplate,
        testCases: evalRun.testCases.map((tc) => ({
          id: tc.id,
          name: tc.name,
          input: tc.input,
          referenceAnswer: tc.referenceAnswer,
          modelOutput: tc.modelOutput ?? '',
          scores: tc.scores,
          reasoning: tc.judgeReasoning,
          status: tc.status,
        })),
      },
    };

    const json = JSON.stringify(payload, null, 2);

    return new Response(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="eval-run-${evalRun.id}.json"`,
      },
    });

  } catch (err) {
    console.error('[export]', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to export' },
      { status: 500 }
    );
  }
}