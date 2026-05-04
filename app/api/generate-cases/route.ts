import { generateTestCases } from '@/lib/llm/judge';
import { TEST_CASE_COUNT } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const { promptTemplate } = await req.json();

    if (!promptTemplate || typeof promptTemplate !== 'string' || promptTemplate.trim().length === 0) {
      return Response.json(
        { error: 'promptTemplate is required' },
        { status: 400 }
      );
    }

    const testCases = await generateTestCases(promptTemplate.trim());

    const withIds = testCases.map((tc, i) => ({
      id: `tc-${Date.now()}-${i}`,
      name: tc.name,
      input: tc.input,
      referenceAnswer: tc.referenceAnswer,
      status: 'pending' as const,
    }));

    return Response.json({ testCases: withIds });

  } catch (err) {
    console.error('[generate-cases]', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to generate test cases' },
      { status: 500 }
    );
  }
}