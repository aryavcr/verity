'use client';

import { useEvalStore } from '@/lib/eval-store';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Download, GitCompare, RotateCcw } from 'lucide-react';

export default function HeaderBar() {
  const currentRun = useEvalStore((s) => s.currentRun);
  const reset = useEvalStore((s) => s.reset);

  const handleExport = async () => {
    if (!currentRun) return;

    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evalRun: currentRun }),
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eval-run-${currentRun.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const promptSummary = currentRun?.promptTemplate
    .slice(0, 32)
    .trim()
    .concat('...');

  return (
    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500 font-medium tracking-wide">
          Eval Playground
        </span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400 font-medium max-w-[200px] truncate">
          {promptSummary}
        </span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300 font-medium">
          Run #{currentRun?.id.split('-')[1]}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* New prompt */}
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="
            text-zinc-500
            hover:text-zinc-300
            hover:bg-zinc-800
            gap-1.5
            text-xs
          "
        >
          <RotateCcw className="w-3 h-3" />
          New prompt
        </Button>

        {/* Export JSON */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="
            bg-transparent
            border-zinc-700
            text-zinc-300
            hover:bg-zinc-800
            hover:text-zinc-100
            gap-1.5
            text-xs
          "
        >
          <Download className="w-3 h-3" />
          Export JSON
        </Button>

        {/* Compare — disabled */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="
                  bg-transparent
                  border-zinc-800
                  text-zinc-600
                  gap-1.5
                  text-xs
                  cursor-not-allowed
                  opacity-50
                "
              >
                <GitCompare className="w-3 h-3" />
                Compare with...
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs"
          >
            Coming soon
          </TooltipContent>
        </Tooltip>

      </div>
    </div>
  );
}