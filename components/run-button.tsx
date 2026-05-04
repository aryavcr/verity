'use client';

import { useEvalStore } from '@/lib/eval-store';
import { Button } from '@/components/ui/button';
import { TEST_CASE_COUNT } from '@/lib/constants';
import { Loader2, Sparkles, Play } from 'lucide-react';

const BUTTON_STATES = {
  idle: {
    label: `Run ${TEST_CASE_COUNT} test cases`,
    icon: Play,
    className: '',
  },
  generating: {
    label: 'Generating test cases...',
    icon: Loader2,
    className: 'animate-spin',
  },
  running: {
    label: 'Running evals...',
    icon: Loader2,
    className: 'animate-spin',
  },
  complete: {
    label: 'Run again',
    icon: Sparkles,
    className: '',
  },
} as const;

export default function RunButton({ onClick }: { onClick?: () => void }) {
  const status = useEvalStore((s) => s.status);
  const promptTemplate = useEvalStore((s) => s.promptTemplate);

  const isLoading = status === 'generating' || status === 'running';
  const isEmpty = promptTemplate.trim().length === 0;
  const isDisabled = isLoading || isEmpty;

  const state = BUTTON_STATES[status];
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        onClick={onClick}
        disabled={isDisabled}
        size="lg"
        className="
          gap-2
          font-medium
          tracking-wide
          bg-primary
          hover:bg-primary/90
          text-primary-foreground
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all
          duration-200
          min-w-50
          cursor-pointer
        "
      >
        <Icon className={`w-4 h-4 ${state.className}`} />
        {state.label}
      </Button>
      {isEmpty && status === 'idle' && (
        <span className="text-[11px] text-zinc-600">
          Write a prompt to get started
        </span>
      )}
    </div>
  );
}