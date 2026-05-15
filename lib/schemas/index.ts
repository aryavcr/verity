import { z } from "zod";

//for every new project
export const ProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  system_prompt: z.string().min(1),
  provider: z.enum(["openrouter", "google"]),
  model: z.string().min(1),
  judge_model: z.string().min(1),
  output_type: z.enum(["text", "json", "structured"]),
  pass_threshold: z.number().min(1).max(5).default(3.5),
});

//for every scoring criterion
export const CriterionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1).max(50),
  description: z.string().min(1),
  scorer_type: z.enum(["llm-judge", "contains-string", "json-schema"]),
  weight: z.number().positive().default(1.0),
  sort_order: z.number().int().default(0),
});

//for every testcase
export const TestCaseSchema = z.object({
  input: z.string().min(1),
  expected_output: z.string().optional(),
  is_generated: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

//for every run
export const RunSchema = z.object({
  name: z.string().min(1).max(100),
  system_prompt: z.string().min(1),
  provider: z.enum(["openrouter", "google"]),
  model: z.string().min(1),
  judge_model: z.string().min(1),
  output_type: z.enum(["text", "json", "structured"]),
});
//for every judge result
export const JudgeResultSchema = z.object({
  score: z.number().min(1).max(5),
  reasoning: z.string(),
});

//derived ts types inferred from zod schemas for type-safe usage
export type Project = z.infer<typeof ProjectSchema>;
export type Criterion = z.infer<typeof CriterionSchema>;
export type TestCase = z.infer<typeof TestCaseSchema>;
export type Run = z.infer<typeof RunSchema>;
export type JudgeResult = z.infer<typeof JudgeResultSchema>;
