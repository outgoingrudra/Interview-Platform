import {
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
  XCircleIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

const securityItems = [
  {
    key: "preventCopyPaste",
    label: "Copy and Paste Protection",
    description: "Blocks copy, cut and paste actions.",
    icon: ClipboardXIcon,
  },
  {
    key: "detectTabSwitch",
    label: "Tab Switch Detection",
    description: "Records when candidates leave the interview tab.",
    icon: MonitorOffIcon,
  },
  {
    key: "requireFullscreen",
    label: "Fullscreen Required",
    description: "Warns when candidates exit fullscreen mode.",
    icon: MaximizeIcon,
  },
  {
    key: "detectFace",
    label: "Face Detection",
    description: "Detects when the candidate's face is missing.",
    icon: EyeIcon,
  },
  {
    key: "detectMultipleFaces",
    label: "Multiple Face Detection",
    description: "Detects when more than one person appears.",
    icon: UsersIcon,
  },
  {
    key: "detectSuspiciousGesture",
    label: "Suspicious Gesture Detection",
    description: "Monitors unusual hand and head movements.",
    icon: HandIcon,
  },
  {
    key: "detectCameraDisconnect",
    label: "Camera Disconnect Detection",
    description: "Detects when the camera becomes unavailable.",
    icon: CameraOffIcon,
  },
];

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SecuritySummary({
  settings = {},
}) {
  const shouldReduceMotion = useReducedMotion();

  const enabledCount =
    securityItems?.filter(({ key }) =>
      Boolean(settings?.[key]),
    )?.length ?? 0;

  const totalItems =
    securityItems?.length ?? 0;

  const securityStrength =
    totalItems > 0
      ? Math.round(
          (enabledCount / totalItems) * 100,
        )
      : 0;

  const warningLimit =
    settings?.warningLimit ?? 3;

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-success/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-base-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
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
                Protection Overview
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Security
              </h2>

              <p className="mt-1 text-sm leading-6 text-base-content/60">
                Review all enabled monitoring and interview protection rules.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-success badge-lg whitespace-nowrap">
              {enabledCount}/{totalItems} enabled
            </span>

            <span
              className={`badge badge-lg whitespace-nowrap ${
                securityStrength >= 75
                  ? "badge-success"
                  : securityStrength >= 40
                    ? "badge-warning"
                    : "badge-error"
              }`}
            >
              {securityStrength}% strength
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">
                Interview Protection
              </p>

              <p className="mt-1 text-xs text-base-content/55">
                Security strength based on enabled safeguards.
              </p>
            </div>

            <SparklesIcon className="size-5 text-primary" />
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-300">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${securityStrength}%`,
              }}
              transition={{
                duration: 0.7,
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

        <div className="mt-5 grid gap-3">
          {securityItems?.map(
            (
              {
                key,
                label,
                description,
                icon: Icon,
              },
              index,
            ) => {
              const enabled = Boolean(
                settings?.[key],
              );

              return (
                <motion.div
                  key={key}
                  custom={index}
                  variants={itemVariants}
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
                          y: -2,
                          scale: 1.005,
                        }
                  }
                  className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition ${
                    enabled
                      ? "border-success/30 bg-success/5"
                      : "border-base-300 bg-base-200/40"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`grid size-10 shrink-0 place-items-center rounded-2xl ${
                        enabled
                          ? "bg-success/15 text-success"
                          : "bg-base-300/70 text-base-content/45"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-black">
                        {label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-base-content/55">
                        {description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`badge shrink-0 gap-1 ${
                      enabled
                        ? "badge-success"
                        : "badge-ghost"
                    }`}
                  >
                    {enabled ? (
                      <CheckCircle2Icon className="size-3.5" />
                    ) : (
                      <XCircleIcon className="size-3.5" />
                    )}

                    {enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </motion.div>
              );
            },
          )}
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 14,
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
          className="mt-5 flex flex-col gap-4 rounded-2xl border border-warning/25 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-black">
              Warning Limit
            </p>

            <p className="mt-1 text-xs leading-5 text-base-content/55">
              Candidate session ends automatically after reaching this limit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-warning badge-lg">
              {warningLimit}
            </span>

            <span className="text-xs font-semibold text-base-content/50">
              warnings
            </span>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}