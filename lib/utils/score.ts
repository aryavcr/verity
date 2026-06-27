import { SCORE_MAX } from "@/lib/constants/scoring"

// map score to css class for color coding
export function scoreClass(score: number): string {
  if (score >= 8) return "score-high"
  if (score >= 6) return "score-mid"
  return "score-low"
}

// convert raw score to percentage
export function scoreToPercent(score: number): number {
  return Math.round((score / SCORE_MAX) * 100)
}

// compute average score as a percentage
export function avgPercent(scores: number[]): number {
  if (!scores.length) return 0
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return scoreToPercent(avg)
}

// check if average score meets threshold
export function isPassing(avgScore: number, threshold: number): boolean {
  return avgScore >= threshold
}