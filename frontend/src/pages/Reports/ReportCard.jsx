import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  CalendarDaysIcon,
  EyeIcon,
  FileBarChartIcon,
  RadioTowerIcon,
  UsersIcon,
} from "lucide-react";

const getStatusClass = (status) => {
  const classes = {
    draft: "badge-ghost",
    scheduled: "badge-warning",
    live: "badge-success",
    completed: "badge-info",
    cancelled: "badge-error",
  };

  return classes?.[status] || "badge-ghost";
};

export default function ReportCard({
  interview,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const isLive =
    interview?.status === "live";

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
        duration: 0.42,
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
            <div className="flex items-center gap-2">
              <FileBarChartIcon className="size-4 text-primary" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Interview Report
              </p>
            </div>

            <h2 className="mt-3 line-clamp-2 text-lg font-black leading-6">
              {interview?.title ||
                "Untitled Interview"}
            </h2>

            <p className="mt-1 truncate text-xs text-base-content/45">
              ID: {interview?._id}
            </p>
          </div>

          <span
            className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
              interview?.status,
            )}`}
          >
            {interview?.status ||
              "unknown"}
          </span>
        </div>

        {isLive && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-success/25 bg-success/10 px-3 py-2 text-xs font-bold text-success">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>

            Interview currently live
          </div>
        )}

        <div className="mt-5 grid gap-3">
          <div className="flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <CalendarDaysIcon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Scheduled
              </p>

              <p className="mt-0.5 line-clamp-2 text-sm font-semibold">
                {interview?.startsAt
                  ? new Date(
                      interview.startsAt,
                    ).toLocaleString()
                  : "No scheduled date"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <UsersIcon className="size-4" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Candidate Sessions
              </p>

              <p className="mt-0.5 text-sm font-semibold">
                Review joined candidates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
              <RadioTowerIcon className="size-4" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
                Report Status
              </p>

              <p className="mt-0.5 text-sm font-semibold capitalize">
                {isLive
                  ? "Collecting session data"
                  : "Reports available"}
              </p>
            </div>
          </div>
        </div>

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
              className="btn btn-primary btn-sm w-full gap-2"
            >
              <EyeIcon className="size-4" />
              View Reports
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}