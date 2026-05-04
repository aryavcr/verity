'use client';

import { useEvalStore } from '@/lib/eval-store';
import { CRITERIA_COLUMNS } from '@/lib/constants';
import { formatColumnAvg, getAvgTextColor } from '@/lib/scoring';

export default function AvgRow() {
  const currentRun = useEvalStore((s) => s.currentRun);

  if (!currentRun) return null;

  const { columnAverages, overallScore } = currentRun;

  const values: Record<string, number> = {
    coreIssue: columnAverages.coreIssue,
    brevity: columnAverages.brevity,
    noHallucination: columnAverages.noHallucination,
    action: columnAverages.action,
  };

  return (
    <div className="flex items-center gap-2 pt-2 mt-1 border-t border-zinc-800">
      <div className="w-[160px] shrink-0">
        <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Avg
        </span>
      </div>
 <div className="flex flex-1 gap-3 shrink-0 justify-end items-center">
  {CRITERIA_COLUMNS.map((col) => (
    <div key={col.key} className="w-12 h-10 flex items-center justify-center">
      <span className={`text-sm font-semibold ${getAvgTextColor(
        col.type === 'boolean'
          ? values[col.key]
          : (values[col.key] / 5) * 100
      )}`}>
        {formatColumnAvg(values[col.key], col.type)}
      </span>
    </div>
  ))}
  {/* Divider */}
  <div className="w-px h-6 bg-zinc-700 mx-1" />
  {/* Overall avg */}
  <div className="w-16 h-10 flex items-center justify-center bg-zinc-900 rounded-sm border border-zinc-800">
    <span className={`text-sm font-bold ${getAvgTextColor(overallScore)}`}>
      {overallScore}%
    </span>
  </div>
</div>
    </div>
  );
}