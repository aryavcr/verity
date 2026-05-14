/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePlaygroundStore } from "@/lib/stores/playground-store";
import { DEFAULT_CRITERIA } from "@/lib/constants/criteria";

export async function executeRun() {
  const store = usePlaygroundStore.getState();
  const { systemPrompt, model, provider } = store;

  if (!systemPrompt.trim()) return;

  //reset state
  store.setTestCaseRows([]);
  store.setExecutionStatus("generating-tests");
  store.setThinkingSteps([
    {
      id: "gen",
      label: "Generating test cases from prompt…",
      status: "running",
    },
  ]);

  //result queue for stagger cell animation(popping)
  const resultQueue: {
    testCaseId: string;
    criterionKey: string;
    score: number;
    reasoning: string;
  }[] = [];
  let processingQueue = false;

  function queueResult(r: (typeof resultQueue)[number]) {
    resultQueue.push(r);
    if (!processingQueue) drainQueue();
  }

  async function drainQueue() {
    processingQueue = true;
    while (resultQueue.length > 0) {
      const r = resultQueue.shift()!;
      usePlaygroundStore
        .getState()
        .updateCellResult(r.testCaseId, r.criterionKey, {
          score: r.score,
          reasoning: r.reasoning,
        });
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    processingQueue = false;
  }

  //SSE stream
  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        model,
        provider,
        criteria: DEFAULT_CRITERIA,
      }),
    });

    if (!res.ok || !res.body) {
      store.setExecutionStatus("failed");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        let msg: any;
        try {
          msg = JSON.parse(line.slice(6));
        } catch {
          continue;
        }

        switch (msg.event) {
          case "test-cases": {
            const rows = msg.testCases.map((tc: any) => ({
              id: tc.id,
              input: tc.input,
              label: tc.label,
              results: {},
            }));
            store.setTestCaseRows(rows);
            store.updateThinkingStep("gen", {
              status: "done",
              detail: `Generated ${msg.testCases.length} test cases`,
            });
            store.setThinkingSteps([
              ...usePlaygroundStore.getState().thinkingSteps,
              {
                id: "eval",
                label: "Evaluating test cases…",
                status: "running",
              },
            ]);
            store.setExecutionStatus("running");
            break;
          }

          case "model-output": {
            const currentRows = usePlaygroundStore.getState().testCaseRows;
            store.setTestCaseRows(
              currentRows.map((r) =>
                r.id === msg.testCaseId
                  ? { ...r, modelOutput: msg.output, latencyMs: msg.latencyMs }
                  : r,
              ),
            );
            break;
          }

          case "result": {
            //queue again for same reason
            queueResult({
              testCaseId: msg.testCaseId,
              criterionKey: msg.criterionKey,
              score: msg.score,
              reasoning: msg.reasoning,
            });
            break;
          }

          case "complete": {
            const waitForQueue = () =>
              new Promise<void>((resolve) => {
                const check = () => {
                  if (resultQueue.length === 0 && !processingQueue) resolve();
                  else setTimeout(check, 50);
                };
                check();
              });

            await waitForQueue();

            store.updateThinkingStep("eval", {
              status: "done",
              detail: "All test cases scored",
            });
            store.setExecutionStatus("complete");

            //save to supabase
            try {
              const { saveCompletedRun } = await import("@/lib/db/save-run");
              const currentState = usePlaygroundStore.getState();
              const { run } = await saveCompletedRun({
                systemPrompt: currentState.systemPrompt,
                provider: currentState.provider,
                model: currentState.model,
                testCaseRows: currentState.testCaseRows,
              });
              store.setCurrentRunId(run.id);
              store.setCurrentRunSlug(run.slug);
            } catch (err) {
              console.error("Failed to save run:", err);
            }
            break;
          }

          case "error": {
            store.setExecutionStatus("failed");
            break;
          }
        }
      }
    }
  } catch {
    store.setExecutionStatus("failed");
  }
}
