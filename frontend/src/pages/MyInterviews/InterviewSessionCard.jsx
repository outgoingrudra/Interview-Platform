import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  EyeIcon,
  LockKeyholeIcon,
  RadioIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

const getStatusStyle = (status) => {
  const styles = {
    waiting: {
      badge: "badge-ghost",
      glow: "bg-base-content/10",
      icon: "bg-base-300 text-base-content/60",
    },

    active: {
      badge: "badge-success",
      glow: "bg-success/15",
      icon: "bg-success/15 text-success",
    },

    submitted: {
      badge: "badge-primary",
      glow: "bg-primary/15",
      icon: "bg-primary/15 text-primary",
    },

    completed: {
      badge: "badge-info",
      glow: "bg-info/15",
      icon: "bg-info/15 text-info",
    },

    expired: {
      badge: "badge-warning",
      glow: "bg-warning/15",
      icon: "bg-warning/15 text-warning",
    },

    terminated: {
      badge: "badge-error",
      glow: "bg-error/15",
      icon: "bg-error/15 text-error",
    },
  };

  return styles?.[status] ?? styles.waiting;
};

const canViewResult = (status) =>
  ["submitted", "completed"].includes(status);

export default function InterviewSessionCard({
  session,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const interview = session?.interview;
  const status = session?.status || "waiting";
  const style = getStatusStyle(status);

  const isActive = status === "active";
  const resultAvailable = canViewResult(status);

  const hostName =
    interview?.host?.name ||
    interview?.host?.email ||
    "Unknown host";

  const warningCount = Number(
    session?.warningCount ?? 0,
  );

  const startedAt = session?.startedAt
    ? new Date(session.startedAt).toLocaleString()
    : "Not started";

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
              scale: 0.96,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -8,
              scale: 1.015,
            }
      }
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl transition duration-300 hover:border-primary/40 hover:shadow-2xl"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.12, 1],
                x: [0, -14, 0],
                y: [0, 10, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="pointer-events-none absolute -bottom-24 -left-20 size-56 rounded-full bg-secondary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.045] via-transparent to-transparent" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <UserIcon className="size-4 text-primary" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  Candidate Session
                </p>
              </div>

              <span
                className={`badge badge-sm capitalize ${style.badge}`}
              >
                {isActive && (
                  <span className="relative mr-1 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-current" />
                  </span>
                )}

                {status}
              </span>
            </div>

            <h2 className="mt-4 line-clamp-2 text-xl font-black leading-7">
              {interview?.title || "Interview"}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/50">
              <UserIcon className="size-3.5 shrink-0" />

              <span className="truncate">
                Hosted by{" "}
                <span className="font-bold text-base-content/70">
                  {hostName}
                </span>
              </span>
            </div>
          </div>

          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: 7,
                    scale: 1.08,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 18,
            }}
            className={`grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm ${style.icon}`}
          >
            <SparklesIcon className="size-5" />
          </motion.div>
        </div>

        {/* Live state */}
        {isActive && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-success/25 bg-success/10 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>

              <div>
                <p className="text-xs font-black text-success">
                  Interview in progress
                </p>

                <p className="text-[11px] text-base-content/50">
                  Your session is currently active
                </p>
              </div>
            </div>

            <RadioIcon className="size-5 text-success" />
          </motion.div>
        )}

        {/* Session details */}
        <div className="mt-5 grid gap-3">
          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 3,
                  }
            }
            className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-100"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Clock3Icon className="size-4" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Interview Duration
              </p>

              <p className="mt-1 text-sm font-bold">
                {interview?.durationMinutes ?? 0} minutes
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 3,
                  }
            }
            className="flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-100"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <CalendarDaysIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Started At
              </p>

              <p className="mt-1 line-clamp-2 text-sm font-bold">
                {startedAt}
              </p>
            </div>
          </motion.div>

          <motion.div
            key={warningCount}
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.97,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              x:
                warningCount > 0 &&
                !shouldReduceMotion
                  ? [0, -2, 2, -1, 1, 0]
                  : 0,
            }}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              warningCount > 0
                ? "border-warning/30 bg-warning/10"
                : "border-success/20 bg-success/5"
            }`}
          >
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                warningCount > 0
                  ? "bg-warning/15 text-warning"
                  : "bg-success/15 text-success"
              }`}
            >
              {warningCount > 0 ? (
                <AlertTriangleIcon className="size-4" />
              ) : (
                <CheckCircle2Icon className="size-4" />
              )}
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Security Integrity
              </p>

              <p
                className={`mt-1 text-sm font-bold ${
                  warningCount > 0
                    ? "text-warning"
                    : "text-success"
                }`}
              >
                {warningCount > 0
                  ? `${warningCount} warning${
                      warningCount === 1 ? "" : "s"
                    } recorded`
                  : "No warnings recorded"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Result availability */}
        <div className="mt-auto pt-6">
          <div className="mb-3 flex items-center justify-between border-t border-base-300 pt-4 text-xs text-base-content/50">
            <div className="flex items-center gap-2">
              <LockKeyholeIcon className="size-3.5" />

              <span>Result status</span>
            </div>

            <span
              className={`font-bold ${
                resultAvailable
                  ? "text-success"
                  : "text-base-content/45"
              }`}
            >
              {resultAvailable
                ? "Available"
                : "Unavailable"}
            </span>
          </div>

          {resultAvailable ? (
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.97,
                    }
              }
            >
              <Link
                to={`/sessions/${session?._id}/result`}
                className="btn btn-primary btn-sm w-full gap-2 rounded-xl shadow-sm shadow-primary/15"
              >
                <EyeIcon className="size-4" />
                View Result

                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: [0, 3, 0],
                        }
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowUpRightIcon className="size-4" />
                </motion.span>
              </Link>
            </motion.div>
          ) : (
            <button
              type="button"
              disabled
              className="btn btn-ghost btn-sm w-full rounded-xl"
            >
              Result unavailable
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}