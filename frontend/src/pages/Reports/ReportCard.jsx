import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  EyeIcon,
  FileBarChartIcon,
  RadioTowerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

const getStatusStyle = (status) => {
  const styles = {
    draft: {
      badge: "badge-ghost",
      glow: "bg-base-content/10",
      icon: "bg-base-300 text-base-content/60",
    },

    scheduled: {
      badge: "badge-warning",
      glow: "bg-warning/15",
      icon: "bg-warning/15 text-warning",
    },

    live: {
      badge: "badge-success",
      glow: "bg-success/15",
      icon: "bg-success/15 text-success",
    },

    completed: {
      badge: "badge-info",
      glow: "bg-info/15",
      icon: "bg-info/15 text-info",
    },

    cancelled: {
      badge: "badge-error",
      glow: "bg-error/15",
      icon: "bg-error/15 text-error",
    },
  };

  return styles?.[status] ?? styles.draft;
};

export default function ReportCard({
  interview,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const status =
    interview?.status || "draft";

  const isLive = status === "live";

  const style = getStatusStyle(status);

  const formattedDate = interview?.startsAt
    ? new Date(
        interview.startsAt,
      ).toLocaleString()
    : "No scheduled date";

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

      <div className="pointer-events-none absolute -bottom-24 -left-20 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.045] via-transparent to-transparent" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* Top section */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <FileBarChartIcon className="size-4 text-primary" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  Interview Report
                </p>
              </div>

              <span
                className={`badge badge-sm capitalize ${style.badge}`}
              >
                {isLive && (
                  <span className="relative mr-1 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50" />

                    <span className="relative inline-flex size-2 rounded-full bg-current" />
                  </span>
                )}

                {status}
              </span>
            </div>

            <h2 className="mt-4 line-clamp-2 text-xl font-black leading-7">
              {interview?.title ||
                "Untitled Interview"}
            </h2>

            <p className="mt-2 truncate text-xs text-base-content/40">
              Report ID: {interview?._id || "Unavailable"}
            </p>
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
        {isLive && (
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
                  Interview Live
                </p>

                <p className="text-[11px] text-base-content/50">
                  Reports are updating in real time
                </p>
              </div>
            </div>

            <RadioTowerIcon className="size-5 text-success" />
          </motion.div>
        )}

        {/* Details */}
        <div className="mt-5 grid gap-3">
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
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <CalendarDaysIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Scheduled
              </p>

              <p className="mt-1 line-clamp-2 text-sm font-bold">
                {formattedDate}
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
            className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-100"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <UsersIcon className="size-4" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Candidate Sessions
              </p>

              <p className="mt-1 text-sm font-bold">
                Review joined candidates
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
            className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-100"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
              <ShieldCheckIcon className="size-4" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
                Report Availability
              </p>

              <p className="mt-1 text-sm font-bold">
                {isLive
                  ? "Collecting session data"
                  : "Reports ready for review"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom action */}
        <div className="mt-auto pt-6">
          <div className="mb-3 flex items-center justify-between border-t border-base-300 pt-4 text-xs text-base-content/50">
            <span>Candidate reports</span>

            <span className="font-bold text-base-content/70">
              Available
            </span>
          </div>

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
              to={`/interviews/${interview?._id}`}
              className="btn btn-primary btn-sm w-full rounded-xl gap-2 shadow-sm shadow-primary/15"
            >
              <EyeIcon className="size-4" />
              View Reports

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
        </div>
      </div>
    </motion.article>
  );
}