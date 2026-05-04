import { useEvalStore } from '@/lib/eval-store';
import { TestCase } from '@/lib/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { computeColumnAverages, computeOverallScore } from '@/lib/scoring';

export function useEvalStream() {
  const {
    setStatus,
    setTestCases,
    updateTestCase,
    setCurrentRun,
    promptTemplate,
    selectedModel,
  } = useEvalStore();

  const startRun = async () => {
    setStatus('generating');

    try {
      // ── Step 1: Generate test cases ──────────────────────────────────
      const genRes = await fetch('/api/generate-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptTemplate }),
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error ?? 'Failed to generate test cases');
      }

      const { testCases } = await genRes.json();
      setTestCases(testCases);
      setStatus('running');

      // ── Step 2: Open SSE stream ───────────────────────────────────────
      const evalRes = await fetch('/api/run-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTemplate,
          modelId: selectedModel.id,
          testCases,
        }),
      });

      if (!evalRes.ok || !evalRes.body) {
        throw new Error('Failed to start eval stream');
      }

      const reader = evalRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const allTestCases: TestCase[] = [...testCases];

      // ── Step 3: Read SSE events ───────────────────────────────────────
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const raw of events) {
          if (!raw.trim()) continue;

          const eventLine = raw.split('\n').find((l) => l.startsWith('event:'));
          const dataLine = raw.split('\n').find((l) => l.startsWith('data:'));

          if (!eventLine || !dataLine) continue;

          const event = eventLine.replace('event:', '').trim();
          const data = JSON.parse(dataLine.replace('data:', '').trim());

          handleEvent(event, data, allTestCases);
        }
      }

    } catch (err) {
      console.error('[useEvalStream]', err);
      setStatus('idle');
    }
  };

  const handleEvent = (
    event: string,
    data: Record<string, unknown>,
    allTestCases: TestCase[]
  ) => {
    switch (event) {

      case 'test-cases-ready':
        setTestCases(data.testCases as TestCase[]);
        break;

      case 'test-case-scored': {
        const { testCaseId, modelOutput, scores, reasoning } = data as {
          testCaseId: string;
          modelOutput: string;
          scores: TestCase['scores'];
          reasoning: TestCase['judgeReasoning'];
        };
        updateTestCase(testCaseId, {
          modelOutput,
          scores,
          judgeReasoning: reasoning,
          status: 'scored',
        });

        // Update local copy for final aggregates
        const tc = allTestCases.find((t) => t.id === testCaseId);
        if (tc) tc.scores = scores;
        break;
      }

      case 'test-case-error':
        updateTestCase(data.testCaseId as string, { status: 'error' });
        break;

      case 'run-complete': {
        const { overallScore, columnAverages, runId, timestamp, model } = data as {
          overallScore: number;
          columnAverages: ReturnType<typeof computeColumnAverages>;
          runId: string;
          timestamp: string;
          model: string;
        };

        const { promptTemplate: prompt, testCases: storedCases } = useEvalStore.getState();

        setCurrentRun({
          id: runId,
          promptTemplate: prompt,
          model,
          testCases: storedCases,
          overallScore,
          columnAverages,
          timestamp,
        });

        setStatus('complete');
        break;
      }

      case 'run-error':
        console.error('[run-error]', data.error);
        setStatus('idle');
        break;
    }
  };

  return { startRun };
}