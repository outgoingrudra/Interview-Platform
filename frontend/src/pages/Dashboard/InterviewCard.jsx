import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  Clock3Icon,
  RadioIcon,
  ShieldCheckIcon,
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

const securityKeys = [
  "preventCopyPaste",
  "detectTabSwitch",
  "requireFullscreen",
  "detectFace",
  "detectMultipleFaces",
  "detectSuspiciousGesture",
  "detectCameraDisconnect",
];

export default function InterviewCard({
  interview,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const status =
    interview?.status || "draft";

  const style = getStatusStyle(status);

  const questionCount =
    interview?.questions?.length ?? 0;

  const enabledSecurityCount =
    securityKeys.filter((key) =>
      Boolean(
        interview?.securitySettings?.[key],
      ),
    ).length;

  const isLive = status === "live";

  const formattedDate = interview?.startsAt
    ? new Date(
        interview.startsAt,
      ).toLocaleString()
    : "Not scheduled";

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
              y: -7,
              scale: 1.015,
            }
      }
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl transition hover:border-primary/35 hover:shadow-2xl"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.12, 1],
                x: [0, -12, 0],
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

      <div className="pointer-events-none absolute -bottom-24 -left-20 size-52 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.04] via-transparent to-transparent" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
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

              {isLive && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-success">
                  <RadioIcon className="size-3" />
                  In progress
                </span>
              )}
            </div>

            <h3 className="mt-4 line-clamp-2 text-xl font-black leading-7">
              {interview?.title ||
                "Untitled Interview"}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-base-content/55">
              Manage candidates, assessment questions,
              reports and security settings.
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
            className={`grid size-11 shrink-0 place-items-center rounded-2xl shadow-sm ${style.icon}`}
          >
            <CalendarDaysIcon className="size-5" />
          </motion.div>
        </div>

        {/* Main details */}
        <div className="mt-5 grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Clock3Icon className="size-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                Duration
              </p>

              <p className="mt-0.5 text-sm font-bold">
                {interview?.durationMinutes ?? 0} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <CalendarDaysIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                Schedule
              </p>

              <p className="mt-0.5 line-clamp-2 text-sm font-bold">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2">
              <CircleHelpIcon className="size-4 text-primary" />

              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                Questions
              </p>
            </div>

            <p className="mt-2 text-xl font-black text-primary">
              {questionCount}
            </p>
          </div>

          <div className="rounded-2xl border border-success/20 bg-success/5 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-success" />

              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                Safeguards
              </p>
            </div>

            <p className="mt-2 text-xl font-black text-success">
              {enabledSecurityCount}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto pt-5">
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
              className="btn btn-outline btn-sm w-full rounded-xl transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-content"
            >
              View Details

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
                <ChevronRightIcon className="size-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}