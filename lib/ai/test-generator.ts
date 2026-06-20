/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText } from "ai";
import { getModel } from "./providers";

export type GeneratedTestCase = {
  label: string;
  input: string;
  expectedOutput: string;
};

const MIN_INPUT_CHARS = 60;
const EXTERNAL_REF =
  /\b(this file|my codebase|the (attached|above)|attached (file|document)|as (mentioned|noted) (earlier|above)|previous turn|the document i shared)\b/i;

function hasInlineCode(s: string): boolean {
  return s.includes("```");
}

function parseArray(text: string, count: number): GeneratedTestCase[] {
  try {
    const cleaned = text.replace(/```json?\n?|\n?```/g, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (Array.isArray(parsed)) {
      return parsed.slice(0, count).map((tc: any) => ({
        label: String(tc.label || "Test case").slice(0, 30),
        input: String(tc.input || tc.label || ""),
        expectedOutput: String(tc.expectedOutput ?? tc.expected_output ?? ""),
      }));
    }
  } catch {}
  return [];
}

/** a case is valid only if its long enough AND not referencing missing external context. */
function isValid(tc: GeneratedTestCase): boolean {
  if (tc.input.trim().length < MIN_INPUT_CHARS) return false;
  if (EXTERNAL_REF.test(tc.input) && !hasInlineCode(tc.input)) return false;
  return true;
}

export async function generateTestCases(
  modelId: string,
  provider: string,
  count: number,
  resolvedPrompt: string,
): Promise<GeneratedTestCase[]> {
  // 1) First pass, `resolvedPrompt` already asks for `count` cases (buildTestGenPrompt substituted {{count}})
  const first = await generateText({
    model: getModel(modelId, provider),
    temperature: 0.9,
    prompt: resolvedPrompt,
  });
  let cases = parseArray(first.text, count + 4).filter(isValid);

  // 2) Criticc pass, score remaining cases; keep the strongest, flag weak ones.
  if (cases.length > 0) {
    const criticPrompt = `You are reviewing candidate evaluation test cases. Score EACH case 1-10 on: difficulty (does it genuinely stress the system?), self-containment (fully answerable from the input alone, no external file/codebase references?), and realism (could a real user send this?). Return ONLY JSON: {"scores":[{"index":<0-based>,"keep":<true|false>,"reason":"<short>"}]}. Mark keep=false for any case that is vague, trivially easy, or references content not present in the input.

Cases:
${cases.map((c, i) => `[${i}] input: ${c.input}`).join("\n\n")}`;
    try {
      const crit = await generateText({
        model: getModel(modelId, provider),
        temperature: 0,
        prompt: criticPrompt,
      });
      const cleaned = crit.text.replace(/```json?\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(
        cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1),
      ) as { scores?: { index: number; keep: boolean }[] };
      const keepSet = new Set(
        (parsed.scores ?? []).filter((s) => s.keep).map((s) => s.index),
      );
      if (keepSet.size > 0) cases = cases.filter((_, i) => keepSet.has(i));
    } catch {}
  }

  // 3) Top up if the critic + filters left us short of `count`
  if (cases.length < count) {
    const need = count - cases.length;
    const more = await generateText({
      model: getModel(modelId, provider),
      temperature: 0.95,
      prompt: resolvedPrompt,
    });
    const extra = parseArray(more.text, need + 3).filter(isValid);
    cases = cases.concat(extra);
  }

  return cases.slice(0, count);
}
