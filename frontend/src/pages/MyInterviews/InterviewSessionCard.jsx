import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertTriangleIcon,
  CalendarDaysIcon,
  Clock3Icon,
  EyeIcon,
  UserIcon,
} from "lucide-react";

const getStatusClass = (status) => {
  const classes = {
    waiting: "badge-ghost",
    active: "badge-success",
    submitted: "badge-primary",
    completed: "badge-info",
    expired: "badge-warning",
    terminated: "badge-error",
  };

  return classes?.[status] || "badge-ghost";
};

const canViewResult = (status) =>
  ["submitted", "completed"].includes(status);

export default function InterviewSessionCard({
  session,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const interview = session?.interview;
  const status = session?.status;

  const hostName =
    interview?.host?.name ||
    interview?.host?.email ||
    "Unknown host";

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.97,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.01,
            }
      }
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-sm backdrop-blur-xl transition hover:border-primary/35 hover:shadow-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl transition duration-500 group-hover:scale-125" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-40 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Candidate Session
            </p>

            <h2 className="mt-2 line-clamp-2 text-lg font-black leading-6">
              {interview?.title || "Interview"}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/55">
              <UserIcon className="size-3.5 shrink-0" />

              <span className="truncate">
                Host: {hostName}
              </span>
            </div>
          </div>

          <span
            className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
              status,
            )}`}
          >
            {status || "unknown"}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Clock3Icon className="size-4" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Duration
              </p>

              <p className="mt-0.5 text-sm font-semibold">
                {interview?.durationMinutes ?? 0} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <CalendarDaysIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Started
              </p>

              <p className="mt-0.5 line-clamp-2 text-sm font-semibold">
                {session?.startedAt
                  ? new Date(
                      session.startedAt,
                    ).toLocaleString()
                  : "Not started"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
              <AlertTriangleIcon className="size-4" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Security Warnings
              </p>

              <p className="mt-0.5 text-sm font-semibold">
                {session?.warningCount ?? 0} warnings
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-5">
          {canViewResult(status) ? (
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
                className="btn btn-primary btn-sm w-full gap-2"
              >
                <EyeIcon className="size-4" />
                View Result
              </Link>
            </motion.div>
          ) : (
            <button
              type="button"
              disabled
              className="btn btn-ghost btn-sm w-full"
            >
              Result unavailable
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}