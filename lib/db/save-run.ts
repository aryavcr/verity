import { createProject, getCriteria } from "./projects";
import { createRun, insertRunResult, updateRunStatus } from "./runs";
import { upsertTestCases } from "./test-cases";

type CellResult = { score: number; reasoning: string };

type RowData = {
  id: string;
  input: string;
  label?: string;
  modelOutput?: string;
  latencyMs?: number;
  results: Record<string, CellResult>;
};

export async function saveCompletedRun(data: {
  systemPrompt: string;
  provider: string;
  model: string;
  testCaseRows: RowData[];
}) {
  //project creation, auto-seeds default criteria & generates UUIDs for each criteria
  const project = await createProject({
    name: data.systemPrompt.slice(0, 60).replace(/\n/g, " "),
    system_prompt: data.systemPrompt,
    provider: data.provider,
    model: data.model,
    judge_model: data.model,
    output_type: "text",
  });

  //get those UUIDs
  const dbCriteria = await getCriteria(project.id);
  const criteriaMap = new Map(dbCriteria.map((c) => [c.key, c.id]));

  //save testcases
  const dbTestCases = await upsertTestCases(
    project.id,
    data.testCaseRows.map((r) => ({
      input: r.input,
      label: r.label,
      expected_output: undefined,
      is_generated: true,
    })),
  );

  //map streaming IDs to supabase UUIDs (matched by sort order)
  const testCaseMap = new Map(
    dbTestCases.map((tc, i) => [data.testCaseRows[i].id, tc.id]),
  );

  //create run record for storing
  const modelShort =
    data.model.split("/").pop()?.replace(":free", "") ?? data.model;
  const run = await createRun({
    project_id: project.id,
    name: `${modelShort}-${new Date().toISOString().slice(5, 16).replace("T", "-")}`,
    system_prompt: data.systemPrompt,
    provider: data.provider,
    model: data.model,
    judge_model: data.model,
    output_type: "text",
  });

  //insert all run results
  const insertPromises: Promise<void>[] = [];

  for (const row of data.testCaseRows) {
    const tcId = testCaseMap.get(row.id);
    if (!tcId) continue;

    for (const [key, result] of Object.entries(row.results)) {
      const critId = criteriaMap.get(key);
      if (!critId) continue;

      insertPromises.push(
        insertRunResult({
          run_id: run.id,
          test_case_id: tcId,
          criterion_id: critId,
          score: result.score,
          reasoning: result.reasoning,
          model_output: row.modelOutput ?? "",
          latency_ms: row.latencyMs ?? 0,
          tokens_in: 0,
          tokens_out: 0,
        }),
      );
    }
  }

  await Promise.all(insertPromises);

  //update run summary
  const allScores = data.testCaseRows.flatMap((r) =>
    Object.values(r.results)
      .map((res) => res.score)
      .filter((s) => s > 0),
  );
  const avgScore = allScores.length
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0;

  await updateRunStatus(run.id, "complete", {
    avg_score: avgScore,
    passed: avgScore >= 3.5,
  });

  return { run, projectId: project.id };
}
