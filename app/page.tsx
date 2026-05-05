'use client';

import { useEvalStore } from '@/lib/eval-store';
import { useEvalStream } from '@/hooks/use-eval-stream';
import PromptEditor from '@/components/prompt-editor';
import ModelSelector from '@/components/model-selector';
import RunButton from '@/components/run-button';
import HeatmapGrid from '@/components/heatmap/heatmap-grid';
import HeaderBar from '@/components/results/header-bar';
import ScoreSummary from '@/components/results/score-summary';
import DrillDownPanel from '@/components/results/drill-down-panel';

export default function Home() {
  const status = useEvalStore((s) => s.status);
  const { startRun } = useEvalStream();

  return (
    <main className="min-h-screen bg-background bg-size-[20px_20px] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] dark:bg-[radial-gradient(#404040_1px,transparent_1px)]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Header */}
        {status === 'complete'
          ? <HeaderBar />
          : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                Eval
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
                Playground
              </span>
            </div>
          )
        }

        {/* Screen 1 — Prompt editor + controls */}
        {status !== 'complete' && (
          <div className="flex flex-col gap-6">
            <PromptEditor />
            <div className="flex items-end justify-between gap-4">
              <ModelSelector />
              <RunButton onClick={startRun} />
            </div>
          </div>
        )}

        {/* Heatmap section */}
        <div className="flex flex-col gap-3">
          {status !== 'complete' && (
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
              Live Results
            </span>
          )}
          {status === 'complete' && <ScoreSummary />}
          <div className="
            rounded-lg
            border
            border-zinc-800
            bg-zinc-950
            p-8
          ">
            <HeatmapGrid />
          </div>
        </div>

      </div>

      {/* Drill-down panel — rendered outside main flow */}
      <DrillDownPanel />

    </main>
  );
}