import { create } from 'zustand';
import { RunStatus, TestCase, EvalRun, DrillDownTarget, ModelOption } from '@/lib/types';
import { PLACEHOLDER_TEST_CASES, MODEL_OPTIONS } from '@/lib/constants';

interface EvalStore {
  //State
  status: RunStatus;
  promptTemplate: string;
  selectedModel: ModelOption;
  testCases: TestCase[];
  currentRun: EvalRun | null;
  drillDownTarget: DrillDownTarget | null;

  //Actions
  setPrompt: (prompt: string) => void;
  setModel: (model: ModelOption) => void;
  setStatus: (status: RunStatus) => void;
  setTestCases: (testCases: TestCase[]) => void;
  updateTestCase: (id: string, update: Partial<TestCase>) => void;
  setCurrentRun: (run: EvalRun) => void;
  setDrillDownTarget: (target: DrillDownTarget | null) => void;
  reset: () => void;
}

const buildPlaceholders = (): TestCase[] =>
  PLACEHOLDER_TEST_CASES.map((name, i) => ({
    id: `placeholder-${i}`,
    name,
    input: '',
    referenceAnswer: '',
    status: 'pending' as const,
  }));

const initialState = {
  status: 'idle' as RunStatus,
  promptTemplate: '',
  selectedModel: MODEL_OPTIONS[0],
  testCases: buildPlaceholders(),
  currentRun: null,
  drillDownTarget: null,
};

export const useEvalStore = create<EvalStore>((set) => ({
  ...initialState,

  setPrompt: (prompt) =>
    set({ promptTemplate: prompt }),

  setModel: (model) =>
    set({ selectedModel: model }),

  setStatus: (status) =>
    set({ status }),

  setTestCases: (testCases) =>
    set({ testCases }),

  updateTestCase: (id, update) =>
    set((state) => ({
      testCases: state.testCases.map((tc) =>
        tc.id === id ? { ...tc, ...update } : tc
      ),
    })),

  setCurrentRun: (run) =>
    set({ currentRun: run }),

  setDrillDownTarget: (target) =>
    set({ drillDownTarget: target }),

  reset: () =>
    set({ ...initialState, testCases: buildPlaceholders() }),
}));