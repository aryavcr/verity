export const DEFAULT_CRITERIA = [
  {
    key: 'core',
    label: 'Correctness',
    description:
      'Does the output accurately answer the question or complete the task? Score 1–5 where 5 is perfectly correct and 1 is completely wrong or off-topic.',
    scorer_type: 'llm-judge' as const,
    weight: 1.0,
    sort_order: 0,
  },
  {
    key: 'brev',
    label: 'Brevity',
    description:
      'Is the output concise without sacrificing completeness? Score 1–5 where 5 is optimally brief and 1 is excessively verbose or far too terse to be useful.',
    scorer_type: 'llm-judge' as const,
    weight: 1.0,
    sort_order: 1,
  },
  {
    key: 'hall',
    label: 'Hallucination',
    description:
      'Does the output avoid fabricating facts, citations, or details not supported by the context or prompt? Score 1–5 where 5 means zero hallucination and 1 means heavily hallucinated.',
    scorer_type: 'llm-judge' as const,
    weight: 1.0,
    sort_order: 2,
  },
  {
    key: 'act',
    label: 'Action',
    description:
      'Does the output provide clear, actionable guidance the user can immediately follow? Score 1–5 where 5 is immediately actionable and concrete, 1 is vague or unhelpful.',
    scorer_type: 'llm-judge' as const,
    weight: 1.0,
    sort_order: 3,
  },
]