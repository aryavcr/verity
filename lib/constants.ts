import { ModelOption } from './types';

export const PLACEHOLDER_TEST_CASES = [
  'Refund req.',
  'Bug report',
  'Billing error',
  'Feature req.',
  'Shipping',
  'Login issue',
  'Account del.',
  'Upgrade',
];

export const CRITERIA_COLUMNS = [
  { key: 'coreIssue',       label: 'Core issue',  type: 'numeric' },
  { key: 'brevity',         label: 'Brevity',     type: 'boolean' },
  { key: 'noHallucination', label: 'No halluc.',  type: 'numeric' },
  { key: 'action',          label: 'Action',      type: 'numeric' },
] as const;

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gpt-4o',                label: 'GPT-4o',             provider: 'openai'    },
  { id: 'gpt-4o-mini',           label: 'GPT-4o mini',        provider: 'openai'    },
  { id: 'claude-sonnet-4',       label: 'Claude Sonnet 4',    provider: 'anthropic' },
  { id: 'claude-haiku-4',        label: 'Claude Haiku 4',     provider: 'anthropic' },
  { id: 'gemini-2.0-flash',      label: 'Gemini 2.0 Flash',   provider: 'google'    },
  { id: 'gemini-2.5-pro',        label: 'Gemini 2.5 Pro',     provider: 'google'    },
];

export const SCORE_COLORS: Record<number, string> = {
  5: 'bg-green-600',
  4: 'bg-green-500',
  3: 'bg-amber-500',
  2: 'bg-orange-500',
  1: 'bg-red-500',
};

export const JUDGE_MODEL = process.env.JUDGE_MODEL ?? 'gpt-4o';

export const CONCURRENCY_LIMIT = 2;

export const TEST_CASE_COUNT = 8;