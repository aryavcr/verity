'use client';

import { useEvalStore } from '@/lib/eval-store';
import { MODEL_OPTIONS } from '@/lib/constants';
import { ModelOption } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const PROVIDER_LABELS: Record<ModelOption['provider'], string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
};

const PROVIDER_COLORS: Record<ModelOption['provider'], string> = {
  openai: 'bg-emerald-500',
  anthropic: 'bg-amber-500',
  google: 'bg-blue-500',
};

export default function ModelSelector() {
  const selectedModel = useEvalStore((s) => s.selectedModel);
  const setModel = useEvalStore((s) => s.setModel);
  const status = useEvalStore((s) => s.status);

  const isLocked = status === 'generating' || status === 'running';

  const handleChange = (modelId: string) => {
    const model = MODEL_OPTIONS.find((m) => m.id === modelId);
    if (model) setModel(model);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Model
      </Label>
      <Select
        value={selectedModel.id}
        onValueChange={handleChange}
        disabled={isLocked}
      >
        <SelectTrigger className="
          w-55
          bg-zinc-900
          border-zinc-800
          text-zinc-100
          focus:ring-1
          focus:ring-primary
          focus:border-primary
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-colors
          duration-200
        ">
          <SelectValue>
            <ProviderDot provider={selectedModel.provider} />
            <span>{selectedModel.label}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="
          bg-zinc-900
          border-zinc-800
          text-zinc-100
        ">
          {(['openai', 'anthropic', 'google'] as ModelOption['provider'][]).map(
            (provider) => {
              const models = MODEL_OPTIONS.filter((m) => m.provider === provider);
              return (
                <div key={provider}>
                  <div className="px-2 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-zinc-500">
                    {PROVIDER_LABELS[provider]}
                  </div>
                  {models.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="
                        text-zinc-100
                        focus:bg-zinc-800
                        focus:text-zinc-100
                        cursor-pointer
                      "
                    >
                      <div className="flex items-center gap-2">
                        <ProviderDot provider={model.provider} />
                        <span>{model.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              );
            }
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

function ProviderDot({ provider }: { provider: ModelOption['provider'] }) {
  return (
    <span
      className={`
        inline-block w-1.5 h-1.5 rounded-full mr-2
        ${PROVIDER_COLORS[provider]}
      `}
    />
  );
}