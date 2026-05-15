import { create } from "zustand";

type ExecutionStatus =
  | "idle"
  | "generating-tests"
  | "running"
  | "complete"
  | "failed";

type ThinkingStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
};

type CellResult = {
  score: number;
  reasoning: string;
};

type TestCaseRow = {
  id: string;
  input: string;
  label?: string;
  expected_output?: string;
  modelOutput?: string;
  latencyMs?: number;
  results: Record<string, CellResult>;
};

type PlaygroundState = {
  // config
  projectId: string | null;
  systemPrompt: string;
  provider: "openrouter" | "google" | "groq";
  model: string;
  judgeModel: string;
  outputType: "text" | "json" | "structured";

  //execution
  executionStatus: ExecutionStatus;
  thinkingSteps: ThinkingStep[];
  currentRunId: string | null;
  currentRunSlug: string | null;
  testCaseRows: TestCaseRow[];

  //drilldown
  selectedCell: { testCaseId: string; criterionId: string } | null;

  // actions
  setProjectId: (id: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setProvider: (p: "openrouter" | "google" | "groq") => void;
  setModel: (m: string) => void;
  setJudgeModel: (m: string) => void;
  setOutputType: (t: "text" | "json" | "structured") => void;
  setExecutionStatus: (s: ExecutionStatus) => void;
  setThinkingSteps: (steps: ThinkingStep[]) => void;
  updateThinkingStep: (id: string, patch: Partial<ThinkingStep>) => void;
  setCurrentRunId: (id: string | null) => void;
  setCurrentRunSlug: (slug: string | null) => void;
  setTestCaseRows: (rows: TestCaseRow[]) => void;
  updateCellResult: (
    testCaseId: string,
    criterionId: string,
    result: CellResult,
  ) => void;
  setSelectedCell: (
    cell: { testCaseId: string; criterionId: string } | null,
  ) => void;
  reset: () => void;
};

const defaults = {
  projectId: null,
  systemPrompt: "",
  provider: "groq" as const,
  model: "llama-3.3-70b-versatile",
  judgeModel: "llama-3.3-70b-versatile",
  outputType: "text" as const,
  executionStatus: "idle" as const,
  thinkingSteps: [],
  currentRunId: null,
  currentRunSlug: null,
  testCaseRows: [],
  selectedCell: null,
};

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  ...defaults,

  setProjectId: (id) => set({ projectId: id }),
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
  setProvider: (provider) => set({ provider }),
  setModel: (model) => set({ model }),
  setJudgeModel: (judgeModel) => set({ judgeModel }),
  setOutputType: (outputType) => set({ outputType }),
  setExecutionStatus: (executionStatus) => set({ executionStatus }),
  setThinkingSteps: (thinkingSteps) => set({ thinkingSteps }),
  updateThinkingStep: (id, patch) =>
    set((s) => ({
      thinkingSteps: s.thinkingSteps.map((step) =>
        step.id === id ? { ...step, ...patch } : step,
      ),
    })),
  setCurrentRunId: (currentRunId) => set({ currentRunId }),
  setCurrentRunSlug: (currentRunSlug) => set({ currentRunSlug }),
  setTestCaseRows: (testCaseRows) => set({ testCaseRows }),
  updateCellResult: (testCaseId, criterionId, result) =>
    set((s) => ({
      testCaseRows: s.testCaseRows.map((row) =>
        row.id === testCaseId
          ? { ...row, results: { ...row.results, [criterionId]: result } }
          : row,
      ),
    })),
  setSelectedCell: (selectedCell) => set({ selectedCell }),
  reset: () => set(defaults),
}));
