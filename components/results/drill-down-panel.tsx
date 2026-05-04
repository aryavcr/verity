'use client';

import { useEvalStore } from '@/lib/eval-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CRITERIA_COLUMNS } from '@/lib/constants';
import { getScoreColor } from '@/lib/scoring';
import { EvalScores } from '@/lib/types';

const CRITERION_LABELS: Record<string, string> = {
  coreIssue: 'Core Issue',
  brevity: 'Brevity',
  noHallucination: 'No Hallucination',
  action: 'Action',
};

export default function DrillDownPanel() {
  const drillDownTarget = useEvalStore((s) => s.drillDownTarget);
  const testCases = useEvalStore((s) => s.testCases);
  const setDrillDownTarget = useEvalStore((s) => s.setDrillDownTarget);

  const testCase = testCases.find((tc) => tc.id === drillDownTarget?.testCaseId);
  const criterion = drillDownTarget?.criterion;
  const isOpen = !!drillDownTarget && !!testCase;

  const score = criterion && testCase?.scores
    ? testCase.scores[criterion as keyof EvalScores]
    : null;

  const reasoning = criterion && testCase?.judgeReasoning
    ? testCase.judgeReasoning[criterion as keyof typeof testCase.judgeReasoning]
    : null;

  const isBoolean = criterion === 'brevity';
  const scoreDisplay = isBoolean
    ? score ? 'Pass ✓' : 'Fail ✗'
    : `${score}/5`;

  const scoreBg = isBoolean
    ? score ? 'bg-green-500/20 text-green-400 border-green-500/30'
            : 'bg-red-500/20 text-red-400 border-red-500/30'
    : `${getScoreColor(score as number).replace('bg-', 'bg-').replace('500', '500/20')} border-zinc-700`;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setDrillDownTarget(null)}>
      <SheetContent
        side="right"
        className="
          w-[440px]
          bg-zinc-950
          border-zinc-800
          text-zinc-100
          overflow-y-auto
        "
      >
        <SheetHeader className="pb-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-zinc-100 text-base">
              {testCase?.name}
            </SheetTitle>
            <div className={`
              text-xs font-semibold px-2.5 py-1 rounded-sm border
              ${scoreBg}
            `}>
              {CRITERION_LABELS[criterion ?? '']} · {scoreDisplay}
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 pt-6">

          {/* Input */}
          <Section label="Input">
            <p className="text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-900 rounded-sm p-3 border border-zinc-800">
              {testCase?.input}
            </p>
          </Section>

          {/* Model Output */}
          <Section label="Model Output">
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900 rounded-sm p-3 border border-zinc-800">
              {testCase?.modelOutput ?? '—'}
            </p>
          </Section>

          {/* Reference Answer */}
          <Section label="Reference Answer">
            <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900 rounded-sm p-3 border border-zinc-800 italic">
              {testCase?.referenceAnswer}
            </p>
          </Section>

          {/* Judge Reasoning */}
          <Section label="Judge Reasoning">
            <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900 rounded-sm p-3 border border-zinc-800">
              {reasoning ?? '—'}
            </p>
          </Section>

          {/* All scores for this test case */}
          <Section label="All Scores">
            <div className="flex flex-col gap-2">
              {CRITERIA_COLUMNS.map((col) => {
                const colScore = testCase?.scores?.[col.key as keyof EvalScores];
                const colScoreDisplay = col.type === 'boolean'
                  ? colScore ? 'Pass ✓' : 'Fail ✗'
                  : `${colScore}/5`;
                return (
                  <div
                    key={col.key}
                    className={`
                      flex items-center justify-between
                      px-3 py-2 rounded-sm
                      border border-zinc-800
                      ${criterion === col.key ? 'bg-zinc-800' : 'bg-zinc-900'}
                    `}
                  >
                    <span className="text-xs text-zinc-400 font-medium">
                      {CRITERION_LABELS[col.key]}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">
                      {colScoreDisplay}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-zinc-900 border border-zinc-800">
                <span className="text-xs text-zinc-400 font-medium">Average</span>
                <span className="text-xs font-bold text-zinc-200">
                  {testCase?.scores?.avg}%
                </span>
              </div>
            </div>
          </Section>

        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500">
        {label}
      </span>
      {children}
    </div>
  );
}