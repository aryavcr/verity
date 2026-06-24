import { supabase } from "./supabase";
import { generateSlug } from "@/lib/utils/slug";

export async function createRun(data: {
  project_id: string;
  name: string;
  system_prompt: string;
  provider: string;
  model: string;
  judge_model: string;
  output_type: string;
  user_id: string;
  mode?: "single" | "battle" | "multi-turn";
  model_b?: string;
  provider_b?: string;
  eval_type_id?: string;
  parent_run_id?: string | null;
  version_number?: number;
}) {
  const slug = generateSlug();

  const { data: run, error } = await supabase
    .from("runs")
    .insert({ ...data, slug, status: "running" })
    .select()
    .single();

  if (error) throw error;
  return run;
}

export async function updateRunStatus(
  id: string,
  status: "running" | "complete" | "failed",
  summary?: {
    avg_score?: number;
    passed?: boolean;
    avg_score_b?: number;
    passed_b?: boolean;
    total_tokens?: number;
    total_tokens_b?: number;
    total_cost_usd?: number;
    total_latency_ms?: number;
  },
) {
  const { error } = await supabase
    .from("runs")
    .update({
      status,
      completed_at: status !== "running" ? new Date().toISOString() : null,
      ...summary,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getRunBySlug(slug: string) {
  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function insertRunResult(result: {
  run_id: string;
  test_case_id: string;
  criterion_id: string;
  score: number;
  reasoning: string;
  model_output: string;
  latency_ms: number;
  tokens_in: number;
  tokens_out: number;
  user_id: string;
  model_slot?: "a" | "b";
  holistic?: number | null;
  verdict?: "pass" | "degraded" | "fail" | null;
}) {
  const { error } = await supabase.from("run_results").insert(result);
  if (error) throw error;
}

export async function insertRunResults(
  rows: Parameters<typeof insertRunResult>[0][],
) {
  if (!rows.length) return;
  const { error } = await supabase.from("run_results").insert(rows);
  if (error) throw error;
}

/** Keep only the latest `keep` runs for one user, dletes older runs' projects & remember that CASCADE sweeps children */
export async function pruneOldRuns(
  userId: string,
  keep: number,
): Promise<void> {
  const { data: oldRuns, error } = await supabase
    .from("runs")
    .select("project_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(keep, keep + 999);

  if (error || !oldRuns?.length) return;

  const projectIds = Array.from(
    new Set(oldRuns.map((r) => r.project_id).filter(Boolean)),
  );
  if (projectIds.length === 0) return;

  await supabase.from("projects").delete().in("id", projectIds);
}

/** Keep only the latest `keep` projects for one user. Used for anon users so a whole b1 to v3 chain (which lives under one project) counts as a single slot instead of N. Projects are ordered by their most-recent run activity so iterating on an older project bumps it back to the front.
 */
export async function pruneOldProjects(
  userId: string,
  keep: number,
): Promise<void> {
  const { data, error } = await supabase
    .from("runs")
    .select("project_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return;

  // First-appearance order = most-recent activity first; dedupe project_ids.
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const r of data) {
    const pid = r.project_id as string | null;
    if (!pid || seen.has(pid)) continue;
    seen.add(pid);
    ordered.push(pid);
  }

  const toDelete = ordered.slice(keep);
  if (toDelete.length === 0) return;

  await supabase.from("projects").delete().in("id", toDelete);
}

/**aall runs sharing a project_id, ordered by version_number ascending. */
export async function getRunChainByProject(projectId: string) {
  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("project_id", projectId)
    .order("version_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function countRunsToday(userId: string): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { count, error } = await supabase
    .from("runs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (error) return 0;
  return count ?? 0;
}

export async function setRunVisibility(runId: string, isPublic: boolean) {
  const { error } = await supabase
    .from("runs")
    .update({ is_public: isPublic })
    .eq("id", runId);
  if (error) throw error;
}

export async function updateRunName(runId: string, name: string) {
  const { error } = await supabase
    .from("runs")
    .update({ name })
    .eq("id", runId);
  if (error) throw error;
}
