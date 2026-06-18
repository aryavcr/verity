import { useEffect, useRef, useState } from "react";

/**counts 0 > target with cubic ease-out over duration in ms & re-runs when target changes. */
export function useCountUp(target: number | null, duration = 900): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    if (target === null || target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return value;
}
