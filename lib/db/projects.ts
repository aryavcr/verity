import { supabase } from "./supabase";
import { DEFAULT_CRITERIA } from "@/lib/constants/criteria";

type CriterionInput = {
  key: string;
  label: string;
  description: string;
  scorer_type: "llm-judge";
  weight: number;
  sort_order: number;
};

export async function createProject(
  data: {
    name: string;
    system_prompt: string;
    provider: string;
    model: string;
    judge_model: string;
    output_type: string;
    user_id: string;
  },
  /** Optional because it defaults to DEFAULT_CRITERIA (the "general" eval type) for back-compatibility */
  criteria: CriterionInput[] = DEFAULT_CRITERIA,
) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  const criteriaRows = criteria.map((c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    scorer_type: c.scorer_type,
    weight: c.weight,
    sort_order: c.sort_order,
    project_id: project.id,
    user_id: data.user_id,
  }));

  const { error: criteriaError } = await supabase
    .from("criteria")
    .insert(criteriaRows);

  if (criteriaError) throw criteriaError;

  return project;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProjectPrompt(id: string, system_prompt: string) {
  const { error } = await supabase
    .from("projects")
    .update({ system_prompt, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function getCriteria(project_id: string) {
  const { data, error } = await supabase
    .from("criteria")
    .select("*")
    .eq("project_id", project_id)
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function updateCriterionLabel(id: string, label: string) {
  const { error } = await supabase
    .from("criteria")
    .update({ label })
    .eq("id", id);

  if (error) throw error;
}
