export interface TestCase {
  id: string;
  name: string;
  input: string;
  referenceAnswer: string;
  modelOutput?: string;
  scores?: EvalScores;
  judgeReasoning?: JudgeReasoning;
  status: 'pending' | 'running' | 'scored' | 'error';
}

export interface EvalScores {
  coreIssue: number;
  brevity: boolean;
  noHallucination: number;
  action: number;
  avg: number;
}

export interface JudgeReasoning {
  coreIssue: string;
  brevity: string;
  noHallucination: string;
  action: string;
}

export interface EvalRun {
  id: string;
  promptTemplate: string;
  model: string;
  testCases: TestCase[];
  overallScore: number;
  columnAverages: {
    coreIssue: number;
    brevity: number;
    noHallucination: number;
    action: number;
  };
  timestamp: string;
}

export interface DrillDownTarget {
  testCaseId: string;
  criterion: keyof EvalScores;
}

export type RunStatus = 'idle' | 'generating' | 'running' | 'complete';

export interface ModelOption {
  id: string;
  label: string;
  provider: 'openai' | 'anthropic' | 'google';
}