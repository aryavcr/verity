import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getJudgeModel } from './providers';
import { EvalScores, JudgeReasoning, TestCase } from '@/lib/types';
import { TEST_CASE_COUNT } from '@/lib/constants';

// defining types

interface GeneratedTestCase {
  name: string;
  input: string;
  referenceAnswer: string;
}

interface JudgeResult {
  scores: EvalScores;
  reasoning: JudgeReasoning;
}

// testcase generation
export async function generateTestCases(
  promptTemplate: string
): Promise<GeneratedTestCase[]> {
  const judge = getJudgeModel();

  const system = new SystemMessage(`
You are an expert LLM eval designer.
Your job is to generate diverse, realistic test cases for evaluating a given system prompt.
You must return ONLY a valid JSON array. No markdown, no explanation, no code fences.
`);

  const human = new HumanMessage(`
Given this system prompt:
"""
${promptTemplate}
"""

Generate exactly ${TEST_CASE_COUNT} test cases that thoroughly evaluate this prompt.
Cover: typical cases, edge cases, adversarial inputs, and boundary conditions.

Return a JSON array of exactly ${TEST_CASE_COUNT} objects. Each object must have:
- "name": a 2-3 word label (e.g. "Refund req.", "Bug report")
- "input": a realistic user input that would be passed to this prompt
- "referenceAnswer": an ideal, perfect response that fully satisfies the prompt's requirements

Return only the JSON array, nothing else.
`);

  const response = await judge.invoke([system, human]);
  const text = extractText(response);
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed) || parsed.length !== TEST_CASE_COUNT) {
      throw new Error('Invalid test case count');
    }
    return parsed as GeneratedTestCase[];
  } catch {
    throw new Error(`Failed to parse test cases from judge: ${cleaned}`);
  }
}

//scoring
export async function scoreTestCase(
  testCase: Pick<TestCase, 'input' | 'referenceAnswer'>,
  modelOutput: string
): Promise<JudgeResult> {
  const judge = getJudgeModel();

  const system = new SystemMessage(`
You are an expert LLM output evaluator.
Your job is to score a model's response against a reference answer across 4 criteria.
You must return ONLY a valid JSON object. No markdown, no explanation, no code fences.
`);

  const human = new HumanMessage(`
Evaluate the following model output against the reference answer.

INPUT:
"""
${testCase.input}
"""

REFERENCE ANSWER (ideal response):
"""
${testCase.referenceAnswer}
"""

MODEL OUTPUT (what you are scoring):
"""
${modelOutput}
"""

Score the model output on these 4 criteria and return a JSON object:

{
  "scores": {
    "coreIssue": <1-5, did the response identify the core issue?>,
    "brevity": <true/false, is the response concise and to the point?>,
    "noHallucination": <1-5, does the response only use information from the input?>,
    "action": <1-5, does the response identify the correct next action?>
  },
  "reasoning": {
    "coreIssue": "<one sentence explaining the core issue score>",
    "brevity": "<one sentence explaining the brevity score>",
    "noHallucination": "<one sentence explaining the hallucination score>",
    "action": "<one sentence explaining the action score>"
  }
}

Scoring guide:
- 5: Perfect, exceeds the reference
- 4: Good, matches the reference closely  
- 3: Acceptable, partially matches
- 2: Poor, mostly misses the mark
- 1: Completely wrong or missing

Return only the JSON object, nothing else.
`);

  const response = await judge.invoke([system, human]);
  const text = extractText(response);
  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    const scores: EvalScores = {
      ...parsed.scores,
      avg: computeAvg(parsed.scores),
    };
    return { scores, reasoning: parsed.reasoning };
  } catch {
    throw new Error(`Failed to parse scores from judge: ${cleaned}`);
  }
}

//post-processing

function extractText(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'content' in response
  ) {
    const content = (response as { content: unknown }).content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      const first = content[0];
      if (first && typeof first === 'object' && 'text' in first) {
        return String((first as { text: unknown }).text);
      }
    }
  }
  return String(response);
}

function computeAvg(scores: Omit<EvalScores, 'avg'>): number {
  const brevityScore = scores.brevity ? 5 : 1;
  const total = scores.coreIssue + brevityScore + scores.noHallucination + scores.action;
  return Math.round((total / 20) * 100);
}