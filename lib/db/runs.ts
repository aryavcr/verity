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
    total_tokens?: number;
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

export async function getRunsByProject(project_id: string) {
  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
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
}) {
  const { error } = await supabase.from("run_results").insert(result);
  if (error) throw error;
}

export async function getRunResults(run_id: string) {
  const { data, error } = await supabase
    .from("run_results")
    .select("*")
    .eq("run_id", run_id);

  if (error) throw error;
  return data;
}
