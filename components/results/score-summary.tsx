'use client';

import { useEvalStore } from '@/lib/eval-store';
import { getOverallScoreColor } from '@/lib/scoring';

export default function ScoreSummary() {
  const currentRun = useEvalStore((s) => s.currentRun);

  if (!currentRun) return null;

  const { overallScore, testCases, model } = currentRun;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-3">
        <span className={`text-5xl font-bold tabular-nums ${getOverallScoreColor(overallScore)}`}>
          {overallScore}%
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-zinc-300">
            overall score
          </span>
          <span className="text-xs text-zinc-500">
            {testCases.length} test cases · {model}
          </span>
        </div>
      </div>
    </div>
  );
}