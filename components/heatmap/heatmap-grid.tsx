'use client';

import { useEvalStore } from '@/lib/eval-store';
import HeatmapHeader from './heatmap-header';
import HeatmapRow from './heatmap-row';

export default function HeatmapGrid() {
  const testCases = useEvalStore((s) => s.testCases);

  return (
    <div className="flex flex-col gap-1 w-full">
      <HeatmapHeader />
      <div className="flex flex-col gap-1 mt-2">
        {testCases.map((testCase, index) => (
          <HeatmapRow
            key={testCase.id}
            testCase={testCase}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}