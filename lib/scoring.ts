import { EvalScores } from './types';
import { SCORE_COLORS } from './constants';

export function getScoreColor(score: number): string {
  return SCORE_COLORS[Math.round(score)] ?? 'bg-zinc-700';
}

export function getAvgTextColor(avg: number): string {
  if (avg >= 75) return 'text-green-400';
  if (avg >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export function getOverallScoreColor(score: number): string {
  if (score >= 75) return 'text-green-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export function computeRowAvg(scores: EvalScores): number {
  const numericAvg = (scores.coreIssue + scores.noHallucination + scores.action) / 3;
  const brevityScore = scores.brevity ? 5 : 1;
  const overall = (numericAvg * 3 + brevityScore) / 4;
  return Math.round((overall / 5) * 100);
}

export function computeColumnAverages(allScores: EvalScores[]): {
  coreIssue: number;
  brevity: number;
  noHallucination: number;
  action: number;
} {
  const count = allScores.length;
  if (count === 0) return { coreIssue: 0, brevity: 0, noHallucination: 0, action: 0 };

  return {
    coreIssue: round1(allScores.reduce((s, e) => s + e.coreIssue, 0) / count),
    brevity: Math.round((allScores.filter(e => e.brevity).length / count) * 100),
    noHallucination: round1(allScores.reduce((s, e) => s + e.noHallucination, 0) / count),
    action: round1(allScores.reduce((s, e) => s + e.action, 0) / count),
  };
}

export function computeOverallScore(allScores: EvalScores[]): number {
  if (allScores.length === 0) return 0;
  const rowAvgs = allScores.map(computeRowAvg);
  return Math.round(rowAvgs.reduce((s, a) => s + a, 0) / rowAvgs.length);
}

export function formatColumnAvg(value: number, type: 'numeric' | 'boolean'): string {
  return type === 'boolean' ? `${value}%` : value.toFixed(1);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}