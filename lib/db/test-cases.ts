import { supabase } from "./supabase";

export async function upsertTestCases(
  project_id: string,
  inputs: {
    input: string;
    label?: string;
    expected_output?: string;
    is_generated: boolean;
  }[],
) {
  //first we remove those existing generated test cases
  await supabase
    .from("test_cases")
    .delete()
    .eq("project_id", project_id)
    .eq("is_generated", true);

  const rows = inputs.map((tc, i) => ({
    ...tc,
    project_id,
    sort_order: i,
  }));

  const { data, error } = await supabase
    .from("test_cases")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function getTestCases(project_id: string) {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*")
    .eq("project_id", project_id)
    .order("sort_order");

  if (error) throw error;
  return data;
}
