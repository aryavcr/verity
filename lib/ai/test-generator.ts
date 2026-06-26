/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateText } from "ai";
import { getModel } from "./providers";

export type GeneratedTestCase = {
  label: string;
  input: string;
  expectedOutput: string;
  targetedRubrics: string[]; // rubric keys this case targets; may be empty if model omits
};

const MIN_INPUT_CHARS = 60;
const EXTERNAL_REF =
  /\b(this file|my codebase|the (attached|above)|attached (file|document)|as (mentioned|noted) (earlier|above)|previous turn|the document i shared)\b/i;

function hasInlineCode(s: string): boolean {
  return s.includes("```");
}

function parseArray(
  text: string,
  count: number,
  validRubricKeys: string[] = [],
): GeneratedTestCase[] {
  try {
    const cleaned = text.replace(/```json?\n?|\n?```/g, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (Array.isArray(parsed)) {
      return parsed.slice(0, count).map((tc: any) => {
        const rawTargets = Array.isArray(tc.targetedRubrics)
          ? tc.targetedRubrics
          : [];
        const targetedRubrics: string[] = rawTargets
          .map((k: unknown) => String(k))
          .filter(
            (k: string) =>
              validRubricKeys.length === 0 || validRubricKeys.includes(k),
          );
        return {
          label: String(tc.label || "Test case").slice(0, 30),
          input: String(tc.input || tc.label || ""),
          expectedOutput: String(tc.expectedOutput ?? tc.expected_output ?? ""),
          targetedRubrics,
        };
      });
    }
  } catch {}
  return [];
}

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
  validRubricKeys: string[] = [],
): Promise<GeneratedTestCase[]> {
  // first generation pass with the full count requested
  const first = await generateText({
    model: getModel(modelId, provider),
    temperature: 0.9,
    prompt: resolvedPrompt,
  });
  let cases = parseArray(first.text, count + 4, validRubricKeys).filter(
    isValid,
  );

  // critic pass scores and filters out weak cases
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

  // top up if critic pass left us short of target count
  if (cases.length < count) {
    const need = count - cases.length;
    const more = await generateText({
      model: getModel(modelId, provider),
      temperature: 0.95,
      prompt: resolvedPrompt,
    });
    const extra = parseArray(more.text, need + 3, validRubricKeys).filter(
      isValid,
    );
    cases = cases.concat(extra);
  }

  // rebalance if any rubric has zero targeted cases
  if (validRubricKeys.length > 0 && cases.length > 0) {
    const covered = new Set<string>();
    for (const c of cases) for (const k of c.targetedRubrics) covered.add(k);
    const missing = validRubricKeys.filter((k) => !covered.has(k));
    if (missing.length > 0) {
      const rebalancePrompt = `${resolvedPrompt}

## REBALANCE REQUEST
Your previous output left these rubric keys UNCOVERED (0 cases targeted them): ${missing.join(", ")}.
Regenerate the ENTIRE set of ${count} cases so that EACH of the keys above is the primary target of at least one case. Replace your weakest previous cases, not the strongest. Same JSON shape as before, including "targetedRubrics".`;
      try {
        const reb = await generateText({
          model: getModel(modelId, provider),
          temperature: 0.85,
          prompt: rebalancePrompt,
        });
        const rebalanced = parseArray(
          reb.text,
          count + 2,
          validRubricKeys,
        ).filter(isValid);
        // Only swap in if the rebalanced set actually covers more rubrics.
        const rebCovered = new Set<string>();
        for (const c of rebalanced)
          for (const k of c.targetedRubrics) rebCovered.add(k);
        const newMissing = validRubricKeys.filter((k) => !rebCovered.has(k));
        if (
          rebalanced.length >= Math.min(count, 4) &&
          newMissing.length < missing.length
        ) {
          cases = rebalanced;
        }
      } catch {}
    }
  }

  return cases.slice(0, count);
}
