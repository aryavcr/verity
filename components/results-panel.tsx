/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePlaygroundStore } from "@/lib/stores/playground-store";
import { DEFAULT_CRITERIA } from "@/lib/constants/criteria";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconBulb, IconPointerCollaboration } from "@tabler/icons-react";

function scoreClass(score: number) {
  if (score >= 4) return "score-high";
  if (score >= 3) return "score-mid";
  return "score-low";
}

function avgColor(avg: number) {
  if (avg >= 70) return "var(--success)";
  if (avg >= 50) return "var(--warning)";
  return "var(--destructive)";
}

//seeded pseudo-random numbers
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 10000;
  return x - Math.floor(x);
}

function ScoreCell({
  score,
  reasoning,
}: {
  score: number | undefined;
  reasoning?: string;
}) {
  const [displayScore, setDisplayScore] = useState<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (score === undefined) {
      setDisplayScore(null);
      hasAnimated.current = false;
      return;
    }
    if (score === 0) {
      setDisplayScore(0);
      return;
    }
    if (hasAnimated.current) {
      setDisplayScore(score);
      return;
    }
    hasAnimated.current = true;

    let frame = 0;
    const totalFrames = 10;
    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.ceil(Math.random() * 5));
      }
    }, 45);

    return () => clearInterval(interval);
  }, [score]);

  if (displayScore === null) {
    return (
      <div className="flex justify-center">
        <div className="w-13 h-11 rounded-xl bg-surface-2 animate-pulse" />
      </div>
    );
  }

  if (displayScore === 0 || score === 0) {
    return (
      <div className="flex justify-center">
        <div className="w-13 h-11 flex items-center justify-center text-base text-muted-foreground/40 rounded-xl bg-surface-2">
          —
        </div>
      </div>
    );
  }

  const cell = (
    <div
      className={cn(
        "w-13 h-12 flex items-center justify-center text-lg font-semibold rounded-xl score-pop shadow-surface-3",
        scoreClass(displayScore),
      )}
    >
      {displayScore}
    </div>
  );

  if (!reasoning) return <div className="flex justify-center">{cell}</div>;

  return <div className="flex justify-center">{cell}</div>;
}

//initial placeholder heatmap contents

const PLACEHOLDER = [
  { label: "Refund request", scores: [4, 3, 4, 2], avg: 65 },
  { label: "Bug report", scores: [5, 4, 5, 3], avg: 85 },
  { label: "Billing error", scores: [2, 4, 1, 1], avg: 40 },
  { label: "Feature request", scores: [4, 3, 4, 2], avg: 65 },
  { label: "Shipping delay", scores: [3, 4, 3, 3], avg: 65 },
  { label: "Login issue", scores: [4, 5, 5, 2], avg: 80 },
  { label: "Account delete", scores: [3, 3, 3, 1], avg: 50 },
  { label: "Plan upgrade", scores: [4, 4, 4, 3], avg: 75 },
];

const GRID_COLS = `1fr ${DEFAULT_CRITERIA.map(() => "52px").join(" ")} 56px`;

function PlaceholderHeatmap() {
  return (
    <div className="relative overflow-hidden bg-[#0f0f0f] shadow-surface-5 rounded-xl p-5 flex flex-col gap-2 flex-1 min-h-0">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/80 z-10 pointer-events-none rounded-xl" />

      <div className="opacity-40 pointer-events-none select-none">
        <div
          className="grid items-center gap-x-6 mr-4 mb-2"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <div />
          {DEFAULT_CRITERIA.map((c) => (
            <div
              key={c.key}
              className="text-[11px] font-medium text-muted-foreground text-right"
              style={{ letterSpacing: "0.05em" }}
            >
              {c.label}
            </div>
          ))}
          <div
            className="text-xs font-medium text-muted-foreground text-right"
            style={{ letterSpacing: "0.05em" }}
          >
            Average
          </div>
        </div>

        {PLACEHOLDER.map((row) => (
          <div
            key={row.label}
            className="grid items-center gap-x-6 px-2 py-2 rounded-lg"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <span className="text-sm text-muted-foreground truncate pr-2">
              {row.label}
            </span>
            {row.scores.map((s, i) => (
              <div key={i} className="flex justify-center">
                <div
                  className={cn(
                    "w-13 h-12 flex items-center justify-center text-base font-semibold rounded-lg",
                    scoreClass(s),
                  )}
                >
                  {s}
                </div>
              </div>
            ))}
            <div
              className="text-right text-sm font-semibold pr-1"
              style={{ color: avgColor(row.avg) }}
            >
              {row.avg}%
            </div>
          </div>
        ))}

        <div className="border-t border-border mt-2 pt-3">
          <div
            className="grid items-center gap-x-2 px-2 py-2 rounded-lg bg-surface-2"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <span className="text-xs font-bold text-foreground tracking-wide">
              Avg
            </span>
            <div className="text-center text-sm font-bold">3.6</div>
            <div className="text-center text-sm font-bold">3.8</div>
            <div className="text-center text-sm font-bold">3.6</div>
            <div className="text-center text-sm font-bold">2.1</div>
            <div
              className="text-right pr-1 text-base font-black tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--warning)",
              }}
            >
              66%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyLinkButton() {
  const { currentRunSlug } = usePlaygroundStore();
  const [copied, setCopied] = useState(false);

  if (!currentRunSlug) return null;

  function handleCopy() {
    const url = `${window.location.origin}/run/${currentRunSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm text-foreground/80 shadow-surface-6 bg-surface-5 hover:bg-surface-2 transition-colors"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7l3.5 3.5L12 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M6 8L8 6M5 9l-1.3 1.3a1.5 1.5 0 002.1 2.1L7.1 11M9 5l1.3-1.3a1.5 1.5 0 00-2.1-2.1L6.9 3"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}

export function ResultsPanel() {
  const { testCaseRows, executionStatus, model, setSelectedCell } =
    usePlaygroundStore();

  const criteria = DEFAULT_CRITERIA;
  const hasResults = testCaseRows.length > 0;

  const criteriaAvgs = criteria.map((c) => {
    const scores = testCaseRows
      .map((r) => r.results[c.key]?.score)
      .filter((s): s is number => s !== undefined && s > 0);
    if (!scores.length) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });

  const rowAvgs = testCaseRows.map((row) => {
    const scores = criteria
      .map((c) => row.results[c.key]?.score)
      .filter((s): s is number => s !== undefined && s > 0);
    if (!scores.length) return null;
    return Math.round(
      (scores.reduce((a, b) => a + b, 0) / scores.length / 5) * 100,
    );
  });

  const validAvgs = rowAvgs.filter((a): a is number => a !== null);
  const overallScore = validAvgs.length
    ? Math.round(validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length)
    : null;

  const displayScore = overallScore;

  const modelShort = model.split("/").pop()?.replace(":free", "") ?? model;

  const passCount = rowAvgs.filter((a) => a !== null && a >= 70).length;
  const failCount = rowAvgs.filter((a) => a !== null && a < 70).length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/*header*/}
      <div className="flex items-start justify-between shrink-0">
        <div className="flex items-center gap-4">
          {overallScore !== null ? (
            <>
              <div
                className="text-6xl font-black tracking-tighter"
                style={{
                  fontFamily: "var(--font-display)",
                  animation: "score-pop 500ms var(--ease-out) both",
                }}
              >
                {displayScore}%
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-muted-foreground font-mono font-medium tracking-tight">
                  overall · {testCaseRows.length} test cases · {modelShort}
                </span>
                <div className="flex items-center gap-2">
                  {passCount > 0 && (
                    <span className="text-[14px] font-medium text-success flex items-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3.5 6L6.5 2"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {passCount} passed
                    </span>
                  )}
                  {failCount > 0 && (
                    <span className="text-[14px] font-medium text-destructive flex items-center gap-0.5">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M2 2l4 4M6 2L2 6"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                      </svg>
                      {failCount} failed
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : executionStatus === "running" ||
            executionStatus === "generating-tests" ? (
            <span
              className="shimmer-text text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Evaluating...
            </span>
          ) : (
            <div className=" flex items-center gap-1 text-foreground/70 tracking-wide">
              <IconPointerCollaboration size={20} />
              Run test-cases to see scores
            </div>
          )}
        </div>

        {overallScore !== null && (
          <div className="flex justify-between gap-2 flex-col items-end mr-2">
            <div>
              <CopyLinkButton />
            </div>
            <span className="text-sm flex gap-1 text-muted-foreground/70 ml-2 ">
              <IconBulb className="size-4 mt-[1.5px]" />
              Tip : Click any row to know more
            </span>
          </div>
        )}
      </div>

      {/*placeholder*/}
      {!hasResults && executionStatus === "idle" && <PlaceholderHeatmap />}

      {/*real heatmap */}
      {(hasResults || executionStatus === "generating-tests") && (
        <div className="relative bg-[#0f0f0f] shadow-surface-6 border rounded-md p-4 flex flex-col gap-2 flex-1 min-h-0 scroll-smooth overflow-auto">
          {/*column headers*/}
          <div
            className="grid items-center gap-x-5 mr-5 mb-1 mt-1"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <div className="flex items-center mx-1.5">
              <span className="text-sm text-muted-foreground/60 font-medium tracking-widest uppercase">
                Test Cases
              </span>
            </div>
            {criteria.map((c) => (
              <Tooltip
                className="bg-black text-foreground/95 rounded-sm w-50 tracking-[0.25] text-[12px]"
                key={c.key}
                content={c.description}
                side="bottom"
              >
                <div
                  className="text-[11px] text-foreground/80 text-right"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {c.label}
                </div>
              </Tooltip>
            ))}
            <div
              className="text-[11px] ml-4 font-medium text-foreground/80 text-right pr-1"
              style={{ letterSpacing: "0.05em" }}
            >
              Average
            </div>
          </div>

          {/* skeleton */}
          {executionStatus === "generating-tests" &&
            !hasResults &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid items-center gap-x-5 px-2 py-2 rounded-lg"
                style={{
                  gridTemplateColumns: GRID_COLS,
                  animation: `fade-in 200ms var(--ease-out) ${i * 50}ms both`,
                }}
              >
                <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                {criteria.map((c) => (
                  <div key={c.key} className="flex justify-center">
                    <div className="w-11 h-8 rounded-lg bg-surface-2 animate-pulse" />
                  </div>
                ))}
                <div className="h-4 w-10 rounded bg-surface-2 animate-pulse ml-auto" />
              </div>
            ))}

          {/*random stagger */}
          {testCaseRows.map((row, idx) => {
            const rowComplete = criteria.every(
              (c) => row.results[c.key]?.score !== undefined,
            );
            //seeded jitter
            const jitter = Math.floor(seededRandom(idx + 1) * 20);
            const delay = idx * 45 + jitter;

            return (
              <div
                key={row.id}
                onClick={() =>
                  setSelectedCell({ testCaseId: row.id, criterionId: "" })
                }
                className={cn(
                  "heatmap-row grid items-center gap-x-5 px-3 py-2 rounded-xl transition-colors duration-100 cursor-pointer",
                  "hover:bg-surface-5",
                  rowComplete && "hover:bg-surface-5 hover:shadow-surface-5",
                )}
                style={{
                  gridTemplateColumns: GRID_COLS,
                  animation: `slide-up 220ms var(--ease-out) ${delay}ms both`,
                }}
              >
                <span className="text-sm text-muted-foreground pr-2">
                  {row.label ?? row.input.slice(0, 20)}
                </span>

                {criteria.map((c) => (
                  <div
                    key={c.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCell({
                        testCaseId: row.id,
                        criterionId: c.key,
                      });
                    }}
                  >
                    <ScoreCell
                      score={row.results[c.key]?.score}
                      reasoning={row.results[c.key]?.reasoning}
                    />
                  </div>
                ))}

                <div
                  className="text-right text-sm font-semibold pr-1 transition-colors duration-200"
                  style={{
                    color:
                      rowAvgs[idx] !== null
                        ? avgColor(rowAvgs[idx]!)
                        : "var(--muted-foreground)",
                  }}
                >
                  {rowAvgs[idx] !== null ? `${rowAvgs[idx]}%` : "—"}
                </div>
              </div>
            );
          })}

          {overallScore !== null && (
            <div
              className=" mt-2 pt-3"
              style={{ animation: "slide-up 300ms var(--ease-out) 400ms both" }}
            >
              <div
                className="grid items-center gap-x-5 p-4 rounded-xl border bg-black"
                style={{ gridTemplateColumns: GRID_COLS }}
              >
                <span className="text-sm text-foreground/50 tracking-wider ml-2">
                  Average
                </span>
                {criteriaAvgs.map((avg, i) => (
                  <div
                    key={criteria[i].key}
                    className="text-center text-base font-bold text-foreground/80"
                  >
                    {avg !== null ? avg.toFixed(1) : "—"}
                  </div>
                ))}
                <div
                  className="text-right text-base font-black tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: avgColor(overallScore),
                  }}
                >
                  {overallScore}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
