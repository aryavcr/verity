export function scoreClass(score: number): string {
  if (score >= 4.0) return "score-high";
  if (score >= 3.0) return "score-mid";
  return "score-low";
}

export function scoreToPercent(score: number): number {
  return Math.round((score / 5) * 100);
}

export function avgPercent(scores: number[]): number {
  if (!scores.length) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return scoreToPercent(avg);
}

export function isPassing(avgScore: number, threshold: number): boolean {
  return avgScore >= threshold;
}
