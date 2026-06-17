const fastBase = {
  type: "spring" as const,
  duration: 0.08,
  bounce: 0,
};
const moderateBase = {
  type: "spring" as const,
  duration: 0.16,
  bounce: 0.15,
};
const slowBase = {
  type: "spring" as const,
  duration: 0.24,
  bounce: 0.15,
};

export const springs = {
  fast: fastBase,
  moderate: moderateBase,
  slow: slowBase,
} as const;

// `spring` (singular) — alias used by the fluid-functionalism slider.
// Each tier carries an `.exit` that AnimatePresence reads on unmount.
export const spring = {
  fast: { ...fastBase, exit: fastBase },
  moderate: { ...moderateBase, exit: moderateBase },
  slow: { ...slowBase, exit: slowBase },
} as const;
