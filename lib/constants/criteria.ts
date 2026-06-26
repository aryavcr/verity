// default evaluation criteria
export const DEFAULT_CRITERIA = [
  {
    key: "core",
    label: "Correctness",
    description:
      "Does the output accurately and completely satisfy the user request under the system-prompt constraints? 9-10: every part of the request addressed, all constraints honored, no factual or logical errors. 5-6: substantively correct but with a meaningful omission, an unhandled constraint, or a small wrong detail. 1-3: wrong, off-topic, or violates a hard rule from the system prompt.",
    scorer_type: "llm-judge" as const,
    weight: 1.0,
    sort_order: 0,
    usesGroundTruth: true,
  },
  {
    key: "brev",
    label: "Brevity",
    description:
      "Does the output waste words or bury the answer? 9-10: concise, no filler, format matches perfectly; everything the user needs and nothing they don't. 5-6: slightly padded or includes one or two bits of filler, but the substance is all there. 1-3: rambling wall of text or so terse it is unusable; answer is hard to find amid the noise.",
    scorer_type: "llm-judge" as const,
    weight: 1.0,
    sort_order: 1,
    usesGroundTruth: false,
  },
  {
    key: "hall",
    label: "Hallucination",
    description:
      "Does the output avoid fabricating facts, identifiers, citations, statistics, names, dates, or capabilities? 9-10: every concrete claim is supported by the input or system prompt, or is a clearly-marked assumption; no invented specifics. 5-6: one borderline unsupported claim or a plausible-sounding but unverified number or name; overall still trustworthy. 1-3: multiple fabricated specifics, confidently invented policy, or claims directly contradicted by the input.",
    scorer_type: "llm-judge" as const,
    weight: 1.0,
    sort_order: 2,
    usesGroundTruth: true,
  },
  {
    key: "act",
    label: "Action",
    description:
      "Can the user immediately act on the output? 9-10: concrete, specific, the user's next step is obvious and actionable without further clarification. 5-6: generally clear but missing one detail the user would have to ask for, or provides generic advice that requires adaptation. 1-3: vague platitudes, 'it depends' without resolution, or defers entirely; no actionable content.",
    scorer_type: "llm-judge" as const,
    weight: 1.0,
    sort_order: 3,
    usesGroundTruth: false,
  },
  {
    key: "tone",
    label: "Tone & Helpfulness",
    description:
      "Does the response feel polite, helpful, and human — neither robotic nor over-friendly? 9-10: warm, natural, perfectly matches the user's register; tone enhances the exchange. 5-6: appropriate overall but one slightly stiff, overly chatty, or mildly curt moment; still functional. 1-3: condescending, cold, aggressively cheerful, or otherwise mismatched to the point of being off-putting.",
    scorer_type: "llm-judge" as const,
    weight: 1.0,
    sort_order: 4,
    usesGroundTruth: false,
  },
];
