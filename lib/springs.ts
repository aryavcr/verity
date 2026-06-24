const fastBase = {
  type: "spring" as const,
  duration: 0.08,
  bounce: 0,
};
const moderateBase = {
  type: "spring" as const,
  duration: 0.16,
  bounce: 0.08,
};
const slowBase = {
  type: "spring" as const,
  duration: 0.24,
  bounce: 0.12,
};

export const springs = {
  fast: fastBase,
  moderate: moderateBase,
  slow: slowBase,
} as const;

export const spring = {
  fast: { ...fastBase, exit: { duration: 0.06 } },
  moderate: { ...moderateBase, exit: { duration: 0.12 } },
  slow: { ...slowBase, exit: { duration: 0.16 } },
} as const;
