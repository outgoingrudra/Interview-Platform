// Shared motion tokens — import these everywhere instead of hardcoding
// durations/eases per component, so animation feels consistent app-wide.

export const easeOut = [0.16, 1, 0.3, 1]; // "expo out" – confident, snappy settle
export const easeInOut = [0.65, 0, 0.35, 1]; // for things that animate both ways

export const spring = {
  soft: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  snappy: { type: "spring", stiffness: 500, damping: 35 },
  bouncy: { type: "spring", stiffness: 400, damping: 20 }, // sparingly: success/live states only
};

export const duration = {
  micro: 0.15,
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
};

// Reusable variants
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeOut } },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0) => ({
  initial: {},
  animate: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};