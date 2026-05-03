'use client';

import { useEvalStore } from '@/lib/eval-store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const PLACEHOLDER = `You are a customer support assistant. Summarize the following support ticket in 1-2 concise sentences. Focus on the core issue and any immediate action needed.

Only reference information explicitly stated in the ticket. Do not change or add details.`;

export default function PromptEditor() {
  const promptTemplate = useEvalStore((s) => s.promptTemplate);
  const setPrompt = useEvalStore((s) => s.setPrompt);
  const status = useEvalStore((s) => s.status);

  const isLocked = status === 'generating' || status === 'running';

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Prompt Template
      </Label>
      <div className="relative">
        <Textarea
          value={promptTemplate}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PLACEHOLDER}
          disabled={isLocked}
          spellCheck={false}
          className="
            font-mono
            text-sm
            leading-relaxed
            min-h-35
            resize-none
            bg-zinc-900
            border-zinc-800
            text-zinc-100
            placeholder:text-zinc-600
            focus-visible:ring-1
            focus-visible:ring-primary
            focus-visible:border-primary
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
            duration-200
          "
        />
        {isLocked && (
          <div className="absolute inset-0 rounded-md cursor-not-allowed" />
        )}
      </div>
    </div>
  );
}