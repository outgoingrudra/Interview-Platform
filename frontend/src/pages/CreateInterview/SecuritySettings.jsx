import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  AlertTriangleIcon,
  CameraOffIcon,
  CheckCircle2Icon,
  ClipboardXIcon,
  EyeIcon,
  HandIcon,
  MaximizeIcon,
  MonitorOffIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

const securityOptions = [
  {
    key: "preventCopyPaste",
    title: "Prevent Copy and Paste",
    description: "Block copy, cut and paste actions.",
    icon: ClipboardXIcon,
    tone: "primary",
  },
  {
    key: "detectTabSwitch",
    title: "Detect Tab Switching",
    description:
      "Record when candidates leave the interview tab.",
    icon: MonitorOffIcon,
    tone: "secondary",
  },
  {
    key: "requireFullscreen",
    title: "Require Fullscreen",
    description:
      "Warn candidates when they exit fullscreen mode.",
    icon: MaximizeIcon,
    tone: "accent",
  },
  {
    key: "detectFace",
    title: "Face Detection",
    description:
      "Detect when the candidate's face is missing.",
    icon: EyeIcon,
    tone: "success",
  },
  {
    key: "detectMultipleFaces",
    title: "Multiple Face Detection",
    description:
      "Detect when multiple people appear on camera.",
    icon: UsersIcon,
    tone: "warning",
  },
  {
    key: "detectSuspiciousGesture",
    title: "Suspicious Gesture Detection",
    description:
      "Record repeated unusual hand movements for host review.",
    icon: HandIcon,
    tone: "error",
  },
  {
    key: "detectCameraDisconnect",
    title: "Camera Disconnect Detection",
    description:
      "Detect if the camera disconnects or becomes unavailable.",
    icon: CameraOffIcon,
    tone: "info",
  },
];

const toneClasses = {
  primary: {
    icon: "bg-primary/15 text-primary",
    border: "border-primary/35",
    background: "bg-primary/5",
    glow: "bg-primary/15",
  },

  secondary: {
    icon: "bg-secondary/15 text-secondary",
    border: "border-secondary/35",
    background: "bg-secondary/5",
    glow: "bg-secondary/15",
  },

  accent: {
    icon: "bg-accent/15 text-accent",
    border: "border-accent/35",
    background: "bg-accent/5",
    glow: "bg-accent/15",
  },

  success: {
    icon: "bg-success/15 text-success",
    border: "border-success/35",
    background: "bg-success/5",
    glow: "bg-success/15",
  },

  warning: {
    icon: "bg-warning/15 text-warning",
    border: "border-warning/35",
    background: "bg-warning/5",
    glow: "bg-warning/15",
  },

  error: {
    icon: "bg-error/15 text-error",
    border: "border-error/35",
    background: "bg-error/5",
    glow: "bg-error/15",
  },

  info: {
    icon: "bg-info/15 text-info",
    border: "border-info/35",
    background: "bg-info/5",
    glow: "bg-info/15",
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.97,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SecuritySettings({
  settings = {},
  setSettings,
}) {
  const shouldReduceMotion = useReducedMotion();

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const enabledCount =
    securityOptions?.filter(({ key }) =>
      Boolean(settings?.[key]),
    )?.length ?? 0;

  const warningLimit = Number(
    settings?.warningLimit ?? 3,
  );

  const securityStrength =
    securityOptions?.length > 0
      ? Math.round(
          (enabledCount /
            securityOptions.length) *
            100,
        )
      : 0;

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-success/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.035] via-transparent to-transparent" />

      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-base-300 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 6,
                      scale: 1.08,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-success/15 text-success shadow-sm"
            >
              <ShieldCheckIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-success">
                Step 3
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Security Settings
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                Configure candidate monitoring,
                browser protection and warning limits.
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-3">
              <p className="text-xs font-semibold text-base-content/50">
                Protection enabled
              </p>

              <p className="mt-1 text-xl font-black text-success">
                {enabledCount}/{securityOptions?.length}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-3">
              <p className="text-xs font-semibold text-base-content/50">
                Security strength
              </p>

              <p className="mt-1 text-xl font-black text-primary">
                {securityStrength}%
              </p>
            </div>
          </div>
        </div>

        {/* Strength progress */}
        <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/35 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">
                Interview Protection
              </p>

              <p className="mt-1 text-xs text-base-content/55">
                Enable more safeguards for stronger monitoring.
              </p>
            </div>

            <span
              className={`badge ${
                securityStrength >= 75
                  ? "badge-success"
                  : securityStrength >= 40
                    ? "badge-warning"
                    : "badge-error"
              }`}
            >
              {securityStrength >= 75
                ? "Strong"
                : securityStrength >= 40
                  ? "Moderate"
                  : "Basic"}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-300">
            <motion.div
              animate={{
                width: `${securityStrength}%`,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`h-full rounded-full ${
                securityStrength >= 75
                  ? "bg-success"
                  : securityStrength >= 40
                    ? "bg-warning"
                    : "bg-error"
              }`}
            />
          </div>
        </div>

        {/* Options */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {securityOptions?.map(
            (
              {
                key,
                title,
                description,
                icon: Icon,
                tone,
              },
              index,
            ) => {
              const enabled = Boolean(
                settings?.[key],
              );

              const styles =
                toneClasses?.[tone] ??
                toneClasses?.primary;

              return (
                <motion.label
                  key={key}
                  custom={index}
                  variants={cardVariants}
                  initial={
                    shouldReduceMotion
                      ? false
                      : "hidden"
                  }
                  animate="visible"
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -4,
                          scale: 1.01,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                  className={`group/option relative isolate flex cursor-pointer items-start justify-between gap-4 overflow-hidden rounded-3xl border p-4 shadow-sm transition sm:p-5 ${
                    enabled
                      ? `${styles?.border} ${styles?.background}`
                      : "border-base-300 bg-base-200/35 hover:border-primary/30 hover:bg-base-100"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 size-28 rounded-full blur-3xl transition duration-500 group-hover/option:scale-125 ${
                      enabled
                        ? styles?.glow
                        : "bg-base-content/5"
                    }`}
                  />

                  <div className="relative flex min-w-0 gap-3">
                    <motion.div
                      animate={{
                        rotate: enabled ? 0 : -4,
                        scale: enabled ? 1.05 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 20,
                      }}
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl shadow-sm ${
                        enabled
                          ? styles?.icon
                          : "bg-base-300/70 text-base-content/50"
                      }`}
                    >
                      <Icon className="size-5" />
                    </motion.div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black">
                          {title}
                        </p>

                        <AnimatePresence>
                          {enabled && (
                            <motion.span
                              initial={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              className="badge badge-success badge-sm gap-1"
                            >
                              <CheckCircle2Icon className="size-3" />
                              Enabled
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-base-content/60">
                        {description}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) =>
                      updateSetting(
                        key,
                        Boolean(
                          event?.target?.checked,
                        ),
                      )
                    }
                    className="toggle toggle-primary toggle-sm relative shrink-0"
                    aria-label={title}
                  />
                </motion.label>
              );
            },
          )}
        </div>

        {/* Warning limit */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.4,
          }}
          className="mt-6 overflow-hidden rounded-3xl border border-warning/25 bg-warning/5"
        >
          <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-warning/15 text-warning">
                <AlertTriangleIcon className="size-5" />
              </div>

              <div>
                <p className="font-black">
                  Warning Limit
                </p>

                <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                  The candidate session will be
                  terminated after reaching this
                  warning limit.
                </p>
              </div>
            </div>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "warningLimit",
                    Math.max(
                      1,
                      warningLimit - 1,
                    ),
                  )
                }
                disabled={warningLimit <= 1}
                className="btn btn-outline btn-circle btn-sm"
                aria-label="Decrease warning limit"
              >
                −
              </button>

              <motion.div
                key={warningLimit}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="grid min-w-20 place-items-center rounded-2xl border border-warning/30 bg-base-100 px-5 py-3"
              >
                <span className="text-2xl font-black text-warning">
                  {warningLimit}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                  warnings
                </span>
              </motion.div>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "warningLimit",
                    Math.min(
                      20,
                      warningLimit + 1,
                    ),
                  )
                }
                disabled={warningLimit >= 20}
                className="btn btn-outline btn-circle btn-sm"
                aria-label="Increase warning limit"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-warning/20 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between text-xs text-base-content/55">
              <span>Strict</span>
              <span>Balanced</span>
              <span>Flexible</span>
            </div>

            <input
              type="range"
              min="1"
              max="20"
              value={warningLimit}
              onChange={(event) =>
                updateSetting(
                  "warningLimit",
                  Number(
                    event?.target?.value,
                  ),
                )
              }
              className="range range-warning range-sm mt-2 w-full"
              aria-label="Warning limit"
            />
          </div>
        </motion.div>

        {/* Final info */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.45,
          }}
          className="mt-5 flex items-start gap-3 rounded-2xl border border-info/25 bg-info/10 p-4"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-info/15 text-info">
            <SparklesIcon className="size-4" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Recommended configuration
            </p>

            <p className="mt-1 text-sm leading-6 text-base-content/60">
              For secure technical interviews, enable
              fullscreen, tab-switch detection, face
              monitoring and camera disconnect detection.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}