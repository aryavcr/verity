// strip provider prefix and :free suffix from model id
export function shortModel(m: string): string {
  return m.split("/").pop()?.replace(":free", "") ?? m;
}

// append alpha channel to hex color, clamps to 0-1
export function hexAlpha(hex: string, alpha: number): string {
  return `${hex}${Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`
}

export function formatTokens(n: number): string {
  if (n < 1000) return `${n}`
  return `${(n / 1000).toFixed(1)}k`
}

export function formatCost(usd: number): string {
  if (usd < 0.01) return `<$0.01`
  return `$${usd.toFixed(3)}`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}